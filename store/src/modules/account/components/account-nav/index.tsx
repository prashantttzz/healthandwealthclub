"use client"

import { clx } from "@medusajs/ui"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"

import ChevronDown from "@modules/common/icons/chevron-down"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

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
    <div className="w-full flex flex-col gap-3 font-manrope">
      <AccountNavLink href="/account/profile" route={route} label="Personal Information" />
      <AccountNavLink href="/account/orders" route={route} label="My Orders" />
      <AccountNavLink href="/account/addresses" route={route} label="Manage Address" />
      <AccountNavLink href="/account/payment-methods" route={route} label="Payment Method" />
      <AccountNavLink href="/account/password" route={route} label="Password Manager" />
      <button
        type="button"
        onClick={handleLogout}
        className="w-full text-left px-8 py-5 border border-black/10 bg-transparent hover:bg-accent/5 transition-all text-[15px] font-bold text-accent tracking-wide"
      >
        Logout
      </button>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  label: string
}

const AccountNavLink = ({
  href,
  route,
  label,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const pathSuffix = route.split(countryCode)[1]
  // Because /account redirects to /account/profile or is the base, let's treat /account/profile as the active profile page
  const isProfileActive = label === "Personal Information" && (pathSuffix === "/account" || pathSuffix === "/account/profile")
  const isGenericActive = pathSuffix === href
  const active = isProfileActive || isGenericActive

  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "w-full block px-8 py-5 transition-all text-[15px] font-bold tracking-wide",
        {
          "bg-accent text-bg border border-accent": active,
          "bg-transparent text-accent border border-black/10 hover:border-black/30 hover:bg-accent/5": !active,
        }
      )}
    >
      {label}
    </LocalizedClientLink>
  )
}

export default AccountNav
