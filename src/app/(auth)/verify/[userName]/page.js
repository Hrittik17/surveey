"use client"

import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

export default function VerifyAccountPage() {
    const [verificationToken,setVerificationToken] = useState('')
    const {userName} = useParams()
    const router = useRouter()

    async function onSubmit(){
        try{
            const response = await axios.post(`/api/auth/verifyToken`,{userName,verificationToken})
            toast.success(response?.data?.message)
            router.replace('/sign-in')

        }catch(error){
            toast.error(error?.response?.data?.message || 'Failed to verify your account')
            throw new Error(error?.message)
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="p-6 md:p-8 bg-zinc-200 rounded-xl shadow-xl w-full max-w-md">
            <h1 className="text-2xl md:text-4xl font-semibold text-center">Verify Your Account</h1>
            <p className="text-md md:text-xl mt-2 md:mt-4">We have send you a verification code on your register email</p>

            <form action={onSubmit} className="text-center">
                <div className="mt-6">
                    <input type="text" 
                    name="verificationCode" 
                    id="verificationCode"
                    placeholder="Enter the code"
                    className="placeholder:w-170 px-4 py-2 bg-white text-black rounded-lg shadow-lg"
                    onChange={(event)=>{setVerificationToken(event.target.value)}} />
                </div>

                <div className="mt-8">
                    <button type="submit"
                    className="px-4 py-2 bg-black text-white rounded-md">Verify</button>
                </div>
            </form>
        </div>   
    </div>
  )
}
