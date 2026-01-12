"use client"

import { SessionProvider } from "next-auth/react"
import { LanguageProvider } from "./language-provider"

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            <LanguageProvider>
                {children}
            </LanguageProvider>
        </SessionProvider>
    )
}
