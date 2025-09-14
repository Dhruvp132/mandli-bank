"use client"

import { useMemo, useState } from "react"
import { Navbar } from "@/components/navbar"
import { LanguageProvider, useLanguage } from "@/components/language-provider"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import account from "@/app/data/customer/account.json"
import transactions from "@/app/data/customer/transactions.json"
import fixedDeposits from "@/app/data/customer/fixed-deposits.json"

type Txn = { id: string; date: string; desc: string; amount: number }
type FD = { id: string; amount: number; rate: number; maturityDate: string }

export default function CustomerPage() {
  return (
    <LanguageProvider>
      <main className="flex min-h-dvh flex-col premium-gradient">
        <Navbar />
        <section className="mx-auto w-full max-w-5xl px-4 py-8">
          <Content />
        </section>
      </main>
      <Toaster />
    </LanguageProvider>
  )
}

function Content() {
  const [loggedIn, setLoggedIn] = useState(false)
  return !loggedIn ? <Login onLogin={() => setLoggedIn(true)} /> : <Dashboard onLogout={() => setLoggedIn(false)} />
}

function Login({ onLogin }: { onLogin: () => void }) {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  return (
    <div className="mx-auto max-w-md">
      <Card className="premium-shadow premium-border bg-gradient-to-br from-white to-purple-50/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-purple-800">{t("customerLoginTitle")}</CardTitle>
          <CardDescription className="text-purple-600">{t("landingSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-purple-700 font-medium">{t("email")}</Label>
            <Input 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-200"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-purple-700 font-medium">{t("password")}</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-200"
            />
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" 
            onClick={onLogin}
          >
            {t("login")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const txns = transactions as Txn[]
  const fds = fixedDeposits as FD[]

  const nearMaturity = useMemo(() => {
    const today = new Date()
    return fds.map((fd) => {
      const d = new Date(fd.maturityDate)
      const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return { ...fd, daysLeft: diff }
    })
  }, [fds])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-white rounded-xl border-2 border-purple-200 shadow-lg">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">{t("dashboard")}</h2>
        <Button 
          variant="outline" 
          onClick={onLogout}
          className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-400 transition-all duration-200"
        >
          {t("logout")}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="premium-shadow premium-border bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-xl">{t("accountInfo")}</CardTitle>
            <CardDescription className="text-purple-100 text-lg font-semibold">
              {t("balance")}: ₹{(account.balance as number).toLocaleString("en-IN")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <h4 className="mb-4 font-semibold text-purple-800 text-lg">{t("transactions")}</h4>
            <ul className="space-y-3 text-sm">
              {txns.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between rounded-lg border-2 border-purple-100 p-3 hover:border-purple-200 transition-colors bg-white/50">
                  <div>
                    <div className="font-medium text-purple-800">{tx.desc}</div>
                    <div className="text-purple-600">{tx.date}</div>
                  </div>
                  <div className={tx.amount >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {tx.amount >= 0 ? "+" : "-"}₹{Math.abs(tx.amount).toLocaleString("en-IN")}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="premium-shadow premium-border bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-xl">{t("loanApplication")}</CardTitle>
            <CardDescription className="text-purple-100">{t("loanType")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <LoanApplicationForm onApplied={() => toast({ title: t("toastLoanApplied") })} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="premium-shadow premium-border bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-xl">{t("fixedDeposits")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            {nearMaturity.map((fd) => (
              <div key={fd.id} className="flex items-center justify-between rounded-lg border-2 border-purple-100 p-4 text-sm hover:border-purple-200 transition-colors bg-white/50">
                <div>
                  <div className="font-semibold text-purple-800 text-base">
                    ₹{fd.amount.toLocaleString("en-IN")} @ {fd.rate}%
                  </div>
                  <div className="text-purple-600">
                    {t("maturity")}: {new Date(fd.maturityDate).toLocaleDateString()}
                  </div>
                </div>
                <div className={fd.daysLeft <= 30 ? "text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-lg" : "text-purple-600 font-medium"}>
                  {fd.daysLeft} {t("daysLeft")}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="premium-shadow premium-border bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-xl">{t("serviceRequests")}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ServiceRequestForm onSent={() => toast({ title: t("toastServiceSent") })} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LoanApplicationForm({ onApplied }: { onApplied: () => void }) {
  const { t } = useLanguage()
  const [type, setType] = useState<string>("agriculture")
  return (
    <div className="grid gap-4">
      <Label className="text-purple-700 font-medium">{t("loanType")}</Label>
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400">
          <SelectValue placeholder={t("loanType")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="agriculture">Agriculture</SelectItem>
          <SelectItem value="personal">Personal</SelectItem>
          <SelectItem value="gold">Gold</SelectItem>
        </SelectContent>
      </Select>
      <Button 
        onClick={onApplied}
        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
      >
        {t("loanApply")}
      </Button>
    </div>
  )
}

function ServiceRequestForm({ onSent }: { onSent: () => void }) {
  const { t } = useLanguage()
  const [type, setType] = useState<string>("cheque-book")
  const [comments, setComments] = useState("")
  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSent()
        setComments("")
      }}
    >
      <Label className="text-purple-700 font-medium">{t("requestType")}</Label>
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400">
          <SelectValue placeholder={t("requestType")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cheque-book">Cheque Book</SelectItem>
          <SelectItem value="complaint">Complaint</SelectItem>
          <SelectItem value="address-change">Address Change</SelectItem>
        </SelectContent>
      </Select>
      <div className="grid gap-2">
        <Label className="text-purple-700 font-medium">{t("comments")}</Label>
        <Textarea 
          value={comments} 
          onChange={(e) => setComments(e.target.value)}
          className="border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-200"
        />
      </div>
      <Button 
        type="submit"
        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
      >
        {t("submit")}
      </Button>
    </form>
  )
}
