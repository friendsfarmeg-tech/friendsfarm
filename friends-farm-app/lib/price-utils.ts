
export const calculateProductPrice = (product: any, category: any) => {
    let finalPrice = Number(product.price);
    let originalPrice = Number(product.price);
    let hasDiscount = false;

    // 1. Check for Product-specific Offer (Standard Offers table logic - handled elsewhere usually, but if we have it on product)
    // Assuming 'offers' are separate. If product has 'offer_price' directly:
    // User requested "Category Offer".

    // 2. Check for Category Offer
    if (category?.is_offer_active && category?.discount_percentage > 0) {
        const discountAmount = originalPrice * (category.discount_percentage / 100);
        finalPrice = originalPrice - discountAmount;
        hasDiscount = true;
    }

    return {
        finalPrice,
        originalPrice,
        hasDiscount,
        discountPercentage: category?.discount_percentage || 0
    };
};
