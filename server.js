const Path = require("path")
const Bundler = require("parcel-bundler")
const express = require("express")
const bodyParser = require("body-parser")
const compression = require("compression")
const puppeteer = require("puppeteer")
const util = require("util")
const fs = require("fs")

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const entries = [Path.join(__dirname, "index.html")]

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
app.use(express.static(Path.join(__dirname, ".build")))

app.get("/api/notes/:note/download-pdf", async (request, response) => {
    const note = request.params.note
    const from = request.query.from

    const json = await readFile(Path.join(__dirname, ".cache", `note-${note}.json`))
    const data = JSON.parse(json)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(`${from}/notes`, { waitUntil: "networkidle0" })

    await page.evaluate(note => {
        localStorage.setItem("notes", JSON.stringify([note]))
    }, data)

    await page.goto(`${from}/notes/${note}/preview`, { waitUntil: "networkidle0" })

    await page.evaluate(() => {
        const wait = async ms => {
            await new Promise(resolve => setTimeout(resolve, ms))
        }

        wait(250)
    }, data)

    const rules = await page.evaluate(() => {
        let rules = []

        for (let i = 0; i < document.styleSheets.length; i++) {
            for (let j = 0; j < document.styleSheets[i].cssRules.length; j++) {
                rules.push(document.styleSheets[i].cssRules[j].cssText)
            }
        }

        return rules
    })

    const templates = {
        headerTemplate: `
            <style>${rules.join("\n")}</style>
            <div class="block w-full font-noto-serif text-center text-gray-800" style="font-size: 8pt; "></div>
        `,
        footerTemplate: `
            <style>${rules.join("\n")}</style>
            <div class="block w-full font-noto-serif text-center text-gray-800" style="font-size: 8pt; margin-bottom: 16pt"><span class="pageNumber"></span></div>
        `,
    }

    const buffer = await page.pdf({
        format: "A4",
        ...templates,
        displayHeaderFooter: true,
        printBackground: true,
        margin: {
            top: "2.5cm",
            right: "3.0cm",
            bottom: "2.5cm",
            left: "3.0cm",
        },
    })

    response.type("application/pdf")
    response.send(buffer)

    browser.close()
})

app.post("/api/notes/:note/store", async (request, response) => {
    const note = request.body

    await writeFile(Path.join(__dirname, ".cache", `note-${note.id}.json`), JSON.stringify(note))

    response.send("done")
})

app.get("/footer", (_, response) => {
    response.sendFile(Path.join(__dirname, ".build", "footer.html"))
})

app.get(["/", "/notes", "/notes/*", "/letters", "/letters/*"], (_, response) => {
    response.sendFile(Path.join(__dirname, ".build", "index.html"))
})

app.listen(port)
