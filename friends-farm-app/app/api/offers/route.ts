import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const activeOnly = searchParams.get('active') !== 'false';

        const offers = await prisma.offers.findMany({
            where: activeOnly ? { is_active: true } : {},
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json(offers);
    } catch (error) {
        console.log('[OFFERS_GET]', error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, image, discount_percentage, offer_price, original_price, is_active } = body;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const offer = await prisma.offers.create({
            data: {
                title,
                description,
                image,
                discount_percentage: discount_percentage || 0,
                offer_price: offer_price || null,
                original_price: original_price || null,
                is_active: is_active ?? true,
                created_at: new Date(),
                updated_at: new Date()
            }
        });

        return NextResponse.json(offer);
    } catch (error) {
        console.log('[OFFERS_POST]', error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
