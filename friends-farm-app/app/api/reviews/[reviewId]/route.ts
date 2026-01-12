import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ reviewId: string }> }
) {
    try {
        const { reviewId } = await params;
        const review = await prisma.reviews.findUnique({
            where: { id: parseInt(reviewId) },
            include: {
                products: {
                    select: { name: true, name_ar: true }
                },
                users: {
                    select: { name: true, image: true }
                }
            }
        });

        if (!review) {
            return new NextResponse("Review not found", { status: 404 });
        }

        return NextResponse.json(review);
    } catch (error) {
        console.log('[REVIEW_GET]', error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ reviewId: string }> }
) {
    try {
        const { reviewId } = await params;
        const body = await req.json();

        const review = await prisma.reviews.update({
            where: { id: parseInt(reviewId) },
            data: {
                ...body,
                updated_at: new Date()
            }
        });

        return NextResponse.json(review);
    } catch (error) {
        console.log('[REVIEW_PATCH]', error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ reviewId: string }> }
) {
    try {
        const { reviewId } = await params;
        await prisma.reviews.delete({
            where: { id: parseInt(reviewId) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.log('[REVIEW_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
