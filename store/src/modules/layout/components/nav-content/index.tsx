"use client"

import { useEffect, useState, Suspense } from "react"
import { motion } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBasket01Icon, Menu01Icon } from "@hugeicons/core-free-icons"
import MobileMenu from "../mobile-menu"

export default function NavContent({ cartButton }: { cartButton: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY
      const threshold = 200

      if (scrollPos > threshold && !isScrolled) {
        setIsScrolled(true)
      } else if (scrollPos <= threshold && isScrolled) {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isScrolled])

  return (
    <div className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      <motion.header 
        key={isScrolled ? "scrolled" : "top"}
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className={`relative h-16 mx-auto pointer-events-auto transition-colors duration-500 ${
          isScrolled ? "bg-bg shadow-md" : "text-white"
        }`}
      >
        <nav className="content-container flex items-center justify-between w-full h-full text-small-regular px-6 lg:px-20">
          <div className="flex-1 basis-0 flex items-center">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={`lg:hidden p-2 -ml-2 transition-colors duration-300 ${isScrolled ? "text-black" : "text-white"}`} 
              aria-label="Open menu"
            >
              <HugeiconsIcon icon={Menu01Icon} size={24} />
            </button>

            <Link href="/" className="h-full hidden lg:flex items-center">
              <Image 
                src={isScrolled ? "/main-logo.png" : "/main-logo-white.png"}
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
                src={isScrolled ? "/main-logo.png" : "/main-logo-white.png"}
                height={40} 
                width={120} 
                className="h-8 w-auto" 
                alt="main-logo"
              />
            </Link>
            <div className={`hidden lg:flex items-center text-xs gap-x-12 font-semibold ${isScrolled ? "text-black" : "text-white"}`}>
              <Link href="/store" className="font-manrope uppercase tracking-wider ">Collections</Link>
              <Link href="/store" className="font-manrope uppercase tracking-wider ">Editorial</Link>
              <Link href="/store" className="font-manrope uppercase tracking-wider ">Account</Link>
            </div>
          </div>

          <div className={`flex-1 basis-0 flex items-center justify-end ${isScrolled ? "text-black" : "text-white"}`}>
            <Suspense
              fallback={
                <LocalizedClientLink className="relative p-2" href="/cart">
                  <HugeiconsIcon icon={ShoppingBasket01Icon} size={22} />
                </LocalizedClientLink>
              }
            >
              {cartButton}
            </Suspense>
          </div>
        </nav>
      </motion.header>

      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </div>
  )
}
