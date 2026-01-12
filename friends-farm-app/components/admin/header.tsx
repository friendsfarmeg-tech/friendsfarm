"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Bell, Menu, Search, Sprout } from "lucide-react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { UserButton } from "@/components/admin/user-button"
import { useLanguage } from "@/components/language-provider"

import { Globe } from "lucide-react"

export function AdminHeader() {
    const { isRtl, language, setLanguage, t } = useLanguage()

    return (
        <div className="sticky top-0 z-50 flex items-center h-16 px-6 bg-white/60 backdrop-blur-xl border-b border-gray-100/50">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-xl">
                            <Menu className="h-5 w-5 text-gray-600" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={isRtl ? "right" : "left"} className="p-0 bg-[#111827] text-white border-white/5">
                        <SheetTitle className="sr-only">{t("Admin Navigation")}</SheetTitle>
                        <AdminSidebar />
                    </SheetContent>
                </Sheet>
            </div>
            <div className="flex w-full items-center justify-between">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest hidden md:block">
                    {t('Admin')}
                </h2>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="rounded-full font-black uppercase tracking-widest border-2 border-[#1B5E20] text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition-all">
                        {t("Back to Farm")} <Sprout className="ml-2 w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                        className="flex items-center gap-2 font-black uppercase tracking-tighter text-gray-600 hover:bg-gray-100 rounded-xl px-4"
                    >
                        <Globe className="w-4 h-4" />
                        {language === 'ar' ? 'EN' : 'العربية'}
                    </Button>
                    <UserButton />
                </div>
            </div>
        </div>
    )
}
