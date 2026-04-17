import React from "react"
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


      <div className="w-full mx-auto flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row gap-0 items-start">
          {/* Sidebar — sticky */}
          {customer && (
            <div className="w-full lg:w-[320px] shrink-0 bg-accent lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
              <AccountNav customer={customer} />
            </div>
          )}
          
          {/* Content Area */}
          <div className={`flex-1 w-full min-w-0 px-6 md:px-12 lg:px-16 py-12 lg:py-20 ${!customer ? "flex justify-center items-center h-full" : ""}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
