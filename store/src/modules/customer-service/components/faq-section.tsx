"use client"

import { ChevronDown } from "lucide-react"

const FAQ_ITEMS = [
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 100 countries worldwide. International shipping times and costs vary depending on the destination. You can calculate your exact shipping costs during checkout before finalizing your purchase.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return window for all standard products. Items must be unworn, undamaged, and strictly in their original packaging. Final sale or customized items cannot be returned. To start a return, visit your Account dashboard.",
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is processed, you'll receive a tracking email. You can also view real-time tracking information by logging into your account and clicking on the 'My Orders' tab.",
  },
  {
    question: "Are your products authentic?",
    answer: "Absolutely. All items available in the Health and Wealth Club are 100% authentic, sourced directly from manufacturers or certified premier distributors.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. All transactions are securely encrypted.",
  }
]

export default function FAQSection() {
  return (
    <div className="w-full flex flex-col gap-10 text-accent font-manrope">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-newsreader italic tracking-tight">Frequently Asked Questions</h2>
        <p className="text-[13px] text-accent/60">Find quick answers to our most common shopping inquiries.</p>
      </div>

      <div className="flex flex-col border-t border-accent/10">
        {FAQ_ITEMS.map((item, index) => (
          <details key={index} className="group border-b border-accent/10">
            <summary className="flex items-center justify-between py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="font-bold text-[15px] pr-8">{item.question}</span>
              <span className="shrink-0 transition-transform duration-300 group-open:rotate-180">
                <ChevronDown size={20} className="text-accent/60" />
              </span>
            </summary>
            <div className="pb-6 text-accent/70 text-[14px] leading-relaxed pr-8">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
