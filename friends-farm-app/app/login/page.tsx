"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sprout, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/components/language-provider"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isCredentialsLoading, setIsCredentialsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { t } = useLanguage()
    const router = useRouter()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            await signIn("google", { callbackUrl: "/" })
        } catch (error) {
            console.error(error)
            setIsLoading(false)
        }
    }

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCredentialsLoading(true)

        try {
            const res = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false
            })

            if (res?.ok) {
                toast.success("Welcome back!")
                router.push("/")
            } else {
                toast.error("Invalid email or password")
            }
        } catch (error) {
            toast.error("An error occurred during login")
        } finally {
            setIsCredentialsLoading(false)
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
                        <CardTitle className="text-3xl font-black text-[#1B5E20] tracking-tighter uppercase">{t("Sign In")}</CardTitle>
                        <CardDescription className="text-gray-500 font-bold">
                            {t("Secure Login Message")}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6 p-8 pt-0">
                    <Button
                        variant="outline"
                        onClick={handleGoogleLogin}
                        disabled={isLoading || isCredentialsLoading}
                        className="w-full h-14 rounded-2xl border-2 border-gray-100 hover:bg-gray-50 font-black transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
                    >
                        {isLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-[#1B5E20]" />
                        ) : (
                            <svg className="mr-3 h-5 w-5 text-[#1B5E20]" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                        )}
                        {t("Continue with Google")}
                    </Button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center px-8">
                            <Separator className="w-full bg-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white/0 px-2 text-gray-400 font-black tracking-widest bg-emerald-50/50 backdrop-blur-sm rounded-full">OR</span>
                        </div>
                    </div>

                    <form onSubmit={handleCredentialsLogin} className="space-y-4">
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
                            <div className="flex items-center justify-between">
                                <Label className="font-bold text-gray-700 text-xs uppercase tracking-widest ml-1">{t("Password")}</Label>
                                <Link href="/forgot-password" className="text-[10px] font-black text-[#1B5E20] hover:underline uppercase tracking-tighter">
                                    {t("Forgot Password?")}
                                </Link>
                            </div>
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
                            disabled={isLoading || isCredentialsLoading}
                            className="w-full h-14 rounded-2xl bg-[#1B5E20] hover:bg-[#144318] text-white font-black text-lg shadow-lg shadow-green-900/20 transition-all active:scale-95"
                        >
                            {isCredentialsLoading ? <Loader2 className="animate-spin" /> : t("Sign In")}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="pb-10 text-center flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 font-bold">{t("Don't have an account?")}</span>
                        <Link href="/register" className="text-[#1B5E20] font-black hover:underline underline-offset-4">
                            {t("Sign Up")}
                        </Link>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1B5E20]/40 w-full italic">
                        &copy; {new Date().getFullYear()} {t("Brand Name")} &bull; Premium Agriculture
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
