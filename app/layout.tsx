import type { Metadata } from "next";
import { Alexandria, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { RouteLoadingProvider } from "@/components/layout/route-loading-provider";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  variable: "--font-alexandria",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Blue Line | بلو لاين — Luxury Sanitary Ware",
  description:
    "Premium German-engineered bathroom solutions: faucets, concealed shower mixers, smart controls, basins & bathtubs.",
  keywords: [
    "luxury sanitary ware",
    "أدوات صحية فاخرة",
    "خلاطات مياه ألمانية",
    "German bathroom fixtures",
    "Blue Line",
    "بلو لاين",
  ],
  authors: [{ name: "Blue Line Sanitary Ware" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [{ url: "/logo.png" }],
  },
  openGraph: {
    title: "Blue Line | بلو لاين — Luxury Sanitary Ware",
    description:
      "Premium German-engineered bathroom solutions: faucets, concealed shower mixers, smart controls, basins & bathtubs.",
    type: "website",
    locale: "ar_EG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${alexandria.variable} ${plusJakarta.variable}`}
    >
      <head>
        {/* Preconnect to external image origins to reduce TTFB on asset fetching */}
        <link rel="preconnect" href="https://cdn.shortpixel.ai" crossOrigin="" />
        <link rel="preconnect" href="https://faster-grohe.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.shortpixel.ai" />
        <link rel="dns-prefetch" href="https://faster-grohe.com" />

        {/* Speculation Rules API for instant prerendering on link hover */}
        <script
          type="application/speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prerender: [
                {
                  where: { href_matches: "/*" },
                  eagerness: "moderate",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-surface-white font-alexandria text-text-primary antialiased">
        <RouteLoadingProvider>{children}</RouteLoadingProvider>
      </body>
    </html>
  );
}
