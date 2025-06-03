import { FreshContext } from "fresh"
import { State } from "@/utils/fresh.ts"
import { kv } from "@/utils/kv.ts"
import { BookmarkSchema } from "@/utils/bookmarks.ts"

export default async function Home(ctx: FreshContext<State>) {
    const { user } = ctx.state
    const it = kv.list({ prefix: ["bookmarks", user.id] })

    const bookmarks = []
    for await (const item of it) {
        bookmarks.push({
            ...BookmarkSchema.parse(item.value),
            id: item.key.at(-1),
        })
    }

    // sort bookmarks by updatedAt
    bookmarks.sort(
        (a, b) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime(),
    )

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <div className="text-4xl mb-3">📚</div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Your Bookmarks
                    </h2>
                    <p className="text-gray-600">
                        {bookmarks.length}{" "}
                        bookmark{bookmarks.length !== 1 ? "s" : ""} saved
                    </p>
                </div>

                {bookmarks.length === 0
                    ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📖</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No bookmarks yet
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Start building your collection of favorite
                                links!
                            </p>
                            <a
                                href="/new"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                            >
                                <span className="text-lg">✨</span>
                                Add Your First Bookmark
                            </a>
                        </div>
                    )
                    : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookmarks.map((bookmark) => (
                                <a
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group bg-white rounded-xl shadow-lg hover:shadow-xl border border-purple-100 overflow-hidden transition-all duration-200 hover:-translate-y-1"
                                    key={bookmark.url}
                                    id={String(bookmark.id)}
                                >
                                    <div className="p-6">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="text-xl">🔗</div>
                                            <div className="flex-1 min-w-0">
                                                {bookmark.title && (
                                                    <h4 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200 line-clamp-2">
                                                        {bookmark.title}
                                                    </h4>
                                                )}
                                                {bookmark.description && (
                                                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                                        {bookmark.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-100 pt-3">
                                            <p className="text-purple-500 text-xs font-medium truncate flex items-center gap-1">
                                                <span>🌐</span>
                                                {bookmark.url.replace(
                                                    /^https?:\/\//,
                                                    "",
                                                ).replace(/\/$/, "")}
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
            </div>
        </div>
    )
}
