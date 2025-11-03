import { z } from 'zod';

export const userNameValidation = z.string()
    .min(3, 'User name must be at least 3 characters long')
    .max(30, 'User name must be at most 30 characters long')
    .regex(/^[a-zA-Z0-9_]+$/, 'User name can only contain letters, numbers, and underscores');

export const signUpSchema = z.object({
    userName:userNameValidation,
    email:z.string().email({message:'Invalid email address'}),
    password:z.string()
        .min(8,{message:'Password must be at least 8 characters long'})
})