import type { Metadata, Viewport } from "next";
import { Lato, Outfit } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientProviders from "@/components/ClientProviders";
import { getOptimizedImageUrl } from "@/utils/image";

const lato = Lato({ 
  subsets: ["latin"], 
  weight: ["400", "700"], 
  variable: "--font-lato",
  display: "swap"
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  weight: ["400", "600", "700", "800"], 
  variable: "--font-outfit",
  display: "swap"
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Despearl – Premium Store",
  description: "Modern furniture for your modern home",
};

async function fetchGlobalSettings() {
  try {
    const res = await fetch(`https://admin.despearl.com/api/settings`, { 
      next: { revalidate: 3600 },
      headers: { 'Origin': process.env.NEXT_PUBLIC_SITE_URL || '' }
    });
    const data = await res.json();
    return data.status === 'success' ? data.data : null;
  } catch (e) {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await fetchGlobalSettings();
  const logoUrl = settings?.branding?.logo_url;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://admin.despearl.com" />
        <link rel="preconnect" href="https://app.votee.in" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://admin.despearl.com" />
        <link rel="dns-prefetch" href="https://app.votee.in" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {logoUrl && (
          <link rel="preload" as="image" href={getOptimizedImageUrl(logoUrl, 160, 85)} fetchPriority="high" />
        )}
      </head>
      <body className={`${lato.className} ${lato.variable} ${outfit.variable} min-h-screen w-full m-0 font-sans`}>
        <StoreProvider>
          <div id="app" className="flex flex-col min-h-screen w-full mx-auto bg-white relative transition-all duration-300">
            <Header logoUrl={logoUrl} />
            <main id="app-main" className="flex-1 overflow-x-hidden relative pb-[60px] md:pb-0">
              {children}
            </main>
            <Footer />
          </div>
          <ClientProviders />
        </StoreProvider>
      </body>
    </html>
  );
}
