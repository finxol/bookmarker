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
                <script src="/htmx.org@2.0.4"></script>
            </head>
            <body>
                <div className="grid h-screen grid-cols-1 grid-rows-[auto_1fr] gap-4">
                    <header className="sticky top-0 z-50 w-full bg-green-500 px-2 h-24 mx-auto flex flex-row items-center justify-between p-2">
                        <div className="flow-inline flex flex-row items-center justify-end">
                            <a
                                href={user ? "/home" : "/"}
                                className="flex flex-row items-center justify-start gap-4 ml-4 mr-8 text-xl font-bold"
                            >
                                Bookmarker
                            </a>
                            <nav className="flex flex-row items-center justify-end gap-4">
                                {user
                                    ? <a href="/bookmarks">Bookmarks</a>
                                    : <a href="/login">Get Started</a>}
                            </nav>
                        </div>
                        {user && (
                            <div className="flex flex-row items-center justify-end gap-4">
                                <nav className="flex flex-row items-center justify-end gap-4">
                                    <LoginAccount isAuthed={user} />
                                </nav>
                            </div>
                        )}
                    </header>
                    <main className="content-grid">
                        <Component />
                    </main>
                </div>
            </body>
        </html>
    )
}
