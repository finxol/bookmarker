import { createDefine } from "fresh"
import { UserSubject } from "./globals.ts"

export interface State {
    user: UserSubject
}

export const define = createDefine<State>()

export function json(data: unknown, status = 200, headers: HeadersInit = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    })
}

export function error(
    data: { message: string; cause?: Error | string | unknown },
    status = 500,
    headers: HeadersInit = {},
) {
    return new Response(
        JSON.stringify({
            message: data.message,
            cause: data.cause?.toString(),
        }),
        {
            status,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
        },
    )
}
