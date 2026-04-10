import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex flex-col w-full min-h-screen relative font-manrope bg-bg" data-testid="account-page">


      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-12 lg:pt-40 lg:pb-20 flex-1">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-16 items-start">
          {/* Sidebar */}
          <div className="w-full lg:w-[280px] shrink-0">
            {customer && <AccountNav customer={customer} />}
          </div>
          
          {/* Content Area */}
          <div className="flex-1 w-full min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
