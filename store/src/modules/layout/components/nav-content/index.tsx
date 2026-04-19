"use client"

import { useEffect, useState, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ShoppingBag01Icon, 
  Menu01Icon, 
  Search01Icon, 
  User02Icon,
  Cancel01Icon
} from "@hugeicons/core-free-icons"
import MobileMenu from "../mobile-menu"
import { clx } from "@medusajs/ui"
import { CONTACT_LINKS, SUPPORT_LINKS } from "@lib/constants"

import { HttpTypes } from "@medusajs/types"

export default function NavContent({ 
  cartButton,
  categories,
  collections
}: { 
  cartButton: React.ReactNode,
  categories: HttpTypes.StoreProductCategory[],
  collections: HttpTypes.StoreCollection[]
}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  
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

  // ✅ Close search on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSearch(false)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/${countryCode}/store?search=${encodeURIComponent(searchValue.trim())}`)
      setShowSearch(false)
      setSearchValue("")
    }
  }

  const showSolid = isScrolled || !isHome || !!hoveredItem

  return (
    <>
    <motion.nav 
      className="fixed top-0 inset-x-0 z-[1000] pointer-events-auto"
      onMouseLeave={() => setHoveredItem(null)}
      animate={{ 
        backgroundColor: showSolid ? "rgba(242, 237, 229, 1)" : "rgba(242, 237, 229, 0)",
        color: showSolid ? "rgba(38, 55, 35, 1)" : "rgba(255, 255, 255, 1)",
        boxShadow: showSolid ? "0 10px 15px -3px rgb(0 0 0 / 0.1)" : "0 0 0 0 rgb(0 0 0 / 0)",
        borderBottomWidth: showSolid ? "1px" : "0px",
      }}
      initial={false}
      transition={{ duration: 0.5 }}
      style={{ borderColor: "rgba(0,0,0,0.05)" }}
    >
      <div className="relative">
        <div className=" mx-auto flex items-center justify-between w-full h-16 px-6 lg:px-10 font-manrope">
          {/* Left: Hamburger & Search (Mobile/Desktop) */}
          <div className="flex-1 basis-0 flex items-center gap-x-2">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 transition-colors duration-300"
              aria-label="Open menu"
            >
              <HugeiconsIcon icon={Menu01Icon} size={24} />
            </button>

            {/* Desktop Logo (Left) */}
            <LocalizedClientLink href="/" className="h-full hidden lg:flex items-center relative w-[150px]">
              <motion.div
                animate={{ opacity: showSolid ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center"
              >
                <Image src="/main-logo.png" height={40} width={150} className="h-10 w-auto" alt="main-logo" priority />
              </motion.div>
              <motion.div
                animate={{ opacity: showSolid ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center"
              >
                <Image src="/main-logo-white.png" height={40} width={150} className="h-10 w-auto" alt="main-logo" priority />
              </motion.div>
            </LocalizedClientLink>

            {/* Mobile Search Trigger */}
            <div className="lg:hidden flex items-center relative">
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 transition-colors duration-300"
              >
                <HugeiconsIcon icon={showSearch ? Cancel01Icon : Search01Icon} size={20} />
              </button>
            </div>
          </div>

          {/* Center: Mobile Logo / Desktop Navigation */}
          <div className="flex items-center justify-center h-full">
            <LocalizedClientLink href="/" className="lg:hidden flex items-center relative w-[120px] h-8">
              <motion.div
                animate={{ opacity: showSolid ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Image src="/main-logo.png" height={40} width={120} className="h-8 w-auto" alt="main-logo" priority />
              </motion.div>
              <motion.div
                animate={{ opacity: showSolid ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Image src="/main-logo-white.png" height={40} width={120} className="h-8 w-auto" alt="main-logo" priority />
              </motion.div>
            </LocalizedClientLink>
            
            <div className="hidden lg:flex items-center h-full text-[12px] gap-x-10 font-semibold tracking-[0.15em] uppercase lg:ml-10  transition-colors font-manrope duration-500">
              <LocalizedClientLink 
                href="/" 
                className="hover:opacity-60 transition-opacity h-full flex items-center px-4"
                onMouseEnter={() => setHoveredItem("home")}
              >
                Home
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/store" 
                className="hover:opacity-60 transition-opacity h-full flex items-center px-4"
                onMouseEnter={() => setHoveredItem("collection")}
              >
                Collection
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/collaborations" 
                className="hover:opacity-60 transition-opacity h-full flex items-center px-4"
                onMouseEnter={() => setHoveredItem("about")}
              >
                Collaborations
              </LocalizedClientLink>
            </div>
          </div>

          {/* Right: Search (Desktop) / User / Cart */}
          <div className="flex-1 basis-0 flex items-center justify-end gap-x-2 md:gap-x-4">
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

            {/* Account */}
            <LocalizedClientLink href="/account" className="p-2 hover:opacity-60 transition-opacity">
              <HugeiconsIcon icon={User02Icon} size={20} />
            </LocalizedClientLink>
          </div>
        </div>

        {/* MEGA MENU Content Area */}
        <AnimatePresence>
          {hoveredItem && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full pointer-events-auto overflow-hidden border-t border-black/[0.03]"
            >
              <div className="max-w-[1440px] mx-auto px-10 py-12 flex gap-20">
                {hoveredItem === "collection" && (
                  <>
                    <div className="flex-1 grid grid-cols-2 gap-10">
                      <div>
                        <h4 className="font-newsreader italic text-3xl text-accent mb-6">Categories</h4>
                        <div className="flex flex-col gap-4">
                          {categories.slice(0, 6).map((cat) => (
                            <LocalizedClientLink 
                              key={cat.id} 
                              href={`/store?category=${cat.handle}`}
                              className="font-manrope text-[11px] font-bold text-accent/40 hover:text-accent tracking-[0.2em] uppercase transition-colors"
                            >
                              {cat.name}
                            </LocalizedClientLink>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-newsreader italic text-3xl text-accent mb-6">Collections</h4>
                        <div className="flex flex-col gap-4">
                          {collections.slice(0, 6).map((col) => (
                            <LocalizedClientLink 
                              key={col.id} 
                              href={`/store?collection=${col.handle}`}
                              className="font-manrope text-[11px] font-bold text-accent/40 hover:text-accent tracking-[0.2em] uppercase transition-colors"
                            >
                              {col.title}
                            </LocalizedClientLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {hoveredItem === "home" && (
                  <div className="flex gap-20 w-full">
                    <div className="flex-1">
                      <h4 className="font-newsreader italic text-4xl text-accent mb-4">Welcome to The Club</h4>
                      <p className="font-manrope text-[13px] text-accent/50 max-w-xl leading-relaxed">
                        Explore the inaugural drop and our seasonal edits. Crafted for the intentional. Join our community of like minded individuals.
                      </p>
                      <div className="mt-8 flex gap-4">
                        <LocalizedClientLink href="/store" className="px-8 py-3 bg-accent text-bg font-manrope text-[10px] uppercase font-bold tracking-widest hover:bg-black transition-colors">Shop Now</LocalizedClientLink>
                        <LocalizedClientLink href="/#about-us" className="px-8 py-3 border border-accent text-accent font-manrope text-[10px] uppercase font-bold tracking-widest hover:bg-accent hover:text-bg transition-colors">Our Story</LocalizedClientLink>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-20 gap-y-10 min-w-[400px]">
                      <div className="flex flex-col gap-4">
                        <h5 className="font-newsreader italic text-2xl text-accent mb-2">The Account</h5>
                        <div className="flex flex-col gap-3 font-manrope text-[11px] font-bold tracking-[0.2em] uppercase text-accent/40">
                          <LocalizedClientLink href="/account" className="hover:text-accent transition-colors">My Account</LocalizedClientLink>
                          <LocalizedClientLink href="/account/orders" className="hover:text-accent transition-colors">Recent Orders</LocalizedClientLink>
                          <LocalizedClientLink href="/account/profile" className="hover:text-accent transition-colors">Profile</LocalizedClientLink>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        <h5 className="font-newsreader italic text-2xl text-accent mb-2">Information</h5>
                        <div className="flex flex-col gap-3 font-manrope text-[11px] font-bold tracking-[0.2em] uppercase text-accent/40">
                          <LocalizedClientLink href={SUPPORT_LINKS.sizeguide} className="hover:text-accent transition-colors">Size Guide</LocalizedClientLink>
                          <LocalizedClientLink href={SUPPORT_LINKS.faqs} className="hover:text-accent transition-colors">FAQs</LocalizedClientLink>
                          <LocalizedClientLink href={SUPPORT_LINKS.terms} className="hover:text-accent transition-colors">Terms & Conditions</LocalizedClientLink>
                          <LocalizedClientLink href={SUPPORT_LINKS.privacy} className="hover:text-accent transition-colors">Privacy Policy</LocalizedClientLink>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {hoveredItem === "about" && (
                  <div className="flex gap-20">
                    <div className="flex-1">
                      <h4 className="font-newsreader italic text-4xl text-accent mb-4">Beyond the Label</h4>
                      <p className="font-manrope text-[13px] text-accent/50 max-w-xl leading-relaxed">
                        We believe in a life of balance. Our mission is to provide the tools for a healthier body and a wealthier mind.
                      </p>
                      {/* <div className="grid grid-cols-2 gap-8 text-[11px] font-bold tracking-[0.25em] uppercase font-manrope text-accent/40 mt-10">
                        <LocalizedClientLink href="/#about-us" className="hover:text-accent transition-colors underline underline-offset-8">Our Vision</LocalizedClientLink>
                        <LocalizedClientLink href="/#about-us" className="hover:text-accent transition-colors underline underline-offset-8">Sustainability</LocalizedClientLink>
                        <LocalizedClientLink href="/collaborations" className="hover:text-accent transition-colors underline underline-offset-8">Working with us</LocalizedClientLink>
                      </div> */}
                    </div>
                    <div className="w-[400px] flex flex-col gap-4">
                      <div className="relative aspect-[16/9] overflow-hidden group">
                        <Image 
                          src="/footer.png" 
                          alt="Featured" 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="font-newsreader italic text-2xl text-white">
                            <Link href={CONTACT_LINKS.instagram}>Join The Club</Link></span>
                        </div>
                      </div>
                      <p className="font-manrope text-[11px] text-accent/40 leading-relaxed tracking-wider">
                        Elevate your lifestyle with our curated selection of essentials. Experience the fusion of health and wealth.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.nav>
    <MobileMenu 
      isOpen={isMenuOpen} 
      onClose={() => setIsMenuOpen(false)} 
    />
    </>
  )
}
