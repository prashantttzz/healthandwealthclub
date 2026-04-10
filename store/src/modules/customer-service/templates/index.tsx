"use client"

import { useState } from "react"
import { clx } from "@medusajs/ui"
import FAQSection from "../components/faq-section"
import ContactSection from "../components/contact-section"
import LegalSection from "../components/legal-section"

type SupportTab = "faq" | "contact" | "privacy" | "terms"

export default function CustomerServiceTemplate() {
  const [activeTab, setActiveTab] = useState<SupportTab>("faq")

  const tabs: { id: SupportTab; label: string }[] = [
    { id: "faq", label: "FAQ & Support" },
    { id: "contact", label: "Contact Us" },
    { id: "privacy", label: "Privacy Policy" },
    { id: "terms", label: "Terms of Use" },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "faq": return <FAQSection />
      case "contact": return <ContactSection />
      case "privacy": return <LegalSection type="privacy" />
      case "terms": return <LegalSection type="terms" />
      default: return <FAQSection />
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen relative font-manrope bg-bg" data-testid="customer-service-page">

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-12 lg:pt-40 lg:pb-20 flex-1">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-16 items-start">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-[280px] shrink-0 sticky top-24">
            <h3 className="text-base font-bold text-accent mb-6 tracking-wide">Help Center</h3>
            <div className="w-full flex flex-col gap-3 font-manrope">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clx(
                    "w-full text-left px-8 py-5 transition-all text-[15px] font-bold tracking-wide",
                    {
                      "bg-accent text-bg border border-accent": activeTab === tab.id,
                      "bg-transparent text-accent border border-black/10 hover:border-black/30 hover:bg-accent/5": activeTab !== tab.id,
                    }
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 w-full min-w-0">
            {renderContent()}
          </div>
          
        </div>
      </div>
    </div>
  )
}
