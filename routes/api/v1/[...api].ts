import { Hono, Context } from "hono"
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

function getCallbackUrl(ctx: Context) {
    const callbackUrl = new URL("/api/v1/auth/callback", ctx.req.url)

    const redirectUri = ctx.req.query("redirect_uri")
    if (redirectUri) callbackUrl.searchParams.set("redirect_uri", redirectUri)

    return callbackUrl.toString()
}

const unprotectedRoutes = new Hono()
    .get("/test", async (ctx) => {
        return await ctx.text("Hello, World!")
    })
    .get("/auth/authorize", async (ctx) => {
        const { url } = await client.authorize(getCallbackUrl(ctx), "code")
        return ctx.redirect(url, 302)
    })
    .get("/auth/callback", async (ctx) => {
        const url = new URL(ctx.req.url)
        const code = ctx.req.query("code")
        const error = ctx.req.query("error")
        const redirectUri = ctx.req.query("redirect_uri")

        // Determine if this is a mobile auth flow based on redirect_uri
        const isMobile = !!(redirectUri && (redirectUri.startsWith('bookmarkerapp://') || redirectUri.startsWith('exp://')))

        if (error) {
            console.debug(
                `AUTH CALLBACK: Error in request - ${error}`,
            )

            if (isMobile && redirectUri) {
                const errorUrl = new URL(redirectUri)
                errorUrl.searchParams.set('error', error)
                errorUrl.searchParams.set('error_description', ctx.req.query("error_description") || 'Authentication failed')
                return ctx.redirect(errorUrl.toString(), 302)
            }

            return ctx.json(
                {
                    message: error,
                    cause: ctx.req.query("error_description"),
                },
                500,
            )
        }

        if (!code) {
            const errorMessage = "Missing code"

            if (isMobile && redirectUri) {
                const errorUrl = new URL(redirectUri)
                errorUrl.searchParams.set('error', 'missing_code')
                errorUrl.searchParams.set('error_description', errorMessage)
                return ctx.redirect(errorUrl.toString(), 302)
            }

            return ctx.json(
                {
                    message: errorMessage,
                },
                400,
            )
        }

        let exchanged: ExchangeSuccess | ExchangeError
        try {
            exchanged = await client.exchange(
                code,
                getCallbackUrl(ctx),
            )
        } catch (error) {
            console.error(
                `AUTH CALLBACK: Exception during code exchange:`,
                error,
            )

            if (isMobile && redirectUri) {
                const errorUrl = new URL(redirectUri)
                errorUrl.searchParams.set('error', 'exchange_failed')
                errorUrl.searchParams.set('error_description', 'Token exchange failed')
                return ctx.redirect(errorUrl.toString(), 302)
            }

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

            if (isMobile && redirectUri) {
                const errorUrl = new URL(redirectUri)
                errorUrl.searchParams.set('error', 'token_error')
                errorUrl.searchParams.set('error_description', JSON.stringify(exchanged.err))
                return ctx.redirect(errorUrl.toString(), 302)
            }

            return ctx.json(exchanged.err, 400)
        }

        const next = redirectUri ? new URL(redirectUri) : new URL('/home', url.origin)

        if (isMobile && redirectUri) {
            // For mobile apps, redirect to the app with tokens as query parameters
            next.searchParams.set('access_token', exchanged.tokens.access)
            if (exchanged.tokens.refresh) {
                next.searchParams.set('refresh_token', exchanged.tokens.refresh)
            }
            if (exchanged.tokens.expiresIn) {
                next.searchParams.set('expires_in', exchanged.tokens.expiresIn.toString())
            }

            console.log('Redirecting mobile app to:', next.toString())
        }

        setTokens(ctx, exchanged.tokens)
        return ctx.redirect(next.toString(), 302)
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
