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

const KERALA_META_KEYWORDS = [
  // Kerala Audience & Locations (KERALA AUDIENCE)
  "Furniture Store Kerala",
  "Online Furniture Kerala",
  "Buy Furniture Online Kerala",
  "Furniture Shop in Kochi",
  "Wooden Furniture Kozhikode",
  "Furniture Showroom Trivandrum",
  "Teak Wood Cot Thrissur",
  "Modern Sofa Sets Ernakulam",
  "Custom Wardrobes Kannur",
  "Dining Table Kottayam",
  "Home Furnishing Malappuram",
  "Furniture Delivery Kerala",
  "NRI Furniture Shopping Kerala",
  "Apartment Furniture Kochi",
  "Villa Furniture Packages Kerala",
  "Nilambur Teak Wood Furniture",
  "Furniture Shop in Palakkad",
  "Furniture Showrooms in Kollam",
  "Alappuzha Furniture Stores",
  "Wayanad Resort Furniture",
  "Kasaragod Home Decor",
  
  // All Category Keywords (ALL CATEGORY)
  "Living Room Furniture",
  "L-Shape Sofas",
  "Wooden Sofa Sets",
  "Recliner Chairs",
  "Chesterfield Couches",
  "Center Tables",
  "Coffee Tables",
  "TV Entertainment Units",
  "Accent Chairs",
  "Bedroom Furniture",
  "King Size Beds",
  "Queen Size Beds",
  "Hydraulic Storage Beds",
  "Solid Teak Wood Cots",
  "3-Door Wardrobes",
  "Sliding Wardrobes",
  "Dressing Tables with LED Mirror",
  "Orthopedic Mattresses",
  "Dining Room Furniture",
  "6 Seater Dining Tables",
  "4 Seater Dining Sets",
  "Italian Marble Dining Tables",
  "Wooden Dining Chairs",
  "Crockery Units",
  "Home Office Desks",
  "Ergonomic Office Chairs",
  "Computer Study Tables",
  "Bookshelves",
  "Balcony Furniture",
  "Garden Swing Chairs",
  "Full Length Floor Mirrors",
  "Home Decor Kerala",
  "Shoe Racks",
  
  // All Audience Types (TYPE AUDIENCE)
  "New Home Furnishing Packages Kerala",
  "Gruhapravesam Furniture Offers",
  "Kerala Villa Furniture Packages",
  "Apartment Space Saving Furniture",
  "Multipurpose Sofa Cum Bed",
  "Send Furniture to Kerala for Family",
  "NRI Online Furniture Booking Kerala",
  "Interior Designer Furniture Kerala",
  "Boutique Resort Furniture Kerala",
  "Affordable Luxury Furniture EMI Kerala",
  "100% Solid Wood Anti-Termite Furniture",
  "5-Year Structural Warranty Furniture Kerala"
];

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://despearl.com'),
  title: {
    default: "Despearl – Premium Furniture & Home Decor Store in Kerala",
    template: "%s | Despearl Kerala"
  },
  description: "Buy premium solid wood, contemporary, and bespoke furniture online in Kerala. Explore luxury sofa sets, king-size beds, marble dining tables, wardrobes, and ergonomic office chairs with free doorstep delivery across Kochi, Calicut, Trivandrum, Thrissur, and all 14 districts of Kerala.",
  keywords: KERALA_META_KEYWORDS,
  authors: [{ name: "Despearl" }],
  creator: "Despearl",
  publisher: "Despearl",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Despearl – Premium Furniture & Home Decor Store in Kerala",
    description: "Shop handcrafted solid wood and modern furniture with free doorstep delivery across all 14 districts of Kerala. Discover sofas, cots, dining tables, and wardrobes.",
    url: "https://despearl.com",
    siteName: "Despearl",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Despearl – Premium Furniture Store in Kerala",
    description: "Explore luxury living, bedroom, dining, and home office furniture crafted for homes in Kerala with doorstep installation.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: "Furniture & Home Decor",
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
      <head>
        <link rel="preconnect" href="https://admin.despearl.com" />
        <link rel="preconnect" href="https://app.votee.in" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://admin.despearl.com" />
        <link rel="dns-prefetch" href="https://app.votee.in" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* Meta Keywords & Regional Geo Tags for Kerala Search Engines */}
        <meta name="keywords" content={KERALA_META_KEYWORDS.join(", ")} />
        <meta name="geo.region" content="IN-KL" />
        <meta name="geo.placename" content="Kerala, Kochi, Kozhikode, Thiruvananthapuram, Thrissur" />
        <meta name="geo.position" content="10.8505;76.2711" />
        <meta name="ICBM" content="10.8505, 76.2711" />

        {logoUrl && (
          <link rel="preload" as="image" href={getOptimizedImageUrl(logoUrl, 160, 85)} fetchPriority="high" />
        )}
      </head>
      <body className={`${lato.className} ${lato.variable} ${outfit.variable} min-h-screen w-full m-0 font-sans`}>
        <StoreProvider>
          <div id="app" className="flex flex-col min-h-screen w-full mx-auto bg-white relative transition-all duration-300">
            <Header logoUrl={logoUrl} />
            <main id="app-main" className="flex-1 overflow-x-hidden relative pb-[96px] md:pb-0">
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
