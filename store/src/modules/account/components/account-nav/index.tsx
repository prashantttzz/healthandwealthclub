"use client"

import { clx } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Logout01Icon, 
  UserCircleIcon, 
  ShoppingBag01Icon, 
  Location01Icon, 
  CreditCardIcon, 
  Settings01Icon 
} from "@hugeicons/core-free-icons"

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
    <div className="w-full flex flex-col gap-2 font-manrope pr-0 lg:pr-12 pt-10">
      <AccountNavLink href="/account/profile" route={route} label="Personal Information" icon={<HugeiconsIcon icon={UserCircleIcon} size={16} />} />
      <AccountNavLink href="/account/orders" route={route} label="My Orders" icon={<HugeiconsIcon icon={ShoppingBag01Icon} size={16} />} />
      <AccountNavLink href="/account/addresses" route={route} label="Manage Address" icon={<HugeiconsIcon icon={Location01Icon} size={16} />} />
      <AccountNavLink href="/account/payment-methods" route={route} label="Payment Method" icon={<HugeiconsIcon icon={CreditCardIcon} size={16} />} />
      <AccountNavLink href="/account/password" route={route} label="Password Manager" icon={<HugeiconsIcon icon={Settings01Icon} size={16} />} />
      
      <button
        type="button"
        onClick={handleLogout}
        className="w-full flex items-center gap-4 px-6 py-4 mt-6 border border-accent/10 bg-transparent hover:bg-accent hover:text-bg transition-all duration-300 text-[12px] font-bold text-accent uppercase tracking-[0.2em] group"
      >
        <HugeiconsIcon icon={Logout01Icon} size={16} className="text-accent/40 group-hover:text-bg transition-colors" />
        Logout
      </button>
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

  const pathSuffix = route.split(countryCode)[1]
  const isProfileActive = label === "Personal Information" && (pathSuffix === "/account" || pathSuffix === "/account/profile")
  const isGenericActive = pathSuffix === href
  const active = isProfileActive || isGenericActive

  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 text-[12px] font-bold uppercase tracking-[0.2em] group border",
        {
          "bg-accent text-bg border-accent shadow-lg shadow-accent/10": active,
          "bg-transparent text-accent/60 border-transparent hover:border-accent/10 hover:bg-accent/5 hover:text-accent": !active,
        }
      )}
    >
      <div className={clx("transition-colors duration-300", {
        "text-bg": active,
        "text-accent/30 group-hover:text-accent": !active
      })}>
        {icon}
      </div>
      {label}
    </LocalizedClientLink>
  )
}

export default AccountNav
