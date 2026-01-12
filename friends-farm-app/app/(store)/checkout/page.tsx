"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import useCart from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, ShoppingBag, Truck, CreditCard, Banknote, MapPin } from "lucide-react"

export default function CheckoutPage() {
    const { t, isRtl } = useLanguage()
    const cart = useCart()
    const { data: session } = useSession()
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [instapayNumber, setInstapayNumber] = useState("")

    // Detailed Address State
    const [addressDetails, setAddressDetails] = useState({
        area: "",
        street: "",
        building: "",
        floor: "",
        apartment: "",
        locationLink: ""
    })

    const [formData, setFormData] = useState({
        phone: session?.user?.phone || "",
        notes: "",
        paymentMethod: "cod" // 'cod' or 'instapay'
    })

    useEffect(() => {
        // Fetch InstaPay number
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.instapay_number) setInstapayNumber(data.instapay_number)
            })
            .catch(err => console.error(err))
    }, [])

    const total = cart.items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0)

    const handleLocation = () => {
        if (!navigator.geolocation) {
            toast.error(t("Geolocation is not supported by your browser"))
            return
        }

        toast.info(t("Getting your location..."))

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const link = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`
                setAddressDetails(prev => ({ ...prev, locationLink: link }))
                toast.success(t("Location added successfully"))
            },
            () => {
                toast.error(t("Unable to retrieve your location"))
            }
        )
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (cart.items.length === 0) {
            toast.error(t("Your cart is empty"))
            return
        }

        // Validate required fields
        if (!addressDetails.area || !addressDetails.street || !addressDetails.building || !formData.phone) {
            toast.error(t("Please fill in all required fields (Area, Street, Building, Phone)"))
            return
        }

        setLoading(true)

        try {
            // Construct full address string
            const fullAddress = `
Area: ${addressDetails.area}
Street: ${addressDetails.street}
Building: ${addressDetails.building}
Floor: ${addressDetails.floor || 'N/A'}
Apt: ${addressDetails.apartment || 'N/A'}
${addressDetails.locationLink ? `Location: ${addressDetails.locationLink}` : ''}
            `.trim()

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.items,
                    address: fullAddress,
                    notes: `Phone: ${formData.phone}\n${formData.notes}`,
                    payment_method: formData.paymentMethod,
                    total: total,
                    language: isRtl ? 'ar' : 'en'
                })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success(t("Order placed successfully!"))
                cart.removeAll()
                router.push('/profile')
            } else {
                console.error("Checkout Error:", data)
                toast.error(data.error || t("Something went wrong"))
            }
        } catch (error) {
            console.error("Checkout Exception:", error)
            toast.error(t("Something went wrong"))
        } finally {
            setLoading(false)
        }
    }

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <div className="text-center space-y-4">
                    <div className="bg-white p-6 rounded-full inline-block shadow-lg">
                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">{t("Your cart is empty")}</h2>
                    <Button onClick={() => router.push('/products')} className="font-black uppercase tracking-widest bg-[#1B5E20]">
                        {t("Shop Now")}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-20 md:pt-32">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <h1 className="text-3xl md:text-4xl font-black text-[#1B5E20] mb-6 md:mb-8 tracking-tighter uppercase text-center md:text-start">{t("Checkout")}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Form Section */}
                    <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
                        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-[#E8F5E9] space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Truck className="w-6 h-6 text-[#1B5E20]" />
                                <h2 className="text-xl font-black">{t("Shipping Details")}</h2>
                            </div>

                            {/* Detailed Address Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <Label className="font-bold text-gray-700">{t("Area / Region")} *</Label>
                                    <Input
                                        value={addressDetails.area}
                                        onChange={(e) => setAddressDetails({ ...addressDetails, area: e.target.value })}
                                        placeholder={t("e.g. Nasr City, Maadi")}
                                        className="rounded-xl bg-gray-50 border-gray-200 focus:border-[#1B5E20] focus:ring-[#1B5E20] h-12"
                                    />
                                </div>
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <Label className="font-bold text-gray-700">{t("Street Name")} *</Label>
                                    <Input
                                        value={addressDetails.street}
                                        onChange={(e) => setAddressDetails({ ...addressDetails, street: e.target.value })}
                                        placeholder={t("Street Name")}
                                        className="rounded-xl bg-gray-50 border-gray-200 focus:border-[#1B5E20] focus:ring-[#1B5E20] h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700">{t("Building No")} *</Label>
                                    <Input
                                        value={addressDetails.building}
                                        onChange={(e) => setAddressDetails({ ...addressDetails, building: e.target.value })}
                                        placeholder={t("Building Number")}
                                        className="rounded-xl bg-gray-50 border-gray-200 focus:border-[#1B5E20] focus:ring-[#1B5E20] h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700">{t("Floor No")}</Label>
                                    <Input
                                        value={addressDetails.floor}
                                        onChange={(e) => setAddressDetails({ ...addressDetails, floor: e.target.value })}
                                        placeholder={t("Floor")}
                                        className="rounded-xl bg-gray-50 border-gray-200 focus:border-[#1B5E20] focus:ring-[#1B5E20] h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700">{t("Apartment No")}</Label>
                                    <Input
                                        value={addressDetails.apartment}
                                        onChange={(e) => setAddressDetails({ ...addressDetails, apartment: e.target.value })}
                                        placeholder={t("Apartment")}
                                        className="rounded-xl bg-gray-50 border-gray-200 focus:border-[#1B5E20] focus:ring-[#1B5E20] h-12"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="button"
                                    onClick={handleLocation}
                                    variant="outline"
                                    className="w-full rounded-xl h-12 border-dashed border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 font-bold"
                                >
                                    <MapPin className="w-4 h-4 me-2" />
                                    {addressDetails.locationLink ? t("Location Added ✓") : t("Share My Current Location")}
                                </Button>
                            </div>

                            <Separator className="bg-gray-100" />

                            <div className="space-y-2">
                                <Label className="font-bold text-gray-700">{t("Phone Number")} *</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="01xxxxxxxxx"
                                    className="rounded-xl bg-gray-50 border-gray-200 focus:border-[#1B5E20] focus:ring-[#1B5E20] h-14 font-mono text-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="font-bold text-gray-700">{t("Order Notes (Optional)")}</Label>
                                <Textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder={t("Any special instructions, landmarks, etc...")}
                                    className="rounded-xl bg-gray-50 border-gray-200 focus:border-[#1B5E20] focus:ring-[#1B5E20] min-h-[100px]"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-[#E8F5E9] space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <CreditCard className="w-6 h-6 text-[#1B5E20]" />
                                <h2 className="text-xl font-black">{t("Payment Method")}</h2>
                            </div>

                            <RadioGroup
                                value={formData.paymentMethod}
                                onValueChange={(val) => setFormData({ ...formData, paymentMethod: val })}
                                className="grid grid-cols-1 gap-4"
                            >
                                <div className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.paymentMethod === 'cod' ? 'border-[#1B5E20] bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <RadioGroupItem value="cod" id="cod" className="sr-only" />
                                    <Label htmlFor="cod" className="cursor-pointer flex items-center gap-4 w-full h-full">
                                        <div className={`p-3 rounded-full ${formData.paymentMethod === 'cod' ? 'bg-[#1B5E20] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <Banknote className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className={`block font-black uppercase tracking-wider ${formData.paymentMethod === 'cod' ? 'text-[#1B5E20]' : 'text-gray-900'}`}>{t("Cash on Delivery")}</span>
                                            <span className="text-xs text-gray-500 font-bold">{t("Pay when you receive")}</span>
                                        </div>
                                    </Label>
                                </div>

                                <div className={`relative flex flex-col gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.paymentMethod === 'instapay' ? 'border-[#1B5E20] bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <RadioGroupItem value="instapay" id="instapay" className="sr-only" />
                                    <Label htmlFor="instapay" className="cursor-pointer flex items-center gap-4 w-full h-full">
                                        <div className={`p-3 rounded-full ${formData.paymentMethod === 'instapay' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <span className="font-bold text-lg">IP</span>
                                        </div>
                                        <div>
                                            <span className={`block font-black uppercase tracking-wider ${formData.paymentMethod === 'instapay' ? 'text-purple-700' : 'text-gray-900'}`}>InstaPay</span>
                                            <span className="text-xs text-gray-500 font-bold">{t("Transfer -> Upload Receipt")}</span>
                                        </div>
                                    </Label>

                                    {formData.paymentMethod === 'instapay' && (
                                        <div className="w-full mt-2 p-4 bg-white rounded-xl border border-purple-100 text-center animate-in fade-in zoom-in duration-300">
                                            <p className="text-xs text-uppercase tracking-widest text-purple-400 font-black mb-2">{t("Send to Wallet")}</p>
                                            <p className="text-2xl font-mono font-black text-purple-700 select-all tracking-wider">{instapayNumber || "Not Set"}</p>
                                        </div>
                                    )}
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    {/* Order Summary - Desktop Stick, Mobile Static */}
                    <div className="space-y-8 order-1 lg:order-2">
                        <div className="bg-[#1B5E20] text-white rounded-[2rem] p-6 md:p-8 shadow-2xl shadow-green-900/20 lg:sticky lg:top-32">
                            <h2 className="text-2xl font-black mb-6 uppercase tracking-widest">{t("Your Order")}</h2>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 mb-6">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start gap-4 p-4 bg-white/10 rounded-2xl border border-white/5">
                                        <div>
                                            <p className="font-bold text-lg leading-tight mb-1">{isRtl ? item.name_ar : item.name}</p>
                                            <div className="flex items-center gap-2 text-green-200/80 text-sm font-medium">
                                                <span>{item.quantity} x {item.price}</span>
                                            </div>
                                        </div>
                                        <p className="font-black font-mono text-lg">{(Number(item.price) * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <Separator className="bg-white/20 mb-6" />

                            <div className="flex justify-between items-center mb-8">
                                <span className="text-lg font-bold text-green-100 uppercase tracking-widest">{t("Total")}</span>
                                <span className="text-4xl font-black font-mono tracking-tight">{total.toFixed(2)} <span className="text-base align-top text-green-300">EGP</span></span>
                            </div>

                            <Button
                                onClick={onSubmit}
                                disabled={loading}
                                className="w-full bg-white text-[#1B5E20] hover:bg-green-50 font-black h-16 rounded-2xl text-xl uppercase tracking-widest shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:translate-y-0"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : t("Confirm Order")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
