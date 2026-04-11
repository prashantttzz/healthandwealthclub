"use client"

import React from "react"
import { Check } from "lucide-react"

const StepIndicator = ({ currentStep, onStepClick }: { currentStep: number; onStepClick: (s: number) => void }) => {
  const steps = ["Bag", "Address", "Payment"]

  return (
    <div className="flex items-center justify-between gap-0 mb-16 select-none max-w-[400px] md:max-w-[500px] mx-auto lg:mx-0 w-full relative">
      <div className="absolute top-[18px] left-10 right-10 h-[1.5px] bg-accent/10 -z-0" />
      <div 
        className="absolute top-[18px] left-10 h-[1.5px] bg-accent transition-all duration-1000 -z-0" 
        style={{ width: currentStep === 0 ? "0%" : currentStep === 1 ? "42%" : "83%" }}
      />
      {steps.map((label, idx) => {
        const done = idx < currentStep, active = idx === currentStep, future = idx > currentStep
        const status = done ? "Completed" : active ? "In Progress" : "Pending"
        return (
          <button
            key={label}
            onClick={() => done && onStepClick(idx)}
            disabled={future}
            className="flex flex-col items-center gap-4 relative z-10 group"
          >
            <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${done ? "border-accent bg-secondary shadow-sm" : active ? "border-accent bg-bg shadow-inner scale-105" : "border-accent/10 bg-bg"}`}>
              {done ? <Check className="w-5 h-5 text-accent" strokeWidth={3} /> : <span className={`font-manrope text-[11px] font-bold ${active ? "text-accent" : "text-accent/80"}`}>{idx + 1}</span>}
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className={`font-newsreader text-[13px] font-bold tracking-tight ${active || done ? "text-accent" : "text-accent/30"}`}>{label}</span>
              <span className={`font-manrope text-[8px] uppercase font-bold tracking-[0.15em] px-2.5 py-1 rounded-full mt-1.5 ${done ? "bg-accent/5 text-accent" : active ? "bg-accent/10 text-accent" : "bg-black/[0.02] text-black/10"}`}>{status}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default StepIndicator
