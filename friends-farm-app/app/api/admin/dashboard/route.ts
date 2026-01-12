import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const today = new Date()
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

        const [
            productCount,
            orderCount,
            userCount,
            totalRevenue,
            monthlyRevenue,
            pendingOrdersCount,
            recentOrders,
            topProducts
        ] = await Promise.all([
            prisma.products.count(),
            prisma.orders.count(),
            prisma.user.count(),
            prisma.orders.aggregate({
                _sum: { total: true },
                where: { status: 'delivered' }
            }),
            prisma.orders.aggregate({
                _sum: { total: true },
                where: {
                    status: 'delivered',
                    created_at: { gte: thirtyDaysAgo }
                }
            }),
            prisma.orders.count({
                where: { status: 'pending' }
            }),
            prisma.orders.findMany({
                take: 5,
                orderBy: { created_at: 'desc' },
                include: { users: true }
            }),
            prisma.products.findMany({
                take: 4,
                orderBy: { order_items: { _count: 'desc' } },
                include: { categories: true }
            })
        ])

        // Generate dummy graph data for the last 6 months
        const graphData = [
            { name: "Jul", total: 0 },
            { name: "Aug", total: 0 },
            { name: "Sep", total: 0 },
            { name: "Oct", total: Number(totalRevenue._sum.total || 0) * 0.2 },
            { name: "Nov", total: Number(totalRevenue._sum.total || 0) * 0.35 },
            { name: "Dec", total: Number(totalRevenue._sum.total || 0) * 0.45 },
        ]

        return NextResponse.json({
            productCount,
            orderCount,
            userCount,
            totalRevenue: Number(totalRevenue._sum.total || 0),
            monthlyRevenue: Number(monthlyRevenue._sum.total || 0),
            pendingOrdersCount,
            recentOrders,
            topProducts,
            graphData
        })
    } catch (error) {
        console.error("[DASHBOARD_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
