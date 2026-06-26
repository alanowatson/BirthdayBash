import type { Metadata } from "next";
import { Cormorant_Garamond, Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AuthHashHandler from "@/components/AuthHashHandler";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-italiana",
  style: ["normal", "italic"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alan's 40th: The 4th Awakens",
  description: "Alan Watson's 40th birthday weekend. Las Vegas, Oct 22–26, 2026.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${playfair.variable} ${inter.variable} ${jetbrains.variable} min-h-full antialiased`}
    >
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="min-h-full bg-bg text-text font-sans">
        <AuthHashHandler />
        {children}
      </body>
    </html>
  );
}
