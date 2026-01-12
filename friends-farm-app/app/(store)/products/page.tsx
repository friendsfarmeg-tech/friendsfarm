"use client"

import { useLanguage } from "@/components/language-provider";
import { ProductCard } from "@/components/product-card";
import { ProductFilters, FilterState } from "@/components/product-filters";
import { HatchingLoader } from "@/components/hatching-loader";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
    const { t, isRtl } = useLanguage();
    const searchParams = useSearchParams();
    const initialCategoryId = searchParams.get('category');

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        categoryId: initialCategoryId,
        sortBy: "default",
        minPrice: null,
        maxPrice: null
    });

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = '/api/products';
                if (filters.categoryId) url += `?category_id=${filters.categoryId}`;

                const res = await fetch(url);
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [filters.categoryId]);

    const handleFilterChange = useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
    }, []);

    // Sort products based on filter
    const sortedProducts = useMemo(() => {
        if (!products.length) return products;

        const sorted = [...products];
        switch (filters.sortBy) {
            case "price_asc":
                return sorted.sort((a, b) => Number(a.price) - Number(b.price));
            case "price_desc":
                return sorted.sort((a, b) => Number(b.price) - Number(a.price));
            case "newest":
                return sorted.sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
            default:
                return sorted;
        }
    }, [products, filters.sortBy]);

    if (loading) return <HatchingLoader />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 gap-4">
                <div className="text-center md:text-start">
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-[#1B5E20] uppercase tracking-tighter mb-2">
                        {t("All Products")}
                    </h1>
                    <div className="h-1 w-24 bg-amber-500 rounded-full mx-auto md:mx-0"></div>
                </div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                    {sortedProducts.length} {t("Products")}
                </p>
            </div>

            <ProductFilters
                onFilterChange={handleFilterChange}
                initialCategory={initialCategoryId || undefined}
            />

            {sortedProducts.length === 0 ? (
                <div className="h-[40vh] flex flex-col items-center justify-center text-gray-400 space-y-4">
                    <p className="font-bold text-lg uppercase tracking-widest opacity-50">{t("No products found")}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {sortedProducts.map((product) => (
                        <ProductCard key={product.id} data={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

