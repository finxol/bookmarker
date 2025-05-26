import { createClient, type Tokens } from "@openauthjs/openauth/client"
import { createSubjects } from "@openauthjs/openauth/subject"
import type { Context } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { user, type UserSubject } from "./globals.ts"
import { isCI } from "std-env"

const clientID = Deno.env.get("AUTH_CLIENT_ID")!
const issuerUrl = Deno.env.get("AUTH_ISSUER_URL")!

export const subjects = createSubjects({
    user,
})

if (!isCI && !clientID) {
    throw new Error("AUTH_CLIENT_ID environment variable is not set")
}

if (!isCI && !issuerUrl) {
    throw new Error("AUTH_ISSUER_URL environment variable is not set")
}

export const client = createClient({
    clientID,
    issuer: issuerUrl,
})

export function setTokens(ctx: Context, tokens: Tokens) {
    setCookie(ctx, "access_token", tokens.access, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: tokens.expiresIn,
    })
    setCookie(ctx, "refresh_token", tokens.refresh, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 400, // 400 days
    })
}

/**
 * Check if the user is authenticated
 * @param ctx The request context
 * @returns true if the user is authenticated
 */
export async function isAuthenticated(ctx: Context) {
    const accessToken = getCookie(ctx, "access_token")
    const refreshToken = getCookie(ctx, "refresh_token")

    if (!accessToken) {
        return false
    }

    const verified = await client.verify(subjects, accessToken, {
        refresh: refreshToken,
    })

    if (verified.err) {
        console.error("Error verifying token:", verified.err)
        deleteCookie(ctx, "access_token")
        deleteCookie(ctx, "refresh_token")
        return false
    }
    if (verified.tokens) {
        setTokens(ctx, verified.tokens)
    }

    return verified.subject
}

export function getUserSub(c: Context): UserSubject | null {
    // Get the subject from the context
    const subject = c.get("user") as UserSubject

    // Middleware should prevent this, but good practice to check
    if (!subject?.id) {
        console.error(
            "User subject missing in context for",
            c.req.method,
            c.req.path,
        )
        return null
    }

    return subject
}
