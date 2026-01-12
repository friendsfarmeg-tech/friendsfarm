"use client"

import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import Image from "next/image";
import { Truck, Trophy, Sprout, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { OffersCarousel } from "@/components/offers-carousel";
import { useEffect, useState } from "react";
import { HatchingLoader } from "@/components/hatching-loader";

export default function HomePage() {
    const { t, isRtl } = useLanguage();
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [topRatedProducts, setTopRatedProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch('/api/products?isFeatured=true'),
                    fetch('/api/categories')
                ]);
                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();
                setFeaturedProducts(productsData.slice(0, 8));
                // Simulate top-rated products (in reality, this would come from API with reviews)
                setTopRatedProducts(productsData.slice(0, 4));
                setCategories(categoriesData.slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <HatchingLoader />;

    return (
        <div className="pb-10">
            {/* Hero Section */}
            <div className="relative h-[55vh] md:h-[75vh] flex flex-col justify-center items-center text-center overflow-hidden bg-[#050f06]">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-no-repeat bg-center bg-fixed opacity-70"
                        style={{ backgroundImage: 'url(/hero-bg.png)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#050f06]"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4">
                    <span className="inline-block bg-[#FFD600]/20 backdrop-blur-md text-[#FFD600] py-1 px-4 rounded-full font-black text-[8px] md:text-xs mb-4 uppercase tracking-[0.2em] border border-[#FFD600]/30 shadow-2xl">
                        {t("Welcome Message")}
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-4 md:mb-6 leading-tight tracking-tighter drop-shadow-2xl uppercase">
                        {t("Brand Name")}
                    </h1>
                    <p className="text-white/60 font-bold mb-6 md:mb-8 max-w-lg mx-auto text-xs md:text-base leading-relaxed px-4">
                        {t("Hero Slogan")}
                    </p>
                    <Link href="/products">
                        <button className="bg-[#FFD600] text-[#1B5E20] px-6 md:px-10 py-2.5 md:py-3.5 rounded-full font-black text-xs md:text-base shadow-[0_20px_40px_rgba(255,214,0,0.2)] hover:scale-110 active:scale-95 transition-all duration-500 uppercase tracking-widest">
                            {t("Shop Now")}
                        </button>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-20 mt-[-3rem] md:mt-[-5rem]">
                {/* 3-Column Feature Grid */}
                <div className="grid grid-cols-3 gap-2 md:gap-6 mb-16 md:mb-20">
                    {[
                        { title: t('Fast Delivery'), subtitle: t('Within 24 hours'), icon: Truck, color: 'bg-orange-50 text-orange-500' },
                        { title: t('Home Raised'), subtitle: t('No hormones or additives'), icon: Sprout, color: 'bg-green-50 text-green-600' },
                        { title: t('High Quality'), subtitle: t('Slaughtered according to Sharia'), icon: Trophy, color: 'bg-amber-50 text-amber-500' }
                    ].map((feature, i) => (
                        <div key={i}
                            className="bg-white rounded-[1.25rem] md:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-green-900/5 p-3 md:p-8 text-center flex flex-col items-center transition-all duration-500 hover:-translate-y-2 group">
                            <div className={`w-10 h-10 md:w-20 md:h-20 ${feature.color} rounded-xl md:rounded-[1.5rem] flex items-center justify-center mb-3 md:mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-sm`}>
                                <feature.icon className="w-5 h-5 md:w-8 md:h-8" />
                            </div>
                            <h4 className="font-black text-[9px] md:text-base text-[#1B5E20] mb-0.5 md:mb-2 leading-tight uppercase tracking-tight">{feature.title}</h4>
                            <p className="text-[7px] md:text-xs text-gray-400 font-bold leading-tight opacity-80">{feature.subtitle}</p>
                        </div>
                    ))}
                </div>

                {/* Categories */}
                <div className="mb-16 md:mb-20">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 md:mb-10 gap-4">
                        <div className="text-center md:text-start">
                            <h2 className="text-xl md:text-3xl font-black text-[#1B5E20] mb-2 uppercase tracking-tighter">{t("Explore Our Sections")}</h2>
                            <div className="h-1 w-16 bg-amber-500 rounded-full mx-auto md:mx-0"></div>
                        </div>
                        <Link href="/products" className="group flex items-center gap-2 bg-[#1B5E20]/5 px-6 py-2.5 rounded-xl font-black text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition-all duration-500 text-sm">
                            {t("All")} <span className={`text-lg transition-transform ${isRtl ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>{isRtl ? '←' : '→'}</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-5">
                        {categories.map((category) => (
                            <Link key={category.id} href={`/products?category=${category.id}`} className="group relative aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden border-2 border-white shadow-lg transition-all duration-500 hover:-translate-y-2">
                                <Image src={category.image_url || 'https://placehold.co/400'} alt={category.name} fill className="object-cover transition duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/20 to-transparent"></div>
                                <div className="absolute inset-0 flex items-end justify-center pb-4 md:pb-6">
                                    <h3 className="text-white font-black text-[10px] md:text-sm text-center px-3 uppercase tracking-wider">{isRtl ? category.name_ar : category.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Featured Products */}
                <div className="mb-16 md:mb-20">
                    <div className="flex items-center gap-4 md:gap-8 mb-8 md:mb-10">
                        <h2 className="text-xl md:text-3xl font-black text-[#1B5E20] uppercase tracking-tighter whitespace-nowrap">{t("Featured Products")}</h2>
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-green-100 to-transparent rounded-full hidden md:block"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} data={product} />
                        ))}
                    </div>
                </div>
                {/* About & Delivery Sections */}
                <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-green-50 flex flex-col items-start gap-4 transform hover:scale-[1.02] transition-all duration-300">
                        <div className="bg-green-100 p-4 rounded-full">
                            <Sprout className="w-8 h-8 text-[#1B5E20]" />
                        </div>
                        <h3 className="text-2xl font-black text-[#1B5E20] uppercase tracking-tighter">{t("About Us") || "About Us"}</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            {t("Write about your farm here...") || "We are a local farm dedicated to providing the freshest, highest quality products directly to your table. Our commitment to sustainable farming ensures healthy and delicious food for your family."}
                        </p>
                        <Link href="/about">
                            <Button variant="link" className="px-0 text-[#1B5E20] font-black uppercase tracking-widest">
                                {t("Read More") || "Read More"} &rarr;
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-green-50 flex flex-col items-start gap-4 transform hover:scale-[1.02] transition-all duration-300">
                        <div className="bg-amber-100 p-4 rounded-full">
                            <Truck className="w-8 h-8 text-amber-600" />
                        </div>
                        <h3 className="text-2xl font-black text-[#1B5E20] uppercase tracking-tighter">{t("Delivery Policy") || "Delivery Policy"}</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            {t("Explain your delivery policy...") || "We deliver fresh to your door within 24 hours of your order. Our specialized delivery team ensures your products arrive in perfect condition, maintaining the cold chain where necessary."}
                        </p>
                        <Link href="/delivery-policy">
                            <Button variant="link" className="px-0 text-[#1B5E20] font-black uppercase tracking-widest">
                                {t("Read More") || "Read More"} &rarr;
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Offers Carousel - Full width */}
                <OffersCarousel />

                <div className="max-w-7xl mx-auto px-4">
                    {/* Our Picks - Top Rated */}
                    <div className="py-16 md:py-20">
                        <div className="text-center mb-10">
                            <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 py-1.5 px-4 rounded-full font-black text-xs mb-4 uppercase tracking-widest">
                                <Star className="w-4 h-4 fill-amber-500" />
                                {t("Top Rated")}
                            </span>
                            <h2 className="text-xl md:text-3xl font-black text-[#1B5E20] uppercase tracking-tighter">
                                {t("Our Picks For You")}
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                            {topRatedProducts.map((product) => (
                                <ProductCard key={product.id} data={product} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Testimonials Carousel */}
                <TestimonialsCarousel />
            </div>
        </div>
    );
}
