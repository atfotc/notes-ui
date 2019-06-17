const Path = require("path")
const Bundler = require("parcel-bundler")
const compression = require("compression")
const express = require("express")
const wkhtmltopdf = require("wkhtmltopdf")
const showdown = require("showdown")
const { atob } = require("./helpers")

const entry = Path.join(__dirname, "index.html")

let assets = undefined

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

    bundler.on("bundled", bundle => (assets = bundle))

    await bundler.bundle()
}

bundle()

const app = express()
const port = 1234

app.use(compression())
app.use(express.static(Path.join(__dirname, ".build")))

app.get("/api/notes/:note/download-pdf", (request, response) => {
    const data = request.query.data
    const json = JSON.parse(decodeURIComponent(atob(data)))

    const bundles = Array.from(assets.childBundles)
    const stylesheets = []

    for (let i = 0; i < bundles.length; i++) {
        if (bundles[i].type === "css") {
            stylesheets.push(bundles[i].name.split(".build/").pop())
        }
    }

    const converter = new showdown.Converter()

    const markdown = `
        <!DOCTYPE html>
        <html lang="head">
            <head>
                <meta charset="utf-8" />
                ${stylesheets.map(
                    stylesheet => `<link rel="stylesheet" href="http://127.0.0.1:${port}/${stylesheet}" />`,
                )}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body class="print text-gray-900 leading-relaxed">
                ${json.blocks
                    .map(block => {
                        if (block.type === "text") {
                            return converter
                                .makeHtml(block.value)
                                .replace(/[\u0590-\u05FF]+/g, match => `<span class="hebrew text-lg">${match}</span>`)
                        }
                    })
                    .join("\n")}
            </body>
        </html>
    `

    // console.log(markdown)
    // response.send(markdown)

    wkhtmltopdf(markdown.trim(), {
        marginTop: "2.5cm",
        marginRight: "3.5cm",
        marginBottom: "2.5cm",
        marginLeft: "3.5cm",
    }).pipe(response)
})

app.get(["/", "/notes", "/notes/*"], (_, response) => {
    response.sendFile(Path.join(__dirname, ".build", "index.html"))
})

app.listen(port)
