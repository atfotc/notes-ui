import React, { Fragment, useContext, useRef } from "react"
import { Context, history } from "app/state"
import { TextBlock } from "app/components"
import { moveBlockUp, moveBlockDown, removeBlock, addBlock, changeBlock } from "app/helpers"

const AddBlock = ({ setState, setSavedState, note, isAddingBlock, order }) => {
    if (isAddingBlock === order) {
        return (
            <div>
                <button
                    onClick={() => addBlock(setState, setSavedState, note, "text", order)}
                    className="bg-gray-100 text-gray-900 py-1 px-2 mt-2 text-xs"
                >
                    text
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => addBlock(setState, setSavedState, note, undefined, order)}
            className="bg-gray-100 text-gray-900 py-1 px-2 mt-2 text-xs"
        >
            +
        </button>
    )
}

const EditNote = ({ match }) => {
    const { state, setState, setSavedState } = useContext(Context)
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

    const { isAddingBlock } = state

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
            <div className="flex flex-col items-start w-full pb-4">
                <label className="flex w-full font-light text-sm text-gray-500">Title</label>
                <input ref={title} defaultValue={note.title} className="flex w-full border-b-2 border-gray-100" />
            </div>
            <div className="flex flex-col items-start w-full pb-4">
                <label className="flex w-full font-light text-sm text-gray-500">Blocks</label>
                {note.blocks
                    .sort((a, b) => a.order - b.order)
                    .map(block => (
                        <Fragment key={block.id}>
                            <div className="group relative w-full flex flex-col items-start mb-4">
                                {block.type === "text" && (
                                    <TextBlock
                                        id={block.id}
                                        defaultValue={block.value}
                                        onChange={({ nativeEvent }) =>
                                            changeBlock(setSavedState, note, block, { value: nativeEvent.target.value })
                                        }
                                    />
                                )}
                                <div className="absolute top-0 right-0 flex-row text-xs hidden group-hover:flex">
                                    <button
                                        onClick={() => moveBlockUp(setSavedState, note, block)}
                                        className="bg-gray-100 text-gray-900 py-1 px-2 mr-1"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => moveBlockDown(setSavedState, note, block)}
                                        className="bg-gray-100 text-gray-900 py-1 px-2 mr-1"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        onClick={() => removeBlock(setSavedState, note, block)}
                                        className="bg-gray-100 text-gray-900 py-1 px-2"
                                    >
                                        -
                                    </button>
                                </div>
                                <AddBlock
                                    {...{ setSavedState, setState, note, isAddingBlock }}
                                    order={block.order + 1}
                                />
                            </div>
                        </Fragment>
                    ))}
                {!note.blocks.length && <AddBlock {...{ setSavedState, setState, note, isAddingBlock }} order={1} />}
            </div>
            <input type="submit" value="Update" className="bg-gray-100 text-gray-900 py-1 px-2" />
        </form>
    )
}

export { EditNote }
