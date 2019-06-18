import React, { useContext } from "react"
import { Context, history } from "app/state"
import showdown from "showdown"

const converter = new showdown.Converter()

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
                __html: `${note.blocks
                    .map(block => {
                        if (block.type === "text") {
                            return converter.makeHtml(block.value).replace(
                                /[\u0590-\u05FF]+/g,
                                match =>
                                    `<span class="hebrew text-lg">${match.replace(/[\u00A0-\u00FF]/g, function(c) {
                                        return "&#" + c.charCodeAt(0) + ";"
                                    })}</span>`,
                            )
                        }
                    })
                    .join("\n")}`,
            }}
        />
    )
}

export { PreviewNote }
