/* This JavaScript code snippet is using the Zod library for runtime schema validation. */


import { z } from 'zod';

export const verifySchema = z.object({
    token: z.string()
        .length(6, { message: 'Verification token must be of 6 digits' })
})
