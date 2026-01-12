import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const { categoryId } = await params
        if (!categoryId) return new NextResponse("Category id is required", { status: 400 })

        const category = await prisma.categories.findUnique({
            where: {
                id: categoryId
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        console.log('[CATEGORY_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const { categoryId } = await params

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthenticated", { status: 403 })
        }

        const body = await req.json()
        const { name, name_ar, image_url, discount_percentage, is_offer_active } = body

        if (!name) return new NextResponse("Name is required", { status: 400 })
        if (!name_ar) return new NextResponse("Arabic name is required", { status: 400 })
        if (!categoryId) return new NextResponse("Category id is required", { status: 400 })

        const category = await prisma.categories.update({
            where: {
                id: categoryId
            },
            data: {
                name,
                name_ar,
                image_url,
                discount_percentage: discount_percentage || 0,
                is_offer_active: is_offer_active || false
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        console.log('[CATEGORY_PATCH]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const { categoryId } = await params

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthenticated", { status: 403 })
        }

        if (!categoryId) return new NextResponse("Category id is required", { status: 400 })

        const category = await prisma.categories.delete({
            where: {
                id: categoryId
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        console.log('[CATEGORY_DELETE]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}
