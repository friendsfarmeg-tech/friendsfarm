"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    ShoppingBasket,
    Layers,
    ClipboardList,
    Users,
    Settings,
    LogOut,
    Sprout,
    Tag,
    Star
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"
import { useLanguage } from "@/components/language-provider"

export const AdminSidebar = () => {
    const pathname = usePathname()
    const { t } = useLanguage()

    const routes = [
        {
            label: t('Overview'),
            icon: LayoutDashboard,
            href: '/admin',
            color: "text-sky-500",
        },
        {
            label: t('Products'),
            icon: ShoppingBasket,
            href: '/admin/products',
            color: "text-amber-500",
        },
        {
            label: t('Categories'),
            icon: Layers,
            href: '/admin/categories',
            color: "text-emerald-500",
        },
        {
            label: t('Orders'),
            icon: ClipboardList,
            href: '/admin/orders',
            color: "text-orange-500",
        },
        {
            label: t('Offers'),
            icon: Tag,
            href: '/admin/offers',
            color: "text-red-500",
        },
        {
            label: t('Testimonials'),
            icon: Star,
            href: '/admin/testimonials',
            color: "text-yellow-500",
        },
        {
            label: t('Users'),
            icon: Users,
            href: '/admin/users',
            color: "text-pink-700",
        },
        {
            label: t('Settings'),
            icon: Settings,
            href: '/admin/settings',
            color: "text-gray-500",
        },
    ]

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#0a1f0c] text-white border-e border-white/5">
            <div className="px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-[#1B5E20] p-2 rounded-2xl group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-green-900/50">
                        <Sprout className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-lg uppercase tracking-tighter">
                        {t('Farm Admin')}
                    </span>
                </Link>
            </div>

            <div className="flex-1 px-3 space-y-1">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "text-sm group flex p-4 w-full justify-start font-black uppercase tracking-widest cursor-pointer hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300",
                            (pathname === route.href || (route.href !== '/admin' && pathname.startsWith(route.href))) ? "text-white bg-white/10 shadow-lg shadow-black/20" : "text-gray-400"
                        )}
                    >
                        <div className="flex items-center flex-1">
                            <route.icon className={cn("h-5 w-5 me-3 transition-colors", (pathname === route.href || (route.href !== '/admin' && pathname.startsWith(route.href))) ? "text-amber-500" : "text-gray-500 group-hover:text-amber-500")} />
                            {route.label}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="px-3 py-4 space-y-2">
                <Link
                    href="/"
                    className="flex items-center w-full p-4 font-black uppercase tracking-widest text-[#1B5E20] bg-white hover:bg-white/90 rounded-2xl transition-all duration-300"
                >
                    <Sprout className="h-5 w-5 me-3" />
                    {t('Back to Farm')}
                </Link>

                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center w-full p-4 font-black uppercase tracking-widest text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all duration-300"
                >
                    <LogOut className="h-5 w-5 me-3" />
                    {t('Logout')}
                </button>
            </div>
        </div>
    )
}
