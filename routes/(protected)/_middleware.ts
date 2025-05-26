import { FreshContext } from "fresh"
import { State } from "@/utils/fresh.ts"
import {
    deleteCookie as deleteCookieFresh,
    getCookies as getCookiesFresh,
} from "@std/http/cookie"
import { client, subjects } from "@/utils/auth.ts"

async function freshIsAuthenticated(ctx: FreshContext | FreshContext["req"]) {
    //@ts-expect-error: this works
    const req = ctx.req || ctx
    const cookies = getCookiesFresh(req.headers)
    const accessToken = cookies.access_token
    const refreshToken = cookies.refresh_token

    if (!accessToken) {
        return false
    }

    const verified = await client.verify(subjects, accessToken, {
        refresh: refreshToken,
    })

    if (verified.err) {
        console.error("Error verifying token:", verified.err)
        deleteCookieFresh(req.headers, "access_token")
        deleteCookieFresh(req.headers, "refresh_token")
        return false
    }

    return verified.subject.properties
}

export async function handler(ctx: FreshContext<State>) {
    const user = await freshIsAuthenticated(ctx)

    if (!user) {
        return ctx.redirect("/login")
    }

    ctx.state.user = user
    return await ctx.next()
}
