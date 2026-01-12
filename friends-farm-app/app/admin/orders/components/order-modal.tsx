"use client"

import { useEffect, useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, User, Package, Clock, RefreshCw, Truck, CheckCircle2, XCircle } from "lucide-react"
import Image from "next/image"
import { formatter } from "@/lib/utils"

interface OrderModalProps {
    orderId: string | null
    isOpen: boolean
    onClose: () => void
    t: (key: string) => string
}

export const OrderModal: React.FC<OrderModalProps> = ({
    orderId,
    isOpen,
    onClose,
    t
}) => {
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState<any>(null)

    useEffect(() => {
        if (isOpen && orderId) {
            const fetchOrder = async () => {
                try {
                    setLoading(true)
                    const res = await fetch(`/api/admin/orders/${orderId}`)
                    const data = await res.json()
                    setOrder(data)
                } catch (error) {
                    console.error("Order Fetch Error:", error)
                } finally {
                    setLoading(false)
                }
            }
            fetchOrder()
        }
    }, [isOpen, orderId])

    if (!order && !loading) return null

    const statusMap: Record<string, { label: string, color: string, icon: any }> = {
        pending: { label: t("pending"), color: "bg-orange-50 text-orange-700 border-orange-200", icon: Clock },
        processing: { label: t("processing"), color: "bg-blue-50 text-blue-700 border-blue-200", icon: RefreshCw },
        shipped: { label: t("shipped"), color: "bg-purple-50 text-purple-700 border-purple-200", icon: Truck },
        delivered: { label: t("delivered"), color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2 },
        cancelled: { label: t("cancelled"), color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
    }

    const config = statusMap[order?.status] || statusMap.pending
    const mapLinkMatch = order?.address?.match(/(https:\/\/www\.google\.com\/maps[^ \n]*)/)
    const mapLink = mapLinkMatch ? mapLinkMatch[0] : null
    const cleanAddress = order?.address?.replace(/Location: https:\/\/www\.google\.com\/maps[^ \n]*/, '').trim()

    return (
        <Modal
            title={t("Order Details")}
            description={t("Detailed information about order #") + (orderId?.slice(0, 8) || "")}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="max-h-[70vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        {/* Status Heading */}
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${config.color.split(' ')[0]} ${config.color.split(' ')[1]}`}>
                                    <config.icon className="w-5 h-5" />
                                </div>
                                <span className="font-black uppercase tracking-tight">{config.label}</span>
                            </div>
                            <span className="font-black text-[#1B5E20] text-xl">{formatter.format(Number(order.total))}</span>
                        </div>

                        {/* Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-4 h-4" /> {t("Customer")}
                                </h3>
                                <div className="space-y-2">
                                    <p className="font-bold text-gray-900">{order.users?.name || "Guest"}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                        <Mail className="w-3 h-3" /> {order.users?.email || "N/A"}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                        <Phone className="w-3 h-3" /> {order.notes?.match(/Phone: (01[0-9]+)/)?.[1] || "N/A"}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> {t("Shipping")}
                                </h3>
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-gray-600 line-height-relaxed whitespace-pre-wrap">{cleanAddress}</p>
                                    {mapLink && (
                                        <a href={mapLink} target="_blank" className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-black uppercase hover:bg-blue-100 transition-colors">
                                            <MapPin className="w-3 h-3" /> {t("Open on Maps")}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-gray-100" />

                        {/* Items */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Package className="w-4 h-4" /> {t("Order Summary")}
                            </h3>
                            <div className="space-y-3">
                                {order.order_items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-50 shadow-sm group hover:border-green-100 transition-all">
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                            <Image
                                                src={item.products?.image_url || 'https://placehold.co/100'}
                                                alt={item.products?.name || "Product"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 truncate">
                                                {item.products?.name}
                                            </p>
                                            <p className="text-xs text-[#1B5E20] font-black">
                                                {item.quantity} x {formatter.format(Number(item.price))}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-gray-900">
                                                {formatter.format(Number(item.price) * Number(item.quantity))}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        {order.notes && order.notes.replace(/Phone: 01[0-9]+\n?/, '').trim() && (
                            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                                <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-1">{t("Special Instructions")}</p>
                                <p className="text-sm font-bold text-amber-900 italic">"{order.notes.replace(/Phone: 01[0-9]+\n?/, '').trim()}"</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    )
}
