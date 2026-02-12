"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, Plus, RefreshCw, Mail, Phone, Pencil, Trash2, ArrowLeft, X } from "lucide-react"

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

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [newCustomer, setNewCustomer] = useState({ full_name: "", email: "", phone: "", address: "", tags: "", status: "lead" as Customer["status"] })
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
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
        load()
    }, [])

    const handleCreate = async () => {
        if (!newCustomer.full_name) return
        setIsLoading(true)
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
        } catch (error) {
            console.error(error)
            setError("API unavailable. Please check your connection and try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = (id: number) => {
        setCustomers((prev) => prev.filter((c) => c.id !== id))
        console.info("TODO: connect delete endpoint when available")
    }

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
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline">
                                <Plus className="h-4 w-4 mr-2" /> Add customer
                            </Button>
                        </SheetTrigger>
                            <SheetContent className="sm:max-w-xl overflow-auto">
                                <SheetHeader>
                                    <SheetTitle>Create customer</SheetTitle>
                                    <SheetDescription>Enter customer details below to create a new record.</SheetDescription>
                                </SheetHeader>
                                <div className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Basic Info</label>
                                        <Input placeholder="Full name / Company" value={newCustomer.full_name} onChange={(e) => setNewCustomer((p) => ({ ...p, full_name: e.target.value }))} />
                                        <Input placeholder="Industry Tags (comma separated)" value={newCustomer.tags} onChange={(e) => setNewCustomer((p) => ({ ...p, tags: e.target.value }))} />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Contact Details</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input placeholder="Email" value={newCustomer.email} onChange={(e) => setNewCustomer((p) => ({ ...p, email: e.target.value }))} />
                                            <Input placeholder="Phone" value={newCustomer.phone} onChange={(e) => setNewCustomer((p) => ({ ...p, phone: e.target.value }))} />
                                        </div>
                                        <Input placeholder="Address (Billing/Shipping)" value={newCustomer.address} onChange={(e) => setNewCustomer((p) => ({ ...p, address: e.target.value }))} />
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
                                    {error && <p className="text-xs text-destructive">{error}</p>}
                                </div>
                                <SheetFooter className="mt-4 flex gap-2">
                                    <Button onClick={handleCreate} disabled={isLoading || !newCustomer.full_name}>
                                        {isLoading ? "Saving..." : "Create customer"}
                                    </Button>
                                    <Button variant="ghost" onClick={() => setIsSheetOpen(false)}>
                                        <X className="h-4 w-4 mr-1" /> Cancel
                                    </Button>
                                </SheetFooter>
                            </SheetContent>
                    </Sheet>
                    <Button variant="ghost" onClick={() => window.location.reload()} disabled={isLoading}>
                        <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl">Directory</CardTitle>
                    <CardDescription>A list of all customers and leads.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-muted-foreground">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Phone</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Source</th>
                                <th className="px-4 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                        No customers yet. Add your first customer to get started.
                                    </td>
                                </tr>
                            ) : customers.map((c) => (
                                <tr key={c.id} className="hover:bg-muted/40">
                                    <td className="px-4 py-3 font-semibold">{c.full_name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {c.emails?.[0] && <div className="flex items-center gap-2"><Mail className="h-4 w-4" />{c.emails[0]}</div>}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {c.phones?.[0] && <div className="flex items-center gap-2"><Phone className="h-4 w-4" />{c.phones[0]}</div>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className={statusTone[c.status]?.className ?? "bg-muted"}>{statusTone[c.status]?.label ?? c.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground capitalize">{c.source || "-"}</td>
                                    <td className="px-4 py-3 text-right space-x-1">
                                        <Button size="icon" variant="ghost" className="h-8 w-8">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
