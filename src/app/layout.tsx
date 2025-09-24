// app/layout.tsx (komponent serwerowy - bez "use client")
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

import { AuthProvider } from "./ClientWrapper";

import { Outfit, Fragment_Mono } from 'next/font/google'

// czcionki
const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
})

const fragmentMono = Fragment_Mono({
  variable: '--font-fragment-mono',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Axon",
  description: "Ucz się angielskiego",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${fragmentMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}