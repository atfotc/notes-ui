const path = require("path")
const Bundler = require("parcel-bundler")
const express = require("express")
const bodyParser = require("body-parser")
const compression = require("compression")
const { writeFile, generatePdf, generateHtml, exec } = require("./helpers")

const entries = [path.join(__dirname, "index.html")]

const bundle = async () => {
    const bundler = new Bundler(entries, {
        outDir: ".build",
        outFile: "index.html",
        publicUrl: "/",
        watch: true,
        cache: true,
        cacheDir: ".cache",
        scopeHoist: false,
        target: "browser",
        logLevel: 3,
        hmr: true,
        sourceMaps: true,
        detailedReport: true,
    })

    await bundler.bundle()
}

bundle()

const app = express()
const port = 1234

app.use(bodyParser.json())
app.use(compression())
app.use(express.static(path.join(__dirname, ".build")))

app.get("/api/notes/:note/download-pdf", async (request, response) => {
    await generatePdf(request.params.note, request.query.from, response)
})

app.get("/api/notes/:note/deploy-pdf", async (request, response) => {
    const { slug, file } = await generatePdf(request.params.note, request.query.from)

    console.log("Sending PDF file...")
    await exec(`rsync -a ${file} forge@notes.assertchris.io:/home/forge/notes.assertchris.io/`)

    console.log("Done.")

    response.redirect(`https://notes.assertchris.io/${slug}.pdf`)
})

app.get("/api/notes/:note/deploy-html", async (request, response) => {
    const { slug, file } = await generateHtml(request.params.note, request.query.from)
    const remote = "forge@notes.assertchris.io:/home/forge/notes.assertchris.io/"

    console.log("Sending HTML file...")
    await exec(`rsync -a ${file} ${remote}`)

    console.log("Sending WOFF files...")
    await exec(`rsync -a ${path.join(__dirname, ".build", "*.woff")} ${remote}`)

    console.log("Sending WOFF2 files...")
    await exec(`rsync -a ${path.join(__dirname, ".build", "*.woff2")} ${remote}`)

    console.log("Done.")

    response.redirect(`https://notes.assertchris.io/${slug}.html`)
})

app.post("/api/notes/:note/store", async (request, response) => {
    const note = request.body

    await writeFile(path.join(__dirname, ".cache", `note-${note.id}.json`), JSON.stringify(note))

    response.send("done")
})

app.get("/footer", (_, response) => {
    response.sendFile(path.join(__dirname, ".build", "footer.html"))
})

app.get(["/", "/notes", "/notes/*", "/letters", "/letters/*"], (_, response) => {
    response.sendFile(path.join(__dirname, ".build", "index.html"))
})

app.listen(port)
