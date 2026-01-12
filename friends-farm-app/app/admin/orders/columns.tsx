"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Clock, RefreshCw, Truck, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatter } from "@/lib/utils"
import { CellAction } from "./components/cell-action"

export type OrderColumn = {
    id: string
    customer: string
    userId: string
    total: string
    status: string
    paymentMethod: string
    createdAt: string
}

export const getColumns = (t: (key: string) => string, isRtl: boolean): ColumnDef<OrderColumn>[] => [
    {
        accessorKey: "id",
        header: t("Order ID"),
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.id.slice(0, 8)}</span>
    },
    {
        accessorKey: "customer",
        header: t("Customer"),
        cell: ({ row }) => {
            const status = row.original.status;
            const statusMap: Record<string, { color: string }> = {
                pending: { color: "bg-orange-500" },
                processing: { color: "bg-blue-500" },
                shipped: { color: "bg-purple-500" },
                delivered: { color: "bg-green-500" },
                cancelled: { color: "bg-red-500" },
            };
            const config = statusMap[status] || statusMap.pending;

            return (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${config.color}`} />
                    <span className="font-bold">{row.original.customer}</span>
                </div>
            );
        }
    },
    {
        accessorKey: "total",
        header: t("Total Price"),
        cell: ({ row }) => <span className="font-black text-[#1B5E20]">{row.original.total}</span>
    },
    {
        accessorKey: "userId",
        header: t("User ID"),
        cell: ({ row }) => <span className="font-mono text-[10px] text-gray-500">{row.original.userId || "N/A"}</span>
    },
    {
        accessorKey: "paymentMethod",
        header: t("Payment"),
        cell: ({ row }) => (
            <Badge variant="outline" className={`font-black uppercase text-[10px] ${row.original.paymentMethod === 'instapay'
                ? 'border-purple-200 bg-purple-50 text-purple-700'
                : 'border-green-200 bg-green-50 text-green-700'
                }`}>
                {row.original.paymentMethod === 'instapay' ? "InstaPay" : t("Cash")}
            </Badge>
        )
    },
    {
        accessorKey: "status",
        header: t("Status"),
        cell: ({ row }) => {
            const status = row.original.status;
            const statusMap: Record<string, { label: string, color: string, icon: any }> = {
                pending: { label: t("pending"), color: "bg-orange-50 text-orange-700 border-orange-200", icon: Clock },
                processing: { label: t("processing"), color: "bg-blue-50 text-blue-700 border-blue-200", icon: RefreshCw },
                shipped: { label: t("shipped"), color: "bg-purple-50 text-purple-700 border-purple-200", icon: Truck },
                delivered: { label: t("delivered"), color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2 },
                cancelled: { label: t("cancelled"), color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
            };

            const config = statusMap[status] || statusMap.pending;
            const Icon = config.icon;

            return (
                <Badge variant="outline" className={`font-black uppercase text-[10px] gap-1 px-2 ${config.color}`}>
                    <Icon className="w-3 h-3" />
                    {config.label}
                </Badge>
            );
        }
    },
    {
        accessorKey: "createdAt",
        header: t("Date"),
        cell: ({ row }) => <span className="text-xs text-gray-500">{row.original.createdAt}</span>
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
