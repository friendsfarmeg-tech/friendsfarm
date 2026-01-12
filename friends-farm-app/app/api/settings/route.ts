import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const settings = await prisma.settings.findMany();
        const formattedSettings = settings.reduce((acc: any, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});

        return NextResponse.json(formattedSettings);
    } catch (error) {
        console.log('[SETTINGS_GET]', error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
