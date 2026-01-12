"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ProductColumn, getColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Loader2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function ProductsPage() {
    const { t, isRtl } = useLanguage()
    const [products, setProducts] = useState<ProductColumn[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products')
                const data = await response.json()

                // Assuming data is an array of products
                const formatted: ProductColumn[] = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    name_ar: item.name_ar,
                    price: new Intl.NumberFormat(isRtl ? 'ar-EG' : 'en-EG', { style: 'currency', currency: 'EGP' }).format(item.price),
                    category: item.categories?.name || "N/A",
                    stock: item.stock,
                    isFeatured: item.is_featured,
                    isAvailable: item.is_available,
                    createdAt: item.created_at ? format(new Date(item.created_at), "MMMM do, yyyy") : "N/A",
                }))

                setProducts(formatted)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [isRtl])

    const columns = getColumns(t, isRtl)

    return (
        <div className="flex-col animate-in fade-in duration-700">
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`${t("Products")} (${products.length})`}
                        description={t("Manage product sections")}
                    />
                    <Link href="/admin/products/new">
                        <Button className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-black uppercase tracking-widest rounded-2xl h-14 px-8 shadow-xl shadow-green-900/20">
                            <Plus className="me-2 h-4 w-4" /> {t("Add New Product")}
                        </Button>
                    </Link>
                </div>
                <Separator className="h-px bg-green-100/50" />
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                        </div>
                    ) : (
                        <DataTable searchKey="name" columns={columns} data={products} />
                    )}
                </div>
            </div>
        </div>
    )
}
