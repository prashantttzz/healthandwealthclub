import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Gilda_Display, Manrope, Newsreader, Petit_Formal_Script } from 'next/font/google';
import "styles/globals.css"


const gilda = Gilda_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-gilda',
});

// 2. Manrope (Variable font)
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

// 3. Newsreader (Variable font)
const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

const petitFormal = Petit_Formal_Script({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-petit',
});
export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={`${gilda.variable} ${manrope.variable} ${newsreader.variable} ${petitFormal.variable}`}>
      <body className="relative" suppressHydrationWarning>
        <main>{props.children}</main>
      </body>
    </html>
  )
}
