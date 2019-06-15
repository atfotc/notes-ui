import React, { useContext, useRef } from "react"
import { Context } from "app/data/context"
import { uuid } from "app/helpers"

const CreateNote = () => {
    const { setSavedState } = useContext(Context)

    const title = useRef(undefined)

    const onSubmit = ({ nativeEvent }) => {
        nativeEvent.preventDefault()

        setSavedState(state => ({
            ...state,
            notes: [
                ...state.notes,
                {
                    id: uuid(),
                    title: title.current.value,
                },
            ],
        }))
    }

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label>Title</label>
                <input ref={title} />
            </div>
            <input type="submit" value="Create" />
        </form>
    )
}

export { CreateNote }
