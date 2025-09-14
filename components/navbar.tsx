"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { useEffect, useState } from "react"

export function Navbar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)")
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false)
    }
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
    } else {
      // Safari fallback
      // @ts-ignore
      mql.addListener(onChange)
    }
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange)
      } else {
        // Safari fallback
        // @ts-ignore
        mql.removeListener(onChange)
      }
    }
  }, [])

  const links = [
    { href: "/", label: t("home") },
    { href: "/customer", label: t("customer") },
    { href: "/member", label: t("member") },
    { href: "/admin", label: t("admin") },
    { href: "/payment", label: t("payment") },
  ]

  return (
    <header className="border-b-2 border-purple-200 bg-white/80 backdrop-blur-lg shadow-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">{/* Brand */}
        <Link href="/" className="font-bold text-xl bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">
          {t("brand")}
        </Link>

        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" aria-expanded={open}>
                {/* Hamburger icon */}
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">{t("brand")}</SheetTitle>
              </SheetHeader>

              {/* Mobile nav */}
              <nav aria-label="Primary" className="mt-6 flex flex-col gap-2">
                {links.map((l) => (
                  <SheetClose asChild key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        pathname === l.href 
                          ? "text-white bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg" 
                          : "text-purple-700 hover:text-purple-600 hover:bg-purple-50",
                      )}
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              {/* Mobile actions */}
              <div className="mt-6 flex items-center gap-3">
                <LanguageToggle />
                <SheetClose asChild>
                  <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent border-2 border-purple-300 text-purple-700 hover:bg-purple-50">
                    <Link href="/customer">{t("getStarted")}</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                pathname === l.href 
                  ? "text-white bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg" 
                  : "text-purple-700 hover:text-purple-600 hover:bg-purple-50",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <Button asChild variant="outline" size="sm" className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-400 transition-all duration-200">
            <Link href="/customer">{t("getStarted")}</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
