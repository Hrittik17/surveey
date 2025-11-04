/* This code snippet is written in JavaScript and it is using the Zod library for data validation.
Here's what it does: */

import {z} from 'zod';

export const messageSchema = z.object({
    content:z.string()
        .min(10,{message:'Message content must be atleast 10 characters'})
        .max(300,{message:'Message content must be atmost 300 characters'})
})