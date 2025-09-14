"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/components/language-provider"

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col premium-gradient">
      <Navbar />
      <section className="mx-auto w-full max-w-5xl px-4 py-10">
        <Hero />
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <PortalCard href="/customer" titleKey="customerPortal" descKey="customerPortalDesc" />
          <PortalCard href="/member" titleKey="memberPortal" descKey="memberPortalDesc" />
          <PortalCard href="/admin" titleKey="adminPortal" descKey="adminPortalDesc" />
        </div>
      </section>
    </main>
  )
}

function Hero() {
  const { t } = useLanguage()
  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl md:text-5xl font-bold text-balance bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 bg-clip-text text-transparent">
        {t("landingTitle")}
      </h1>
      <p className="text-muted-foreground max-w-2xl mx-auto text-pretty text-lg leading-relaxed">
        {t("landingSubtitle")}
      </p>
    </div>
  )
}

function PortalCard({ href, titleKey, descKey }: { href: string; titleKey: string; descKey: string }) {
  const { t } = useLanguage()
  return (
    <Card className="h-full premium-shadow premium-border hover:shadow-2xl hover:shadow-purple-200/30 transition-all duration-300 hover:-translate-y-1 group bg-gradient-to-br from-white to-purple-50/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-purple-800 group-hover:text-purple-600 transition-colors">
          {t(titleKey)}
        </CardTitle>
        <CardDescription className="text-purple-600/80">
          {t(descKey)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
          <Link href={href}>{t("enterPortal")}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
