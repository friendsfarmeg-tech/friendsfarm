import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';

interface CartItem {
    id: string;
    name: string;
    price: number;
    image?: string;
    quantity?: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (data: CartItem) => void;
    removeItem: (id: string) => void;
    removeAll: () => void;
}

const useCart = create(
    persist<CartStore>(
        (set, get) => ({
            items: [],
            addItem: (data: CartItem) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === data.id);

                if (existingItem) {
                    return toast.error('Item already in cart.');
                }

                set({ items: [...get().items, data] });
                toast.success('Item added to cart.');
            },
            removeItem: (id: string) => {
                set({ items: [...get().items.filter((item) => item.id !== id)] });
                toast.success('Item removed from cart.');
            },
            removeAll: () => set({ items: [] }),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useCart;
