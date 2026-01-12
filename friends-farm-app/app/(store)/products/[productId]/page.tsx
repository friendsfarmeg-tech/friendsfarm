import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { formatter } from "@/lib/utils";
import AddToCartButton from "./components/add-to-cart-button";
import { Rating } from "@/components/rating";
import { ReviewForm } from "@/components/review-form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductDetails } from "@/components/product-details";

interface ProductPageProps {
    params: Promise<{
        productId: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { productId } = await params;

    const product = await prisma.products.findUnique({
        where: { id: productId },
        include: { categories: true, reviews: { where: { is_approved: true } } }
    });

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <h1 className="text-4xl font-black text-gray-200 uppercase">Product Not Found</h1>
                <Link href="/products" className="text-[#1B5E20] font-bold underline">Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="bg-[#fcfdfc]">
            <div className="mx-auto max-w-7xl px-4 py-12 md:py-20 sm:px-6 lg:px-8">
                <ProductDetails product={product} />
            </div>
        </div>
    );
}
