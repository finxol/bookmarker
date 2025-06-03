import { FreshContext } from "fresh"
import { State } from "@/utils/fresh.ts"
import BookmarkForm from "@/islands/BookmarkForm.tsx"

export default function Home(ctx: FreshContext<State>) {
    const { user: _user } = ctx.state

    return <BookmarkForm />
}
