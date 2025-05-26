import { define } from "@/utils/fresh.ts"

export const handler = define.handlers({
    GET(ctx) {
        return Response.redirect(`${ctx.url.origin}/api/v1/auth/authorize`, 302)
    },
})
