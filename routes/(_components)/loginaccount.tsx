import { UserIcon } from "@/utils/icons/user.tsx"
import { LogInIcon } from "@/utils/icons/login.tsx"
import { State } from "@/utils/fresh.ts"

export default function LoginAccount(
    { isAuthed }: { isAuthed: State["user"] },
) {
    return isAuthed
        ? (
            <a
                href="/account"
                className="mr-0.75 size-10"
            >
                {isAuthed.avatar
                    ? (
                        <img
                            src={isAuthed.avatar}
                            alt={isAuthed.name}
                            className="size-10 rounded-full"
                        />
                    )
                    : <UserIcon className="size-10 rounded-full" />}
            </a>
        )
        : (
            <a href="/api/v1/auth/authorize">
                <LogInIcon />
                Log in
            </a>
        )
}
