import type { Metadata } from "next";
import { Tajawal, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { HatchingLoader } from "@/components/hatching-loader";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Friends Farm | فريندز فارم",
  description: "Fresh from our farm directly to you. أجود أنواع الطيور والدواجن طازجة من المزرعة إليك مباشرة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-tajawal antialiased selection:bg-green-100 selection:text-green-900 overflow-x-hidden">
        <Providers>
          <HatchingLoader />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
