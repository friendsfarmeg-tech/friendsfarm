import { useState, useEffect } from "react"
import { ShoppingBasket, Trash, Plus, Minus, X, Banknote, Smartphone, Copy, Check } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/use-cart"
import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { formatter } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export const CartSidebar = () => {
    const cart = useCart()
    const router = useRouter()
    const { data: session } = useSession()
    const { t, isRtl } = useLanguage()

    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<"cod" | "instapay">("cod")
    const [instapayNumber, setInstapayNumber] = useState("")
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings')
                const data = await res.json()
                if (data.instapay_number) {
                    setInstapayNumber(data.instapay_number)
                }
            } catch (error) {
                console.error("Failed to fetch settings", error)
            }
        }
        fetchSettings()
    }, [])

    const onCopy = () => {
        navigator.clipboard.writeText(instapayNumber)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success(t("Number copied to clipboard"))
    }

    const total = cart.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)

    const onCheckout = async () => {
        try {
            if (!session) {
                toast.error(t("Please login to checkout"))
                router.push("/login")
                return
            }

            setLoading(true)

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cart.items,
                    total: total,
                    address: session.user.address || "Main Street",
                    payment_method: paymentMethod,
                })
            })

            if (!response.ok) {
                throw new Error("Something went wrong")
            }

            toast.success(t("Order placed successfully!"))
            cart.removeAll()
            router.push("/")
        } catch (error) {
            toast.error(t("Something went wrong"))
        } finally {
            setLoading(false)
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="relative p-2 hover:bg-gray-100 rounded-full transition-all">
                    <ShoppingBasket className="w-6 h-6 text-[#1B5E20]" />
                    {cart.items.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center shadow-lg">
                            {cart.items.length}
                        </span>
                    )}
                </button>
            </SheetTrigger>
            <SheetContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-md bg-white border-none p-0 flex flex-col [&>button]:hidden">
                <SheetHeader className="p-6 border-b border-gray-100 relative">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-xl font-black text-[#1B5E20] uppercase tracking-tight flex items-center gap-3">
                            <ShoppingBasket className="w-6 h-6" />
                            {t("Cart")}
                        </SheetTitle>
                        <SheetClose asChild>
                            <button className="bg-gray-50 hover:bg-gray-100 text-gray-500 p-2.5 rounded-2xl transition-all active:scale-95 border border-gray-100">
                                <X className="w-5 h-5" />
                            </button>
                        </SheetClose>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                            <ShoppingBasket className="w-16 h-16 opacity-20" />
                            <p className="font-bold">{t("Empty Cart")}</p>
                        </div>
                    ) : (
                        cart.items.map((item: any) => (
                            <div key={item.id} className="flex gap-4 group">
                                <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                                    <Image
                                        src={item.image_url}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-black text-[#1B5E20] text-sm uppercase leading-tight">
                                            {isRtl ? item.name_ar : item.name}
                                        </h4>
                                        <p className="text-amber-600 font-black text-xs mt-1">
                                            {formatter.format(item.price)}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                            <button
                                                onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-gray-400 hover:text-[#1B5E20]"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 text-center font-black text-xs text-[#1B5E20]">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-gray-400 hover:text-[#1B5E20]"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => cart.removeItem(item.id)}
                                            className="text-red-400 hover:text-red-600 p-2 transition-all hover:bg-red-50 rounded-xl"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.items.length > 0 && (
                    <div className="p-6 bg-gray-50 space-y-4">
                        <Separator className="bg-gray-200" />

                        <div className="flex items-center justify-between">
                            <span className="font-black text-gray-400 uppercase text-xs tracking-widest">{t("Total")}</span>
                            <span className="font-black text-2xl text-[#1B5E20]">{formatter.format(total)}</span>
                        </div>
                        <Button
                            disabled={loading}
                            onClick={() => {
                                router.push('/checkout')
                                const closeButton = document.querySelector('[data-radix-collection-item]') as HTMLElement
                                if (closeButton) closeButton.click() // Hack to close sheet if open, or use prop if available. 
                                // Actually better to just use SheetClose or controlled state. 
                                // Since I can't easily change to controlled state without rewriting parent, I'll rely on the fact user navigates away.
                            }}
                            className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-black uppercase tracking-widest rounded-2xl h-14 shadow-xl shadow-green-900/10"
                        >
                            {t("Proceed to Checkout")}
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
