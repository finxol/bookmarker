import { define } from "@/utils/fresh.ts"
import { kv } from "@/utils/kv.ts"
import { BookmarkSchema } from "@/utils/bookmarks.ts"

export const handler = define.handlers(async (ctx) => {
    const { user } = ctx.state
    const it = kv.list({ prefix: ["bookmarks", user.id] })

    const bookmarks = []
    for await (const item of it) {
        bookmarks.push({
            ...BookmarkSchema.parse(item.value),
            id: item.key.at(-1),
        })
    }

    // sort bookmarks by updatedAt
    bookmarks.sort(
        (a, b) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime(),
    )

    return Response.json(bookmarks)
})
