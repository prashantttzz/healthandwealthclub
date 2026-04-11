import { Metadata } from "next"
import "styles/globals.css"
import { UIProvider } from "@lib/context/ui-context"
import { CartProvider } from "@lib/context/cart-context"
import { Newsreader, Gilda_Display, Petit_Formal_Script, Poppins } from "next/font/google"
import Preloader from "@modules/common/components/preloader"

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
  metadataBase: new URL("http://localhost:8000"),
  title: "HEALTH & WEALTH CLUB",
  description: "A premium health and wealth club experience.",
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
        {/* ✅ Loader styles injected before anything renders */}
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
            #hard-loader img {
              width: 80%;
              max-width: 500px;
              transform: scale(0.8);
            }
            @media (min-width: 768px) {
              #hard-loader img {
                transform: scale(1);
              }
            }
            .hard-loader-frame {
              position: fixed;
              inset: 20px;
              border: 1px solid rgba(255,255,255,0.15);
              pointer-events: none;
              z-index: 100000;
            }
          `
        }} />

        {/* ✅ Runs synchronously before body — zero flicker */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              if (sessionStorage.getItem('hasSeenPreloader')) return;

              var frame = document.createElement('div');
              frame.className = 'hard-loader-frame';

              var loader = document.createElement('div');
              loader.id = 'hard-loader';

              var img = document.createElement('img');
              img.src = '/loader.webp';
              img.alt = 'The Health & Wealth Club';

              loader.appendChild(img);
              document.documentElement.appendChild(frame);
              document.documentElement.appendChild(loader);
              document.documentElement.style.overflow = 'hidden';
            })();
          `
        }} />
      </head>

      <body className="font-manrope">
        <CartProvider>
          <UIProvider>
            {/* ✅ React takes over and removes the hard loader */}
            <Preloader />
            <main className="relative">{props.children}</main>
          </UIProvider>
        </CartProvider>
      </body>
    </html>
  )
}