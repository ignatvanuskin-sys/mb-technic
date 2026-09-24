import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { BookingModal } from "@/components/booking/BookingModal";

/**
 * Public site URL. REQUIRES CONFIRMATION — no domain is published on the 2GIS card or
 * Instagram, so this is a placeholder used for canonical/OG/sitemap URLs only.
 * Set NEXT_PUBLIC_SITE_URL in the environment to the real domain before launch.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mbtechnic.kz";

const title = "MB Technic — Сервис Mercedes в Астане";
const description =
  "Профессиональное обслуживание и ремонт Mercedes-Benz в Астане. Диагностика, двигатель, ходовая часть, кузовной ремонт, АКПП. Онлайн-запись в MB Technic.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · MB TECHNIC",
  },
  description,
  applicationName: "MB TECHNIC",
  keywords: [
    "MB Technic",
    "сервис Mercedes Астана",
    "ремонт Mercedes-Benz Астана",
    "Mercedes сервис Астана",
    "ремонт двигателя Mercedes",
    "пневмоподвеска Mercedes",
    "СТО Астана Аркайым",
  ],
  authors: [{ name: "MB TECHNIC" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_KZ",
    url: siteUrl,
    siteName: "MB TECHNIC",
    title,
    description,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "MB TECHNIC — сервис Mercedes-Benz в Астане",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "automotive",
};

export const viewport: Viewport = {
  themeColor: "#06070A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  "@id": `${siteUrl}/#business`,
  name: "MB TECHNIC",
  alternateName: "Mb Technic",
  description:
    "Специализированный сервис Mercedes-Benz в Астане: диагностика, ремонт двигателя, ходовой части, пневмоподвески, тормозной системы, кузовной ремонт, АКПП, замена масла.",
  url: siteUrl,
  telephone: site.primaryPhone.tel,
  image: `${siteUrl}/media/opt/owner-03.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "улица Аркайым, 7",
    addressLocality: "Астана",
    addressRegion: "Алматинский район",
    postalCode: site.postalCode,
    addressCountry: "KZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.lat,
    longitude: site.geo.lng,
  },
  hasMap: site.links.twoGis,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: site.rating.value,
    bestRating: 5,
    ratingCount: site.rating.ratings,
    reviewCount: site.rating.reviews,
  },
  areaServed: { "@type": "City", name: "Астана" },
  sameAs: [site.links.instagram, site.links.tiktok, site.links.twoGis],
  /* Categories published on the 2GIS business card. */
  knowsAbout: [
    "Ремонт бензиновых двигателей",
    "Ремонт ходовой части",
    "Ремонт АКПП",
    "Кузовной ремонт",
    "Компьютерная диагностика",
    "Замена масла",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        {/* Enables the reveal-on-scroll transition only when JS is available. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/inter-tight-cyrillic.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/inter-tight-latin.woff2" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <BookingProvider>
          {children}
          <BookingModal />
        </BookingProvider>
      </body>
    </html>
  );
}
