"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, signOut } from "next-auth/react"
import { useLanguage } from "@/components/language-provider"

export function UserButton() {
    const { data: session } = useSession()
    const { t } = useLanguage()

    if (!session?.user) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <Avatar>
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="bg-emerald-500 text-white">
                        {session.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('My Account')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-gray-500 text-xs">
                    {session.user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="text-red-500">
                    {t('Logout')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
