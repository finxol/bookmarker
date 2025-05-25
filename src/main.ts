import { Hono } from "hono"
import bookmarks from "./api/bookmarks.ts"

const app = new Hono()

app.route("/bookmarks", bookmarks)

Deno.serve(app.fetch)
