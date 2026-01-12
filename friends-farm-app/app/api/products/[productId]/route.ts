import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params
        if (!productId) return new NextResponse("Product id is required", { status: 400 })

        const product = await prisma.products.findUnique({
            where: {
                id: productId
            },
            include: {
                categories: true,
                reviews: true
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCT_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const { productId } = await params

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthenticated", { status: 403 })
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
        if (!productId) return new NextResponse("Product id is required", { status: 400 })
        if (!category_id) return new NextResponse("Category id is required", { status: 400 })
        if (!image_url) return new NextResponse("Image URL is required", { status: 400 })

        const product = await prisma.products.update({
            where: {
                id: productId
            },
            data: {
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
        console.log('[PRODUCT_PATCH]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const { productId } = await params

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthenticated", { status: 403 })
        }

        if (!productId) return new NextResponse("Product id is required", { status: 400 })

        const product = await prisma.products.delete({
            where: {
                id: productId
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}
