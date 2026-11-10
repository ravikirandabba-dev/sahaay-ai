import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sahaay AI — Luxurious 3D Gold Multilingual Voice Helpdesk",
  description: "Your language. Your voice. Your solution. Powered by Gnani Prisma Speech Intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} light`}>
      <body className="min-h-screen bg-[#F4E3B2] text-[#1E293B] antialiased selection:bg-[#D4AF37] selection:text-[#812637]">
        {children}
      </body>
    </html>
  );
}
