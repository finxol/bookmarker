import { FreshContext } from "fresh"
import { State } from "@/utils/fresh.ts"
import { freshIsAuthenticated } from "../(protected)/_middleware.ts"

export async function handler(ctx: FreshContext<State>) {
    const user = await freshIsAuthenticated(ctx)

    if (user) {
        const url = new URL("/home", ctx.url)
        return Response.redirect(url, 302)
    }

    return await ctx.next()
}
