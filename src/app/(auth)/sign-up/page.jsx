// "use client"

// import { useSession, signIn, signOut } from "next-auth/react"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Form,FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { useDebounceCallback } from 'usehooks-ts'
// // import { toast } from "sonner"
// import Link from "next/link"
// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { signUpSchema } from "@/schemas/signUpSchema"
// import axios, { AxiosError, axiosError } from "axios"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Loader2 } from "lucide-react"


// export default function Component() {
//   const [checkUsername, setCheckUsername] = useState('')
//   const [checkUsernameMessage, setCheckUsernameMessage] = useState('')
//   const [isCheckingMessage, setIsCheckingMessage] = useState(false)
//   const [isCheckingUsername, setIsCheckingUsername] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const debouncedUsername = useDebounceCallback(setCheckUsername, 500)
//   const router = useRouter()

//   //zode implementation
//   const form = useForm({
//     resolver: zodResolver(signUpSchema),
//     defaultValues: {
//       userName: "",
//       email: "",
//       password: ""
//     }
//   })

//   // checking the username is unique or not when the username typed in the username field
//   useEffect(() => {
//     async function checkUserNameUnique() {

//       if (checkUsername) {
//         setIsCheckingUsername(false)
//         setCheckUsernameMessage('')
//       }

//       try {
//         const response = await axios.get(`/api/check-username-unique?username=${checkUsername}`)
//         let message = response.data?.message
//         setCheckUsernameMessage(message)
        
//       } catch (error) {
//         const axiosError = error
//         setCheckUsernameMessage(axiosError.response?.data?.message ?? 'Error checking username.')
//       } finally {
//         setIsCheckingUsername(false)
//       }
//     }

//     checkUserNameUnique()

//   }, [checkUsername])


//   // a function to create the user 
//   async function onSubmit(data) {
//     try {
//       const response = await axios.post(`/api/signUp`, data)
//       toast({
//         title: "Success",
//         description: response.data?.message
//       })
//       router.replace(`/verify/${checkUsername}`)
//       setIsSubmitting(false)

//     } catch (error) {
//       console.error('Something went wrong in sign up : ', error)
//       const axiosError = error
//       let errorMessage = axiosError.response.data?.message
//       toast({
//         title: 'Signup failed',
//         description: errorMessage,
//       })

//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div className="w-full max-w-md bg-zinc-100 shadow-lg rounded-2xl p-8">

//         <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

//             {/* for username */}
//             <FormField
//               control={form.control}
//               name="userName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Username</FormLabel>
//                   <FormControl>
//                     <Input placeholder="UserName"
//                       {...field}
//                       onChange={(event) => {
//                         field.onChange(event)
//                         debouncedUsername(event.target.value)
//                       }} />
//                   </FormControl>
//                   {/* Username check feedback */}
//                   {isCheckingUsername ? (
//                     <p className="text-sm text-gray-500 mt-1">Checking username...</p>
//                   ) : (
//                     checkUsernameMessage && (
//                       <p
//                         className={`text-sm mt-1 ${checkUsernameMessage === 'Username is available'
//                             ? "text-green-600"
//                             : "text-red-600"
//                           }`}
//                       >
//                         {checkUsernameMessage}
//                       </p>
//                     )
//                   )}

//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* for email */}
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input type='email' placeholder="Enter your email"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* for password  */}
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input type='password' placeholder="password"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <Button type='submit' disable={isSubmitting}>
//               {isSubmitting ? (<>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
//               </>) : 'Signup'}
//             </Button>
//           </form>
//         </Form>

//         <p className="text-center text-sm text-gray-600 mt-4">
//           Already have an account?{" "}
//           <Link href="/login" className="text-blue-600 hover:underline">
//             Log in
//           </Link>
//         </p>
//       </div>
//     </div>
//   )
// }




"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../../../schemas/signUpSchema";
import axios from "axios";
import { useDebounceCallback } from "usehooks-ts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Component() {
  const [checkUsername, setCheckUsername] = useState("");
  const [checkUsernameMessage, setCheckUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceCallback(setCheckUsername, 500);
  const router = useRouter();

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  // username availability check
  useEffect(() => {
    async function checkUserNameUnique() {
      if (!checkUsername.trim()) return;

      setIsCheckingUsername(true);
      setCheckUsernameMessage("");

      try {
        const response = await axios.get(
          `/api/check-username-unique?userName=${checkUsername}`
        );

        setCheckUsernameMessage(response.data?.message);
      } catch (error) {
        setCheckUsernameMessage(
          error.response?.data?.message || "Error checking username."
        );
      } finally {
        setIsCheckingUsername(false);
      }
    }

    checkUserNameUnique();
  }, [checkUsername]);

  // create user
  async function onSubmit(data) {
    setIsSubmitting(true);

    try {
      const response = await axios.post(`/api/signUp`, data);

      // alert(response.data?.message); // simple alert instead of shadcn toast
      toast.success(response.data?.message || "Signup successful!");

      router.replace(`/verify/${data.userName}`);
    } catch (error) {
      // alert(error.response?.data?.message || "Signup failed");
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-zinc-100 shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username field */}
          <div>
            <label className="font-medium">Username</label>
            <input
              placeholder="Username"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
              {...register("userName")}
              onChange={(e) => {
                register("userName").onChange(e);
                debouncedUsername(e.target.value);
              }}
            />

            {/* Username availability */}
            {isCheckingUsername ? (
              <p className="text-sm text-gray-500 mt-1">Checking username...</p>
            ) : (
              checkUsernameMessage && (
                <p
                  className={`text-sm mt-1 ${
                    checkUsernameMessage === "Username is available"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {checkUsernameMessage}
                </p>
              )
            )}

            {/* RHF error */}
            {errors.userName && (
              <p className="text-sm text-red-600 mt-1">
                {errors.userName.message}
              </p>
            )}
          </div>

          {/* Email field */}
          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label className="font-medium">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Please Wait
              </>
            ) : (
              "Signup"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
