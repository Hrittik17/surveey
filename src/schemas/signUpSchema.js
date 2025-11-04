/* This code snippet is defining validation schemas using the Zod library in JavaScript. Here's a
breakdown of what it's doing: */

import {email, z} from 'zod';

export const userNameValidation = z.string().min(3,{message:'Username must be atleast 3 characters'})
    .max(30,{message:'Username must be atmost 30 characters'})
    .regex(/^[a-zA-Z0-9_]+$/,{message:'Username can only contain letters, numbers, and underscores'})

export const signUpSchema = z.object({
    userName:userNameValidation,
    email:z.email({message:'Invalid email address'}),
    password:z.string()
        .min(8,{message:'Password must be atleast 8 characters'}),
    
})