import React from "react"
import { Router, Redirect, Route } from "react-router-dom"
import { Menu } from "app/components"
import { ShowNotes, CreateNote, EditNote } from "app/pages"
import { load, save } from "app/data/storage"
import { Context, initial } from "app/data/context"
import { history } from "app/data/history"
import { useEffectOnce, useStateWithEffect } from "app/helpers"

const Container = () => {
    const [state, setState, setSavedState] = useStateWithEffect(initial, state => {
        save("notes", state.notes)
    })

    useEffectOnce(() => {
        const notes = load("notes", [])
        setState({ notes })
    })

    return (
        <div className="container mx-auto p-4">
            <Context.Provider value={{ state, setState, setSavedState }}>
                <Router history={history}>
                    <Menu />
                    <Route path="/notes" exact component={ShowNotes} />
                    <Route path="/notes/create" component={CreateNote} />
                    <Route path="/notes/:note/edit" component={EditNote} />
                    <Redirect from="/" to="/notes" />
                </Router>
            </Context.Provider>
        </div>
    )
}

export { Container }
