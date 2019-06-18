import React, { Fragment, useContext, useRef } from "react"
import { Context, history } from "app/state"
import { Container, Menu, TextBlock } from "app/components"
import { addBlock, changeBlock, moveBlockDown, moveBlockUp, removeBlock } from "app/helpers"

const AddBlock = ({ onAddBlock, onCancelAddBlock, setSavedState, note, isAddingBlock, order }) => {
    if (isAddingBlock === order) {
        return (
            <div>
                <button
                    onClick={() => onCancelAddBlock()}
                    className="bg-gray-100 text-gray-900 py-1 px-2 mt-2 mr-1 text-xs"
                >
                    <span className="inline-flex relative rotate-45">+</span>
                </button>
                <button
                    onClick={() => addBlock(setSavedState, note, "text", order)}
                    className="bg-gray-100 text-gray-900 py-1 px-2 mt-2 text-xs"
                >
                    text
                </button>
            </div>
        )
    }

    return (
        <button onClick={() => onAddBlock(order)} className="bg-gray-100 text-gray-900 py-1 px-2 mt-2 text-xs">
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

    const onAddBlock = order => {
        setState(state => ({ ...state, isAddingBlock: order }))
    }

    const onCancelAddBlock = order => {
        setState(state => ({ ...state, isAddingBlock: undefined }))
    }

    return (
        <Container>
            <Menu />
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
                                            defaultValue={(block.value || "").trim()}
                                            onChange={({ nativeEvent }) =>
                                                changeBlock(setSavedState, note, block, {
                                                    value: nativeEvent.target.value,
                                                })
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
                                        {...{ onAddBlock, onCancelAddBlock, setSavedState, note, isAddingBlock }}
                                        order={block.order + 1}
                                    />
                                </div>
                            </Fragment>
                        ))}
                    {!note.blocks.length && (
                        <AddBlock {...{ onAddBlock, onCancelAddBlock, setSavedState, note, isAddingBlock }} order={1} />
                    )}
                </div>
                <input type="submit" value="Update" className="bg-gray-100 text-gray-900 py-1 px-2" />
            </form>
        </Container>
    )
}

export { EditNote }
