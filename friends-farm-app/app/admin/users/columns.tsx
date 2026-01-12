"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { CellAction } from "./cell-action"

export type UserColumn = {
    id: string
    name: string | null
    email: string | null
    role: string
    createdAt: string
}

export const columns: ColumnDef<UserColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <span className="font-black text-[#1B5E20] uppercase">{row.original.name || "Guest"}</span>
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <span className="font-bold text-gray-500">{row.original.email}</span>
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
            <Badge className={row.original.role === "ADMIN" ? "bg-amber-500 hover:bg-amber-600 border-none" : "bg-green-600 border-none"}>
                {row.original.role}
            </Badge>
        )
    },
    {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => <span className="text-xs text-gray-400 font-bold">{row.original.createdAt}</span>
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
