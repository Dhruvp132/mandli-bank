"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import en from "@/app/locales/en.json"
import gu from "@/app/locales/gu.json"

type Locale = "en" | "gu"
type Dict = Record<string, string>
const dictionaries: Record<Locale, Dict> = { en, gu }

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: (key: string) => string }
const LanguageContext = createContext<Ctx | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  useEffect(() => {
    const saved = (typeof window !== "undefined" && window.localStorage.getItem("locale")) as Locale | null
    if (saved === "gu" || saved === "en") setLocaleState(saved)
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    try {
      window.localStorage.setItem("locale", l)
    } catch {}
  }

  const t = useMemo(() => {
    const dict = dictionaries[locale] ?? dictionaries.en
    return (key: string) => dict[key] ?? key
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
