import { Metadata } from "next"
import "styles/globals.css"
import { UIProvider } from "@lib/context/ui-context"
import { CartProvider } from "@lib/context/cart-context"
import { Newsreader, Gilda_Display, Petit_Formal_Script, Poppins } from "next/font/google"
import Preloader from "@modules/common/components/preloader"
import SmoothScroll from "@modules/common/components/smooth-scroll"

const manrope = Poppins({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

const gilda = Gilda_Display({
  subsets: ["latin"],
  variable: "--font-gilda",
  display: "swap",
  weight: ["400"],
})

const petit = Petit_Formal_Script({
  subsets: ["latin"],
  variable: "--font-petit",
  display: "swap",
  weight: ["400"],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"),
  title: {
    template: "%s | HEALTH & WEALTH CLUB",
    default: "HEALTH & WEALTH CLUB - Premium Lifestyle & Wellness",
  },
  description: "Experience the pinnacle of health and wealth. A curated collection of premium lifestyle, wellness, and investment in self.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://health-wealthclub.com",
    siteName: "HEALTH & WEALTH CLUB",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "HEALTH & WEALTH CLUB",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/preloader.jpeg",
    shortcut: "/preloader.jpeg",
    apple: "/preloader.jpeg",
  },
  twitter: {
    card: "summary_large_image",
    title: "HEALTH & WEALTH CLUB",
    description: "Premium Lifestyle & Wellness",
    images: ["/twitter-image.jpg"],
  },
  authors: [
    { name: "Prashant", url: "https://prashanttzz.in" },
    { name: "City Reach", url: "https://cityreach.in" }
  ],
  creator: "Prashant & City Reach",
  publisher: "The Health & Wealth Club",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="light"
      className={`${manrope.variable} ${newsreader.variable} ${gilda.variable} ${petit.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* ✅ Performance: DNS and Connection Pre-warming */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL} />

        {/* ✅ Performance: Preload Critical Above-the-fold Assets */}
        <link rel="preload" href="/preloader.jpeg" as="image" type="image/jpeg" />
        <link rel="icon" href="/preloader.jpeg" />

        <style dangerouslySetInnerHTML={{
          __html: `
            #hard-loader {
              position: fixed;
              inset: 0;
              z-index: 99999;
              background: #162917;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .loader-content {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              opacity: 0;
              animation: fadeIn 0.35s ease-out 0.05s forwards;
            }
            #hard-loader img {
              width: 80%;
              max-width: 500px;
              display: block;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .hard-loader-frame {
              position: fixed;
              inset: 20px;
              border: 1px solid rgba(255,255,255,0.15);
              pointer-events: none;
              z-index: 100000;
              opacity: 0;
              animation: fadeIn 0.25s ease-out forwards;
            }
          `
        }} />

        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              if (localStorage.getItem('hasSeenPreloader')) return;

              var frame = document.createElement('div');
              frame.className = 'hard-loader-frame';

              var loader = document.createElement('div');
              loader.id = 'hard-loader';

              var content = document.createElement('div');
              content.className = 'loader-content';

              var img = document.createElement('img');
              img.src = '/preloader.jpeg';
              img.alt = 'The Health & Wealth Club';

              content.appendChild(img);
              loader.appendChild(content);
              
              document.documentElement.appendChild(frame);
              document.documentElement.appendChild(loader);
              document.documentElement.style.overflow = 'hidden';
            })();
          `
        }} />
      </head>

      <body className="font-manrope smooth-scroll">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "HEALTH & WEALTH CLUB",
              "url": "https://health-wealthclub.com",
              "logo": "https://health-wealthclub.com/logo.png",
              "sameAs": [
                "https://instagram.com/healthwealthclub",
                "https://twitter.com/healthwealthclub"
              ]
            })
          }}
        />
        <CartProvider>
          <UIProvider>
            <SmoothScroll>
              <Preloader />
              <main className="relative">{props.children}</main>
            </SmoothScroll>
          </UIProvider>
        </CartProvider>
      </body>
    </html>
  )
}
