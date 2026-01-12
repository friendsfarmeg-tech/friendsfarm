"use client"

import { useState } from "react"
import { Upload, X, Loader2, ImagePlus } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    disabled
}) => {
    const [isUploading, setIsUploading] = useState(false)

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0]
            if (!file) return

            setIsUploading(true)
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Upload failed")
            }

            onChange(data.secure_url)
            toast.success("Image uploaded successfully")
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload image")
        } finally {
            setIsUploading(false)
        }
    }

    const onRemove = () => {
        onChange("")
    }

    return (
        <div className="space-y-4 w-full">
            <div className={cn(
                "border-2 border-dashed border-gray-300 rounded-3xl p-4 flex flex-col justify-center items-center gap-4 transition-colors hover:bg-gray-50/50 min-h-[200px] relative overflow-hidden group",
                disabled && "opacity-50 cursor-not-allowed",
                value ? "border-green-100 bg-green-50/30" : "hover:border-green-400/50"
            )}>
                {value ? (
                    <div className="relative w-full h-full min-h-[200px]">
                        <div className="absolute top-2 right-2 z-10">
                            <button
                                onClick={onRemove}
                                disabled={disabled}
                                type="button"
                                className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <Image
                            fill
                            src={value}
                            alt="Upload"
                            className="object-contain rounded-2xl"
                        />
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                        <div className="bg-green-50 p-4 rounded-full mb-2 group-hover:scale-110 transition-transform duration-300">
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                            ) : (
                                <ImagePlus className="w-8 h-8 text-green-600" />
                            )}
                        </div>
                        <div className="text-center space-y-1">
                            <p className="font-bold text-gray-700">
                                {isUploading ? "Uploading..." : "Click to upload image"}
                            </p>
                            <p className="text-xs text-gray-400">
                                SVG, PNG, JPG or GIF (max. 5MB)
                            </p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onUpload}
                            disabled={disabled || isUploading}
                        />
                    </label>
                )}
            </div>
        </div>
    )
}
