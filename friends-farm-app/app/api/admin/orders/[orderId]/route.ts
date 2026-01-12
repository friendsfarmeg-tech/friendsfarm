import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { orderId } = await params;

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        const order = await prisma.orders.findUnique({
            where: {
                id: orderId
            },
            include: {
                users: true,
                order_items: {
                    include: {
                        products: true
                    }
                }
            }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.log('[ORDER_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { orderId } = await params;

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        const body = await req.json();
        const { status } = body;

        if (!status) {
            return new NextResponse("Status is required", { status: 400 });
        }

        const order = await prisma.orders.update({
            where: {
                id: orderId
            },
            data: {
                status: status
            }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.log('[ORDER_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
