import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        const orders = await prisma.orders.findMany({
            where: {
                user_id: session.user.id
            },
            include: {
                order_items: {
                    include: {
                        products: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.log('[ORDERS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
