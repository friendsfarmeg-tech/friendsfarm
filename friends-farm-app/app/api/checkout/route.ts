import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderNotificationEmail, sendCustomerReceiptEmail } from "@/lib/send-email";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthenticated" }, { status: 403 });
        }

        const body = await req.json();
        const { items, address, notes, total, payment_method } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        const orderId = crypto.randomUUID();

        // Create order with order items in a transaction
        const order = await prisma.orders.create({
            data: {
                id: orderId,
                user_id: session.user.id,
                total: total,
                address: address || "Not provided",
                notes: notes || "",
                status: "pending",
                payment_method: payment_method || "cod",
                created_at: new Date(),
                updated_at: new Date(),
                order_items: {
                    create: items.map((item: any) => ({
                        id: crypto.randomUUID(),
                        product_id: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        created_at: new Date(),
                        updated_at: new Date(),
                    }))
                }
            }
        });

        // Send email notification to admin (non-blocking)
        sendOrderNotificationEmail({
            orderId: orderId,
            userId: session.user.id,
            paymentMethod: payment_method || "cod",
            customerName: session.user.name || "Guest",
            customerEmail: session.user.email || "",
            address: address || "Not provided",
            items: items.map((item: any) => ({
                name: item.name || item.name_ar || "Product",
                quantity: item.quantity,
                price: item.price * item.quantity
            })),
            total: total,
            notes: notes
        }).catch(err => console.error("Admin Email send failed:", err));

        // Send email receipt to customer
        sendCustomerReceiptEmail({
            orderId: orderId,
            userId: session.user.id,
            paymentMethod: payment_method || "cod",
            customerName: session.user.name || "Guest",
            customerEmail: session.user.email || "",
            address: address || "Not provided",
            items: items.map((item: any) => ({
                name: item.name || item.name_ar || "Product", // This will use the name passed from cart which is localized
                quantity: item.quantity,
                price: item.price * item.quantity
            })),
            total: total,
            notes: notes
        }, body.language || 'en').catch(err => console.error("Customer Email send failed:", err));

        return NextResponse.json(order);
    } catch (error) {
        console.log('[CHECKOUT_POST]', error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

