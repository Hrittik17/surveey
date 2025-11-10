"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form";
import { z } from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError, axiosError } from "axios"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function Component() {
  const [checkUsername, setCheckUsername] = useState('')
  const [checkUsernameMessage, setCheckUsernameMessage] = useState('')
  const [isCheckingMessage, setIsCheckingMessage] = useState(false)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debouncedUsername = useDebounceCallback(setCheckUsername, 500)
  const router = useRouter()

  //zode implementation
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: ""
    }
  })

  // checking the username is unique or not when the username typed in the username field
  useEffect(() => {
    async function checkUserNameUnique() {

      if (checkUsername) {
        setIsCheckingUsername(false)
        setCheckUsernameMessage('')
      }

      try {
        const response = await axios.get(`/api/check-username-unique?username=${checkUsername}`)
        let message = response.data?.message
        setCheckUsernameMessage(message)
        
      } catch (error) {
        const axiosError = error
        setCheckUsernameMessage(axiosError.response?.data?.message ?? 'Error checking username.')
      } finally {
        setIsCheckingUsername(false)
      }
    }

    checkUserNameUnique()

  }, [checkUsername])


  // a function to create the user 
  async function onSubmit(data) {
    try {
      const response = await axios.post(`/api/signUp`, data)
      toast({
        title: "Success",
        description: response.data?.message
      })
      router.replace(`/verify/${checkUsername}`)
      setIsSubmitting(false)

    } catch (error) {
      console.error('Something went wrong in sign up : ', error)
      const axiosError = error
      let errorMessage = axiosError.response.data?.message
      toast({
        title: 'Signup failed',
        description: errorMessage,
      })

      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-zinc-100 shadow-lg rounded-2xl p-8">

        <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* for username */}
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="UserName"
                      {...field}
                      onChange={(event) => {
                        field.onChange(event)
                        debouncedUsername(event.target.value)
                      }} />
                  </FormControl>
                  {/* Username check feedback */}
                  {isCheckingUsername ? (
                    <p className="text-sm text-gray-500 mt-1">Checking username...</p>
                  ) : (
                    checkUsernameMessage && (
                      <p
                        className={`text-sm mt-1 ${checkUsernameMessage === 'Username is available'
                            ? "text-green-600"
                            : "text-red-600"
                          }`}
                      >
                        {checkUsernameMessage}
                      </p>
                    )
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* for email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* for password  */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' disable={isSubmitting}>
              {isSubmitting ? (<>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
              </>) : 'Signup'}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}