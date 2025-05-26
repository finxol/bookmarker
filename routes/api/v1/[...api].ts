import { Hono } from "hono"
import { secureHeaders } from "hono/secure-headers"
import { trimTrailingSlash } from "hono/trailing-slash"
import { createMiddleware } from "hono/factory"
import { showRoutes } from "hono/dev"
import type {
    ExchangeError,
    ExchangeSuccess,
} from "@openauthjs/openauth/client"
import bookmarks from "./(_routes)/bookmarks.ts"
import type { Variables } from "@/utils/globals.ts"
import { client, isAuthenticated, setTokens } from "@/utils/auth.ts"
import { define } from "@/utils/fresh.ts"

const unprotectedRoutes = new Hono()
    .get("/test", async (ctx) => {
        return await ctx.text("Hello, World!")
    })
    .get("/auth/authorize", async (ctx) => {
        const origin = new URL(ctx.req.url).origin
        const { url } = await client.authorize(
            origin + "/api/v1/auth/callback",
            "code",
        )
        return ctx.redirect(url, 302)
    })
    .get("/auth/callback", async (ctx) => {
        const url = new URL(ctx.req.url)
        const code = ctx.req.query("code")
        const error = ctx.req.query("error")
        const next = ctx.req.query("next") ?? `${url.origin}/home`

        if (error) {
            console.debug(
                `AUTH CALLBACK: Error in request - ${error}`,
            )
            return ctx.json(
                {
                    message: error,
                    cause: ctx.req.query("error_description"),
                },
                500,
            )
        }

        if (!code) {
            return ctx.json(
                {
                    message: "Missing code",
                },
                400,
            )
        }

        let exchanged: ExchangeSuccess | ExchangeError
        try {
            exchanged = await client.exchange(
                code,
                `${url.origin}/api/v1/auth/callback`,
            )
        } catch (error) {
            console.error(
                `AUTH CALLBACK: Exception during code exchange:`,
                error,
            )
            return ctx.json(
                {
                    message: "Token exchange failed",
                    cause: String(error),
                },
                500,
            )
        }

        if (exchanged.err) {
            console.debug(
                `AUTH CALLBACK: Error exchanging code - ${
                    JSON.stringify(exchanged.err)
                }`,
            )
            return ctx.json(exchanged.err, 400)
        }

        setTokens(ctx, exchanged.tokens)

        return ctx.redirect(next, 302)
    })

const protectedRoutes = new Hono<Variables>()
    .use(
        createMiddleware(async (c, next) => {
            const subject = await isAuthenticated(c)

            if (!subject) {
                return c.json(
                    {
                        error: "Unauthorized",
                    },
                    401,
                )
            }

            // Set the subject in the context
            c.set("user", subject.properties)
            await next()
        }),
    )
    .get("/auth/me", async (ctx) => {
        const user = ctx.get("user")
        return await Promise.resolve(ctx.json(user))
    })
    .route("/bookmarks", bookmarks)

const app = new Hono<Variables>()
    .basePath("/api/v1")
    .use(trimTrailingSlash())
    // TODO(@finxol): fix security headers
    .use(
        "*",
        secureHeaders({
            xFrameOptions: false,
            xXssProtection: false,
        }),
    )
    .route("/", unprotectedRoutes)
    .route("/", protectedRoutes)

showRoutes(app, { verbose: true })

export const handler = define.handlers(async (ctx) => {
    return await app.fetch(ctx.req)
})
