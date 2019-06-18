import { createContext } from "React"

export const initial = {
    notes: [],
    letters: [],
    isAddingBlock: false,
}

export const Context = createContext()
