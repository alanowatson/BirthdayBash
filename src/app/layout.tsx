import type { Metadata } from "next";
import { Italiana, Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const italiana = Italiana({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-italiana",
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
  title: "Vegas Hype — You're on the list.",
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
      className={`${italiana.variable} ${playfair.variable} ${inter.variable} ${jetbrains.variable} min-h-full antialiased`}
    >
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="min-h-full bg-bg text-text font-sans">{children}</body>
    </html>
  );
}
