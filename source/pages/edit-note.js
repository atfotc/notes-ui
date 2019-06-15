import React, { useContext, useRef } from "react"
import { Context, history } from "app/state"

const EditNote = ({ match }) => {
    const { state, setSavedState } = useContext(Context)
    const title = useRef(undefined)

    if (!state.notes.length) {
        return null
    }

    const id = match.params.note
    const note = state.notes.find(next => next.id === id)

    if (!note) {
        history.push("/404")
        return null
    }

    const onSubmit = ({ nativeEvent }) => {
        nativeEvent.preventDefault()

        setSavedState(state => ({
            ...state,
            notes: [
                ...state.notes.filter(next => next.id !== note.id),
                {
                    ...note,
                    title: title.current.value,
                },
            ],
        }))
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col w-full pb-4">
                <label className="flex w-full font-semibold">Title</label>
                <input ref={title} defaultValue={note.title} className="flex max-w-md border-b-2 border-gray-100" />
            </div>
            <input type="submit" value="Update" className="bg-gray-300 text-gray-900 py-1 px-2" />
            <pre className="w-full mt-8 text-xs text-gray-500">{JSON.stringify(state, undefined, 4)}</pre>
        </form>
    )
}

export { EditNote }
