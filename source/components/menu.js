import React from "react"
import { Link } from "react-router-dom"

const Menu = () => (
    <nav className="text-blue-500 text-sm mb-8">
        <Link to="/notes" className="underline mr-2">
            Show Notes
        </Link>
        <Link to="/notes/create" className="underline mr-2">
            Create Note
        </Link>
        <Link to="/letters" className="underline mr-2">
            Show Letters
        </Link>
        <Link to="/letters/create" className="underline mr-2">
            Create Letter
        </Link>
        <Link to="/settings" className="underline">
            Settings
        </Link>
    </nav>
)

export { Menu }
