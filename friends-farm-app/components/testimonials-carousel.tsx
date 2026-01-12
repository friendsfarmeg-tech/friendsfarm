"use client"

import { useEffect, useState, useRef } from "react"
import { useLanguage } from "@/components/language-provider"
import { Quote } from "lucide-react"
import { EggRating } from "@/components/egg-rating"

interface Testimonial {
    id: number
    customer_name: string
    comment: string
    rating: number
    created_at: string
}

export const TestimonialsCarousel = () => {
    const { t, isRtl } = useLanguage()
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await fetch('/api/reviews?featured=true&limit=6')
                if (!res.ok) throw new Error("Failed to fetch")
                const data = await res.json()
                if (Array.isArray(data)) {
                    setTestimonials(data)
                } else {
                    setTestimonials([])
                }
            } catch (error) {
                console.error("Failed to fetch testimonials", error)
                setTestimonials([])
            }
        }
        fetchTestimonials()
    }, [])

    // Auto-scroll
    useEffect(() => {
        if (testimonials.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [testimonials.length])

    if (testimonials.length === 0) return null

    return (
        <div className="relative overflow-hidden py-12">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-transparent -z-10" />

            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-10">
                    <span className="inline-block bg-amber-100 text-amber-700 py-1 px-4 rounded-full font-black text-xs mb-4 uppercase tracking-widest">
                        {t("Customer Reviews")}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-[#1B5E20] uppercase tracking-tighter">
                        {t("What Our Customers Say")}
                    </h2>
                </div>

                <div
                    ref={containerRef}
                    className="relative"
                >
                    <div
                        className="flex transition-transform duration-700 ease-out"
                        style={{ transform: `translateX(${isRtl ? currentIndex * 100 : -currentIndex * 100}%)` }}
                    >
                        {testimonials.map((testimonial, idx) => (
                            <div
                                key={testimonial.id}
                                className="w-full flex-shrink-0 px-4"
                            >
                                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-green-900/5 border border-gray-100 relative">
                                    {/* Quote icon */}
                                    <div className="absolute -top-4 start-8">
                                        <div className="bg-[#1B5E20] p-3 rounded-2xl">
                                            <Quote className="w-5 h-5 text-white" />
                                        </div>
                                    </div>

                                    {/* Golden Egg Rating */}
                                    <div className="mb-4 pt-4">
                                        <EggRating rating={testimonial.rating} size="md" />
                                    </div>

                                    {/* Comment */}
                                    <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">
                                        "{testimonial.comment}"
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#1B5E20]/10 rounded-full flex items-center justify-center">
                                            <span className="font-black text-[#1B5E20]">
                                                {testimonial.customer_name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-black text-[#1B5E20] text-sm">
                                                {testimonial.customer_name}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                {t("Verified Customer")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dots indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? 'bg-[#1B5E20] w-6'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
