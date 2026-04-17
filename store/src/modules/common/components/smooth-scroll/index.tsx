"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"
import { usePathname } from "next/navigation"

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  const scrollToHash = (hash: string) => {
    const lenis = lenisRef.current
    if (!lenis || !hash) return

    const target = document.querySelector(hash)
    if (!target) return

    lenis.scrollTo(target as HTMLElement, {
      offset: -96,
      duration: 1,
    })
  }

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null

      if (!anchor?.href) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin || !url.hash) return

      const currentPath = `${window.location.pathname}${window.location.search}`
      const targetPath = `${url.pathname}${url.search}`

      if (currentPath !== targetPath) return

      event.preventDefault()
      window.history.replaceState(null, "", `${targetPath}${url.hash}`)
      scrollToHash(url.hash)
    }

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    document.addEventListener("click", handleAnchorClick)
    requestAnimationFrame(raf)

    return () => {
      document.removeEventListener("click", handleAnchorClick)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    if (!window.location.hash) return

    const timeout = window.setTimeout(() => {
      scrollToHash(window.location.hash)
    }, 50)

    return () => window.clearTimeout(timeout)
  }, [pathname])

  return (
    <div className="smooth-scroll-wrapper relative">
      {children}
    </div>
  )
}
