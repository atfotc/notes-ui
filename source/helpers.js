import { useEffect, useRef, useState } from "react"

export const useEffectOnce = effect => {
    useEffect(effect, [])
}

export const useStateWithEffect = (initial, effect) => {
    const [state, setState] = useState(initial)
    const [tick, setTick] = useState(0)

    if (tick > 0) {
        effect(state)
    }

    const setStateWithEffect = (...params) => {
        setState(...params)
        setTick(tick + 1)
    }

    return [state, setState, setStateWithEffect]
}

// https://overreacted.io/making-setinterval-declarative-with-react-hooks ↓

export const useInterval = (callback, delay) => {
    const savedCallback = useRef()

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        function tick() {
            savedCallback.current()
        }

        if (delay !== null) {
            let id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}

// https://stackoverflow.com/a/2117523 ↓

export const uuid = () =>
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
    )

// https://stackoverflow.com/a/17748203 ↓

export const getStorage = () => {
    const keys = Object.keys(localStorage)
    let archive = {}
    let i = keys.length

    while (i--) {
        archive[keys[i]] = localStorage.getItem(keys[i])
    }

    return archive
}

export const reorderBlocks = blocks => {
    blocks = blocks.sort((a, b) => a.order - b.order)

    for (let i = 0; i < blocks.length; i++) {
        blocks[i].order = i
    }

    return blocks
}

export const moveBlockUp = (setSavedState, note, block) => {
    setSavedState(state => ({
        ...state,
        notes: [
            ...state.notes.filter(next => next.id !== note.id),
            {
                ...note,
                blocks: reorderBlocks([
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

export const moveBlockDown = (setSavedState, note, block) => {
    setSavedState(state => ({
        ...state,
        notes: [
            ...state.notes.filter(next => next.id !== note.id),
            {
                ...note,
                blocks: reorderBlocks([
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

export const removeBlock = (setSavedState, note, block) => {
    if (!confirm("are you sure?")) {
        return
    }

    setSavedState(state => ({
        ...state,
        notes: [
            ...state.notes.filter(next => next.id !== note.id),
            {
                ...note,
                blocks: reorderBlocks([...note.blocks.filter(next => next.id !== block.id)]),
            },
        ],
    }))
}

export const addBlock = (setSavedState, note, type, order) => {
    const id = uuid()

    setSavedState(state => ({
        ...state,
        notes: [
            ...state.notes.filter(next => next.id !== note.id),
            {
                ...note,
                blocks: reorderBlocks([
                    ...note.blocks.map(note => {
                        if (note.order >= order) {
                            note.order++
                        }

                        return note
                    }),
                    { id, type, order },
                ]),
            },
        ],
        isAddingBlock: undefined,
    }))
}

export const changeBlock = (setSavedState, note, block, data) => {
    if (block.type === "text" || block.type === "heading-one" || block.type === "heading-two") {
        setSavedState(state => ({
            ...state,
            notes: [
                ...state.notes.filter(next => next.id !== note.id),
                {
                    ...note,
                    blocks: [
                        ...note.blocks.filter(next => next.id !== block.id),
                        {
                            ...block,
                            ...data,
                        },
                    ],
                },
            ],
        }))
    }

    if (block.type === "word") {
        setSavedState(state => ({
            ...state,
            notes: [
                ...state.notes.filter(next => next.id !== note.id),
                {
                    ...note,
                    blocks: [
                        ...note.blocks.filter(next => next.id !== block.id),
                        {
                            ...block,
                            ...data,
                        },
                    ],
                },
            ],
        }))
    }
}
