import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

import { v4 as uuidv4 } from 'uuid';

export async function POST(
    req: Request,
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthenticated" }, { status: 403 })
        }

        const body = await req.json()
        const { name, name_ar, image_url, discount_percentage, is_offer_active } = body

        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 })
        if (!name_ar) return NextResponse.json({ error: "Arabic name is required" }, { status: 400 })

        const category = await prisma.categories.create({
            data: {
                id: uuidv4(),
                name,
                name_ar,
                image_url,
                discount_percentage: discount_percentage || 0,
                is_offer_active: is_offer_active || false,
                created_at: new Date(),
                updated_at: new Date()
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        console.log('[CATEGORIES_POST]', error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}

export async function GET(
    req: Request,
) {
    try {
        const categories = await prisma.categories.findMany({
            orderBy: {
                created_at: 'desc'
            }
        })

        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
