import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { Context } from "app/state"
import { Container, Menu } from "app/components"

const storeNote = async (state, note) => {
    for (let i = 0; i < note.blocks.length; i++) {
        if (note.blocks[i].type === "word") {
            for (let j = 0; j < note.blocks[i].letters.length; j++) {
                note.blocks[i].letters[j] = {
                    ...note.blocks[i].letters[j],
                    ...state.letters.find(next => next.id === note.blocks[i].letters[j].id),
                }
            }
        }
    }

    await fetch(`/api/notes/${note.id}/store`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    })
}

const ShowNotes = () => {
    const { state, setSavedState } = useContext(Context)

    let from = `${location.protocol}//${location.hostname}`

    if (location.port) {
        from += `:${location.port}`
    }

    const onClickDownloadPdf = async note => {
        await storeNote(state, note)
        window.open(`/api/notes/${note.id}/download-pdf?from=${encodeURIComponent(from)}`, "_blank")
    }

    const onClickDeployPdf = async note => {
        await storeNote(state, note)
        window.open(`/api/notes/${note.id}/deploy-pdf?from=${encodeURIComponent(from)}`, "_blank")
    }

    const onClickDeployHtml = async note => {
        await storeNote(state, note)
        window.open(`/api/notes/${note.id}/deploy-html?from=${encodeURIComponent(from)}`, "_blank")
    }

    return (
        <Container>
            <Menu />
            {state.notes.length < 1 && <div>No notes</div>}
            {state.notes.map(note => {
                return (
                    <div key={note.id} className="flex flex-row justify-between w-full">
                        {note.title}
                        <div>
                            <Link to={`/notes/${note.id}/edit`} className="text-blue-500 text-sm mr-2">
                                edit
                            </Link>
                            <button
                                onClick={() => {
                                    confirm("Are you sure?") &&
                                        setSavedState(state => ({
                                            ...state,
                                            notes: state.notes.filter(next => next.id !== note.id),
                                        }))
                                }}
                                className="text-blue-500 text-sm mr-2"
                            >
                                delete
                            </button>
                            <button onClick={() => onClickDownloadPdf(note)} className="text-sm text-blue-500 mr-2">
                                download pdf
                            </button>
                            <button onClick={() => onClickDeployPdf(note)} className="text-sm text-blue-500 mr-2">
                                deploy pdf
                            </button>
                            <button onClick={() => onClickDeployHtml(note)} className="text-sm text-blue-500">
                                deploy html
                            </button>
                        </div>
                    </div>
                )
            })}
        </Container>
    )
}

export { ShowNotes }
