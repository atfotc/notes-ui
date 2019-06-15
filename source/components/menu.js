import React from "react"
import { Link } from "react-router-dom"

const Menu = () => (
    <nav className="text-blue-500 text-sm mb-8">
        <Link to="/notes" className="underline mr-2">
            Show Notes
        </Link>
        <Link to="/notes/create" className="underline">
            Create Note
        </Link>
    </nav>
)

export { Menu }
