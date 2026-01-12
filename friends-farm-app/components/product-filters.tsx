"use client"

import { useLanguage } from "@/components/language-provider"
import { useState, useEffect } from "react"
import { Filter, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Category {
    id: string
    name: string
    name_ar: string
}

interface ProductFiltersProps {
    onFilterChange: (filters: FilterState) => void
    initialCategory?: string
}

export interface FilterState {
    categoryId: string | null
    sortBy: "default" | "price_asc" | "price_desc" | "newest"
    minPrice: number | null
    maxPrice: number | null
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
    onFilterChange,
    initialCategory
}) => {
    const { t, isRtl } = useLanguage()
    const [categories, setCategories] = useState<Category[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState<FilterState>({
        categoryId: initialCategory || null,
        sortBy: "default",
        minPrice: null,
        maxPrice: null
    })

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories')
                const data = await res.json()
                if (Array.isArray(data)) {
                    setCategories(data)
                } else {
                    setCategories([])
                }
            } catch (error) {
                console.error("Failed to fetch categories", error)
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        onFilterChange(filters)
    }, [filters, onFilterChange])

    const handleCategoryChange = (value: string) => {
        setFilters(prev => ({
            ...prev,
            categoryId: value === "all" ? null : value
        }))
    }

    const handleSortChange = (value: string) => {
        setFilters(prev => ({
            ...prev,
            sortBy: value as FilterState["sortBy"]
        }))
    }

    const clearFilters = () => {
        setFilters({
            categoryId: null,
            sortBy: "default",
            minPrice: null,
            maxPrice: null
        })
    }

    const hasActiveFilters = filters.categoryId || filters.sortBy !== "default"

    return (
        <div className="mb-8">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-4">
                <Button
                    variant="outline"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full justify-between rounded-2xl border-gray-200 h-12"
                >
                    <span className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        {t("Filters")}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </Button>
            </div>

            {/* Filter Panel */}
            <div className={`${isOpen ? "block" : "hidden"} md:block`}>
                <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    {/* Category Filter */}
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                            {t("Category")}
                        </label>
                        <Select
                            value={filters.categoryId || "all"}
                            onValueChange={handleCategoryChange}
                        >
                            <SelectTrigger className="w-full rounded-xl border-gray-200 h-11 bg-white">
                                <SelectValue placeholder={t("All Categories")} />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all" className="rounded-lg">
                                    {t("All Categories")}
                                </SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id} className="rounded-lg">
                                        {isRtl ? cat.name_ar : cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort Filter */}
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                            {t("Sort By")}
                        </label>
                        <Select
                            value={filters.sortBy}
                            onValueChange={handleSortChange}
                        >
                            <SelectTrigger className="w-full rounded-xl border-gray-200 h-11 bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="default" className="rounded-lg">
                                    {t("Default")}
                                </SelectItem>
                                <SelectItem value="price_asc" className="rounded-lg">
                                    {t("Price: Low to High")}
                                </SelectItem>
                                <SelectItem value="price_desc" className="rounded-lg">
                                    {t("Price: High to Low")}
                                </SelectItem>
                                <SelectItem value="newest" className="rounded-lg">
                                    {t("Newest First")}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <div className="flex items-end">
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-11"
                            >
                                <X className="w-4 h-4 mr-2" />
                                {t("Clear")}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
