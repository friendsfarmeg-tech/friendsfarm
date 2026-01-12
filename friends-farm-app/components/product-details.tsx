"use client"

import { useLanguage } from "@/components/language-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Rating } from "@/components/rating"
import { ReviewForm } from "@/components/review-form"
import AddToCartButton from "@/app/(store)/products/[productId]/components/add-to-cart-button"
import { formatter } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface ProductDetailsProps {
    product: any
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
    const { t, isRtl } = useLanguage()

    return (
        <div dir={isRtl ? "rtl" : "ltr"}>
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-16">
                {/* Premium Gallery */}
                <div className="relative group">
                    <div className="aspect-square relative w-full rounded-[3rem] overflow-hidden bg-white shadow-2xl shadow-green-900/5 border border-green-50">
                        {product.image_url ? (
                            <Image
                                fill
                                src={product.image_url!}
                                alt={product.name}
                                className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full font-black text-gray-200">NO IMAGE</div>
                        )}
                        <div className="absolute top-8 left-8">
                            <Badge className="bg-[#FFD600] text-[#1B5E20] border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
                                {t("Fresh Pick") || "Fresh Pick"}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Detailed Info */}
                <div className="mt-12 md:mt-16 lg:mt-0 space-y-8">
                    <div className="space-y-4">
                        <p className="text-amber-500 font-black uppercase tracking-widest text-sm italic">
                            {isRtl && product.categories?.name_ar ? product.categories.name_ar : (product.categories?.name || 'Farm Fresh')}
                        </p>
                        <h1 className="text-4xl md:text-6xl font-black text-[#1B5E20] leading-[0.9] uppercase tracking-tighter">
                            {isRtl && product.name_ar ? product.name_ar : product.name}
                        </h1>
                        <div className="flex items-center gap-4">
                            <Rating readonly initialRating={5} />
                            <span className="text-gray-400 font-bold text-sm uppercase">({product.reviews.length} {t("Feedbacks") || "Feedbacks"})</span>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <p className="text-4xl md:text-5xl font-black text-[#1B5E20] tracking-tighter">
                            {formatter.format(Number(product.price))}
                        </p>
                        <span className="text-xl font-bold text-gray-300 uppercase italic">/ {product.unit}</span>
                    </div>

                    <Separator className="bg-green-100/50" />

                    <div className="space-y-4">
                        <h3 className="text-xl font-black text-[#1B5E20] uppercase tracking-tight">{t("Farm Description") || "Farm Description"}</h3>
                        <p className="text-gray-500 font-bold leading-relaxed text-lg">
                            {isRtl && product.description_ar ? product.description_ar : (product.description || t("Fresh products description") || "Fresh products from our farm to your table, raised naturally and with the highest quality standards.")}
                        </p>
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-1 w-full">
                            <AddToCartButton data={{
                                id: product.id,
                                name: isRtl && product.name_ar ? product.name_ar : product.name,
                                price: Number(product.price),
                                image: product.image_url || "",
                                name_ar: product.name_ar
                            }} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-12">
                        <div className="bg-white p-6 rounded-3xl border border-green-50 shadow-sm">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">{t("Stock Status") || "Stock Status"}</p>
                            <p className="text-lg font-black text-[#1B5E20] uppercase">
                                {product.stock > 0 ? `${t("In Stock") || "In Stock"} (${product.stock} ${product.unit})` : (t("Sold Out") || "Sold Out")}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-green-50 shadow-sm">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">{t("Availability") || "Availability"}</p>
                            <p className="text-lg font-black text-amber-500 uppercase">
                                {product.is_available ? (t("Ready for Pickup") || "Ready for Pickup") : (t("Coming Soon") || "Coming Soon")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews & Evaluation Section */}
            <div className="mt-24 md:mt-32 grid lg:grid-cols-2 gap-16 items-start">
                <div className="space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-[#1B5E20] uppercase tracking-tighter">{t("Community Feedback") || "Community Feedback"}</h2>
                        <p className="text-gray-400 font-bold uppercase text-sm">{t("See what your neighbors are saying") || "See what your neighbors are saying about this farm pick."}</p>
                    </div>

                    <div className="space-y-8">
                        {product.reviews.length === 0 ? (
                            <div className="bg-white/50 p-12 rounded-[2.5rem] border-2 border-dashed border-green-50 text-center">
                                <p className="text-gray-300 font-black uppercase tracking-widest">{t("No reviews yet") || "No reviews yet. Be the first!"}</p>
                            </div>
                        ) : (
                            product.reviews.map((review: any) => (
                                <div key={review.id} className="bg-white p-8 rounded-[2.5rem] border border-green-50 shadow-sm space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center font-black text-[#1B5E20] uppercase">
                                                {review.customer_name[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-[#1B5E20] uppercase tracking-tight">{review.customer_name}</p>
                                                <p className="text-[10px] font-bold text-gray-300 uppercase">{new Date(review.created_at!).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <Rating readonly initialRating={review.rating} />
                                    </div>
                                    <p className="text-gray-500 font-bold leading-relaxed">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="sticky top-24">
                    <ReviewForm productId={product.id} />
                </div>
            </div>
        </div>
    )
}
