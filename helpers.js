const path = require("path")
const puppeteer = require("puppeteer")
const { promisify } = require("util")
const fs = require("fs")
const child_process = require("child_process")
const strip = require("striptags")

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const exec = promisify(child_process.exec)

const generateHtml = async (note, from, response) => {
    const json = await readFile(path.join(__dirname, ".cache", `note-${note}.json`))
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

    const slug = data.title
        .replace(/[^0-9a-z_]/gi, "-")
        .replace(/[-]{2,}/gi, "-")
        .toLowerCase()

    if (!response) {
        console.log(`Saving HTML to ${path.join(__dirname, ".cache", `${slug}.html`)}`)
    }

    const rules = await page.evaluate(() => {
        let rules = []

        for (let i = 0; i < document.styleSheets.length; i++) {
            for (let j = 0; j < document.styleSheets[i].cssRules.length; j++) {
                rules.push(document.styleSheets[i].cssRules[j].cssText)
            }
        }

        return rules
    })

    let markup = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll("script"))

        for (let i = scripts.length - 1; i >= 0; i--) {
            scripts[i].parentNode.removeChild(scripts[i])
        }

        const stylesheets = Array.from(document.querySelectorAll("link"))

        for (let i = stylesheets.length - 1; i >= 0; i--) {
            stylesheets[i].parentNode.removeChild(stylesheets[i])
        }

        document.querySelector(".print").className += " container mx-auto p-4"

        return document.documentElement.innerHTML
    })

    markup = markup.replace(/\<\/head\>/gi, `<style>${rules.join("\n")}</style></head>`)

    const filePath = path.join(__dirname, ".cache", `${slug}.html`)

    await writeFile(filePath, markup)

    browser.close()

    return {
        slug,
        file: filePath,
    }
}

const generatePdf = async (note, from, response) => {
    const json = await readFile(path.join(__dirname, ".cache", `note-${note}.json`))
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

    const slug = data.title
        .replace(/[^0-9a-z_]/gi, "-")
        .replace(/[-]{2,}/gi, "-")
        .toLowerCase()

    const filePath = path.join(__dirname, ".cache", `${slug}.pdf`)

    if (!response) {
        console.log(`Saving PDF to ${filePath}`)
    }

    const buffer = await page.pdf({
        format: "A4",
        ...templates,
        path: response ? undefined : filePath,
        displayHeaderFooter: true,
        printBackground: true,
        margin: {
            top: "2.5cm",
            right: "3.0cm",
            bottom: "2.5cm",
            left: "3.0cm",
        },
    })

    if (response) {
        response.type("application/pdf")
        response.send(buffer)
    }

    browser.close()

    return {
        slug,
        file: filePath,
    }
}

module.exports = { readFile, writeFile, generatePdf, generateHtml, exec }
