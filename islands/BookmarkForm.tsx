import { useSignal } from "@preact/signals"

export default function BookmarkForm() {
    const url = useSignal("")
    const error = useSignal("")
    const submitting = useSignal(false)

    const submitBookmark = async (e: Event) => {
        e.preventDefault()

        if (!url.value) return

        submitting.value = true
        error.value = ""

        try {
            const response = await fetch(
                `/api/v1/bookmarks/add?url=${encodeURIComponent(url.value)}`,
                {
                    method: "POST",
                },
            )

            if (response.ok) {
                globalThis.location.href = "/home"
            } else {
                const errorData = await response.text()
                error.value = errorData || "Failed to add bookmark"
            }
        } catch (_e) {
            error.value = "Network error. Please try again."
        } finally {
            submitting.value = false
        }
    }

    return (
        <div class="py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md mx-auto bg-white rounded-xl shadow-xl p-8 border border-purple-100">
                <div class="text-center mb-8">
                    <div class="text-4xl mb-3">🔖</div>
                    <h1 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Add a new bookmark
                    </h1>
                    <p class="text-gray-600 text-sm">
                        Save your favorite links for later!
                    </p>
                </div>
                <form onSubmit={submitBookmark} class="space-y-4">
                    <div>
                        <label
                            for="url-input"
                            class="block text-sm font-medium text-purple-700 mb-2 flex items-center gap-2"
                        >
                            <span class="text-purple-500">🌐</span>
                            Bookmark URL:
                        </label>
                        <input
                            type="url"
                            id="url-input"
                            value={url.value}
                            onInput={(
                                e,
                            ) => (url.value =
                                (e.target as HTMLInputElement).value)}
                            placeholder="https://example.com"
                            required
                            class="w-full px-4 py-3 border-2 border-purple-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-purple-300"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting.value}
                        class={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${
                            submitting.value
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                    >
                        <span
                            class={submitting.value
                                ? "animate-spin"
                                : "text-lg"}
                        >
                            {submitting.value ? "⏳" : "✨"}
                        </span>
                        <span>
                            {submitting.value ? "Adding..." : "Add Bookmark"}
                        </span>
                    </button>
                </form>
                {error.value && (
                    <div class="mt-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                        {error.value}
                    </div>
                )}
            </div>
        </div>
    )
}
