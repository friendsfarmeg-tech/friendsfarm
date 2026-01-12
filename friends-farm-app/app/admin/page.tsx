"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { formatter } from "@/lib/utils"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts"

interface DashboardData {
    productCount: number
    orderCount: number
    userCount: number
    totalRevenue: number
    monthlyRevenue: number
    pendingOrdersCount: number
    recentOrders: any[]
    topProducts: any[]
    graphData: any[]
}

export default function AdminDashboardPage() {
    const { t, isRtl } = useLanguage()
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // In a real scenario, this would be an API call. 
                // For now, we fetch from a server action or API route.
                const response = await fetch('/api/admin/dashboard')
                const result = await response.json()
                setData(result)
            } catch (error) {
                console.error("Dashboard fetch error:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    if (loading) {
        return <div className="h-[400px] w-full flex items-center justify-center font-black animate-pulse text-[#1B5E20]">{t("Loading Farm")}...</div>
    }

    if (!data) return <div>{t("Error")}</div>

    return (
        <div className={`flex-col space-y-8 animate-in fade-in duration-1000 ${isRtl ? 'font-tajawal' : ''}`}>

            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    {t("Admin Dashboard")}
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </h2>
                <p className="text-gray-500 font-bold">{t("Dashboard Summary")}</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title={t("Total Revenue")}
                    value={formatter.format(data.totalRevenue)}
                    label={t("Lifetime Earnings")}
                    icon={<DollarSign className="h-5 w-5 text-white" />}
                    color="bg-[#1B5E20]"
                    trend="+12.5%"
                    isUp={true}
                />
                <StatCard
                    title={t("Monthly Revenue")}
                    value={formatter.format(data.monthlyRevenue)}
                    label={t("Last 30 Days")}
                    icon={<TrendingUp className="h-5 w-5 text-white" />}
                    color="bg-blue-600"
                    trend="+8.2%"
                    isUp={true}
                />
                <StatCard
                    title={t("Pending Orders")}
                    value={data.pendingOrdersCount.toString()}
                    label={t("Awaiting Delivery")}
                    icon={<ShoppingCart className="h-5 w-5 text-white" />}
                    color="bg-orange-500"
                    trend="-2"
                    isUp={false}
                />
                <StatCard
                    title={t("Total Customers")}
                    value={`+${data.userCount}`}
                    label={t("Active Accounts")}
                    icon={<Users className="h-5 w-5 text-white" />}
                    color="bg-teal-600"
                    trend="+48"
                    isUp={true}
                />
            </div>

            {/* Financial Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-8">
                        <div>
                            <CardTitle className="text-xl font-black text-gray-800">{t("Sales Overview")}</CardTitle>
                            <p className="text-xs font-bold text-gray-400 mt-1">{t("Monthly Revenue Tracking")}</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                <ArrowUpRight className="w-3 h-3" /> 14%
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.graphData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1B5E20" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#1B5E20" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        fontWeight="bold"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        fontWeight="bold"
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#1B5E20"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-none shadow-2xl shadow-gray-200/50 rounded-3xl bg-[#1B5E20] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-xl font-black">{t("Finance Hub")}</CardTitle>
                        <p className="text-xs font-bold text-white/60">{t("Net Profit vs Expenses")}</p>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-8">
                        <div>
                            <p className="text-3xl font-black">{formatter.format(data.totalRevenue * 0.7)}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mt-1">{t("Net Profit")}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-bold opacity-60">{t("Expenses")}</span>
                                <span className="font-black">{formatter.format(data.totalRevenue * 0.3)}</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full" style={{ width: '30%' }} />
                            </div>
                        </div>
                        <div className="pt-4 grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-2xl flex flex-col gap-1">
                                <p className="text-lg font-black">{data.orderCount}</p>
                                <p className="text-[10px] font-black uppercase text-white/40">{t("Orders")}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl flex flex-col gap-1">
                                <p className="text-lg font-black">+{data.userCount}</p>
                                <p className="text-[10px] font-black uppercase text-white/40">{t("Users")}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Items Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-none shadow-xl shadow-gray-100 rounded-3xl bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-black text-gray-800">{t("Recent Orders")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {data.recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center font-black text-[#1B5E20] border border-gray-100">
                                            {order.users?.name?.[0]?.toUpperCase() || 'G'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900">{order.users?.name || t("Guest")}</p>
                                            <p className="text-[10px] font-bold text-gray-400">{new Date(order.created_at || '').toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-[#1B5E20]">{formatter.format(Number(order.total))}</p>
                                        <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg inline-block mt-1 ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {order.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-none shadow-xl shadow-gray-100 rounded-3xl bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-black text-gray-800">{t("Top Performing Products")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {data.topProducts.map((product) => (
                                <div key={product.id} className="flex items-center gap-4">
                                    <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                                        <Image src={product.image_url || 'https://placehold.co/100'} alt={product.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-gray-900 truncate">{isRtl ? product.name_ar : product.name}</p>
                                        <p className="text-[10px] font-bold text-[#1B5E20] uppercase">{isRtl ? product.categories?.name_ar : product.categories?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-gray-900">{formatter.format(Number(product.price))}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.unit}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatCard({ title, value, label, icon, color, trend, isUp }: any) {
    return (
        <Card className="border-none shadow-xl shadow-gray-100 rounded-3xl bg-white overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`${color} p-3 rounded-2xl shadow-lg shadow-gray-200 group-hover:rotate-6 transition-transform`}>
                        {icon}
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${isUp ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {trend}
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                    <div className="text-2xl font-black text-gray-900">{value}</div>
                    <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">{label}</p>
                </div>
            </CardContent>
        </Card>
    )
}
