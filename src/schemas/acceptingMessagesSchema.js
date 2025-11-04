/* This code snippet is written in JavaScript and it is using the Zod library for data validation. */

import {z} from 'zod';

export const acceptingMessagesSchema = z.object({
    acceptingMessages:z.boolean()
})

