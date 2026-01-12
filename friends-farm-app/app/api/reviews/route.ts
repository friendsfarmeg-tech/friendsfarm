import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('product_id');
        const featured = searchParams.get('featured');
        const limit = parseInt(searchParams.get('limit') || '20');
        const approvedOnly = searchParams.get('approved') !== 'false';

        const where: any = {};

        if (productId) {
            where.product_id = productId;
        }

        if (approvedOnly) {
            where.is_approved = true;
        }

        // For featured/testimonials, get high-rated reviews
        if (featured === 'true') {
            where.rating = { gte: 4 };
        }

        const reviews = await prisma.reviews.findMany({
            where,
            orderBy: { created_at: 'desc' },
            take: limit,
            include: {
                products: {
                    select: {
                        name: true,
                        name_ar: true
                    }
                },
                users: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            }
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.log('[REVIEWS_GET]', error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { product_id, user_id, customer_name, customer_email, rating, comment } = body;

        if (!product_id || !comment) {
            return NextResponse.json({ error: "Product ID and comment are required" }, { status: 400 });
        }

        const review = await prisma.reviews.create({
            data: {
                product_id,
                user_id: user_id || null,
                customer_name: customer_name || "Anonymous",
                customer_email: customer_email || null,
                rating: rating || 5,
                comment,
                is_approved: false, // Require admin approval
                is_admin_added: false,
                created_at: new Date(),
                updated_at: new Date()
            }
        });

        return NextResponse.json(review);
    } catch (error) {
        console.log('[REVIEWS_POST]', error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
