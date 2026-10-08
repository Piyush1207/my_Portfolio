import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SubFooter from "@/components/layout/SubFooter";
import Loader from "@/components/ui/Loader";
import ParticlesBackground from "@/components/background/ParticlesBackground";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Piyush A | Software Engineer",
  description: "Software engineer and Framer creator building scalable web experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-full flex flex-col relative selection:bg-black selection:text-white" suppressHydrationWarning>
        <SmoothScroll />
        <ParticlesBackground />
        <Loader />
        <Navbar />
        <div className="noise-overlay" />
        <main className="flex-1 flex flex-col w-full">
          {children}
        </main>
        <Footer />
        <SubFooter />
      </body>
    </html>
  );
}