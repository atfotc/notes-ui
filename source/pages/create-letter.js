import React, { useContext, useRef } from "react"
import { Context, history } from "app/state"
import { Container, Menu } from "app/components"
import { uuid } from "app/helpers"
import dayjs from "dayjs"

const CreateLetter = () => {
    const { setSavedState } = useContext(Context)

    const title = useRef(undefined)
    const shape = useRef(undefined)
    const description = useRef(undefined)

    const onSubmit = ({ nativeEvent }) => {
        nativeEvent.preventDefault()

        const id = uuid()

        setSavedState(state => ({
            ...state,
            letters: [
                ...state.letters,
                {
                    id,
                    title: title.current.value,
                    shape: shape.current.value,
                    description: description.current.value,
                },
            ],
        }))

        history.push(`/letters`)
    }

    return (
        <Container>
            <Menu />
            <form onSubmit={onSubmit}>
                <div className="flex flex-col items-start w-full mb-4">
                    <label className="flex w-full font-light text-sm text-gray-500">Title</label>
                    <input
                        ref={title}
                        defaultValue={`New Pictograph on ${dayjs().format("YYYY/MM/DD")}`}
                        className="flex w-full border-b-2 border-gray-100"
                    />
                </div>
                <div className="flex flex-col items-start w-full mb-4">
                    <label className="flex w-full font-light text-sm text-gray-500">Shape</label>
                    <textarea ref={shape} className="flex w-full border-b-2 border-gray-100" />
                </div>
                <div className="flex flex-col items-start w-full mb-4">
                    <label className="flex w-full font-light text-sm text-gray-500">Description</label>
                    <textarea ref={description} className="flex w-full border-b-2 border-gray-100" />
                </div>
                <input type="submit" value="Create" className="bg-gray-100 text-gray-900 py-1 px-2" />
            </form>
        </Container>
    )
}

export { CreateLetter }
