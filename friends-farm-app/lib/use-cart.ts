import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';

interface CartItem {
    id: string;
    name: string;
    name_ar: string;
    price: number;
    image_url: string;
    quantity: number;
    unit: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (data: CartItem) => void;
    removeItem: (id: string) => void;
    removeAll: () => void;
    updateQuantity: (id: string, quantity: number) => void;
}

export const useCart = create(
    persist<CartStore>((set, get) => ({
        items: [],
        addItem: (data: CartItem) => {
            const currentItems = get().items;
            const existingItem = currentItems.find((item) => item.id === data.id);

            if (existingItem) {
                return toast.info('Item already in cart.');
            }

            set({ items: [...get().items, data] });
            toast.success('Item added to cart.');
        },
        removeItem: (id: string) => {
            set({ items: [...get().items.filter((item) => item.id !== id)] });
            toast.success('Item removed from cart.');
        },
        removeAll: () => set({ items: [] }),
        updateQuantity: (id: string, quantity: number) => {
            const currentItems = get().items;
            const updatedItems = currentItems.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
            );
            set({ items: updatedItems });
        },
    }), {
        name: 'cart-storage',
        storage: createJSONStorage(() => localStorage),
    })
);
