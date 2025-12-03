'use client'

import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'

interface NavItem {
  name: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' },
]

export function LandingNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [positions, setPositions] = useState<{ left: number; width: number }[]>([])
  const navRef = useRef<HTMLDivElement>(null)

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setIsMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.href.replace('#', ''))).filter(
        Boolean,
      ) as HTMLElement[]

      if (!sections.length) return

      const midViewport = window.innerHeight / 2
      let currentIndex = 0

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= midViewport && rect.bottom >= midViewport) {
          currentIndex = index
        }
      })

      setActiveIndex(currentIndex)
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        handleScroll()
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useLayoutEffect(() => {
    const measure = () => {
      if (!navRef.current) return
      const buttons = Array.from(navRef.current.querySelectorAll('a'))
      const rects = buttons.map((btn) => ({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
      }))
      setPositions(rects)
    }

    const rafId = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)

    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined' && navRef.current) {
      observer = new ResizeObserver(() => requestAnimationFrame(measure))
      observer.observe(navRef.current)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', measure)
      observer?.disconnect()
    }
  }, [])

  const highlightIndex = hoverIndex ?? activeIndex
  const highlight = positions[highlightIndex]

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[92%] max-w-3xl -translate-x-1/2">
      <div className="relative flex items-center gap-6 rounded-full border border-white/10 bg-black/50 px-6 py-3 text-white shadow-lg backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Image
            src="/img0.jpg"
            alt="Arvind Pandey"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full border border-white/30 object-cover"
          />
          <div className="hidden text-sm font-semibold sm:block">Arvind Pandey</div>
        </div>

        <div
          ref={navRef}
          className="relative hidden items-center gap-4 md:flex"
          onMouseLeave={() => setHoverIndex(null)}
          role="navigation"
          aria-label="Primary"
        >
          {highlight && (
            <span
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full bg-white/20 transition-all duration-300"
              style={{
                left: highlight.left - 8,
                width: highlight.width + 16,
                height: 36,
              }}
            />
          )}

          {NAV_ITEMS.map((item, index) => {
            const isActive = activeIndex === index
            const isHovered = hoverIndex === index
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                onMouseEnter={() => setHoverIndex(index)}
                className={`relative z-10 px-4 py-1 text-sm font-medium transition-colors ${
                  isHovered ? 'text-black' : isActive ? 'text-white' : 'text-white/80 hover:text-black'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.name}
              </a>
            )
          })}
        </div>

        <button
          className="ml-auto rounded-lg p-2 text-white transition hover:bg-white/10 md:hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={`md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'pointer-events-auto mt-3 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                activeIndex === index ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
              aria-current={activeIndex === index ? 'page' : undefined}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

