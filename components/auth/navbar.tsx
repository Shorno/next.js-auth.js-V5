import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Navbar() {
    return (
        <>
            <nav className="flex justify-around items-center py-4 bg-[#141414] text-white">
                <Link href="/" className="text-xl font-bold">
                    My Fancy Website
                </Link>

                <ul className="hidden md:flex space-x-4 list-none">
                    <li>
                        <Link href={"/login"} className={"hover:text-gray-400"}>Login</Link>
                    </li>
                    <li>
                        <Link href={"/register"} className={"hover:text-gray-400"}>Register</Link>
                    </li>
                    <li>
                        <Link href={"/private/dashboard"} className={"hover:text-gray-400"}>Dashboard</Link>
                    </li>

                    <form>
                        <Button type={"submit"} variant={"ghost"} size={"sm"}>
                            Logout
                        </Button>
                    </form>

                </ul>
            </nav>
        </>
    )
}
