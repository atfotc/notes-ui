import React, { useContext } from "react"
import { Context, history } from "app/state"
import showdown from "showdown"
import strip from "striptags"

const converter = new showdown.Converter()

const markdownToMarkup = markdown => {
    return converter
        .makeHtml(markdown)
        .replace(/[\u0590-\u05FF]+/g, match => `<span class="hebrew text-lg">${match}</span>`)
        .replace(
            /H[0-9]+/g,
            match => `<a class="strongs" href="https://studybible.info/strongs/${match}" target="_blank">${match}</a>`,
        )
}

const PreviewNote = ({ match }) => {
    const { state } = useContext(Context)

    if (!state.notes.length) {
        return null
    }

    const id = match.params.note
    const note = state.notes.find(next => next.id === id)

    if (!note) {
        history.push("/404")
        return null
    }

    return (
        <div
            className="print"
            dangerouslySetInnerHTML={{
                __html: `
                <h1 class="text-2xl flex w-full font-bold">${markdownToMarkup(note.title)}</h1>
                ${note.blocks
                    .sort((a, b) => a.order - b.order)
                    .map(block => {
                        if (block.type === "heading-one") {
                            return `<h2 class="text-xl flex w-full font-bold">${markdownToMarkup(block.value)}</h2>`
                        }
                        if (block.type === "heading-two") {
                            return `<h3 class="text-lg flex w-full font-bold">${markdownToMarkup(block.value)}</h3>`
                        }
                        if (block.type === "text") {
                            return markdownToMarkup(block.value)
                        }
                        if (block.type === "word") {
                            return `
                                <div class="flex flex-col w-full p-4 mt-4 bg-word">
                                    <div class="flex flex-row-reverse w-full items-center justify-center word">
                                        ${block.letters
                                            .map(
                                                letter =>
                                                    `<div class="inline-flex w-8 h-8 text-gray-900 mx-2">${
                                                        letter.shape
                                                    }</div>`,
                                            )
                                            .join("\n")}
                                    </div>
                                    ${block.letters
                                        .map(
                                            letter =>
                                                `<p class="text-sm">
                                                    <strong>${letter.title}</strong>
                                                    ${strip(markdownToMarkup(letter.description), ["span"], "")}
                                                </p>`,
                                        )
                                        .join("\n")}
                                </div>
                            `
                        }
                    })
                    .join("\n")}`,
            }}
        />
    )
}

export { PreviewNote }
