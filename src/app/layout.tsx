import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientProviders from "@/components/ClientProviders";
import { getOptimizedImageUrl } from "@/utils/image";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const KERALA_META_KEYWORDS = [
  // High-Volume Commercial & Local Intent (Kerala Most Result Keywords)
  "furniture shop near me",
  "furniture store near me kerala",
  "furniture shop in kochi",
  "furniture store calicut",
  "furniture shops in malappuram",
  "furniture shop in thrissur",
  "furniture shop in palakkad",
  "furniture showroom trivandrum",
  "online furniture shopping kerala",
  "buy furniture online kerala",
  "best furniture store in kerala",
  "wooden furniture manufacturers in kerala",

  // Core Product Categories & Furniture Keywords
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
  "5-Year Structural Warranty Furniture Kerala",

  // High-Conversion Material & Heritage Keywords (Kerala Specific)
  "nilambur teak wood furniture",
  "nilambur teak furniture price",
  "nilambur teak wood cot",
  "solid teak wood cots kerala",
  "kallai timber furniture calicut",
  "rosewood dining table kerala",
  "sheesham wood furniture kerala",
  "anti-termite solid wood furniture",
  "traditional kerala kattil designs",
  "water-resistant coastal furniture",

  // Living Room Top Result Searches
  "sofa sets in kerala",
  "l-shape sofa kochi",
  "wooden sofa designs kerala",
  "3+2+1 wooden sofa set",
  "recliner chairs kerala",
  "chesterfield sofa online",
  "center table for living room",
  "teak wood coffee table",
  "modern tv units kerala",
  "living room furniture packages",

  // Bedroom Top Result Searches
  "teak wood cot price kerala",
  "king size bed with storage",
  "queen size hydraulic cot",
  "wooden wardrobe with mirror kerala",
  "3 door wardrobe",
  "4 door sliding wardrobe",
  "dressing table with led mirror",
  "orthopedic memory foam mattress kerala",
  "master bedroom furniture set",

  // Dining & Kitchen Top Result Searches
  "dining table sets in kerala",
  "6 seater dining table price kerala",
  "4 seater wooden dining table",
  "italian marble top dining table",
  "solid wood dining chairs",
  "crockery display cabinet",
  "kitchen pantry storage unit",

  // Home Office & Work From Home
  "ergonomic office chairs kerala",
  "work from home computer table kochi",
  "solid wood study table with bookshelf",
  "executive office desks",

  // Factory Direct, Custom Sofa & Pinterest Keywords
  "kerala largest furniture factory",
  "best sofa factory kerala",
  "custom sofa manufacturers kerala",
  "pinterest furniture makers kerala",
  "pinterest sofa designs custom made",
  "direct furniture factory kochi",
  "sofa factory in malappuram calicut",
  "bespoke furniture manufacturing kerala",
  "custom wooden sofa factory",
  "wholesale furniture factory kerala"
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
    description: "Buy premium solid wood, contemporary, and bespoke furniture online in Kerala. Explore luxury sofa sets, king-size beds, marble dining tables, wardrobes, and ergonomic office chairs with free doorstep delivery across Kochi, Calicut, Trivandrum, Thrissur, and all 14 districts of Kerala.",
    url: "https://despearl.com",
    siteName: "Despearl",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Despearl – Premium Furniture & Home Decor Store in Kerala",
    description: "Buy premium solid wood, contemporary, and bespoke furniture online in Kerala. Explore luxury sofa sets, king-size beds, marble dining tables, wardrobes, and ergonomic office chairs with free doorstep delivery across Kochi, Calicut, Trivandrum, Thrissur, and all 14 districts of Kerala.",
  },
  other: {
    'geo.placename': 'Kerala, Kochi, Kozhikode, Thiruvananthapuram, Thrissur',
    'geo.region': 'IN-KL',
    'geo.position': '10.8505;76.2711',
    'ICBM': '10.8505, 76.2711',
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

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "name": "Despearl – Kerala's Largest Furniture & Custom Sofa Factory",
    "image": logoUrl ? getOptimizedImageUrl(logoUrl, 400, 85) : "https://despearl.com/despearl.png",
    "description": "Kerala's largest direct furniture factory and custom sofa manufacturer. Bring any Pinterest or designer furniture to life at direct factory prices with free doorstep delivery across Kochi, Calicut, Malappuram, Thrissur, Palakkad, and all 14 districts of Kerala.",
    "url": "https://despearl.com",
    "telephone": "+91 9895363788",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Kerala",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 10.8505,
      "longitude": 76.2711
    },
    "areaServed": [
      "Kochi",
      "Ernakulam",
      "Calicut",
      "Kozhikode",
      "Malappuram",
      "Thrissur",
      "Palakkad",
      "Thiruvananthapuram",
      "Kottayam",
      "Kannur",
      "Kollam",
      "Alappuzha",
      "Kasaragod",
      "Wayanad",
      "Idukki",
      "Pathanamthitta",
      "Kerala",
      "India"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Kerala Furniture Collections",
      "itemListElement": [
        { "@type": "OfferCatalog", "name": "Custom Sofa Manufacturing & Pinterest Designs" },
        { "@type": "OfferCatalog", "name": "Living Room & Recliners" },
        { "@type": "OfferCatalog", "name": "Bedroom Sets & Solid Teak Cots" },
        { "@type": "OfferCatalog", "name": "Dining Tables & Marble Sets" },
        { "@type": "OfferCatalog", "name": "Wardrobes & Modular Storage" },
        { "@type": "OfferCatalog", "name": "Gruhapravesam Villa Packages" }
      ]
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
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

        {/* Structured Data (Schema.org) for Google Kerala Local SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />

        {logoUrl && (
          <link rel="preload" as="image" href={getOptimizedImageUrl(logoUrl, 160, 85)} fetchPriority="high" />
        )}
      </head>
      <body className="min-h-screen w-full m-0 font-sans">
        <StoreProvider>
          <div id="app" className="flex flex-col min-h-screen w-full mx-auto bg-white relative transition-all duration-300">
            <Header logoUrl={logoUrl} />
            <main id="app-main" className="flex-1 overflow-x-hidden relative pb-[96px] md:pb-0">
              {children}
            </main>
            <Footer logoUrl={logoUrl} />
          </div>
          <ClientProviders />
        </StoreProvider>
      </body>
    </html>
  );
}
