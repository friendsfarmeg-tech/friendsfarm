"use client"

import { useEffect, useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

interface AlertModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    loading: boolean
}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <Modal
            title="Are you sure?"
            description="This action cannot be undone."
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant="outline" onClick={onClose} className="rounded-2xl border-2">
                    Cancel
                </Button>
                <Button disabled={loading} variant="destructive" onClick={onConfirm} className="rounded-2xl bg-red-600 hover:bg-red-700">
                    Continue
                </Button>
            </div>
        </Modal>
    )
}
