import { z } from 'zod'

export const loginSchema = z.object({
    username: z.string().min(5).optional(),
    email:z.string().email().optional(),
    password: z.string().min(4),
})
