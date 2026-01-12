"use client"

import { useState } from "react"
import { Rating } from "./rating"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { toast } from "sonner"

interface ReviewFormProps {
    productId: string
}

export function ReviewForm({ productId }: ReviewFormProps) {
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: productId,
                    rating,
                    comment
                })
            })

            if (!res.ok) throw new Error("Failed to submit review")

            toast.success("Thank you! Your review has been submitted for approval.")
            setComment("")
            setRating(5)
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-green-50 shadow-sm">
            <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#1B5E20] uppercase tracking-tighter">Rate this product</h3>
                <p className="text-gray-400 font-bold text-sm uppercase">Your feedback helps neighbors find the best fresh products.</p>
            </div>

            <div className="py-2">
                <Rating initialRating={rating} onChange={setRating} />
            </div>

            <div className="space-y-4">
                <Textarea
                    placeholder="Tell us what you think... How was the quality? The delivery?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[120px] rounded-2xl border-gray-100 bg-gray-50/50 focus:ring-[#1B5E20] font-bold text-gray-700"
                    required
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#1B5E20] hover:bg-[#2e7d32] text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-green-900/10"
                >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
            </div>
        </form>
    )
}
