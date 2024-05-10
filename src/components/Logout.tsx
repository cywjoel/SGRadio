import { Link } from "react-router-dom"

export const Logout = () => {
    return (
        <div className="fixed right-0 top-0 mt-16 mr-32">
            <button className="border-2 border-solid rounded-full border-white bg-red-800 text-white font-semibold text-lg px-12 py-4">
                <Link to="/?logout=success">Logout</Link>
            </button>
        </div>
)
}