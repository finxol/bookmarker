import { Hono } from "hono"
import { kv } from "@/utils/kv.ts"
import { URLSchema } from "@/utils/bookmarks.ts"
import { TidyURL } from "tidy-url"
import { encodeHex } from "@std/encoding/hex"

const app = new Hono()
    .get("/", (c) => {
        return c.text("Hello Hono!")
    })
    .delete("/all", async (c) => {
        const it = kv.list({ prefix: ["bookmarks"] })

        for await (const item of it) {
            await kv.delete(item.key)
        }
        return c.json({ message: "Bookmarks deleted" })
    })
    .get("/all", async (c) => {
        const it = kv.list({ prefix: ["bookmarks"] })

        const bookmarks = []
        for await (const item of it) {
            bookmarks.push(item.value)
        }

        return c.json(bookmarks)
    })
    .post("/add", async (c) => {
        const url = c.req.query("url")
        if (!url) {
            return c.json({ error: "Missing URL parameter" }, 400)
        }

        const urlSchema = URLSchema.safeParse(url)
        if (!urlSchema.success) {
            return c.json({ error: "Invalid URL" }, 400)
        }

        const cleanUrl = TidyURL.clean(urlSchema.data).url

        const encoder = new TextEncoder()
        const data = encoder.encode(cleanUrl)
        const hashBuffer = await crypto.subtle.digest("SHA-256", data)
        const id = encodeHex(hashBuffer)

        await kv.set(["bookmarks", id], cleanUrl)

        return c.json({ id })
    })

export default app
