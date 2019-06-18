import React, { useRef } from "react"

const WordBlock = ({ id, letters, defaultLetters, onChangeLetters }) => {
    const selector = useRef(undefined)

    const onSelectorChange = () => {
        onChangeLetters([...defaultLetters, letters.find(letter => letter.id === selector.current.value)])
    }

    return (
        <div className="flex flex-row w-full items-center justify-center border-2 border-gray-100 p-4">
            <select
                ref={selector}
                onChange={onSelectorChange}
                value="-1"
                className="flex flex-shrink mx-4 appearance-none"
            >
                <option value="-1">add letter</option>
                {letters.map(letter => (
                    <option key={letter.id} value={letter.id}>
                        {letter.title}
                    </option>
                ))}
            </select>
            <div className="flex flex-row-reverse flex-shrink items-center justify-center">
                {defaultLetters.map((letter, i) => (
                    <div
                        key={i}
                        className="inline-flex w-8 h-8 text-gray-800 mx-2"
                        dangerouslySetInnerHTML={{ __html: letters.find(next => next.id === letter.id).shape }}
                    />
                ))}
            </div>
        </div>
    )
}

export { WordBlock }
