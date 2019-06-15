import React, { useContext, useRef } from "react"
import { Context } from "app/data/context"
import { history } from "app/data/history"
import { uuid } from "app/helpers"
import dayjs from "dayjs"

const CreateNote = () => {
    const { setSavedState } = useContext(Context)

    const title = useRef(undefined)

    const onSubmit = ({ nativeEvent }) => {
        nativeEvent.preventDefault()

        const id = uuid()

        setSavedState(state => ({
            ...state,
            notes: [
                ...state.notes,
                {
                    id,
                    title: title.current.value,
                },
            ],
        }))

        history.push(`/notes/${id}/edit`)
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col w-full pb-4">
                <label className="flex w-full font-semibold">Title</label>
                <input
                    ref={title}
                    defaultValue={`New Note on ${dayjs().format("YYYY/MM/DD")}`}
                    className="flex max-w-md border-b-2 border-gray-100"
                />
            </div>
            <input type="submit" value="Create" className="bg-gray-300 text-gray-900 py-1 px-2" />
        </form>
    )
}

export { CreateNote }
