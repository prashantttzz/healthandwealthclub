import { Metadata } from "next"
import "styles/globals.css"
import { UIProvider } from "@lib/context/ui-context"
import { CartProvider } from "@lib/context/cart-context"
import { Newsreader, Gilda_Display, Petit_Formal_Script, Poppins } from "next/font/google"

const manrope = Poppins({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
}) 

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
})

const gilda = Gilda_Display({
  subsets: ["latin"],
  variable: "--font-gilda",
  weight: ["400"],
})

const petit = Petit_Formal_Script({
  subsets: ["latin"],
  variable: "--font-petit",
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
    >
      <body className="font-manrope">
        <CartProvider>
          <UIProvider>
            <main className="relative">{props.children}</main>
          </UIProvider>
        </CartProvider>
      </body>
    </html>
  )
}
