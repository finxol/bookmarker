import type { PageProps } from "fresh"
import { State } from "@/utils/fresh.ts"
import LoginAccount from "./(_components)/loginaccount.tsx"

export default function App(
    { Component, state }: PageProps<object, State>,
) {
    const { user } = state

    return (
        <html lang="en-GB">
            <head>
                <meta charset="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>Bookmarker</title>
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body className="bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
                <div className="min-h-screen flex flex-col">
                    <header className="sticky top-0 z-50 w-full bg-purple-600 shadow-lg">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                <div className="flex items-center space-x-8">
                                    <a
                                        href={user ? "/home" : "/"}
                                        className="flex items-center space-x-2 text-2xl font-bold text-white hover:text-yellow-300 transition-colors duration-200"
                                    >
                                        <span className="text-yellow-400">
                                            📚
                                        </span>
                                        <span>Bookmarker</span>
                                    </a>
                                    <nav className="hidden md:flex items-center space-x-6">
                                        {user
                                            ? (
                                                <a
                                                    href="/new"
                                                    className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-purple-200"
                                                >
                                                    New Bookmark
                                                </a>
                                            )
                                            : (
                                                <a
                                                    href="/login"
                                                    className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-purple-200"
                                                >
                                                    Get Started
                                                </a>
                                            )}
                                    </nav>
                                </div>
                                {user && (
                                    <div className="flex items-center space-x-4">
                                        <nav className="flex items-center space-x-4">
                                            <LoginAccount isAuthed={user} />
                                        </nav>
                                    </div>
                                )}
                                {/* Mobile menu for smaller screens */}
                                <div className="md:hidden">
                                    <nav className="flex items-center space-x-4">
                                        {user
                                            ? (
                                                <a
                                                    href="/new"
                                                    className="bg-white text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 text-sm font-medium shadow-md border border-purple-200"
                                                >
                                                    New
                                                </a>
                                            )
                                            : (
                                                <a
                                                    href="/login"
                                                    className="bg-white text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 text-sm font-medium shadow-md border border-purple-200"
                                                >
                                                    Start
                                                </a>
                                            )}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 overflow-auto">
                        <Component />
                    </main>
                </div>
            </body>
        </html>
    )
}
