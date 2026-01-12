"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ProductColumn = {
    id: string
    name: string
    name_ar: string
    price: string
    category: string
    stock: number
    isFeatured: boolean
    isAvailable: boolean
    createdAt: string
}

export const getColumns = (t: (key: string) => string, isRtl: boolean): ColumnDef<ProductColumn>[] => [
    {
        accessorKey: "name",
        header: t("Name (EN)"),
        cell: ({ row }) => <span className="font-black text-[#1B5E20] uppercase text-left block">{row.original.name}</span>
    },
    {
        accessorKey: "name_ar",
        header: t("Name (AR)"),
        cell: ({ row }) => <span className="font-bold text-[#1B5E20] text-right block font-cairo">{row.original.name_ar}</span>
    },
    {
        accessorKey: "price",
        header: t("Price"),
        cell: ({ row }) => {
            // Parse the numeric value from the formatted string (assuming it was formatted as EGP 100.00)
            // Ideally backend should send raw number, but here we work with what we have or re-format
            // For now, let's assume we just want to replace EGP with translated currency symbol if needed
            // Or better, just display it. Use text-start to align with header.
            return <span className="font-bold text-amber-600 block text-start" dir="ltr">{row.original.price}</span>
        }
    },
    {
        accessorKey: "category",
        header: t("Category"),
        cell: ({ row }) => <span className="font-bold text-gray-500 block text-start">{row.original.category}</span>
    },
    {
        accessorKey: "stock",
        header: t("Stock"),
        cell: ({ row }) => (
            <span className={`font-black block text-center ${row.original.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>
                {row.original.stock}
            </span>
        )
    },
    {
        accessorKey: "isFeatured",
        header: t("Featured"),
        cell: ({ row }) => (
            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg block w-fit mx-auto ${row.original.isFeatured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                {row.original.isFeatured ? t("Yes") : t("No")}
            </span>
        )
    },
    {
        accessorKey: "isAvailable",
        header: t("Active"),
        cell: ({ row }) => (
            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg block w-fit mx-auto ${row.original.isAvailable ? 'bg-green-600 text-white' : 'bg-red-100 text-red-600'}`}>
                {row.original.isAvailable ? t("Live") : t("Hidden")}
            </span>
        )
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
]
