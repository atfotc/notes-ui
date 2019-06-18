import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { Context } from "app/state"
import { Container, Menu } from "app/components"

const ShowLetters = () => {
    const { state, setSavedState } = useContext(Context)

    return (
        <Container>
            <Menu />
            {state.letters.length < 1 && <div>No letters</div>}
            {state.letters.map(letter => {
                return (
                    <div key={letter.id} className="flex flex-row justify-between w-full">
                        {letter.title}
                        <div>
                            <Link to={`/letters/${letter.id}/edit`} className="text-blue-500 text-sm mr-2">
                                edit
                            </Link>
                            <button
                                onClick={() => {
                                    confirm("Are you sure?") &&
                                        setSavedState(state => ({
                                            ...state,
                                            letters: state.letters.filter(next => next.id !== letter.id),
                                        }))
                                }}
                                className="text-blue-500 text-sm mr-2"
                            >
                                delete
                            </button>
                        </div>
                    </div>
                )
            })}
        </Container>
    )
}

export { ShowLetters }
