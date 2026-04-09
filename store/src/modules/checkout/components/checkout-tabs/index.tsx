"use client"

import { clx } from "@medusajs/ui"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

const CheckoutTabs = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const step = searchParams.get("step") || "address"

  const tabs = [
    { id: "shipping", label: "Shipping", steps: ["address", "delivery"], num: "01" },
    { id: "payment", label: "Payment", steps: ["payment"], num: "02" },
    { id: "summary", label: "Summary", steps: ["review"], num: "03" },
  ]

  const activeTab = tabs.find(t => t.steps.includes(step)) || tabs[0]

  const handleTabClick = (tabId: string) => {
    // For now, only allow clicking if the user is already on a step in that tab
    // or if we want to allow going back.
    // Let's map tab clicks to the first step of that tab.
    const targetTab = tabs.find(t => t.id === tabId)
    if (targetTab) {
       router.push(`${pathname}?step=${targetTab.steps[0]}`, { scroll: false })
    }
  }

  return (
    <div className="w-full border-b border-black/5 mb-14">
      <div className="flex flex-row items-center justify-between max-w-[700px] mx-auto pb-6 relative">
        {tabs.map((tab, index) => {
          const isActive = activeTab.id === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={clx(
                "relative flex items-center gap-4 transition-all duration-500",
                {
                  "opacity-100": isActive,
                  "opacity-20 hover:opacity-100": !isActive,
                }
              )}
            >
              <span className={clx(
                "font-newsreader italic text-3xl",
                {
                  "text-accent": isActive,
                  "text-accent/60": !isActive,
                }
              )}>
                {tab.num}
              </span>
              <span className={clx(
                "font-manrope text-[12px] uppercase font-bold tracking-[0.3em]",
                {
                  "text-accent": isActive,
                  "text-accent/60": !isActive,
                }
              )}>
                {tab.label}
              </span>
              
              {isActive && (
                 <div className="absolute -bottom-[25px] left-0 right-0 h-[2px] bg-accent" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CheckoutTabs
