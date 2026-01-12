"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Sprout, User, LayoutDashboard, LogOut, Menu } from "lucide-react"

import { useLanguage } from "./language-provider"
import { CartSidebar } from "./cart-sidebar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Navbar = () => {
    const { data: session } = useSession()
    const { language, setLanguage, t, isRtl } = useLanguage()

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group whitespace-nowrap">
                    <div className="bg-[#1B5E20] p-1.5 rounded-xl group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-green-900/10">
                        <Sprout className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-lg text-[#1B5E20] uppercase tracking-tighter">
                        {t("Brand Name")}
                    </span>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-1 sm:gap-2">

                    {/* Language Switcher */}
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                        className="w-10 h-10 flex items-center justify-center font-black text-[#1B5E20] hover:bg-gray-50 rounded-xl transition-all text-sm"
                    >
                        {language === 'ar' ? 'EN' : 'ع'}
                    </button>

                    <CartSidebar />

                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-100">
                                    <User className="w-5 h-5 text-[#1B5E20]" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-none shadow-2xl">
                                {session.user.role === "ADMIN" && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin" className="flex items-center gap-2 p-2.5 font-bold text-[#1B5E20] cursor-pointer rounded-xl text-sm">
                                            <LayoutDashboard className="w-4 h-4" />
                                            {t("Admin")}
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    onClick={() => signOut()}
                                    className="flex items-center gap-2 p-2.5 font-bold text-red-500 cursor-pointer rounded-xl focus:bg-red-50 focus:text-red-500 text-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    {t("Logout")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-black uppercase tracking-widest rounded-xl h-10 px-4 shadow-lg shadow-green-900/10 text-xs">
                                {t("Login")}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
