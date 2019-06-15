import React, { Fragment, useContext, useRef } from "react"
import { Context, history } from "app/state"
import { uuid } from "app/helpers"
import { TextBlock } from "app/components"

const reorder = blocks => {
    blocks = blocks.sort((a, b) => a.order - b.order)

    for (let i = 0; i < blocks.length; i++) {
        blocks[i].order = i
    }

    return blocks
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

    const onAddBlock = (type, order) => {
        if (!type) {
            setState(state => ({ ...state, isAddingBlock: order }))
            return
        }

        const id = uuid()

        setSavedState(state => ({
            isAddingBlock: undefined,
            notes: [
                ...state.notes.filter(next => next.id !== note.id),
                {
                    ...note,
                    blocks: [
                        ...note.blocks.map(note => {
                            if (note.order >= order) {
                                note.order++
                            }

                            return note
                        }),
                        { id, type, order },
                    ],
                },
            ],
        }))
    }

    const onRemoveBlock = id => {
        if (!confirm("are you sure?")) {
            return
        }

        setSavedState(state => ({
            notes: [
                ...state.notes.filter(next => next.id !== note.id),
                {
                    ...note,
                    blocks: reorder([...note.blocks.filter(next => next.id !== id)]),
                },
            ],
        }))
    }

    const onTextBlockChange = ({ nativeEvent }) => {
        const element = nativeEvent.target
        const id = element.getAttribute("data-id")

        const block = note.blocks.find(next => next.id === id)

        setSavedState(state => ({
            notes: [
                ...state.notes.filter(next => next.id !== note.id),
                {
                    ...note,
                    blocks: [
                        ...note.blocks.filter(next => next.id !== block.id),
                        {
                            ...block,
                            value: element.value,
                        },
                    ],
                },
            ],
        }))
    }

    const onMoveBlockUp = id => {
        const block = note.blocks.find(next => next.id === id)

        setSavedState(state => ({
            notes: [
                ...state.notes.filter(next => next.id !== note.id),
                {
                    ...note,
                    blocks: reorder([
                        ...note.blocks
                            .filter(next => next.id !== block.id)
                            .map(next => {
                                if (next.order >= block.order - 1) {
                                    next.order++
                                }

                                return next
                            }),
                        {
                            ...block,
                            order: block.order - 1,
                        },
                    ]),
                },
            ],
        }))
    }

    const onMoveBlockDown = id => {
        const block = note.blocks.find(next => next.id === id)

        setSavedState(state => ({
            notes: [
                ...state.notes.filter(next => next.id !== note.id),
                {
                    ...note,
                    blocks: reorder([
                        ...note.blocks
                            .filter(next => next.id !== block.id)
                            .map(next => {
                                if (next.order === block.order + 1) {
                                    next.order--
                                }

                                return next
                            }),
                        {
                            ...block,
                            order: block.order + 1,
                        },
                    ]),
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
                                    <TextBlock id={block.id} defaultValue={block.value} onChange={onTextBlockChange} />
                                )}
                                <div className="absolute top-0 right-0 flex-row text-xs hidden group-hover:flex">
                                    <button
                                        onClick={() => onMoveBlockUp(block.id)}
                                        className="bg-gray-100 text-gray-900 py-1 px-2 mr-1"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => onMoveBlockDown(block.id)}
                                        className="bg-gray-100 text-gray-900 py-1 px-2 mr-1"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        onClick={() => onRemoveBlock(block.id)}
                                        className="bg-gray-100 text-gray-900 py-1 px-2"
                                    >
                                        -
                                    </button>
                                </div>
                                {isAddingBlock === block.order + 1 ? (
                                    <div>
                                        <button
                                            onClick={() => onAddBlock("text", block.order + 1)}
                                            className="bg-gray-100 text-gray-900 py-1 px-2 mt-2 text-xs"
                                        >
                                            text
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onAddBlock(undefined, block.order + 1)}
                                        className="bg-gray-100 text-gray-900 py-1 px-2 mt-2 text-xs"
                                    >
                                        +
                                    </button>
                                )}
                            </div>
                        </Fragment>
                    ))}
                {!note.blocks.length && (
                    <Fragment>
                        {isAddingBlock === 1 ? (
                            <div>
                                <button
                                    onClick={() => onAddBlock("text", 1)}
                                    className="bg-gray-100 text-gray-900 py-1 px-2 text-xs"
                                >
                                    text
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => onAddBlock(undefined, 1)}
                                className="bg-gray-100 text-gray-900 py-1 px-2 text-xs"
                            >
                                +
                            </button>
                        )}
                    </Fragment>
                )}
            </div>
            <input type="submit" value="Update" className="bg-gray-100 text-gray-900 py-1 px-2" />
        </form>
    )
}

export { EditNote }
