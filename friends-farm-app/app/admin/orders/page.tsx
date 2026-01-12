"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { OrderColumn, getColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { useLanguage } from "@/components/language-provider"
import { Loader2 } from "lucide-react"

export default function OrdersPage() {
    const { t, isRtl } = useLanguage()
    const [orders, setOrders] = useState<OrderColumn[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/admin/orders')
                const data = await response.json()

                const formatted: OrderColumn[] = data.map((item: any) => ({
                    id: item.id,
                    customer: item.users?.name || 'Guest',
                    userId: item.users?.display_id ? String(item.users.display_id).padStart(5, '0') : (item.user_id ? item.user_id.slice(0, 8) : 'N/A'),
                    total: new Intl.NumberFormat(isRtl ? 'ar-EG' : 'en-EG', { style: 'currency', currency: 'EGP' }).format(item.total),
                    status: item.status,
                    paymentMethod: item.payment_method || 'cod',
                    createdAt: format(new Date(item.created_at || new Date()), "MMMM do, yyyy"),
                }))

                setOrders(formatted)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [isRtl])

    const columns = getColumns(t, isRtl)

    return (
        <div className="flex-col animate-in fade-in duration-700">
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Heading
                            title={`${t("Orders")} (${orders.length})`}
                            description={t("Manage Orders")}
                        />
                    </div>
                </div>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                        </div>
                    ) : (
                        <DataTable searchKey="customer" columns={columns} data={orders} />
                    )}
                </div>
            </div>
        </div>
    )
}
