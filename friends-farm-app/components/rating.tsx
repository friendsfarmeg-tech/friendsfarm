"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface RatingProps {
    initialRating?: number
    onChange?: (rating: number) => void
    readonly?: boolean
}

export function Rating({ initialRating = 0, onChange, readonly = false }: RatingProps) {
    const [rating, setRating] = useState(initialRating)
    const [hover, setHover] = useState(0)

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-transform hover:scale-110 active:scale-95`}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    onClick={() => {
                        if (!readonly) {
                            setRating(star)
                            onChange?.(star)
                        }
                    }}
                >
                    <Star
                        className={`w-6 h-6 md:w-8 md:h-8 transition-all ${(hover || rating) >= star
                                ? "fill-[#FFD600] text-[#FFD600] drop-shadow-[0_0_8px_rgba(255,214,0,0.5)]"
                                : "fill-transparent text-gray-200"
                            }`}
                        strokeWidth={1.5}
                    />
                </button>
            ))}
        </div>
    )
}
