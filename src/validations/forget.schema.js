import { z } from 'zod'

export const forgetSchema = z.object({
    username: z.string().optional(),
    email:z.string().email().optional()
},)
