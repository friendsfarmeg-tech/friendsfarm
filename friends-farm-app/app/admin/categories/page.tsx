"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { CategoryColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Loader2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function CategoriesPage() {
    const { t } = useLanguage()
    const [categories, setCategories] = useState<CategoryColumn[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories')
                const data = await response.json()

                const formatted: CategoryColumn[] = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    name_ar: item.name_ar,
                    image_url: item.image_url,
                    createdAt: format(item.created_at || new Date(), "MMMM do, yyyy"),
                }))

                setCategories(formatted)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return (
        <div className="flex-col animate-in fade-in duration-700">
            <div className="flex-1 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-black text-[#111827] tracking-tight">{t("Categories")}</h2>
                        <p className="text-gray-500 font-bold mt-1">{t("Manage product sections")} ({categories.length} {t("items")})</p>
                    </div>
                    <Link href="/admin/categories/new">
                        <Button className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-black uppercase tracking-widest rounded-2xl h-14 px-8 shadow-xl shadow-green-900/10">
                            <Plus className="h-5 w-5 me-2" strokeWidth={3} />
                            {t("Add New Category")}
                        </Button>
                    </Link>
                </div>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                        </div>
                    ) : (
                        <DataTable searchKey="name" columns={columns} data={categories} />
                    )}
                </div>
            </div>
        </div>
    )
}
