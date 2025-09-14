"use client"

import { useMemo, useState } from "react"
import { Navbar } from "@/components/navbar"
import { LanguageProvider, useLanguage } from "@/components/language-provider"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import baseCustomers from "@/app/data/admin/customers.json"
import baseLoans from "@/app/data/admin/loan-applications.json"
import reports from "@/app/data/admin/reports.json"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"

type Customer = { id: string; name: string; email: string }
type LoanApp = {
  id: string
  customer: string
  type: string
  amount: number
  status: "pending" | "approved" | "rejected"
}

const COLORS = ["#7c3aed", "#a855f7", "#c084fc"] // purple theme colors

export default function AdminPage() {
  return (
    <LanguageProvider>
      <main className="flex min-h-dvh flex-col premium-gradient">
        <Navbar />
        <section className="mx-auto w-full max-w-6xl px-4 py-8 space-y-8">
          <Content />
        </section>
      </main>
      <Toaster />
    </LanguageProvider>
  )
}

function Content() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>(baseCustomers as Customer[])
  const [loans, setLoans] = useState<LoanApp[]>(baseLoans as LoanApp[])

  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")

  const auditData = useMemo(() => reports.audit as { name: string; value: number }[], [])
  const complianceData = useMemo(() => reports.compliance as { name: string; value: number }[], [])

  return (
    <>
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-white rounded-xl border-2 border-purple-200 shadow-lg">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">{t("adminManageCustomers")}</h2>
      </div>
      <Card className="premium-shadow premium-border bg-gradient-to-br from-white to-purple-50/30">
        <CardContent className="py-8 px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="md:col-span-2">
              <Label className="text-purple-700 font-medium">Name</Label>
              <Input 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                placeholder="Jane Doe"
                className="border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-200 mt-2"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-purple-700 font-medium">Email</Label>
              <Input 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)} 
                placeholder="jane@example.com"
                className="border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-200 mt-2"
              />
            </div>
            <div className="md:col-span-4">
              <Button
                onClick={() => {
                  if (!newName || !newEmail) return
                  setCustomers((prev) => [...prev, { id: crypto.randomUUID(), name: newName, email: newEmail }])
                  setNewName("")
                  setNewEmail("")
                  toast({ title: t("toastSaved") })
                }}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                {t("add")}
              </Button>
            </div>
          </div>
          <div className="mt-8 rounded-xl border-2 border-purple-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold">ID</th>
                  <th className="px-4 py-4 text-left font-semibold">Name</th>
                  <th className="px-4 py-4 text-left font-semibold">Email</th>
                  <th className="px-4 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, index) => (
                  <tr key={c.id} className={`border-t border-purple-100 ${index % 2 === 0 ? 'bg-purple-50/30' : 'bg-white'} hover:bg-purple-50 transition-colors`}>
                    <td className="px-4 py-3 font-medium text-purple-800">{c.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-purple-700">{c.name}</td>
                    <td className="px-4 py-3 text-purple-700">{c.email}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="mr-2 border-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                        onClick={() => {
                          const name = prompt("New name", c.name) || c.name
                          const email = prompt("New email", c.email) || c.email
                          setCustomers((prev) => prev.map((x) => (x.id === c.id ? { ...x, name, email } : x)))
                          toast({ title: t("toastSaved") })
                        }}
                      >
                        {t("edit")}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setCustomers((prev) => prev.filter((x) => x.id !== c.id))}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {t("delete")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-white rounded-xl border-2 border-purple-200 shadow-lg">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">{t("adminLoanWorkflow")}</h2>
      </div>
      <Card className="premium-shadow premium-border bg-gradient-to-br from-white to-purple-50/30">
        <CardContent className="py-8 px-6">
          <div className="rounded-xl border-2 border-purple-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold">ID</th>
                  <th className="px-4 py-4 text-left font-semibold">Customer</th>
                  <th className="px-4 py-4 text-left font-semibold">Type</th>
                  <th className="px-4 py-4 text-right font-semibold">Amount</th>
                  <th className="px-4 py-4 text-right font-semibold">Status</th>
                  <th className="px-4 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((l, index) => (
                  <tr key={l.id} className={`border-t border-purple-100 ${index % 2 === 0 ? 'bg-purple-50/30' : 'bg-white'} hover:bg-purple-50 transition-colors`}>
                    <td className="px-4 py-3 font-medium text-purple-800">{l.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-purple-700">{l.customer}</td>
                    <td className="px-4 py-3 text-purple-700 capitalize">{l.type}</td>
                    <td className="px-4 py-3 text-right font-semibold text-purple-800">₹{l.amount.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          l.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : l.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="mr-2 border-2 border-green-300 text-green-700 hover:bg-green-50"
                        onClick={() =>
                          setLoans((prev) => prev.map((x) => (x.id === l.id ? { ...x, status: "approved" } : x)))
                        }
                      >
                        {t("approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() =>
                          setLoans((prev) => prev.map((x) => (x.id === l.id ? { ...x, status: "rejected" } : x)))
                        }
                      >
                        {t("reject")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-white rounded-xl border-2 border-purple-200 shadow-lg">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">{t("adminReports")}</h2>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="premium-shadow premium-border bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-xl">Audit Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={auditData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {auditData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="premium-shadow premium-border bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-xl">Compliance Stats</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-white rounded-xl border-2 border-purple-200 shadow-lg">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">{t("adminUserManagement")}</h2>
      </div>
      <Card className="premium-shadow premium-border bg-gradient-to-br from-white to-purple-50/30">
        <CardContent className="py-8 px-6">
          <div className="rounded-xl border-2 border-purple-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold">User</th>
                  <th className="px-4 py-4 text-left font-semibold">Role</th>
                  <th className="px-4 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {["Alice", "Bob", "Carol"].map((u, i) => (
                  <RoleRow key={u} name={u} defaultRole={i === 0 ? "admin" : "staff"} />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function RoleRow({ name, defaultRole }: { name: string; defaultRole: "admin" | "staff" }) {
  const [role, setRole] = useState<"admin" | "staff">(defaultRole)
  const index = ["Alice", "Bob", "Carol"].indexOf(name)
  return (
    <tr className={`border-t border-purple-100 ${index % 2 === 0 ? 'bg-purple-50/30' : 'bg-white'} hover:bg-purple-50 transition-colors`}>
      <td className="px-4 py-3 font-medium text-purple-800">{name}</td>
      <td className="px-4 py-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
          {role}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setRole(role === "admin" ? "staff" : "admin")}
          className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          Toggle Role
        </Button>
      </td>
    </tr>
  )
}
