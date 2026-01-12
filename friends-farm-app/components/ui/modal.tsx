"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface ModalProps {
    title: string
    description: string
    isOpen: boolean
    onClose: () => void
    children?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
    title,
    description,
    isOpen,
    onClose,
    children
}) => {
    const onChange = (open: boolean) => {
        if (!open) {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-none shadow-2xl">
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-3xl font-black text-[#1B5E20] uppercase tracking-tighter">{title}</DialogTitle>
                    <DialogDescription className="text-gray-500 font-bold">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}
