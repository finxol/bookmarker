import { FreshContext } from "fresh"
import { State } from "@/utils/fresh.ts"

export default function Home(ctx: FreshContext<State>) {
    const { user } = ctx.state

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <div className="text-4xl mb-3">👤</div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Your Account
                    </h1>
                    <p className="text-gray-600">
                        Manage your profile and settings
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-xl p-8 border border-purple-100 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="text-purple-500">ℹ️</span>
                        Profile Information
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="text-purple-500 text-xl">🆔</div>
                            <div>
                                <div className="font-medium text-purple-700">
                                    ID
                                </div>
                                <div className="text-gray-600 font-mono text-sm">
                                    {user.id}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                            <div className="text-emerald-500 text-xl">📧</div>
                            <div>
                                <div className="font-medium text-emerald-700">
                                    Email
                                </div>
                                <div className="text-gray-600">
                                    {user.email}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg border border-pink-100">
                            <div className="text-pink-500 text-xl">🖼️</div>
                            <div>
                                <div className="font-medium text-pink-700">
                                    Avatar
                                </div>
                                <div className="text-gray-600">
                                    {user.avatar}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                            <div className="text-indigo-500 text-xl">👋</div>
                            <div>
                                <div className="font-medium text-indigo-700">
                                    Name
                                </div>
                                <div className="text-gray-600">{user.name}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-xl p-8 border border-red-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-red-500">⚠️</span>
                        Danger Zone
                    </h2>
                    <p className="text-gray-600 mb-6">
                        This action cannot be undone. This will permanently
                        delete all of your bookmarks.
                    </p>
                    <button
                        class="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
                        type="button"
                        data-hx-delete="/api/v1/bookmarks/all"
                        data-hx-swap="innerHTML"
                    >
                        <span className="text-lg">🗑️</span>
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    )
}
