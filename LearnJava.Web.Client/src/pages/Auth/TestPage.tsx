import { Link } from "react-router-dom";

export default function TestPage() {

    // align-items: center;
    // justify-content: space-between;

    return (

        <header className="w-full p-4 flex justify-between items-center shadow-md border-b border-gray-100">
            <h2 className="text-2xl">Name of efarmogh</h2>
            <nav className={"flex gap-4"}>
                <Link to={"/home"}>Home</Link>
                <Link to={"/about"}>About</Link>
                <Link to={"/about"}>About</Link>
                <Link to={"/about"}>About</Link>
                <Link to={"/about"}>About</Link>
            </nav>
            <span></span>
        </header>

    )
}
