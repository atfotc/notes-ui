import React, { useContext, useRef } from "react"
import { Context, history } from "app/state"
import { Container, Menu } from "app/components"
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
                    blocks: [],
                },
            ],
        }))

        history.push(`/notes/${id}/edit`)
    }

    return (
        <Container>
            <Menu />
            <form onSubmit={onSubmit}>
                <div className="flex flex-col items-start w-full mb-4">
                    <label className="flex w-full font-light text-sm text-gray-500">Title</label>
                    <input
                        ref={title}
                        defaultValue={`New Note on ${dayjs().format("YYYY/MM/DD")}`}
                        className="flex w-full border-b-2 border-gray-100"
                    />
                </div>
                <input type="submit" value="Create" className="bg-gray-100 text-gray-900 py-1 px-2" />
            </form>
        </Container>
    )
}

export { CreateNote }
