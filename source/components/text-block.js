import React, { useRef } from "react"
import { useInterval } from "app/helpers"

const TextBlock = ({ id, defaultValue, onChange }) => {
    const element = useRef(undefined)

    let scrollHeight = undefined

    useInterval(() => {
        if (element.current && element.current.scrollHeight !== scrollHeight) {
            scrollHeight = element.current.scrollHeight

            element.current.style.height = "auto"
            element.current.style.height = `${element.current.scrollHeight}px`
        }
    }, 15)

    return (
        <textarea
            data-id={id}
            onChange={onChange}
            ref={element}
            className="flex w-full border-2 border-gray-100 p-4 overflow-hidden"
            defaultValue={defaultValue}
        />
    )
}

export { TextBlock }
