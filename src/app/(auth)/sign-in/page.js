'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { signInSchema } from '../../../schemas/signInSchema'
import toast from "react-hot-toast"


export default function SignIn() {
    const { register, handleSubmit } = useForm({ resolver: zodResolver(signInSchema) })
    const router = useRouter()

    async function onSubmit(data) {
        const { email, password } = data
        const result = await signIn('credentials', {
            identifier: email,
            password,
            redirect: false
        })

        console.log('result : ', result)

        if (result?.error) {
            toast.error("Invalid username or password")
        }

        if (result.url) {
            router.replace('/dashboard')
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50">
            <div className="w-full max-w-md bg-zinc-100 shadow-lg rounded-2xl p-8">
                <h1 className="text-4xl font-bold text-center">Enter Your Credentials</h1>
                <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="Email">Email</label>
                        <input type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 mt-2 border-2 border-amber-400 rounded-md focus:ring focus:ring-blue-300"
                            {...register("email")} />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="password">Password</label>
                        <input type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 mt-2 rounded-md border-2 border-amber-400 focus:ring focus:ring-blue-300"
                            {...register("password")} />
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg transform hover:scale-105">Login</button>
                        <button type="reset" className="px-4 py-2 bg-slate-300 text-black rounded-lg transform hover:scale-105">Reset</button>
                    </div>
                </form>

                <div className="mt-6">
                    <button className="px-3 py-2 bg-green-800 text-md text-white rounded-lg transform hover:scale-105">Forget Password?</button>
                    <h1 className="font-semibold">Create Account</h1>

                </div>
            </div>
        </div>
    )
}