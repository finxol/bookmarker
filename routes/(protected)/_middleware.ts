import { Context } from "fresh"
import { State } from "@/utils/fresh.ts"
import { deleteCookie, getCookies } from "@std/http"
import { client, subjects } from "@/utils/auth.ts"

export async function freshIsAuthenticated(ctx: Context<State>) {
    const req = ctx.req
    const cookies = getCookies(req.headers)
    const accessToken = cookies.access_token
    const refreshToken = cookies.refresh_token

    console.log("access_token:", accessToken)
    console.log("refresh_token:", refreshToken)

    if (!accessToken) {
        return false
    }

    const verified = await client.verify(subjects, accessToken, {
        refresh: refreshToken,
    })

    if (verified.err) {
        console.error("Error verifying token:", verified.err)
        deleteCookie(req.headers, "access_token")
        deleteCookie(req.headers, "refresh_token")
        console.log("Cookies", req.headers)

        return false
    }

    return verified.subject.properties
}

export async function handler(ctx: Context<State>) {
    const user = await freshIsAuthenticated(ctx)

    if (!user) {
        deleteCookie(ctx.req.headers, "access_token")
        deleteCookie(ctx.req.headers, "refresh_token")
        return ctx.redirect("/login")
    }

    ctx.state.user = user
    return await ctx.next()
}
