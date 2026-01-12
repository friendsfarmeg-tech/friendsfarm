import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const settings = await prisma.settings.findMany();
        const formattedSettings = settings.reduce((acc: any, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});

        return NextResponse.json(settings);
    } catch (error) {
        console.log('[SETTINGS_GET]', error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthenticated" }, { status: 403 });
        }

        const body = await req.json();
        const {
            instapay_number,
            facebook,
            instagram,
            tiktok,
            whatsapp,
            phone,
            about_us,
            delivery_policy
        } = body;

        const updates = [];

        if (instapay_number !== undefined) {
            updates.push(prisma.settings.upsert({
                where: { key: 'instapay_number' },
                update: { value: instapay_number, label: 'InstaPay Number', group: 'payment' },
                create: { key: 'instapay_number', value: instapay_number, label: 'InstaPay Number', group: 'payment' }
            }));
        }

        if (facebook !== undefined) updates.push(prisma.settings.upsert({ where: { key: 'facebook' }, update: { value: facebook, label: 'Facebook URL', group: 'social' }, create: { key: 'facebook', value: facebook, label: 'Facebook URL', group: 'social' } }));
        if (instagram !== undefined) updates.push(prisma.settings.upsert({ where: { key: 'instagram' }, update: { value: instagram, label: 'Instagram URL', group: 'social' }, create: { key: 'instagram', value: instagram, label: 'Instagram URL', group: 'social' } }));
        if (tiktok !== undefined) updates.push(prisma.settings.upsert({ where: { key: 'tiktok' }, update: { value: tiktok, label: 'TikTok URL', group: 'social' }, create: { key: 'tiktok', value: tiktok, label: 'TikTok URL', group: 'social' } }));
        if (whatsapp !== undefined) updates.push(prisma.settings.upsert({ where: { key: 'whatsapp' }, update: { value: whatsapp, label: 'WhatsApp Number', group: 'contact' }, create: { key: 'whatsapp', value: whatsapp, label: 'WhatsApp Number', group: 'contact' } }));
        if (phone !== undefined) updates.push(prisma.settings.upsert({ where: { key: 'phone' }, update: { value: phone, label: 'Phone Number', group: 'contact' }, create: { key: 'phone', value: phone, label: 'Phone Number', group: 'contact' } }));

        if (about_us !== undefined) updates.push(prisma.settings.upsert({ where: { key: 'about_us' }, update: { value: about_us, label: 'About Us Content', group: 'content' }, create: { key: 'about_us', value: about_us, label: 'About Us Content', group: 'content' } }));
        if (delivery_policy !== undefined) updates.push(prisma.settings.upsert({ where: { key: 'delivery_policy' }, update: { value: delivery_policy, label: 'Delivery Policy Content', group: 'content' }, create: { key: 'delivery_policy', value: delivery_policy, label: 'Delivery Policy Content', group: 'content' } }));

        await Promise.all(updates);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.log('[SETTINGS_POST]', error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
