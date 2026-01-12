import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ offerId: string }> }
) {
    try {
        const { offerId } = await params;
        const offer = await prisma.offers.findUnique({
            where: { id: parseInt(offerId) }
        });

        if (!offer) {
            return new NextResponse("Offer not found", { status: 404 });
        }

        return NextResponse.json(offer);
    } catch (error) {
        console.log('[OFFER_GET]', error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ offerId: string }> }
) {
    try {
        const { offerId } = await params;
        const body = await req.json();

        const offer = await prisma.offers.update({
            where: { id: parseInt(offerId) },
            data: {
                ...body,
                updated_at: new Date()
            }
        });

        return NextResponse.json(offer);
    } catch (error) {
        console.log('[OFFER_PATCH]', error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ offerId: string }> }
) {
    try {
        const { offerId } = await params;
        await prisma.offers.delete({
            where: { id: parseInt(offerId) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.log('[OFFER_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
