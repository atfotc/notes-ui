import { useEffect, useState } from "react"

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
