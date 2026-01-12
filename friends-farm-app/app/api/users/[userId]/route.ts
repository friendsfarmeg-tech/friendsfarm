import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
    req: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { is_admin } = body

        if (typeof is_admin !== 'boolean') {
            return new NextResponse("Is Admin is required", { status: 400 })
        }

        if (!params.userId) {
            return new NextResponse("User id is required", { status: 400 })
        }

        const user = await prisma.user.update({
            where: {
                id: params.userId
            },
            data: {
                is_admin
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.log('[USER_PATCH]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.userId) {
            return new NextResponse("User id is required", { status: 400 })
        }

        // Prevent admin from deleting themselves
        if (params.userId === session.user.id) {
            return new NextResponse("Cannot delete yourself", { status: 400 })
        }

        const user = await prisma.user.delete({
            where: {
                id: params.userId
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.log('[USER_DELETE]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}
