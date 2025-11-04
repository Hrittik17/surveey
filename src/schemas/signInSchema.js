/* This code snippet is defining a schema using the Zod library for validating sign-in data. The
`import {z} from 'zod';` statement imports the `z` object from the Zod library. */

import {z} from 'zod';

export const signInSchema = z.object({
    email:z.string().email({message:'Invalid email address'}),
    password:z.string()
        .min(8,{message:'Password must be atleast 8 characters'})
})