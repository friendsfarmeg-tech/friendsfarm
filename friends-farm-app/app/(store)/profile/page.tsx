"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useLanguage } from "@/components/language-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Package, Clock, CheckCircle2, XCircle } from "lucide-react"
import { formatter } from "@/lib/utils"
import Image from "next/image"

export default function ProfilePage() {
    const { data: session } = useSession()
    const { t, isRtl } = useLanguage()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders')
                const data = await res.json()
                setOrders(data)
            } catch (error) {
                console.error("Failed to fetch orders", error)
            } finally {
                setLoading(false)
            }
        }
        if (session) {
            fetchOrders()
        }
    }, [session])

    const activeOrders = orders.filter(order => ['pending', 'processing', 'shipped'].includes(order.status))
    const historyOrders = orders.filter(order => ['delivered', 'cancelled'].includes(order.status))

    const OrderCard = ({ order }: { order: any }) => (
        <Card className="mb-4 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 p-6 flex flex-row items-center justify-between pb-4">
                <div className="space-y-1">
                    <CardTitle className="font-black text-lg flex items-center gap-2">
                        {t("Order")} #{order.id.slice(0, 8)}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">
                        {new Date(order.created_at).toLocaleDateString()}
                    </CardDescription>
                </div>
                <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className="uppercase font-black tracking-wider">
                    {t(order.status)}
                </Badge>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4">
                    {order.order_items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
                            <span className="font-bold text-sm text-gray-700">
                                {isRtl && item.products?.name_ar ? item.products.name_ar : item.products?.name || "Product"}
                                <span className="text-gray-400 text-xs ml-2 font-normal">x{item.quantity}</span>
                            </span>
                            <span className="font-mono font-bold text-sm">
                                {formatter.format(Number(item.price))}
                            </span>
                        </div>
                    ))}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="font-black uppercase text-xs tracking-widest text-gray-400">{t("Total")}</span>
                        <span className="font-black text-xl text-[#1B5E20] font-mono">{formatter.format(Number(order.total))}</span>
                    </div>
                    {order.payment_method === 'instapay' && (
                        <div className="text-xs text-purple-600 font-bold bg-purple-50 p-2 rounded-xl text-center">
                            Paid via InstaPay
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )

    if (!session) return <div className="min-h-screen flex items-center justify-center pt-20">{t("Please login to view profile")}</div>

    return (
        <div className="min-h-screen bg-[#F8F9FA] pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-6">

                {/* User Info */}
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#E8F5E9] mb-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#E8F5E9] shadow-xl">
                        {session.user?.image ? (
                            <Image src={session.user.image} alt={session.user.name || "User"} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#E8F5E9] flex items-center justify-center"><User className="w-12 h-12 text-[#1B5E20] opacity-50" /></div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-[#1B5E20] tracking-tighter uppercase">{session.user?.name}</h1>
                        <p className="text-gray-400 font-bold tracking-widest uppercase">{session.user?.email}</p>
                        <p className="font-mono text-sm text-gray-500 bg-gray-50 inline-block px-3 py-1 rounded-lg border border-gray-100">
                            ID: {session.user?.display_id ? String(session.user.display_id).padStart(5, '0') : '...'}
                        </p>
                    </div>
                </div>

                {/* Orders Tabs */}
                <Tabs defaultValue="active" className="space-y-8">
                    <TabsList className="bg-white p-1 rounded-full border border-gray-100 shadow-sm w-full md:w-auto inline-flex">
                        <TabsTrigger value="active" className="rounded-full px-8 py-3 data-[state=active]:bg-[#1B5E20] data-[state=active]:text-white font-black uppercase tracking-widest text-xs transition-all">
                            <Clock className="w-4 h-4 me-2" />
                            {t("Active Orders")}
                        </TabsTrigger>
                        <TabsTrigger value="history" className="rounded-full px-8 py-3 data-[state=active]:bg-[#1B5E20] data-[state=active]:text-white font-black uppercase tracking-widest text-xs transition-all">
                            <CheckCircle2 className="w-4 h-4 me-2" />
                            {t("Order History")}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="active" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {loading ? (
                            <div className="text-center py-12 text-gray-400">{t("Loading orders...")}</div>
                        ) : activeOrders.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeOrders.map(order => <OrderCard key={order.id} order={order} />)}
                            </div>
                        ) : (
                            <div className="text-center py-12 space-y-4">
                                <Package className="w-16 h-16 text-gray-200 mx-auto" />
                                <p className="text-gray-400 font-bold">{t("No active orders")}</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {loading ? (
                            <div className="text-center py-12 text-gray-400">{t("Loading orders...")}</div>
                        ) : historyOrders.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {historyOrders.map(order => <OrderCard key={order.id} order={order} />)}
                            </div>
                        ) : (
                            <div className="text-center py-12 space-y-4">
                                <Package className="w-16 h-16 text-gray-200 mx-auto" />
                                <p className="text-gray-400 font-bold">{t("No order history")}</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
