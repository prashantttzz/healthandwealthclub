export const getColorHex = (color: string): string => {
  const colorMap: Record<string, string> = {
    olive: "#3E4437",
    black: "#1a1a1a",
    cream: "#E8E4D9",
    white: "#FFFFFF",
    tan: "#C4A484",
    navy: "#1a1f2c",
    "dark olive": "#2C3A2C",
    "soft cream": "#F8F6F1",
  }

  return colorMap[color.toLowerCase()] || "#cccccc"
}
