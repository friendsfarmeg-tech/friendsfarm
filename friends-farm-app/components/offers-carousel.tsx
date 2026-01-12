"use client"

import { useEffect, useState, useRef } from "react"
import { useLanguage } from "@/components/language-provider"
import { Sparkles, Tag, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { formatter } from "@/lib/utils"



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

export const OffersCarousel = () => {
    const { t, isRtl } = useLanguage()
    const [offers, setOffers] = useState<Offer[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch('/api/offers')
                if (!res.ok) throw new Error("Failed to fetch")
                const data = await res.json()
                if (Array.isArray(data)) {
                    setOffers(data.filter((o: Offer) => o.is_active))
                } else {
                    setOffers([])
                }
            } catch (error) {
                console.error("Failed to fetch offers. Check API route /api/offers.", error)
                setOffers([])
            }
        }
        fetchOffers()
    }, [])

    // Auto-scroll
    useEffect(() => {
        if (offers.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % offers.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [offers.length])

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length)
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % offers.length)
    }

    if (offers.length === 0) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold uppercase tracking-widest">{t("No offers available now") || "No offers available now"}</p>
            </div>
        )
    }

    return (
        <div className="relative overflow-hidden py-10 bg-gradient-to-br from-[#1B5E20] to-[#0d3010]">
            {/* Background decorations */}
            <div className="absolute top-0 end-0 w-96 h-96 bg-white/5 rounded-full -me-48 -mt-48 blur-3xl" />
            <div className="absolute bottom-0 start-0 w-64 h-64 bg-amber-500/10 rounded-full -ms-32 -mb-32 blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 relative">
                {/* Header */}
                <div className="text-center mb-8">
                    <span className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 py-1.5 px-4 rounded-full font-black text-xs mb-4 uppercase tracking-widest backdrop-blur-sm">
                        <Sparkles className="w-4 h-4" />
                        {t("Special Offers")}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter">
                        {t("Don't Miss Out!")}
                    </h2>
                </div>

                {/* Carousel */}
                <div className="relative">
                    {/* Navigation arrows - Desktop only */}
                    {offers.length > 1 && (
                        <>
                            <button
                                onClick={goToPrev}
                                className="absolute start-0 top-1/2 -translate-y-1/2 -ms-4 z-10 hidden md:flex w-12 h-12 items-center justify-center bg-white rounded-2xl shadow-xl text-[#1B5E20] hover:scale-110 transition-transform"
                            >
                                <ChevronLeft className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute end-0 top-1/2 -translate-y-1/2 -me-4 z-10 hidden md:flex w-12 h-12 items-center justify-center bg-white rounded-2xl shadow-xl text-[#1B5E20] hover:scale-110 transition-transform"
                            >
                                <ChevronRight className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} />
                            </button>
                        </>
                    )}

                    <div
                        ref={containerRef}
                        className="overflow-hidden rounded-3xl"
                    >
                        <div
                            className="flex transition-transform duration-700 ease-out"
                            style={{ transform: `translateX(${isRtl ? currentIndex * 100 : -currentIndex * 100}%)` }}
                        >
                            {offers.map((offer) => (
                                <div
                                    key={offer.id}
                                    className="w-full flex-shrink-0"
                                >
                                    <div className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl">
                                        {/* Image */}
                                        <div className="relative aspect-video md:aspect-auto md:w-1/2">
                                            <Image
                                                src={offer.image || "https://placehold.co/600x400?text=Offer"}
                                                alt={offer.title}
                                                fill
                                                className="object-cover"
                                            />
                                            {/* Discount badge */}
                                            {offer.discount_percentage > 0 && (
                                                <div className="absolute top-4 start-4 bg-red-500 text-white px-3 py-1 rounded-full font-black text-sm flex items-center gap-1 shadow-lg">
                                                    <Tag className="w-4 h-4" />
                                                    {offer.discount_percentage}% {t("OFF")}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-center">
                                            <h3 className="text-xl md:text-2xl font-black text-[#1B5E20] mb-3 uppercase">
                                                {offer.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                                                {offer.description}
                                            </p>

                                            {/* Pricing */}
                                            <div className="flex items-end gap-3 mb-6">
                                                {offer.offer_price && (
                                                    <span className="text-3xl font-black text-[#1B5E20]">
                                                        {formatter.format(offer.offer_price)}
                                                    </span>
                                                )}
                                                {offer.original_price && offer.offer_price && (
                                                    <span className="text-lg text-gray-400 line-through font-bold">
                                                        {formatter.format(offer.original_price)}
                                                    </span>
                                                )}
                                            </div>

                                            <button className="bg-[#1B5E20] text-white py-3 px-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#144318] transition-colors shadow-lg shadow-green-900/20">
                                                {t("Shop Now")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots indicator */}
                    {offers.length > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {offers.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                        ? 'bg-amber-400 w-6'
                                        : 'bg-white/30 hover:bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
