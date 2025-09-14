"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage()
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(locale === "en" ? "gu" : "en")}
      aria-label="Toggle language"
      className="text-purple-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
    >
      {locale === "en" ? "ગુજરાતી" : "English"}
    </Button>
  )
}
