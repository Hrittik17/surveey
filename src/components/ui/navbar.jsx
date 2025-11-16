'use client'

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export default function Navbar(){
    const {data:session} = useSession()
    const user = session?.user

    return (
        <nav className="p-4 md:p-6 shadow-md">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="#">SurVeey</a>
                {session ? (
                    <>
                    <span>{user?.email || user?.userName}</span>
                    <button className="px-4 py-2 bg-black text-white rounded-lg" onClick={()=> signOut()}>Logout</button>
                    </>
                ) : (
                    <Link href='/sign-in'><button className="px-4 py-2 bg-black text-white rounded-lg">Logout</button></Link>
                )}
            </div>

        </nav>
    )

}