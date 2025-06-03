import { Hono } from "hono"
import { kv } from "@/utils/kv.ts"
import { Bookmark, BookmarkSchema, URLSchema } from "@/utils/bookmarks.ts"
import { TidyURL } from "tidy-url"
import { encodeHex } from "@std/encoding/hex"
import { parse } from "node-html-parser"
import type { Variables } from "@/utils/globals.ts"
import { getUserSub } from "@/utils/auth.ts"
import { tryCatch } from "@/utils/utils.ts"
import { ofetch } from "ofetch"

const app = new Hono<Variables>()
    .delete("/:id", async (c) => {
        const subject = getUserSub(c)

        if (!subject) {
            return c.json(
                {
                    message: "User subject missing in context",
                },
                500,
            )
        }

        const id = c.req.param("id")

        if (!id) {
            return c.json(
                {
                    message: "ID parameter missing in request",
                },
                400,
            )
        }

        const key = ["bookmarks", subject.id, id]
        await kv.delete(key)
        return c.text("Bookmark deleted!")
    })
    .delete("/all", async (c) => {
        const subject = getUserSub(c)

        if (!subject) {
            return c.json(
                {
                    message: "User subject missing in context",
                },
                500,
            )
        }

        const it = kv.list({ prefix: ["bookmarks", subject.id] })

        for await (const item of it) {
            await kv.delete(item.key)
        }
        return c.text("Bookmarks deleted!")
    })
    .get("/all", async (c) => {
        const subject = getUserSub(c)

        if (!subject) {
            return c.json(
                {
                    message: "User subject missing in context",
                },
                500,
            )
        }

        const it = kv.list<Bookmark>({ prefix: ["bookmarks", subject.id] })

        const bookmarks = []
        for await (const item of it) {
            bookmarks.push({
                id: item.key.at(-1),
                ...item.value
            })
        }

        return c.json(bookmarks)
    })
    .post("/add", async (c) => {
        const subject = getUserSub(c)

        if (!subject) {
            return c.json(
                {
                    message: "User subject missing in context",
                },
                500,
            )
        }

        const urlParam = c.req.query("url")
        const urlBody = (await c.req.parseBody()).url
        const url = urlParam || urlBody
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

        const page = await tryCatch(ofetch(cleanUrl))
        if (!page.success) {
            console.error("Error fetching URL:", page.error)
            return c.json({ error: "Invalid URL" }, 400)
        }

        const parsedPage = parse(page.value)

        const title = (parsedPage.querySelector("title")?.textContent ||
            parsedPage.querySelector("meta[property='og:title']")?.getAttribute(
                "content",
            ) ||
            parsedPage.querySelector("meta[property='twitter:title']")
                ?.getAttribute(
                    "content",
                ) ||
            cleanUrl).trim().substring(0, 200)
        const description =
            (parsedPage.querySelector("meta[name='description']")?.getAttribute(
                "content",
            ) ||
            parsedPage.querySelector("meta[property='og:description']")
                ?.getAttribute("content") ||
            parsedPage.querySelector("meta[name='twitter:description']")
                ?.getAttribute("content") ||
            "").trim().substring(0, 500)

        console.log(title, description)

        const bookmark = BookmarkSchema.safeParse({
            title,
            description,
            url: cleanUrl,
            updatedAt: new Date().toISOString(),
        })

        if (!bookmark.success) {
            console.error("Error parsing bookmark:", bookmark.error)
            return c.json({ error: "Invalid bookmark" }, 400)
        }

        await kv.set(["bookmarks", subject.id, id], bookmark.data)

        return c.json({ id })
    })

export default app
