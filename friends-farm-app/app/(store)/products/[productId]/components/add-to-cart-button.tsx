"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import useCart from "@/hooks/use-cart"

interface AddToCartButtonProps {
    data: {
        id: string;
        name: string;
        price: number;
        image: string;
    }
}

export default function AddToCartButton({ data }: AddToCartButtonProps) {
    const cart = useCart();

    const onAddToCart = () => {
        cart.addItem(data);
    }

    return (
        <Button onClick={onAddToCart} className="flex items-center gap-x-2 rounded-full cursor-pointer">
            Add To Cart
            <ShoppingCart size={20} />
        </Button>
    )
}
