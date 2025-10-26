// app/layout.tsx (komponent serwerowy - bez "use client")
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";

import { AuthProvider } from "./ClientWrapper";
import { LanguageProvider } from "@/contexts/LanguageContext";

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
      <body className="antialiased overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <LanguageProvider>
              <div id="main-content" className="relative min-h-screen focus:outline-none">
                {children}
              </div>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}