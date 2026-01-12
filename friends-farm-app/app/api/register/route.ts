import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name } = body;

        if (!email || !password) {
            return new NextResponse("Email and Password are required", { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return new NextResponse("User already exists", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                id: crypto.randomUUID(),
                email,
                name: name || email.split('@')[0],
                password: hashedPassword,
                is_admin: false, // Default to regular user
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.log('[REGISTRATION_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
