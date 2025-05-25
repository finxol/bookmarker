import { z } from "zod/v4-mini"

export const user = z.object({
    id: z.string(),
    email: z.email(),
    avatar: z.nullable(z.optional(z.url())),
    name: z.string(),
})

export type UserSubject = z.infer<typeof user>

export type Variables = {
    Variables: {
        user: UserSubject
    }
}
