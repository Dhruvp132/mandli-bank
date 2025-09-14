"use client"

import { Navbar } from "@/components/navbar"
import { LanguageProvider, useLanguage } from "@/components/language-provider"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster"
import shareCapital from "@/app/data/member/share-capital.json"
import dividends from "@/app/data/member/dividends.json"
import notices from "@/app/data/member/notices.json"

type ShareRow = { memberId: string; name: string; shares: number; value: number }
type Dividend = { id: string; year: number; rate: number; amount: number }
type Notice = { id: string; title: string; date: string; details: string }

export default function MemberPage() {
  return (
    <LanguageProvider>
      <main className="flex min-h-dvh flex-col premium-gradient">
        <Navbar />
        <section className="mx-auto w-full max-w-5xl px-4 py-8 space-y-8">
          <Content />
        </section>
      </main>
      <Toaster />
    </LanguageProvider>
  )
}

function Content() {
  const { t } = useLanguage()
  const capital = shareCapital as ShareRow[]
  const divs = dividends as Dividend[]
  const nts = notices as Notice[]

  return (
    <>
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-white rounded-xl border-2 border-purple-200 shadow-lg">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">{t("memberShareCapital")}</h2>
      </div>
      <div className="rounded-xl border-2 border-purple-200 overflow-hidden shadow-lg bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <tr>
              <th className="px-4 py-4 text-left font-semibold">Member ID</th>
              <th className="px-4 py-4 text-left font-semibold">Name</th>
              <th className="px-4 py-4 text-right font-semibold">Shares</th>
              <th className="px-4 py-4 text-right font-semibold">Value (₹)</th>
            </tr>
          </thead>
          <tbody>
            {capital.map((r, index) => (
              <tr key={r.memberId} className={`border-t border-purple-100 ${index % 2 === 0 ? 'bg-purple-50/30' : 'bg-white'} hover:bg-purple-50 transition-colors`}>
                <td className="px-4 py-3 font-medium text-purple-800">{r.memberId}</td>
                <td className="px-4 py-3 text-purple-700">{r.name}</td>
                <td className="px-4 py-3 text-right font-semibold text-purple-800">{r.shares.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-right font-semibold text-purple-800">{r.value.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-white rounded-xl border-2 border-purple-200 shadow-lg">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">{t("memberDividends")}</h3>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {divs.map((d) => (
          <Card key={d.id} className="premium-shadow premium-border hover:shadow-2xl hover:shadow-purple-200/30 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-purple-50/30">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
              <CardTitle className="text-xl">{d.year}</CardTitle>
              <CardDescription className="text-purple-100 font-medium">Rate: {d.rate}%</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-800">₹{d.amount.toLocaleString("en-IN")}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-white rounded-xl border-2 border-purple-200 shadow-lg">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">{t("memberNotices")}</h3>
      </div>
      <div className="space-y-4">
        {nts.map((n) => (
          <Card key={n.id} className="premium-shadow premium-border hover:shadow-lg hover:shadow-purple-200/30 transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
              <CardTitle className="text-lg">{n.title}</CardTitle>
              <CardDescription className="text-purple-100">{new Date(n.date).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-purple-700 leading-relaxed">{n.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
