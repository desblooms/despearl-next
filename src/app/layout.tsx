import type { Metadata, Viewport } from "next";
import { Lato, Outfit } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthSheet from "@/components/AuthSheet";
import ToastProvider from "@/components/ToastProvider";

const lato = Lato({ subsets: ["latin"], weight: ["100", "300", "400", "700", "900"], variable: "--font-lato" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

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
      next: { revalidate: 60 },
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
      <body className={`${lato.className} ${lato.variable} ${outfit.variable} h-[100dvh] w-full overflow-hidden m-0 font-sans`}>
        <StoreProvider>
          <div id="app" className="flex flex-col h-full w-full mx-auto bg-white relative transition-all duration-300">
            <Header logoUrl={logoUrl} />
            <main id="app-main" className="flex-1 overflow-y-auto overflow-x-hidden relative overscroll-y-contain">
              {children}
            </main>
            <Footer />
          </div>
          <AuthSheet />
          <ToastProvider />
        </StoreProvider>
      </body>
    </html>
  );
}
