"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Sprout } from "lucide-react"

export default function AboutPage() {
    const { t } = useLanguage()
    const [content, setContent] = useState("")

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/admin/settings')
                const data = await res.json()
                if (data.about_us) setContent(data.about_us)
            } catch (error) {
                console.error("Failed to fetch content")
            }
        }
        fetchContent()
    }, [])

    return (
        <div className="min-h-screen bg-[#F8F9FA] pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#E8F5E9]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-[#E8F5E9] p-4 rounded-3xl">
                            <Sprout className="w-8 h-8 text-[#1B5E20]" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#1B5E20] tracking-tighter uppercase">
                            {t("About Farm")}
                        </h1>
                    </div>

                    <div className="prose prose-lg prose-green max-w-none">
                        <p className="whitespace-pre-wrap text-gray-600 font-medium leading-relaxed text-lg">
                            {content || t("Loading...")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
