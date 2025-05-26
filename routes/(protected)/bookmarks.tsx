import { FreshContext } from "fresh"
import { State } from "@/utils/fresh.ts"
import { kv } from "@/utils/kv.ts"
import { BookmarkSchema } from "@/utils/bookmarks.ts"

export default async function Home(ctx: FreshContext<State>) {
    const { user } = ctx.state
    const it = kv.list({ prefix: ["bookmarks", user.id] })

    const bookmarks = []
    for await (const item of it) {
        bookmarks.push(BookmarkSchema.parse(item.value))
    }

    return (
        <div>
            <h2 className="text-xl font-bold">Your bookmarks:</h2>

            {bookmarks.length === 0
                ? <p>You have no bookmarks yet.</p>
                : (
                    <ul className="flex flex-row flex-wrap gap-2">
                        {bookmarks.map((bookmark) => (
                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-start justify-start *:px-4 *:py-2 *:w-full h-min border border-gray-200 rounded-md w-fit max-w-96"
                                key={bookmark.url}
                            >
                                {bookmark.title &&
                                    (
                                        <h4 className="font-medium text-lg border-b border-gray-200">
                                            {bookmark.title}
                                        </h4>
                                    )}
                                {bookmark.description &&
                                    (
                                        <p>
                                            {bookmark.description}
                                        </p>
                                    )}
                                <p className="text-gray-500 text-sm">
                                    {bookmark.url}
                                </p>
                            </a>
                        ))}
                    </ul>
                )}
        </div>
    )
}
