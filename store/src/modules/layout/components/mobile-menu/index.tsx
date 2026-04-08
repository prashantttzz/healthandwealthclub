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
import Image from "next/image"

const menuVariants = {
  closed: {
    x: "100%",
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as any
    }
  },
  open: {
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as any
    }
  }
}

const itemVariants = {
  closed: { opacity: 0, y: 20 },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.1,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as any
    }
  })
}

const MENU_LINKS = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/store" },
  { name: "Editorial", href: "/store" }, // Assuming editorial is part of store/blog
  { name: "Account", href: "/account" },
]

export default function MobileMenu({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean 
  onClose: () => void 
}) {
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
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm pointer-events-auto"
          />

          {/* Sidebar */}
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-y-0 right-0 z-[101] w-full max-w-sm bg-bg shadow-2xl pointer-events-auto flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-black/5">
              <span className="font-newsreader italic text-xl">The Club</span>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 text-accent hover:rotate-90 transition-transform duration-300"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={24} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 px-8 py-12 flex flex-col justify-between">
              <ul className="space-y-8">
                {MENU_LINKS.map((link, i) => (
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
                      className="font-newsreader italic text-4xl hover:opacity-60 transition-opacity block"
                    >
                      {link.name}
                    </LocalizedClientLink>
                  </motion.li>
                ))}
              </ul>

              {/* Bottom Details */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <p className="font-manrope text-[10px] tracking-[0.4em] uppercase font-bold text-accent/30">
                    Connect With Us
                  </p>
                  <div className="flex gap-4">
                    {[
                      { icon: Instagram, href: "#" },
                      { icon: WhatsappFreeIcons, href: "#" },
                      { icon: Mail, href: "mailto:contact@healthandwealth.club" }
                    ].map((social, i) => (
                      <a 
                        key={i}
                        href={social.href}
                        className="w-10 h-10 flex items-center justify-center border border-black/5 rounded-full hover:bg-accent hover:text-bg transition-colors duration-300"
                      >
                        <HugeiconsIcon icon={social.icon} size={18} />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-black/5">
                  <p className="font-manrope text-[10px] tracking-[0.2em] uppercase text-accent/20">
                    © 2026 THE HEALTH & WEALTH CLUB
                  </p>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
