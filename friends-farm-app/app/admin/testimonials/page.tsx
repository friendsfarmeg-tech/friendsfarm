"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Check, X, Trash2, MessageSquare } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Review {
    id: number
    customer_name: string
    customer_email: string
    rating: number
    comment: string
    is_approved: boolean
    is_admin_added: boolean
    created_at: string
    products?: {
        name: string
        name_ar: string
    }
}

export default function TestimonialsPage() {
    const { t, isRtl } = useLanguage()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all')

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/reviews?approved=false')
            const data = await res.json()
            setReviews(data)
        } catch (error) {
            console.error("Failed to fetch reviews", error)
        } finally {
            setLoading(false)
        }
    }

    const toggleApproval = async (id: number, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/reviews/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_approved: !currentStatus })
            })

            if (res.ok) {
                toast.success(currentStatus ? t("Review hidden") : t("Review approved"))
                fetchReviews()
            }
        } catch (error) {
            toast.error(t("Something went wrong"))
        }
    }

    const deleteReview = async (id: number) => {
        try {
            const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success(t("Successfully deleted"))
                fetchReviews()
            }
        } catch (error) {
            toast.error(t("Something went wrong"))
        }
    }

    const filteredReviews = reviews.filter(review => {
        if (filter === 'approved') return review.is_approved
        if (filter === 'pending') return !review.is_approved
        return true
    })

    if (loading) {
        return <div className="h-[400px] flex items-center justify-center font-black animate-pulse text-[#1B5E20]">{t("Loading...")}...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-amber-500" />
                        {t("Manage Testimonials")}
                    </h2>
                    <p className="text-gray-500 font-bold text-sm mt-1">{t("Approve or reject customer reviews")}</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
                    {(['all', 'approved', 'pending'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${filter === tab
                                    ? 'bg-white text-[#1B5E20] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab === 'all' ? t("All") : tab === 'approved' ? t("Approved") : t("Pending Approval")}
                            <span className="ms-2 text-xs opacity-60">
                                ({reviews.filter(r => tab === 'all' ? true : tab === 'approved' ? r.is_approved : !r.is_approved).length})
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                    <Card className="border-none shadow-xl rounded-3xl">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Star className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-400 font-bold">{t("No reviews found")}</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredReviews.map((review) => (
                        <Card key={review.id} className="border-none shadow-lg rounded-2xl overflow-hidden">
                            <CardContent className="p-5">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#1B5E20]/10 rounded-full flex items-center justify-center">
                                                    <span className="font-black text-[#1B5E20]">
                                                        {review.customer_name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900">{review.customer_name}</p>
                                                    <p className="text-xs text-gray-400">{review.customer_email}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${review.is_approved
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {review.is_approved ? t("Approved") : t("Pending")}
                                            </span>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex gap-1 mb-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                                                />
                                            ))}
                                        </div>

                                        {/* Comment */}
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            "{review.comment}"
                                        </p>

                                        {/* Product */}
                                        {review.products && (
                                            <p className="text-xs text-[#1B5E20] font-bold mt-3 uppercase">
                                                {isRtl ? review.products.name_ar : review.products.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex md:flex-col gap-2">
                                        <Button
                                            size="sm"
                                            variant={review.is_approved ? "outline" : "default"}
                                            onClick={() => toggleApproval(review.id, review.is_approved)}
                                            className={`rounded-xl ${!review.is_approved ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                        >
                                            {review.is_approved ? (
                                                <><X className="w-4 h-4 me-1" /> {t("Hide")}</>
                                            ) : (
                                                <><Check className="w-4 h-4 me-1" /> {t("Approve")}</>
                                            )}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => deleteReview(review.id)}
                                            className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                        >
                                            <Trash2 className="w-4 h-4 me-1" />
                                            {t("Delete")}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
