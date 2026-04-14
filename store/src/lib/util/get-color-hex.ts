// @ts-ignore
import colornames from "colornames"

export const getColorHex = (color: string): string => {
  // Priority Brand Overrides - These ensure the specific Health & Wealth aesthetic
  const brandColors: Record<string, string> = {
    olive: "#3E4437",
    black: "#1a1a1a",
    cream: "#E8E4D9",
    white: "#FFFFFF",
    tan: "#C4A484",
    navy: "#1a1f2c",
    "dark olive": "#2C3A2C",
    "soft cream": "#F8F6F1",
    bone: "#F2EDE5",
  }

  const normalized = color.toLowerCase().trim()
  
  // 1. Check brand map first (overrides)
  if (brandColors[normalized]) {
    return brandColors[normalized]
  }

  // 2. Use NPM package for all standard CSS colors (Red, Blue, etc.)
  try {
    const hex = colornames(normalized)
    if (hex) return hex
  } catch (e) {
    // Silent fail if colornames has issues
  }

  return "#cccccc"
}
