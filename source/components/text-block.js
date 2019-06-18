import React, { useRef } from "react"
import { useInterval } from "app/helpers"

const TextBlock = ({ id, defaultValue, onChange, kind = "text" }) => {
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
        <div
            className={`
                flex w-full
                ${kind === "heading-one" ? "heading-one" : ""}
                ${kind === "heading-two" ? "heading-two" : ""}
            `}
        >
            <textarea
                data-id={id}
                onChange={onChange}
                ref={element}
                className={`
                flex w-full border-2 border-gray-100 p-4 overflow-hidden
                ${kind === "heading-one" ? "text-2xl" : ""}
                ${kind === "heading-two" ? "text-xl" : ""}
            `}
                defaultValue={defaultValue}
            />
        </div>
    )
}

export { TextBlock }
