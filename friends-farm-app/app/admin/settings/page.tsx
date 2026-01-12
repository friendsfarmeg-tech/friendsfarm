"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Settings, Save, Facebook, Instagram, Phone, MessageCircle } from "lucide-react"

export default function SettingsPage() {
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        instapay_number: "",
        facebook: "",
        instagram: "",
        tiktok: "",
        whatsapp: "",
        phone: "",
        about_us: "",
        delivery_policy: ""
    })

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings')
                const data = await res.json()
                setFormData(prev => ({ ...prev, ...data }))
            } catch (error) {
                console.error("Failed to fetch settings", error)
            }
        }
        fetchSettings()
    }, [])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success(t("Settings updated successfully"))
            } else {
                toast.error(t("Something went wrong"))
            }
        } catch (error) {
            toast.error(t("Something went wrong"))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-col animate-in fade-in duration-700">
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <Settings className="w-8 h-8 text-[#1B5E20]" />
                            {t("Settings")}
                        </h2>
                        <p className="text-gray-500 font-bold text-sm mt-1">{t("Manage store settings")}</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-8 max-w-4xl">
                    <form onSubmit={onSubmit} className="space-y-8">

                        {/* Payment Settings */}
                        <div className="space-y-4">
                            <h3 className="font-black text-xl text-[#1B5E20]">{t("Payment Settings")}</h3>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700">{t("InstaPay Number")}</Label>
                                    <Input
                                        value={formData.instapay_number}
                                        onChange={(e) => setFormData({ ...formData, instapay_number: e.target.value })}
                                        placeholder="01xxxxxxxxx"
                                        className="rounded-xl font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Social Media & Contact */}
                        <div className="space-y-4">
                            <h3 className="font-black text-xl text-[#1B5E20]">{t("Social Media & Contact")}</h3>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700 flex items-center gap-2"><Facebook className="w-4 h-4" /> Facebook URL</Label>
                                    <Input
                                        value={formData.facebook}
                                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700 flex items-center gap-2"><Instagram className="w-4 h-4" /> Instagram URL</Label>
                                    <Input
                                        value={formData.instagram}
                                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700 flex items-center gap-2">TikTok URL</Label>
                                    <Input
                                        value={formData.tiktok}
                                        onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700 flex items-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp Number</Label>
                                    <Input
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700 flex items-center gap-2"><Phone className="w-4 h-4" /> Phone Number</Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Content Management */}
                        <div className="space-y-4">
                            <h3 className="font-black text-xl text-[#1B5E20]">{t("Content Management")}</h3>
                            <Separator />
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700">{t("About Us")}</Label>
                                    <Textarea
                                        value={formData.about_us}
                                        onChange={(e) => setFormData({ ...formData, about_us: e.target.value })}
                                        className="rounded-xl min-h-[150px]"
                                        placeholder={t("Write about your farm here...")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700">{t("Delivery Policy")}</Label>
                                    <Textarea
                                        value={formData.delivery_policy}
                                        onChange={(e) => setFormData({ ...formData, delivery_policy: e.target.value })}
                                        className="rounded-xl min-h-[150px]"
                                        placeholder={t("Explain your delivery policy...")}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            disabled={loading}
                            type="submit"
                            className="bg-[#1B5E20] hover:bg-[#144318] rounded-xl font-black uppercase tracking-widest w-full md:w-auto"
                        >
                            <Save className="w-4 h-4 me-2" />
                            {t("Save Changes")}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
