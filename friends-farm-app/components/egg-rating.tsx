"use client"

import { cn } from "@/lib/utils"

interface EggRatingProps {
    rating: number
    maxRating?: number
    size?: "sm" | "md" | "lg"
    interactive?: boolean
    onRatingChange?: (rating: number) => void
}

export const EggRating = ({
    rating,
    maxRating = 5,
    size = "md",
    interactive = false,
    onRatingChange
}: EggRatingProps) => {
    const sizeClasses = {
        sm: "w-4 h-5",
        md: "w-5 h-6",
        lg: "w-7 h-8"
    }

    const handleClick = (newRating: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(newRating)
        }
    }

    return (
        <div className="flex gap-1">
            {Array.from({ length: maxRating }, (_, i) => i + 1).map((eggIndex) => (
                <button
                    key={eggIndex}
                    type="button"
                    onClick={() => handleClick(eggIndex)}
                    disabled={!interactive}
                    className={cn(
                        "transition-transform duration-200",
                        interactive && "hover:scale-125 cursor-pointer",
                        !interactive && "cursor-default"
                    )}
                >
                    <svg
                        viewBox="0 0 24 30"
                        className={cn(sizeClasses[size], "drop-shadow-sm")}
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Egg shape */}
                        <ellipse
                            cx="12"
                            cy="16"
                            rx="10"
                            ry="12"
                            className={cn(
                                "transition-colors duration-200",
                                eggIndex <= rating
                                    ? "fill-amber-400 stroke-amber-500"
                                    : "fill-gray-200 stroke-gray-300"
                            )}
                            strokeWidth="1.5"
                        />
                        {/* Golden shine effect */}
                        {eggIndex <= rating && (
                            <>
                                <ellipse
                                    cx="9"
                                    cy="12"
                                    rx="2"
                                    ry="3"
                                    className="fill-amber-200/60"
                                />
                                <ellipse
                                    cx="8"
                                    cy="10"
                                    rx="1"
                                    ry="1.5"
                                    className="fill-white/50"
                                />
                            </>
                        )}
                    </svg>
                </button>
            ))}
        </div>
    )
}
