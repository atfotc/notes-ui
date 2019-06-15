export const load = (key, orValue) => {
    const value = localStorage.getItem(key)

    if (value) {
        return JSON.parse(value)
    }

    return orValue
}

export const save = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}
