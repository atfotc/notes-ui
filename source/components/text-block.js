import React from "react"

const TextBlock = ({ id, defaultValue, onChange }) => (
    <textarea
        data-id={id}
        onChange={onChange}
        className="flex w-full border-2 border-gray-100 p-4"
        defaultValue={defaultValue}
    />
)

export { TextBlock }
