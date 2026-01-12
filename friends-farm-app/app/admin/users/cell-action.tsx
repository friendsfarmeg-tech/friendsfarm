"use client"

import axios from "axios"
import { useState } from "react"
import { ShieldAlert, ShieldCheck, Trash, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/modals/alert-modal"
import { UserColumn } from "./columns"

interface CellActionProps {
    data: UserColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onToggleAdmin = async () => {
        try {
            setLoading(true)
            await axios.patch(`/api/users/${data.id}`, {
                is_admin: data.role !== "ADMIN"
            })
            router.refresh()
            toast.success("User role updated.")
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/users/${data.id}`)
            router.refresh()
            toast.success("User deleted.")
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl border-gray-100 shadow-xl">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={onToggleAdmin}
                        className="cursor-pointer font-bold"
                    >
                        {data.role === "ADMIN" ? (
                            <><ShieldAlert className="mr-2 h-4 w-4" /> Demote to User</>
                        ) : (
                            <><ShieldCheck className="mr-2 h-4 w-4" /> Promote to Admin</>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                        className="text-red-600 cursor-pointer font-bold"
                    >
                        <Trash className="mr-2 h-4 w-4" /> Delete User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
