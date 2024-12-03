import { z } from 'zod'

export const companiesSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    description: z.string().min(10),
    location: z.string().min(10),
    website: z.string().min(10),
    industry: z.string().min(5),
    size: z.number(),
})
