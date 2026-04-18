"use client"

import { useEffect, useState, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ShoppingBag01Icon, 
  Menu01Icon, 
  Search01Icon, 
  User02Icon,
  Cancel01Icon
} from "@hugeicons/core-free-icons"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MobileMenu from "./components/mobile-menu"

export default function NavContent({ cartButton }: { cartButton: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  
  const pathname = usePathname()
  const router = useRouter()

  // Extract country code from pathname for redirects
  const countryCode = pathname.split('/')[1] || "us"

  const isHome = pathname.split('/').filter(Boolean).length <= 1

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY
      const threshold = 100

      if (scrollPos > threshold && !isScrolled) {
        setIsScrolled(true)
      } else if (scrollPos <= threshold && isScrolled) {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isScrolled])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/${countryCode}/store?search=${encodeURIComponent(searchValue.trim())}`)
      setShowSearch(false)
      setSearchValue("")
    }
  }

  const showSolid = isScrolled || !isHome

  return (
    <div className="fixed top-0 inset-x-0 z-[1000] pointer-events-none">
      <motion.header 
        key={showSolid ? "scrolled" : "top"}
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className={clx(
          "relative h-16 mx-auto pointer-events-auto transition-all duration-500",
          showSolid ? "bg-bg shadow-md" : "text-white"
        )}
      >
        <nav className="max-w-[1440px] mx-auto flex items-center justify-between w-full h-full px-6 lg:px-10">
          {/* Left: Hamburger & Search (Mobile/Desktop) */}
          <div className="flex-1 basis-0 flex items-center gap-x-2">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={clx(
                "lg:hidden p-2 -ml-2 transition-colors duration-300",
                showSolid ? "text-accent" : "text-white"
              )} 
              aria-label="Open menu"
            >
              <HugeiconsIcon icon={Menu01Icon} size={24} />
            </button>

            {/* Desktop Logo (Left) */}
            <LocalizedClientLink href="/" className="h-full hidden lg:flex items-center">
              <Image 
                src={showSolid ? "/main-logo.png" : "/main-logo-white.png"}
                height={40} 
                width={150} 
                className="h-10 w-auto" 
                style={{ height: 'auto' }}
                alt="main-logo"
                priority
              />
            </LocalizedClientLink>

            {/* Mobile Search Trigger */}
            <div className="lg:hidden flex items-center relative">
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className={clx(
                  "p-2 transition-colors duration-300",
                  showSolid ? "text-accent" : "text-white"
                )}
              >
                <HugeiconsIcon icon={showSearch ? Cancel01Icon : Search01Icon} size={20} />
              </button>
            </div>
          </div>

          {/* Center: Mobile Logo / Desktop Navigation */}
          <div className="flex items-center justify-center h-full">
            <LocalizedClientLink href="/" className="lg:hidden flex items-center">
              <Image 
                src={showSolid ? "/main-logo.png" : "/main-logo-white.png"}
                height={40} 
                width={120} 
                className="h-8 w-auto" 
                style={{ height: 'auto' }}
                alt="main-logo"
                priority
              />
            </LocalizedClientLink>
            
            <div className={clx(
              "hidden lg:flex items-center text-[12px] gap-x-10 font-semibold tracking-[0.1em] uppercase transition-colors font-manrope duration-500",
              showSolid ? "text-accent" : "text-white"
            )}>
              <LocalizedClientLink href="/" className="hover:opacity-60 transition-opacity">Home</LocalizedClientLink>
              <LocalizedClientLink href="/store" className="hover:opacity-60 transition-opacity">Collection</LocalizedClientLink>
              <LocalizedClientLink href="/collabrations" className="hover:opacity-60 transition-opacity">Collabrations</LocalizedClientLink>
            </div>
          </div>

          {/* Right: Search (Desktop) / User / Cart */}
          <div className={clx(
            "flex-1 basis-0 flex items-center justify-end gap-x-2 md:gap-x-4",
            showSolid ? "text-accent" : "text-white"
          )}>
            {/* Search (Desktop Only) */}
            <div className="hidden lg:flex relative items-center">
              <AnimatePresence>
                {showSearch ? (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearchSubmit}
                    className="absolute right-10 flex items-center bg-bg/10 backdrop-blur-md rounded-full px-4 py-2 border border-current/20"
                  >
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Search Experience..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="bg-transparent border-none outline-none text-[10px] w-full font-manrope placeholder:text-current/30 italic"
                    />
                  </motion.form>
                ) : null}
              </AnimatePresence>
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:opacity-60 transition-opacity"
              >
                <HugeiconsIcon icon={showSearch ? Cancel01Icon : Search01Icon} size={20} />
              </button>
            </div>

            {/* Mobile Search Box Overlay */}
            <AnimatePresence>
              {showSearch && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="lg:hidden fixed inset-x-0 top-16 bg-bg border-b border-black/5 p-4 z-50 pointer-events-auto"
                >
                  <form onSubmit={handleSearchSubmit} className="flex items-center gap-4 bg-black/5 rounded-full px-4 py-3">
                    <HugeiconsIcon icon={Search01Icon} size={18} className="text-accent/40" />
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Search..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs w-full text-accent placeholder:text-accent/30 italic  tracking-widest"
                    />
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Account */}
            <LocalizedClientLink href="/account" className="p-2 hover:opacity-60 transition-opacity">
              <HugeiconsIcon icon={User02Icon} size={20} />
            </LocalizedClientLink>

            {/* Cart */}
            <Suspense
              fallback={
                <div className="relative p-2 ">
                  <HugeiconsIcon icon={ShoppingBag01Icon} size={20} />
                </div>
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
