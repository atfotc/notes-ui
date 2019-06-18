import React, { Fragment } from "react"
import { Redirect, Route, Router, Switch } from "react-router-dom"
import { Context, history, initial, load, save } from "app/state"
import { useEffectOnce, useStateWithEffect, getStorage } from "app/helpers"
import { CreateNote, CreateLetter, EditNote, EditLetter, Missing, PreviewNote, ShowNotes, ShowLetters } from "app/pages"

const Container = () => {
    const [state, setState, setSavedState] = useStateWithEffect(initial, state => {
        save("notes", state.notes)
        save("letters", state.letters)
    })

    useEffectOnce(() => {
        const notes = load("notes", [])
        const letters = load("letters", [])

        setState({ notes, letters })
    })

    return (
        <Fragment>
            <Context.Provider value={{ state, setState, setSavedState }}>
                <Router history={history}>
                    <Switch>
                        <Route path="/notes/create" component={CreateNote} />
                        <Route path="/notes/:note/edit" component={EditNote} />
                        <Route path="/notes/:note/preview" component={PreviewNote} />
                        <Route path="/notes" exact component={ShowNotes} />
                        <Route path="/letters/create" component={CreateLetter} />
                        <Route path="/letters/:letter/edit" component={EditLetter} />
                        <Route path="/letters" exact component={ShowLetters} />
                        <Redirect from="/" to="/notes" />
                        <Route component={Missing} />
                    </Switch>
                </Router>
            </Context.Provider>
            {/* <pre className="w-full mt-8 text-xs text-gray-500">{JSON.stringify(state, undefined, 4)}</pre> */}
            {/* <pre className="w-full mt-8 text-xs text-gray-500">{JSON.stringify(getStorage(), undefined, 4)}</pre> */}
        </Fragment>
    )
}

export { Container }
