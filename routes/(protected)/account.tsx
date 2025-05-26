import { FreshContext } from "fresh"
import { State } from "@/utils/fresh.ts"

export default function Home(ctx: FreshContext<State>) {
    const { user } = ctx.state

    return (
        <div>
            <h1>Your account</h1>

            <div>
                <strong>ID:</strong> {user.id}
            </div>
            <div>
                <strong>Email:</strong> {user.email}
            </div>
            <div>
                <strong>Avatar:</strong> {user.avatar}
            </div>
            <div>
                <strong>Name:</strong> {user.name}
            </div>

            <aside>
                <button
                    class="mt-8 px-4 py-2 bg-red-500 text-white rounded-md"
                    type="button"
                    data-hx-delete="/api/v1/bookmarks/all"
                    data-hx-swap="innerHTML"
                >
                    Delete Account
                </button>
            </aside>
        </div>
    )
}
