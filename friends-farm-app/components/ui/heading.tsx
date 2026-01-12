"use client"

import { useLanguage } from "@/components/language-provider"

interface HeadingProps {
    title: string
    description: string
}

export const Heading: React.FC<HeadingProps> = ({
    title,
    description
}) => {
    const { isRtl } = useLanguage()

    return (
        <div className={isRtl ? 'text-right' : 'text-left'}>
            <h2 className="text-4xl font-black text-[#111827] tracking-tight uppercase">{title}</h2>
            <p className="text-gray-500 font-bold mt-1">{description}</p>
        </div>
    )
}
