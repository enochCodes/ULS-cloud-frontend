"use client"

import { useEffect, useState } from "react"
import {
    Users,
    Ticket,
    TrendingUp,
    Activity,
    ArrowUpRight,
    LayoutGrid,
    Clock,
    ShieldCheck,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { crmCustomers, crmOrders } from "@/services/api/crm"
import { organizationService } from "@/services/api/organization"

export default function DashboardPage() {
    const [customersCount, setCustomersCount] = useState<number | null>(null)
    const [ordersCount, setOrdersCount] = useState<number | null>(null)
    const [orgCount, setOrgCount] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const [customers, orders, orgs] = await Promise.all([
                    crmCustomers.list(),
                    crmOrders.list(),
                    organizationService.list(),
                ])
                setCustomersCount(Array.isArray(customers) ? customers.length : 0)
                setOrdersCount(Array.isArray(orders) ? orders.length : 0)
                setOrgCount(Array.isArray(orgs) ? orgs.length : 0)
            } catch {
                setCustomersCount(0)
                setOrdersCount(0)
                setOrgCount(0)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const isLoading = loading
    const customers = customersCount ?? 0
    const orders = ordersCount ?? 0
    const tickets = 0 // Ticketing service not yet available

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">System Overview</h2>
                    <p className="text-muted-foreground mt-1">Real-time telemetry across your neural workspace.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Clock className="h-4 w-4" /> Last 24 Hours
                    </Button>
                    <Button className="gap-2" asChild>
                        <Link href="/marketplace">
                            <LayoutGrid className="h-4 w-4" /> Customize Layout
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-md bg-gradient-to-br from-indigo-500/5 to-transparent hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{customers}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    <span className="text-green-500 font-bold inline-flex items-center">
                                        <ArrowUpRight className="mr-1 h-3 w-3" /> CRM
                                    </span> from Neuro CRM
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md bg-gradient-to-br from-blue-500/5 to-transparent hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
                        <Ticket className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tickets}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Quantum Support coming soon
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md bg-gradient-to-br from-emerald-500/5 to-transparent hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Orders</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{orders}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    <span className="text-green-500 font-bold inline-flex items-center">
                                        <ArrowUpRight className="mr-1 h-3 w-3" /> CRM
                                    </span> from Neuro CRM
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md bg-gradient-to-br from-amber-500/5 to-transparent hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Health</CardTitle>
                        <Activity className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">99.9%</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3 text-green-500" /> All systems nominal
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Organization Pulse</CardTitle>
                        <CardDescription>Combined activity across all neural modules.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-end justify-between px-2 gap-2">
                        {[35, 60, 45, 75, 55, 80, 70, 45, 60, 90, 65, 50].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end group h-full">
                                <div
                                    className="w-full bg-primary/10 rounded-t-sm transition-all duration-500 group-hover:bg-primary/30 relative"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        Activity Score: {h}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest system events and audits from all services.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6 min-h-[200px] flex flex-col items-center justify-center py-12 text-center">
                            <Activity className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-sm text-muted-foreground">Activity collector service coming soon</p>
                            <p className="text-xs text-muted-foreground/70">Unified activity feed from CRM, Ticketing, and other modules will appear here.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border bg-card p-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="font-bold text-lg">Quick Start Guide</h3>
                        <p className="text-sm text-muted-foreground">Learn how to configure your neural workspace.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/crm/settings">View Docs</Link>
                    </Button>
                </div>
                <div className="rounded-2xl border bg-gradient-to-r from-primary/10 to-transparent p-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="font-bold text-lg text-primary">Invite Team Members</h3>
                        <p className="text-sm text-muted-foreground">Collaborate with your organization in real-time.</p>
                    </div>
                    <Button asChild>
                        <Link href="/settings/organization">Invite Users</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
