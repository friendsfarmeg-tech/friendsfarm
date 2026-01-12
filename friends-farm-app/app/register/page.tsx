"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Sprout, Eye, EyeOff } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import Link from "next/link"
import { toast } from "sonner"

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { t } = useLanguage()
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                // Auto-login after successful registration
                const loginResult = await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    redirect: false
                })

                if (loginResult?.ok) {
                    toast.success(t("Account created successfully!"))
                    router.push("/")
                } else {
                    // If auto-login fails, redirect to login page
                    toast.success(t("Account created! Please login."))
                    router.push("/login")
                }
            } else {
                const error = await res.text()
                toast.error(error || t("Registration failed"))
            }
        } catch (error) {
            toast.error(t("Something went wrong"))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-[#0a1f0c]">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 scale-110 blur-sm"
                    style={{ backgroundImage: 'url(/hero-bg.png)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-black/40 to-green-900/60" />
            </div>

            <Card className="relative z-10 w-full max-w-md border-none shadow-2xl rounded-[3rem] bg-white/95 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                <CardHeader className="space-y-4 text-center pt-10">
                    <div className="mx-auto w-20 h-20 bg-[#1B5E20] rounded-[1.5rem] flex items-center justify-center mb-2 shadow-xl shadow-green-900/40 group">
                        <Sprout className="w-10 h-10 text-white group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-black text-[#1B5E20] tracking-tighter uppercase">{t("Create Account")}</CardTitle>
                        <CardDescription className="text-gray-500 font-bold">
                            {t("Fresh from the farm directly to you.")}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="font-bold text-gray-700 text-xs uppercase tracking-widest ml-1">{t("Full Name")}</Label>
                            <Input
                                placeholder="Abdallah Sayed"
                                className="h-12 rounded-xl border-gray-100 bg-white/50 focus:bg-white"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-gray-700 text-xs uppercase tracking-widest ml-1">{t("Email")}</Label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                className="h-12 rounded-xl border-gray-100 bg-white/50 focus:bg-white"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-gray-700 text-xs uppercase tracking-widest ml-1">{t("Password")}</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    className="h-12 rounded-xl border-gray-100 bg-white/50 focus:bg-white pr-12"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B5E20] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl bg-[#1B5E20] hover:bg-[#144318] text-white font-black text-lg shadow-lg shadow-green-900/20 transition-all active:scale-95"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : t("Register")}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-6 pb-10">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 font-bold">{t("Already have an account?")}</span>
                        <Link href="/login" className="text-[#1B5E20] font-black hover:underline underline-offset-4">
                            {t("Sign In")}
                        </Link>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1B5E20]/40 w-full text-center">
                        &copy; {new Date().getFullYear()} {t("Brand Name")} &bull; Farm Fresh
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
