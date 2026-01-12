import { prisma } from "@/lib/prisma"
import { ProductForm } from "./components/product-form"

export default async function ProductPage({
    params
}: {
    params: Promise<{ productId: string }>
}) {
    const { productId } = await params

    const product = productId === "new"
        ? null
        : await prisma.products.findUnique({
            where: {
                id: productId
            }
        })

    const categories = await prisma.categories.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4">
                <ProductForm initialData={product} categories={categories} />
            </div>
        </div>
    )
}
