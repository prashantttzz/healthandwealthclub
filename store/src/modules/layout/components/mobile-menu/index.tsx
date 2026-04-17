"use client"

import { motion, AnimatePresence } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Instagram, 
  Mail, 
  WhatsappFreeIcons, 
  Cancel01Icon 
} from "@hugeicons/core-free-icons"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Text, clx } from "@medusajs/ui"
import Image from "next/image"
import ReactCountryFlag from "react-country-flag"
import { useRegion } from "@lib/context/region-context"
import { CONTACT_LINKS } from "@lib/constants"
import TikTokIcon from "@modules/common/icons/tiktok"

const menuVariants = {
  closed: {
    x: "-100%",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as any
    }
  },
  open: {
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as any
    }
  }
}

const itemVariants = {
  closed: { opacity: 0, y: 30 },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.4 + i * 0.15,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as any
    }
  })
}

const MENU_LINKS = [
  { name: "HOME", href: "/" },
  { name: "COLLECTIONS", href: "/store" },
  { name: "ABOUT US", href: "/#about-us" },
  { name: "COLLABORATIONS", href: "/collaborations" },
]

export default function MobileMenu({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean 
  onClose: () => void 
}) {
  const pathname = usePathname()
  const { region, countryCode } = useRegion()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm pointer-events-auto"
          />

          {/* Sidebar */}
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-y-0 left-0 z-[1000] w-[80vw] bg-bg shadow-2xl pointer-events-auto flex flex-col h-[100dvh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-black/5">
              <a 
                href={CONTACT_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0"
              >
                <Image className="" src={"/main-logo.png"} alt="logo" height={150} width={150}/>
              </a>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 text-accent hover:rotate-90 transition-transform duration-300"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={24} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 px-8 py-16 flex flex-col justify-between">
              <ul className="space-y-10">
                {MENU_LINKS.map((link, i) => {
                  // Handle localized pathnames (e.g. /us/store)
                  const strippedPathname = pathname?.replace(/^\/[a-z]{2}(\/|$)/, "/") || "/"
                  const isActive = strippedPathname === link.href || (link.href !== "/" && strippedPathname?.startsWith(link.href))
                  
                  return (
                    <motion.li
                      key={link.name}
                      custom={i}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                    >
                      <LocalizedClientLink
                        href={link.href}
                        onClick={onClose}
                        className={clx(
                          "font-newsreader italic text-2xl text-accent transition-all block relative w-fit ",
                          isActive ? "opacity-100 " : "text-black/40"
                        )}
                      >
                        {link.name}
                        {isActive && (
                          <motion.div 
                            layoutId="mobile-active-underline"
                            className="absolute -bottom-1 left-0 right-0 h-[1px] bg-accent"
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          />
                        )}
                      </LocalizedClientLink>
                    </motion.li>
                  )
                })}
              </ul>

              {/* Bottom Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-4 mt-8">
                  <p className="font-manrope text-[10px] tracking-[0.4em] uppercase font-bold text-accent/30">
                    Connect With Us
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-6">
                      {[
                        { icon: Instagram, href: CONTACT_LINKS.tiktok, isTikTok: true },
                        { icon: Instagram, href: CONTACT_LINKS.instagram },
                        { icon: WhatsappFreeIcons, href: CONTACT_LINKS.whatsapp },
                        { icon: Mail, href: CONTACT_LINKS.email }
                      ].map((social, i) => (
                        <a 
                          key={i}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent hover:opacity-60 transition-opacity duration-300"
                        >
                          {social.isTikTok ? (
                            <TikTokIcon className="w-5 h-5" />
                          ) : (
                            <HugeiconsIcon icon={social.icon} size={20} />
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-black/5">
                  <p className="font-manrope text-[10px] tracking-[0.4em] uppercase font-bold text-accent/30 mb-4">
                    Shipping to
                  </p>
                  <div className="flex items-center gap-x-2">
                    <ReactCountryFlag
                      svg
                      style={{
                        width: "18px",
                        height: "18px",
                      }}
                      countryCode={countryCode}
                    />
                    <Text className="text-accent font-medium uppercase text-sm">
                      {region?.countries?.find(c => c.iso_2 === countryCode)?.display_name} — {region?.currency_code?.toUpperCase()}
                    </Text>
                  </div>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
