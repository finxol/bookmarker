import type { PageProps } from "fresh"
import { State } from "@/utils/fresh.ts"

export default function App(
    { Component }: PageProps<object, State>,
) {
    return <Component />
}
