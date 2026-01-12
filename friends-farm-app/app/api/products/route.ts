import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: Request,
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthenticated" }, { status: 403 })
        }

        const body = await req.json()
        const {
            name,
            name_ar,
            description,
            description_ar,
            price,
            category_id,
            image_url,
            is_featured,
            is_available,
            stock,
            unit,
        } = body

        if (!name) return new NextResponse("Name is required", { status: 400 })
        if (!price) return new NextResponse("Price is required", { status: 400 })
        if (!category_id) return new NextResponse("Category id is required", { status: 400 })
        if (!image_url) return new NextResponse("Image URL is required", { status: 400 })

        const product = await prisma.products.create({
            data: {
                id: crypto.randomUUID(),
                name,
                name_ar,
                description,
                description_ar,
                price,
                category_id,
                image_url,
                is_featured,
                is_available,
                stock,
                unit,
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCTS_POST]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function GET(
    req: Request,
) {
    try {
        const { searchParams } = new URL(req.url)
        const category_id = searchParams.get("category_id") || undefined
        const isFeatured = searchParams.get("isFeatured")

        const products = await prisma.products.findMany({
            where: {
                category_id,
                is_featured: isFeatured ? true : undefined,
                is_available: true
            },
            include: {
                categories: true,
                reviews: true
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        return NextResponse.json(products)
    } catch (error) {
        console.log('[PRODUCTS_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}
