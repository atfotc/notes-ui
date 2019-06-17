import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { Context } from "app/state"

const ShowNotes = () => {
    const { state, setSavedState } = useContext(Context)

    return (
        <div>
            {state.notes.length < 1 && <div>No notes</div>}
            {state.notes.map(note => (
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
                            className="text-blue-500 text-sm mr-2 font-noto-serif"
                        >
                            delete
                        </button>
                        <a
                            href={`/api/notes/${note.id}/download-pdf?data=${btoa(
                                encodeURIComponent(JSON.stringify(note)),
                            )}`}
                            target="_blank"
                            className="text-sm text-blue-500"
                        >
                            download pdf
                        </a>
                    </div>
                </div>
            ))}
        </div>
    )
}

export { ShowNotes }
