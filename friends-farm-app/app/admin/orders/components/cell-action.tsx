"use client"

import { useState } from "react"
import { Copy, Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu"
import { OrderColumn } from "../columns"
import { useLanguage } from "@/components/language-provider"
import { OrderModal } from "./order-modal"

interface CellActionProps {
    data: OrderColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter()
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success(t("Order ID copied to clipboard"))
    }

    const onUpdateStatus = async (newStatus: string) => {
        try {
            setLoading(true)
            await fetch(`/api/admin/orders/${data.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            router.refresh()
            toast.success(t("Order status updated"))
        } catch (error) {
            toast.error(t("Something went wrong"))
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <OrderModal
                orderId={data.id}
                isOpen={open}
                onClose={() => setOpen(false)}
                t={t}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                    <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setOpen(true)} className="cursor-pointer font-black text-[#1B5E20]">
                        <Eye className="mr-2 h-4 w-4" />
                        {t("View Details")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCopy(data.id)} className="cursor-pointer">
                        <Copy className="mr-2 h-4 w-4" />
                        {t("Copy ID")}
                    </DropdownMenuItem>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            {t("Update Status")}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="rounded-xl">
                            <DropdownMenuRadioGroup value={data.status} onValueChange={onUpdateStatus}>
                                <DropdownMenuRadioItem value="pending" className="cursor-pointer">{t("pending")}</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="processing" className="cursor-pointer">{t("processing")}</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="shipped" className="cursor-pointer">{t("shipped")}</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="delivered" className="cursor-pointer">{t("delivered")}</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="cancelled" className="cursor-pointer text-red-500 font-bold">{t("cancelled")}</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
