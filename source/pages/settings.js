import React, { useContext, useRef } from "react"
import { Context } from "app/state"
import { Container, Menu } from "app/components"

const download = data => {
    const link = document.createElement("a")
    link.setAttribute("href", `data:text/plain,${data}`)
    link.setAttribute("download", "letters.json")
    link.click()
}

const upload = (setSavedState, data) => {
    setSavedState(state => ({
        ...state,
        ...data,
    }))
}

const select = async file =>
    new Promise((resolve, reject) => {
        try {
            const reader = new FileReader()
            reader.onloadend = e => resolve(e)
            reader.readAsText(file)
        } catch (e) {
            reject(e)
        }
    })

const Settings = () => {
    const { state, setSavedState } = useContext(Context)

    const file = useRef(undefined)

    const onDownload = () => {
        download(JSON.stringify(state, undefined, 4))
    }

    const onUpload = async () => {
        if (file.current) {
            const upload = await select(file.current.files[0])
            const content = JSON.parse(upload.target.result)

            if (content.notes && content.letters) {
                setSavedState(state => ({
                    ...state,
                    ...content,
                }))
            }
        }
    }

    return (
        <Container>
            <Menu />
            <div className="flex w-full mb-2">
                <button onClick={onDownload} className="bg-gray-100 text-gray-900 py-1 px-2">
                    Download backup
                </button>
            </div>
            <div className="flex flex-row items-center w-full mb-2">
                <input type="file" ref={file} />
                <button onClick={onUpload} className="bg-gray-100 text-gray-900 py-1 px-2">
                    Upload backup
                </button>
            </div>
        </Container>
    )
}

export { Settings }
