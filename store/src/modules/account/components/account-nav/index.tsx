"use client"

import { clx } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { motion } from "framer-motion"
import { signout } from "@lib/data/customer"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Logout01Icon, 
  UserCircleIcon, 
  ShoppingBag01Icon, 
  Location01Icon, 
  CreditCardIcon, 
  Settings01Icon, 
  Clock01Icon
} from "@hugeicons/core-free-icons"
import { useEffect, useRef } from "react"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div className="w-full mt-20  flex lg:flex-col font-manrope px-6 lg:px-10  py- relative overflow-hidden bg-accent lg:bg-transparent sticky top-0 z-[100] lg:static">
      <div className="hidden lg:flex flex-col gap-2 pb-10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-[9px] uppercase font-bold tracking-[0.5em] text-bg/40">Member Portal</span>
        </div>  
      </div>

      <div className="flex flex-row lg:flex-col gap-1 w-full flex-1 overflow-x-auto no-scrollbar snap-x snap-mandatory lg:snap-none">
        <AccountNavLink href="/account" route={route} label="Account Overview" icon={<HugeiconsIcon icon={Clock01Icon} size={16} />} />
        <AccountNavLink href="/account/profile" route={route} label="Profile Details" icon={<HugeiconsIcon icon={UserCircleIcon} size={16} />} />
        <AccountNavLink href="/account/orders" route={route} label="Dossier & Orders" icon={<HugeiconsIcon icon={ShoppingBag01Icon} size={16} />} />
        <AccountNavLink href="/account/addresses" route={route} label="Address Book" icon={<HugeiconsIcon icon={Location01Icon} size={16} />} />
      </div>
      
      {/* Brand Signature - Desktop Only */}
      <div className="hidden lg:flex py-12 mt-auto">
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex items-center gap-4 text-[10px] font-bold text-bg/50 uppercase tracking-[0.3em] hover:text-bg transition-colors"
          >
            <HugeiconsIcon icon={Logout01Icon} size={16} className="text-bg/20 group-hover:text-bg transition-colors" />
            Sign Out of Account
          </button>
          
          <div className="pt-12 text-bg text-[10px] font-newsreader italic tracking-widest opacity-15">
            HEALTH & WEALTH CLUB EST. 2024
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  label: string
  icon?: React.ReactNode
}

const AccountNavLink = ({
  href,
  route,
  label,
  icon
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const pathPrefix = `/${countryCode}`
  const pathSuffix = route.startsWith(pathPrefix) 
    ? route.replace(pathPrefix, "") 
    : route
  
  // Normalize empty path to root account path
  const currentPath = pathSuffix || "/account"
  
  const isOverview = label === "Account Overview" && (currentPath === "/account" || currentPath === "/account/")
  
  const isProfile = (label === "Profile Details" || label === "Personal Information") && currentPath.startsWith("/account/profile")
  
  const isGeneric = currentPath === href || (href !== "/account" && currentPath.startsWith(href))
  
  const active = isOverview || isProfile || isGeneric

  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (active && ref.current && window.innerWidth < 1024) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }
  }, [active])

  return (
    <LocalizedClientLink
      href={href}
      ref={ref}
      className={clx(
        "flex-none lg:w-full flex items-center gap-3 lg:gap-5 px-4 lg:px-6 py-4 lg:py-5 transition-all duration-500 text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.25em] group relative overflow-hidden shrink-0 snap-center lg:snap-start",
        {
          "text-bg bg-bg/[0.03] lg:bg-bg/[0.05]": active,
          "text-bg/30 lg:text-bg/40 hover:text-bg lg:hover:translate-x-1": !active,
        }
      )}
    >
      {/* Active Architectural Indicator - Vertical (Desktop) */}
      {active && (
        <motion.div 
          layoutId="sidebar-active"
          className="hidden lg:block absolute left-0 top-3 bottom-3 w-[2px] bg-bg shadow-[0_0_15px_rgba(255,246,236,0.3)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      {/* Active Indicator - Horizontal (Mobile) */}
      {active && (
        <motion.div 
          layoutId="sidebar-active-mob"
          className="lg:hidden absolute bottom-0 left-4 right-4 h-[1px] bg-bg shadow-[0_0_10px_rgba(255,246,236,0.5)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      <div className={clx("transition-all duration-500", {
        "text-bg scale-110": active,
        "text-bg/10 lg:text-bg/20 group-hover:text-bg group-hover:scale-110": !active
      })}>
        {icon}
      </div>
      <span className="relative z-10 whitespace-nowrap">{label}</span>
      
      {/* Hover Arrow Reveal - Desktop Only */}
      <div className={clx("ml-auto hidden lg:flex transition-all duration-500", active ? "opacity-30" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0")}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </LocalizedClientLink>
  )
}

export default AccountNav
