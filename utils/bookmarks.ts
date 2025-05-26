import { z } from "zod/v4-mini"

export const URLSchema = z.url()

export const BookmarkSchema = z.object({
    title: z.string(),
    description: z.string(),
    url: z.string(),
    updatedAt: z.iso.datetime(),
})

export type Bookmark = z.infer<typeof BookmarkSchema>
