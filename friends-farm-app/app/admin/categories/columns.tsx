"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import Image from "next/image"

export type CategoryColumn = {
    id: string
    name: string
    name_ar: string
    image_url: string | null
    createdAt: string
}

export const columns: ColumnDef<CategoryColumn>[] = [
    {
        accessorKey: "image_url",
        header: "Image",
        cell: ({ row }) => (
            <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-gray-100">
                <Image
                    fill
                    src={row.original.image_url || "/placeholder-category.png"}
                    alt="Category"
                    className="object-cover"
                />
            </div>
        )
    },
    {
        accessorKey: "name",
        header: "name",
    },
    {
        accessorKey: "name_ar",
        header: "name_ar",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
