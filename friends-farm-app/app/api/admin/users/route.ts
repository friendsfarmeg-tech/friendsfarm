import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        const users = await prisma.user.findMany({
            orderBy: {
                created_at: 'desc'
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.log('[USERS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
