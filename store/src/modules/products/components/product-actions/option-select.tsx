import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  availableValues?: string[]
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
  availableValues = [],
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between">
        <span className="font-manrope text-[10px] tracking-[0.3em] uppercase font-bold text-accent/40">
          Select {title}
        </span>
      </div>
      <div
        className="flex flex-wrap gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          const isColor = title.toLowerCase() === "color"
          const isSelected = v === current
          const isAvailable = availableValues.includes(v)

          if (isColor) {
            const colorMap: Record<string, string> = {
              olive: "#2C3A2C",
              cream: "#F8F6F1",
              white: "#FFFFFF",
              black: "#1a1a1a",
              tan: "#D2B48C",
              navy: "#1a1f2c",
            }
            const colorHex = colorMap[v.toLowerCase()] || "#cccccc"

            return (
              <button
                onClick={() => updateOption(option.id, v)}
                key={v}
                className={clx(
                  "w-8 h-8 rounded-full border transition-all duration-300 relative flex items-center justify-center overflow-hidden",
                  {
                    "border-accent scale-110": isSelected,
                    "border-black/5 hover:border-accent/40": !isSelected,
                    "opacity-50 cursor-not-allowed grayscale-[0.5]": !isAvailable,
                  }
                )}
                disabled={disabled || (!isAvailable && !isSelected)}
                title={v + (!isAvailable ? " (Out of Stock)" : "")}
              >
                <div 
                  className="w-6 h-6 rounded-full border border-black/5 shadow-inner"
                  style={{ backgroundColor: colorHex }}
                />
                {!isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center p-0.5 pointer-events-none">
                    <div className="w-full h-[1px] bg-accent/30 rotate-45" />
                  </div>
                )}
              </button>
            )
          }

          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "border px-6 py-2.5 min-w-[60px] text-[12px] font-manrope tracking-wider uppercase transition-all duration-300 relative overflow-hidden",
                {
                  "border-accent bg-accent text-bg": isSelected,
                  "border-black/5 text-accent/60 hover:border-accent/20": !isSelected,
                  "opacity-30 cursor-not-allowed grayscale": !isAvailable,
                }
              )}
              disabled={disabled || (!isAvailable && !isSelected)}
              data-testid="option-button"
            >
              <span className={clx({ "line-through opacity-30": !isAvailable })}>{v}</span>
              {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                   <div className="w-[120%] h-[1px] bg-accent rotate-[20deg]" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
