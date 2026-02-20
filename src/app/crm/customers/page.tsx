"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { Users, Plus, RefreshCw, Mail, Phone, Pencil, Trash2, ArrowLeft, X, Loader2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { crmCustomers, Customer } from "@/services/api/crm"

const statusTone: Record<Customer["status"], { label: string; className: string }> = {
    lead: { label: "Lead", className: "bg-blue-500/10 text-blue-500" },
    customer: { label: "Customer", className: "bg-emerald-500/10 text-emerald-500" },
    inactive: { label: "Inactive", className: "bg-muted text-muted-foreground" },
}

function getApiErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) {
        return err.response?.data?.message || err.message || fallback
    }
    if (err instanceof Error) return err.message || fallback
    return fallback
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [newCustomer, setNewCustomer] = useState({ full_name: "", email: "", phone: "", address: "", tags: "", status: "lead" as Customer["status"] })
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const load = async () => {
        setIsLoading(true)
        try {
            const list = await crmCustomers.list()
            setCustomers(Array.isArray(list) ? list : [])
        } catch {
            setCustomers([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const handleCreate = async () => {
        if (!newCustomer.full_name) return
        setIsSaving(true)
        setError(null)
        try {
            const created = await crmCustomers.create({
                full_name: newCustomer.full_name,
                emails: newCustomer.email ? [newCustomer.email] : [],
                phones: newCustomer.phone ? [newCustomer.phone] : [],
                address: newCustomer.address,
                tags: newCustomer.tags ? newCustomer.tags.split(",").map(t => t.trim()) : [],
                status: newCustomer.status,
            })
            setCustomers((prev) => [created, ...prev])
            setNewCustomer({ full_name: "", email: "", phone: "", address: "", tags: "", status: "lead" })
            setIsSheetOpen(false)
        } catch (err) {
            console.error(err)
            setError(getApiErrorMessage(err, "Failed to create customer. Please try again."))
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = (id: number) => {
        // Optimistically remove from UI. A delete API endpoint will be connected when available.
        setCustomers((prev) => prev.filter((c) => c.id !== id))
    }

    const filtered = customers.filter((c) =>
        !search || c.full_name.toLowerCase().includes(search.toLowerCase()) ||
        c.emails?.some(e => e.toLowerCase().includes(search.toLowerCase())) ||
        c.phones?.some(p => p.includes(search))
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Customers</h1>
                        <p className="text-muted-foreground">Manage your customer database and leads.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Sheet open={isSheetOpen} onOpenChange={(open) => { setIsSheetOpen(open); if (!open) setError(null) }}>
                        <SheetTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" /> Add customer
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-xl overflow-auto">
                            <SheetHeader>
                                <SheetTitle>Create customer</SheetTitle>
                                <SheetDescription>Enter customer details below to create a new record.</SheetDescription>
                            </SheetHeader>
                            <div className="space-y-4 mt-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="customer-name">Full Name / Company <span className="text-destructive" aria-hidden="true">*</span></label>
                                    <Input id="customer-name" aria-required="true" placeholder="e.g. Acme Corp" value={newCustomer.full_name} onChange={(e) => setNewCustomer((p) => ({ ...p, full_name: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Industry Tags</label>
                                    <Input placeholder="e.g. retail, logistics (comma separated)" value={newCustomer.tags} onChange={(e) => setNewCustomer((p) => ({ ...p, tags: e.target.value }))} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input type="email" placeholder="name@example.com" value={newCustomer.email} onChange={(e) => setNewCustomer((p) => ({ ...p, email: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone</label>
                                        <Input type="tel" placeholder="+1 555 000 0000" value={newCustomer.phone} onChange={(e) => setNewCustomer((p) => ({ ...p, phone: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Address</label>
                                    <Input placeholder="Billing / Shipping address" value={newCustomer.address} onChange={(e) => setNewCustomer((p) => ({ ...p, address: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <div className="flex gap-2">
                                        {(["lead", "customer"] as Customer["status"][]).map((s) => (
                                            <Button key={s} type="button" variant={newCustomer.status === s ? "default" : "outline"} onClick={() => setNewCustomer((p) => ({ ...p, status: s }))} className="flex-1 capitalize">
                                                {s}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                {error && (
                                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium">
                                        {error}
                                    </div>
                                )}
                            </div>
                            <SheetFooter className="mt-6 flex gap-2">
                                <Button onClick={handleCreate} disabled={isSaving || !newCustomer.full_name}>
                                    {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : "Create customer"}
                                </Button>
                                <Button variant="ghost" onClick={() => setIsSheetOpen(false)}>
                                    <X className="h-4 w-4 mr-1" /> Cancel
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                    <Button variant="outline" onClick={load} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} /> Refresh
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <CardTitle className="text-2xl">Directory</CardTitle>
                            <CardDescription>
                                {isLoading ? "Loading…" : `${customers.length} customer${customers.length !== 1 ? "s" : ""} total`}
                            </CardDescription>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-9 w-56"
                                placeholder="Search customers…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="text-left text-muted-foreground border-b">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Name</th>
                                    <th className="px-4 py-3 font-medium">Email</th>
                                    <th className="px-4 py-3 font-medium">Phone</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Source</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-16 text-center text-muted-foreground">
                                            {search ? "No customers match your search." : "No customers yet. Add your first customer to get started."}
                                        </td>
                                    </tr>
                                ) : filtered.map((c) => (
                                    <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 font-semibold">{c.full_name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {c.emails?.[0] ? <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{c.emails[0]}</div> : <span className="text-xs">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {c.phones?.[0] ? <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{c.phones[0]}</div> : <span className="text-xs">—</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge className={statusTone[c.status]?.className ?? "bg-muted"}>{statusTone[c.status]?.label ?? c.status}</Badge>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground capitalize">{c.source || "—"}</td>
                                        <td className="px-4 py-3 text-right space-x-1">
                                            <Button size="icon" variant="ghost" className="h-8 w-8" title="Edit customer">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(c.id)} title="Remove customer">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>

            <Button variant="ghost" asChild>
                <Link href="/crm">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to CRM dashboard
                </Link>
            </Button>
        </div>
    )
}
