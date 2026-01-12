"use client"

import Image from "next/image"
import { ShoppingBasket } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/use-cart"
import { useLanguage } from "@/components/language-provider"
import { formatter } from "@/lib/utils"
import { EggRating } from "@/components/egg-rating"

import { calculateProductPrice } from "@/lib/price-utils"

interface ProductCardProps {
    data: any // Adjust type as needed
}

export const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
    const cart = useCart()
    const { t, isRtl } = useLanguage()

    const { finalPrice, originalPrice, hasDiscount, discountPercentage } = calculateProductPrice(data, data.categories)

    const onAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        cart.addItem({
            id: data.id,
            name: data.name,
            name_ar: data.name_ar,
            price: finalPrice, // Use final discounted price
            image_url: data.image_url || "",
            quantity: 1,
            unit: data.unit
        })
    }

    return (
        <div className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-500 hover:-translate-y-1 relative">

            {hasDiscount && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider animate-pulse">
                    -{discountPercentage}%
                </div>
            )}

            <Link href={`/products/${data.id}`} className="block relative aspect-square overflow-hidden bg-gray-50 cursor-pointer">
                <Image
                    src={data.image_url || "https://placehold.co/400x400?text=Farm"}
                    alt={data.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm">
                    <span className="text-[10px] font-black text-[#1B5E20] uppercase tracking-wider">
                        {isRtl ? data.categories?.name_ar : data.categories?.name}
                    </span>
                </div>
            </Link>

            <div className="p-4 space-y-1">
                <EggRating rating={data.average_rating || 5} size="sm" />

                <h3 className="font-extrabold text-[#1B5E20] text-sm md:text-base mb-1 md:mb-2 line-clamp-1 uppercase tracking-tight group-hover:text-amber-600 transition-colors duration-500">
                    {isRtl ? (data.name_ar || data.name) : data.name}
                </h3>

                <div className="flex items-center justify-between pt-3">
                    <div className="flex flex-col items-start">
                        <div className="flex items-baseline gap-1">
                            <span className={`text-base font-black ${hasDiscount ? 'text-red-500' : 'text-[#1B5E20]'}`}>
                                {formatter.format(finalPrice).replace("EGP", "")}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                                {t("EGP")}
                            </span>
                        </div>
                        {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through font-bold">
                                {formatter.format(originalPrice)}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={onAddToCart}
                        className="bg-[#1B5E20] text-white p-2.5 rounded-xl shadow-lg shadow-green-900/20 active:scale-90 transition-all duration-300 hover:rotate-12 hover:bg-[#2E7D32]"
                    >
                        <ShoppingBasket className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
