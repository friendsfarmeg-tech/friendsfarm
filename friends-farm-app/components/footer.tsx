"use client"

import Link from 'next/link';
import { Facebook, Instagram, Phone, MessageCircle, Sprout } from 'lucide-react';
import { useLanguage } from './language-provider';
import { useEffect, useState } from 'react';

export default function Footer() {
    const { t } = useLanguage();
    const [settings, setSettings] = useState<any>({});

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                setSettings(data);
            } catch (error) {
                console.error("Failed to fetch settings", error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <footer className="bg-[#0a1f0c] text-white pt-24 pb-12 mt-24 text-center border-t border-white/5 font-outfit">
            <div className="max-w-7xl mx-auto px-6">
                {/* Brand */}
                <div className="mb-12 space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="bg-[#1B5E20] p-3 rounded-2xl shadow-lg shadow-green-900/50">
                            <Sprout className="w-8 h-8 text-white" />
                        </div>

                    </div>
                    <p className="text-gray-400 max-w-lg mx-auto leading-relaxed font-bold">
                        {t("Fresh from the farm")}
                    </p>
                </div>

                {/* Links */}
                <div className="flex justify-center gap-10 flex-wrap mb-16">
                    <Link href="/products" className="text-gray-300 hover:text-amber-500 font-black uppercase tracking-widest text-sm transition-all duration-300 underline-offset-8 hover:underline italic">
                        {t("All Products")}
                    </Link>
                    <Link href="/about" className="text-gray-300 hover:text-amber-500 font-black uppercase tracking-widest text-sm transition-all duration-300 underline-offset-8 hover:underline italic">
                        {t("About Farm")}
                    </Link>
                    <Link href="/delivery-policy" className="text-gray-300 hover:text-amber-500 font-black uppercase tracking-widest text-sm transition-all duration-300 underline-offset-8 hover:underline italic">
                        {t("Delivery Policy")}
                    </Link>
                </div>

                {/* Socials & Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    <div className="flex justify-center md:justify-end gap-6">
                        {settings.facebook && (
                            <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center hover:bg-[#1877F2] transition-all duration-500 hover:-translate-y-2 group">
                                <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </a>
                        )}
                        {settings.instagram && (
                            <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center hover:bg-gradient-to-tr hover:from-orange-500 hover:to-pink-600 transition-all duration-500 hover:-translate-y-2 group">
                                <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </a>
                        )}
                        {settings.tiktok && (
                            <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center hover:bg-black transition-all duration-500 hover:-translate-y-2 border border-white/10 group">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31-1.26-.71-2.31-1.75-3.04-2.99v8.94c.03 2.39-1.02 4.79-2.9 6.27-1.88 1.48-4.47 2.05-6.81 1.54-2.34-.51-4.38-2.15-5.46-4.36-1.08-2.21-1.08-4.89 0-7.1.54-1.11 1.34-2.07 2.32-2.81 1.05-.79 2.33-1.32 3.65-1.53v4.07c-1.14.28-2.13 1-2.73 1.99-.6 1-.6 2.3 0 3.3.6 1 1.59 1.71 2.73 1.99 1.14.28 2.37-.03 3.26-.82.89-.79 1.39-1.95 1.39-3.15V.02z" />
                                </svg>
                            </a>
                        )}
                    </div>
                    <div className="flex justify-center md:justify-start gap-4">
                        {settings.phone && (
                            <a href={`tel:${settings.phone}`} className="flex items-center gap-4 bg-white/5 py-4 px-8 rounded-3xl font-black hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                                <Phone className="w-5 h-5 text-amber-500" />
                                <span className="tracking-tighter">{settings.phone}</span>
                            </a>
                        )}
                        {settings.whatsapp && (
                            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-16 h-16 bg-green-500/20 text-green-500 rounded-3xl hover:bg-green-500 hover:text-white transition-all duration-500 hover:-translate-y-1">
                                <MessageCircle className="w-6 h-6" />
                            </a>
                        )}
                    </div>
                </div>

                <div className="border-t border-white/5 pt-12 text-gray-500 text-[10px] font-black flex flex-col md:flex-row items-center justify-between gap-6 uppercase tracking-[0.2em]">
                    <span>{t("All Rights Reserved")} &copy; {new Date().getFullYear()} {t("Brand Name")}</span>
                    <a
                        href="https://github.com/AbdullahSayed3"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-white transition-colors group"
                    >
                        <span className="text-amber-500 group-hover:scale-110 transition-transform">&lt;/&gt;</span>
                        <span>{t("Developed by")}</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
