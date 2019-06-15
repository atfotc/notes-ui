import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { Context } from "app/data/context"

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
                            className="text-blue-500 text-sm"
                        >
                            delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export { ShowNotes }
