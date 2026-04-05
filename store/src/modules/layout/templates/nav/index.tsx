import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import Image from "next/image"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBasket01Icon, Menu01Icon } from "@hugeicons/core-free-icons";

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="fixed top-0 inset-x-0 z-50 group">
      <header className="relative h-16 glass mx-auto border-b duration-200 border-ui-border-base">
        <nav className="content-container flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 flex items-center">
            <button className="lg:hidden p-2 -ml-2" aria-label="Open menu">
              <HugeiconsIcon icon={Menu01Icon} size={24} />
            </button>

            <Link href="/" className="h-full hidden lg:flex items-center">
              <Image 
                src="/main-logo.png" 
                height={40} 
                width={150} 
                className="h-10 w-auto" 
                alt="main-logo"
                priority
              />
            </Link>
          </div>
          <div className="flex items-center justify-center h-full">
            <Link href="/" className="lg:hidden flex items-center">
              <Image 
                src="/main-logo.png" 
                height={40} 
                width={120} 
                className="h-8 w-auto" 
                alt="main-logo"
              />
            </Link>
            <div className="hidden lg:flex items-center gap-x-12">
              <Link href="/store" className="text-text font-manrope uppercase font-medium tracking-wider text-xs">Collections</Link>
              <Link href="/store" className="text-text font-manrope uppercase font-medium tracking-wider text-xs">Editorial</Link>
              <Link href="/store" className="text-text font-manrope uppercase font-medium tracking-wider text-xs">Account</Link>
            </div>
          </div>
          <div className="flex-1 basis-0 flex items-center justify-end">
            <Suspense
              fallback={
                <LocalizedClientLink className="relative p-2" href="/cart">
                  <HugeiconsIcon icon={ShoppingBasket01Icon} size={22} />
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>

        </nav>
      </header>
    </div>
  )
}