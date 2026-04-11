"use client"

import { useEffect } from "react"

export default function Preloader() {
  useEffect(() => {
    const hasSeen = sessionStorage.getItem("hasSeenPreloader")
    if (hasSeen) return

    const MIN_DISPLAY = 4000


    const hide = () => {
      const loader = document.getElementById("hard-loader")
      const frame = document.querySelector(".hard-loader-frame")

      if (loader) {
        loader.style.transition = "opacity 1s ease"
        loader.style.opacity = "0"
        setTimeout(() => loader.remove(), 1000)
      }

      if (frame) {
        ;(frame as HTMLElement).style.transition = "opacity 1s ease"
        ;(frame as HTMLElement).style.opacity = "0"
        setTimeout(() => frame.remove(), 1000)
      }

      document.documentElement.style.overflow = "visible"
      sessionStorage.setItem("hasSeenPreloader", "true")
    }

    const start = Date.now()

    if (document.readyState === "complete") {
      const elapsed = Date.now() - start
      setTimeout(hide, Math.max(0, MIN_DISPLAY - elapsed))
    } else {
      window.addEventListener("load", () => {
        const elapsed = Date.now() - start
        setTimeout(hide, Math.max(0, MIN_DISPLAY - elapsed))
      }, { once: true })
    }
  }, [])

  return null
}