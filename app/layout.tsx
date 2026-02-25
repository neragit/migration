import type { Metadata } from "next";
import Script from "next/script";
import { Mukta } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import CookieConsent from "./components/CookieConsent";

const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Migracije i Meta signali",
  description: "Analiza migracija i digitalnih tragova u Hrvatskoj.",
  keywords: ["migracije", "strani radnici", "Meta", "digitalni trag", "Hrvatska"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <head>
        <Script
          src="https://t.contentsquare.net/uxa/28aa38d58a541.js" // Contentsquare / Hotjar script
          strategy="beforeInteractive" // runs in head before page scripts
        />
      </head>
      <body className={`${mukta.variable} antialiased`}>

        <header className="fixed top-0 left-0 right-0 h-10 px-4 bg-neutral-50 text-neutral-700 shadow flex items-center z-9998">

          <nav className="flex justify-between w-full">

            <div className="flex gap-5">
              <a
                href="/"
                className="relative group"
              >
                Migracije
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-400 transition-all duration-300 group-hover:w-full" />
              </a>
              <a href="/meta" className="hover:text-slate-600 focus:outline-none">Meta signali</a>
            </div>

            <div className="flex gap-5">
              <a href="https://github.com/tvoje-github" className="hover:text-slate-600 focus:outline-none">GitHub</a>
              <a href="https://linkedin.com/in/tvoje-linkedin" className="hover:text-slate-600 focus:outline-none">LinkedIn</a>
            </div>

          </nav>

        </header>

        {children}

        <CookieConsent />

      </body>
    </html>
  );
}
