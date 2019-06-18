import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { Context } from "app/state"
import { Container, Menu } from "app/components"

const ShowNotes = () => {
    const { state, setSavedState } = useContext(Context)

    let from = `${location.protocol}//${location.hostname}`

    if (location.port) {
        from += `:${location.port}`
    }

    const onClickPreview = async note => {
        await fetch(`/api/notes/${note.id}/store`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
        })

        window.open(`/api/notes/${note.id}/download-pdf?from=${encodeURIComponent(from)}`, "_blank")
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
                            <button onClick={() => onClickPreview(note)} className="text-sm text-blue-500">
                                download
                            </button>
                        </div>
                    </div>
                )
            })}
        </Container>
    )
}

export { ShowNotes }
