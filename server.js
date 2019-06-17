const Path = require("path")
const Bundler = require("parcel-bundler")
const compression = require("compression")
const express = require("express")

const entry = Path.join(__dirname, "index.html")

const bundle = async () => {
    const bundler = new Bundler(entry, {
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

app.use(compression())
app.use(express.static(Path.join(__dirname, ".build")))

app.get("*", (_, response) => {
    response.sendFile(Path.join(__dirname, ".build", "index.html"))
})

app.listen(port)
