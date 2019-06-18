import React, { useContext, useRef } from "react"
import { Context, history } from "app/state"
import { Container, Menu } from "app/components"

const EditLetter = ({ match }) => {
    const { state, setSavedState } = useContext(Context)
    const title = useRef(undefined)
    const shape = useRef(undefined)
    const description = useRef(undefined)

    if (!state.letters.length) {
        return null
    }

    const id = match.params.letter
    const letter = state.letters.find(next => next.id === id)

    if (!letter) {
        history.push("/404")
        return null
    }

    const onSubmit = ({ nativeEvent }) => {
        nativeEvent.preventDefault()

        setSavedState(state => ({
            ...state,
            letters: [
                ...state.letters.filter(next => next.id !== letter.id),
                {
                    ...letter,
                    title: title.current.value,
                    shape: shape.current.value,
                    description: description.current.value,
                },
            ],
        }))
    }

    return (
        <Container>
            <Menu />
            <form onSubmit={onSubmit}>
                <div className="flex flex-col items-start w-full mb-4">
                    <label className="flex w-full font-light text-sm text-gray-500">Title</label>
                    <input ref={title} defaultValue={letter.title} className="flex w-full border-b-2 border-gray-100" />
                </div>
                <div className="flex flex-col items-start w-full mb-4">
                    <label className="flex w-full font-light text-sm text-gray-500">Shape</label>
                    <textarea
                        ref={shape}
                        className="flex w-full border-b-2 border-gray-100"
                        defaultValue={letter.shape}
                    />
                </div>
                <div className="flex flex-col items-start w-full mb-4">
                    <label className="flex w-full font-light text-sm text-gray-500">Description</label>
                    <textarea
                        ref={description}
                        className="flex w-full border-b-2 border-gray-100"
                        defaultValue={letter.description}
                    />
                </div>
                <input type="submit" value="Update" className="bg-gray-100 text-gray-900 py-1 px-2" />
            </form>
        </Container>
    )
}

export { EditLetter }
