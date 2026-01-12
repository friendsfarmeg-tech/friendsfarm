"use client"

import { useEffect, useState } from 'react';
import useCart from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { formatter } from '@/lib/utils';
import Image from 'next/image';
import { Trash } from 'lucide-react';

export default function CartPage() {
    const [isMounted, setIsMounted] = useState(false);
    const cart = useCart();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null; // Avoid hydration mismatch
    }

    const totalPrice = cart.items.reduce((total, item) => {
        return total + Number(item.price)
    }, 0);

    const onCheckout = async () => {
        // Placeholder for checkout logic (e.g., Stripe or simple Order creation)
        console.log("Proceeding to checkout...");
        // Implement Order creation API call here
    }

    return (
        <div className="bg-white">
            <div className="px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
                <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
                    <div className="lg:col-span-7">
                        {cart.items.length === 0 && <p className="text-neutral-500">No items added to cart.</p>}
                        <ul>
                            {cart.items.map((item) => (
                                <li key={item.id} className="flex py-6 border-b">
                                    <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover object-center" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>
                                        )}
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div className="flex justify-between">
                                                <p className="text-lg font-semibold text-black">{item.name}</p>
                                            </div>
                                            <div className="mt-1 flex text-sm">
                                                <p className="text-gray-500">{formatter.format(item.price)}</p>
                                            </div>
                                            <div className="absolute right-0 top-0">
                                                <Button variant="ghost" size="icon" onClick={() => cart.removeItem(item.id)}>
                                                    <Trash className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <div className="text-base font-medium text-gray-900">Order total</div>
                                <div className="text-lg font-bold text-gray-900">{formatter.format(totalPrice)}</div>
                            </div>
                        </div>
                        <Button onClick={onCheckout} disabled={cart.items.length === 0} className="w-full mt-6 rounded-full text-lg py-6">
                            Checkout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
