import { z } from "zod/v4-mini"

export const URLSchema = z.url()

export const BookmarkSchema = z.object({
    title: z.string().check(z.trim(), z.minLength(1), z.maxLength(100)),
    description: z.string().check(z.trim(), z.maxLength(500)),
    url: z.string().check(z.trim(), z.minLength(7), z.maxLength(1500)),
    updatedAt: z.iso.datetime(),
})

export type Bookmark = z.infer<typeof BookmarkSchema>
