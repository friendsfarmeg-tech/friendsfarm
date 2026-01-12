"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Pencil, Tag, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { formatter } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ImageUpload } from "@/components/ui/image-upload"

interface Offer {
    id: number
    title: string
    description: string
    image: string
    discount_percentage: number
    offer_price: number
    original_price: number
    is_active: boolean
}

export default function OffersPage() {
    const { t, isRtl } = useLanguage()
    const [offers, setOffers] = useState<Offer[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        discount_percentage: 0,
        offer_price: 0,
        original_price: 0,
        is_active: true
    })

    useEffect(() => {
        fetchOffers()
    }, [])

    const fetchOffers = async () => {
        try {
            const res = await fetch('/api/offers?active=false')
            const data = await res.json()
            if (Array.isArray(data)) {
                setOffers(data)
            } else {
                setOffers([])
            }
        } catch (error) {
            console.error("Failed to fetch offers", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success(t("Offer created successfully"))
                setIsDialogOpen(false)
                setFormData({
                    title: "",
                    description: "",
                    image: "",
                    discount_percentage: 0,
                    offer_price: 0,
                    original_price: 0,
                    is_active: true
                })
                fetchOffers()
            } else {
                const data = await res.json()
                toast.error(data.error || t("Something went wrong"))
            }
        } catch (error) {
            toast.error(t("Something went wrong"))
        }
    }

    const deleteOffer = async (id: number) => {
        try {
            const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success(t("Successfully deleted"))
                fetchOffers()
            }
        } catch (error) {
            toast.error(t("Something went wrong"))
        }
    }

    if (loading) {
        return <div className="h-[400px] flex items-center justify-center font-black animate-pulse text-[#1B5E20]">{t("Loading...")}...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Tag className="w-8 h-8 text-red-500" />
                        {t("Manage Offers")}
                    </h2>
                    <p className="text-gray-500 font-bold text-sm mt-1">{t("Create and manage special offers")}</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#1B5E20] hover:bg-[#144318] rounded-2xl font-black uppercase tracking-widest">
                            <Plus className="w-4 h-4 me-2" />
                            {t("Add New Offer")}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-3xl max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black text-[#1B5E20]">
                                {t("Add New Offer")}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-gray-700">{t("Offer Title")}</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="rounded-xl"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-gray-700">{t("Description")}</Label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-gray-700">{t("Image URL")}</Label>
                                <ImageUpload
                                    value={formData.image}
                                    onChange={(url) => setFormData({ ...formData, image: url })}
                                    disabled={loading}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700">{t("Discount %")}</Label>
                                    <Input
                                        type="number"
                                        value={formData.discount_percentage}
                                        onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) })}
                                        className="rounded-xl"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-gray-700">{t("Original Price")}</Label>
                                <Input
                                    type="number"
                                    value={formData.original_price}
                                    onChange={(e) => {
                                        const original = Number(e.target.value)
                                        const offer = formData.offer_price
                                        const discount = original > 0 ? Math.round(((original - offer) / original) * 100) : 0
                                        setFormData({
                                            ...formData,
                                            original_price: original,
                                            discount_percentage: discount
                                        })
                                    }}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-gray-700">{t("Offer Price")}</Label>
                                <Input
                                    type="number"
                                    value={formData.offer_price}
                                    onChange={(e) => {
                                        const offer = Number(e.target.value)
                                        const original = formData.original_price
                                        const discount = original > 0 ? Math.round(((original - offer) / original) * 100) : 0
                                        setFormData({
                                            ...formData,
                                            offer_price: offer,
                                            discount_percentage: discount
                                        })
                                    }}
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                                    {t("Cancel")}
                                </Button>
                                <Button type="submit" className="bg-[#1B5E20] hover:bg-[#144318] rounded-xl font-bold">
                                    {t("Create")}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.length === 0 ? (
                    <Card className="col-span-full border-none shadow-xl rounded-3xl">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Tag className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-400 font-bold">{t("No offers yet")}</p>
                        </CardContent>
                    </Card>
                ) : (
                    offers.map((offer) => (
                        <Card key={offer.id} className="border-none shadow-xl rounded-3xl overflow-hidden group">
                            {offer.image && (
                                <div className="relative h-40">
                                    <Image src={offer.image} alt={offer.title} fill className="object-cover" />
                                    {offer.discount_percentage > 0 && (
                                        <div className="absolute top-3 start-3 bg-red-500 text-white px-3 py-1 rounded-full font-black text-xs">
                                            {offer.discount_percentage}% {t("OFF")}
                                        </div>
                                    )}
                                </div>
                            )}
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-black text-[#1B5E20] text-lg">{offer.title}</h3>
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${offer.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {offer.is_active ? t("Active") : t("Inactive")}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{offer.description}</p>
                                <div className="flex items-end justify-between">
                                    <div>
                                        {offer.offer_price > 0 && (
                                            <p className="font-black text-xl text-[#1B5E20]">
                                                {formatter.format(offer.offer_price)}
                                            </p>
                                        )}
                                        {offer.original_price > 0 && (
                                            <p className="text-sm text-gray-400 line-through">
                                                {formatter.format(offer.original_price)}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => deleteOffer(offer.id)}
                                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div >
    )
}
