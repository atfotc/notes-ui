import React from "react"
import { Redirect, Route, Router, Switch } from "react-router-dom"
import { Menu } from "app/components"
import { CreateNote, EditNote, Missing, ShowNotes } from "app/pages"
import { Context, history, initial, load, save } from "app/state"
import { useEffectOnce, useStateWithEffect, getStorage } from "app/helpers"

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
                    <Switch>
                        <Route path="/notes/create" component={CreateNote} />
                        <Route path="/notes/:note/edit" component={EditNote} />
                        <Route path="/notes" exact component={ShowNotes} />
                        <Route component={Missing} />
                        <Redirect from="/" to="/notes" />
                    </Switch>
                </Router>
            </Context.Provider>
            <pre className="w-full mt-8 text-xs text-gray-500">{JSON.stringify(state, undefined, 4)}</pre>
            {/* <pre className="w-full mt-8 text-xs text-gray-500">{JSON.stringify(getStorage(), undefined, 4)}</pre> */}
        </div>
    )
}

export { Container }
