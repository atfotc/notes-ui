import React, { useContext } from "react"
import { Context } from "app/data/context"

const ShowNotes = () => {
    const { state } = useContext(Context)

    return (
        <div>
            {state.notes.map(note => (
                <div key={note.id}>{note.title}</div>
            ))}
        </div>
    )
}

export { ShowNotes }
