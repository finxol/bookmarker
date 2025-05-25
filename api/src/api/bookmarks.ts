import { Hono } from "hono"
import { kv } from "@/utils/kv.ts"
import { URLSchema } from "@/utils/bookmarks.ts"
import { TidyURL } from "tidy-url"
import { encodeHex } from "@std/encoding/hex"
import { parse } from "node-html-parser"
import type { Variables } from "../globals.ts"
import { getUserSub } from "../utils/auth.ts"

const app = new Hono<Variables>()
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
        return c.json({ message: "Bookmarks deleted" })
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

        const it = kv.list({ prefix: ["bookmarks", subject.id] })

        const bookmarks = []
        for await (const item of it) {
            bookmarks.push(item.value)
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

        const page = await fetch(cleanUrl).then((response) => response.text())
        const parsedPage = parse(page)

        const title = parsedPage.querySelector("title")?.textContent ||
            parsedPage.querySelector("meta[property='og:title']")?.getAttribute(
                "content",
            ) ||
            parsedPage.querySelector("meta[property='twitter:title']")
                ?.getAttribute(
                    "content",
                ) ||
            cleanUrl
        const description =
            parsedPage.querySelector("meta[name='description']")?.getAttribute(
                "content",
            ) ||
            parsedPage.querySelector("meta[property='og:description']")
                ?.getAttribute("content") ||
            parsedPage.querySelector("meta[name='twitter:description']")
                ?.getAttribute("content") ||
            ""

        console.log(title, description)

        await kv.set(["bookmarks", subject.id, id], {
            title,
            description,
            url: cleanUrl,
            updatedAt: new Date().toISOString(),
        })

        return c.json({ id })
    })

export default app
