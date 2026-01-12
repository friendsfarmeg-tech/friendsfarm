import { prisma } from "@/lib/prisma"
import { CategoryForm } from "./components/category-form"

export default async function CategoryPage({
    params
}: {
    params: Promise<{ categoryId: string }>
}) {
    const { categoryId } = await params

    const category = categoryId === "new"
        ? null
        : await prisma.categories.findUnique({
            where: {
                id: categoryId
            }
        })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4">
                <CategoryForm initialData={category} />
            </div>
        </div>
    )
}
