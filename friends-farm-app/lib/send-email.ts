import nodemailer from 'nodemailer';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface OrderEmailData {
    orderId: string;
    userId: string;
    paymentMethod: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    address: string;
    items: OrderItem[];
    total: number;
    notes?: string;
}

// Create transporter using Gmail SMTP
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER || 'friendsfarm.eg@gmail.com',
            // Gmail App Password (16 characters without spaces)
            pass: process.env.SMTP_PASSWORD || 'peigqwpccgpswebf',
        },
    });
};

export async function sendOrderNotificationEmail(order: OrderEmailData) {
    const transporter = createTransporter();

    // Extract Map Link if present
    const mapLinkMatch = order.address.match(/(https:\/\/www\.google\.com\/maps[^ \n]*)/);
    const mapLink = mapLinkMatch ? mapLinkMatch[0] : null;
    const cleanAddress = order.address.replace(/Location: https:\/\/www\.google\.com\/maps[^ \n]*/, '').trim();

    const itemsHtml = order.items.map(item => `
        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
            <span style="font-weight: 600; color: #333;">${item.name} <span style="font-size: 12px; color: #888;">x${item.quantity}</span></span>
            <span style="font-weight: 700; color: #1B5E20;">${item.price} EGP</span>
        </div>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <body style="font-family: 'Tajawal', sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
            <div style="background: #1B5E20; padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px;">طلب جديد 🔔</h1>
                <p style="margin: 5px 0 0; opacity: 0.8;">#${order.orderId.substring(0, 8)}</p>
            </div>
            
            <div style="padding: 30px;">
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #666; font-size: 14px; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 10px;">بيانات العميل</h3>
                    <p style="margin: 5px 0;"><strong>الاسم:</strong> ${order.customerName}</p>
                    <p style="margin: 5px 0;"><strong>رقم الموبايل:</strong> ${order.customerPhone || 'غير متوفر'}</p>
                     <p style="margin: 5px 0;"><strong>ID:</strong> <span style="background:#eee; padding:2px 6px; border-radius:4px; font-family:monospace">${order.userId}</span></p>
                    
                    <div style="margin-top: 15px; background: #f9f9f9; padding: 15px; border-radius: 10px;">
                        <p style="margin: 0 0 5px; color: #888; font-size: 12px;">العنوان:</p>
                        <p style="margin: 0; line-height: 1.5;">${cleanAddress}</p>
                        ${mapLink ? `<a href="${mapLink}" style="display: inline-block; margin-top: 10px; background: #2196F3; color: white; text-decoration: none; padding: 8px 15px; border-radius: 20px; font-size: 12px;">📍 فتح الموقع على الخريطة</a>` : ''}
                    </div>

                    ${order.notes ? `
                    <div style="margin-top: 15px; background: #fff3cd; padding: 15px; border-radius: 10px; color: #856404;">
                        <strong>ملاحظات:</strong> ${order.notes}
                    </div>` : ''}
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #666; font-size: 14px; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 10px;">الفاتورة</h3>
                    ${itemsHtml}
                    <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 18px; font-weight: 800; color: #1B5E20;">
                        <span>الإجمالي</span>
                        <span>${order.total} EGP</span>
                    </div>
                     <p style="margin: 10px 0 0; font-size: 14px; color: #666;">
                        طريقة الدفع: <strong>${order.paymentMethod === 'instapay' ? 'InstaPay' : 'كاش عند الاستلام'}</strong>
                    </p>
                </div>
            </div>
            <div style="background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                Friends Farm Dashboard System
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: `"Friends Farm System" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
            subject: `[طلب جديد] ${order.customerName} - ${order.total} EGP`,
            html: htmlContent
        });
    } catch (error) {
        console.error("Admin Email Error:", error);
    }
}

export async function sendCustomerReceiptEmail(order: OrderEmailData, lang: 'en' | 'ar' = 'ar') {
    const transporter = createTransporter();
    const isRtl = lang === 'ar';
    const t = {
        title: isRtl ? 'تم تاكيد طلبك بنجاح! 🎉' : 'Order Confirmed! 🎉',
        subtitle: isRtl ? 'شكراً لثقتك في فريندز فارم' : 'Thanks for trusting Friends Farm',
        orderNo: isRtl ? 'رقم الطلب' : 'Order #',
        total: isRtl ? 'الإجمالي' : 'Total',
        payment: isRtl ? 'طريقة الدفع' : 'Payment Method',
        shipping: isRtl ? 'العنوان' : 'Shipping Address',
        summary: isRtl ? 'ملخص الطلب' : 'Order Summary',
        footer: isRtl ? 'نتمنى لك وجبة هنية!' : 'Bon Appétit!',
        cod: isRtl ? 'كاش عند الاستلام' : 'Cash on Delivery'
    };

    const itemsHtml = order.items.map(item => `
        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
            <span style="font-weight: 600; color: #333;">${item.name} <span style="font-size: 12px; color: #888;">x${item.quantity}</span></span>
            <span style="font-weight: 700; color: #1B5E20;">${item.price} EGP</span>
        </div>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html dir="${isRtl ? 'rtl' : 'ltr'}" lang="${lang}">
    <body style="font-family: 'Tajawal', sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #eee;">
            <!-- Header -->
            <div style="background: #ffffff; padding: 40px 30px; text-align: center; border-bottom: 1px solid #eee;">
                <div style="width: 60px; height: 60px; background: #e8f5e9; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                    <span style="font-size: 30px;">✅</span>
                </div>
                <h1 style="color: #1B5E20; margin: 0; font-size: 24px;">${t.title}</h1>
                <p style="color: #888; margin: 10px 0 0;">${t.subtitle}</p>
            </div>

            <div style="padding: 30px;">
                <!-- Key Info -->
                <div style="display: flex; justify-content: space-between; margin-bottom: 30px; background: #fdfdfd; padding: 15px; border-radius: 12px; border: 1px solid #eee;">
                    <div>
                        <p style="font-size: 12px; color: #999; margin: 0 0 5px; text-transform: uppercase;">${t.orderNo}</p>
                        <p style="font-weight: 900; color: #333; margin: 0;">#${order.orderId.substring(0, 8)}</p>
                    </div>
                     <div style="text-align: ${isRtl ? 'left' : 'right'};">
                        <p style="font-size: 12px; color: #999; margin: 0 0 5px; text-transform: uppercase;">${t.total}</p>
                        <p style="font-weight: 900; color: #1B5E20; margin: 0;">${order.total} EGP</p>
                    </div>
                </div>

                <!-- Summary -->
                <h3 style="font-size: 16px; color: #333; margin-bottom: 15px;">${t.summary}</h3>
                ${itemsHtml}
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px dashed #eee;">
                    <h3 style="font-size: 16px; color: #333; margin-bottom: 10px;">${t.shipping}</h3>
                    <p style="color: #666; line-height: 1.6; margin: 0;">${order.address.split('Location:')[0]}</p>
                </div>
            </div>

            <div style="background: #1B5E20; color: white; padding: 20px; text-align: center;">
                <p style="margin: 0; font-weight: bold;">${t.footer}</p>
                <p style="margin: 5px 0 0; font-size: 12px; opacity: 0.8;">Friends Farm 🐔</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: `"Friends Farm" <${process.env.SMTP_USER}>`,
            to: order.customerEmail,
            subject: isRtl ? `تأكيد الطلب #${order.orderId.substring(0, 8)}` : `Order Confirmation #${order.orderId.substring(0, 8)}`,
            html: htmlContent
        });
    } catch (error) {
        console.error("Customer Email Error:", error);
    }
}
