"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Sparkles, ArrowRight, Layers, ClipboardList, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { crmCustomers, crmOrders, Customer, Order } from "@/services/api/crm"

const sampleCustomers: Customer[] = [
    { id: 1, full_name: "Acme Corp", emails: ["ops@acme.com"], phones: ["(555) 210-1010"], status: "customer", tags: ["key"], source: "web" },
    { id: 2, full_name: "Neuro Labs", emails: ["hello@neurolabs.ai"], phones: ["(555) 441-5522"], status: "lead", tags: ["ai"], source: "event" },
    { id: 3, full_name: "Orbit Ventures", emails: ["team@orbit.vc"], phones: ["(555) 998-2211"], status: "customer", tags: ["investor"], source: "referral" },
]

const sampleOrders: Order[] = [
    { id: 301, customer_id: 1, status: "in_progress", priority: "high", order_type: "service", notes: "Migration to v2 platform", deadline_at: "2026-02-28", items: [], created_at: "2026-02-01" },
    { id: 302, customer_id: 2, status: "draft", priority: "medium", order_type: "product", notes: "Pilot seat expansion", deadline_at: "2026-03-10", items: [], created_at: "2026-02-05" },
]

export default function CRMPage() {
    const [customers, setCustomers] = useState<Customer[]>(sampleCustomers)
    const [orders, setOrders] = useState<Order[]>(sampleOrders)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const hydrate = async () => {
            setIsLoading(true)
            try {
                const [fetchedCustomers, fetchedOrders] = await Promise.all([
                    crmCustomers.list().catch(() => sampleCustomers),
                    crmOrders.list().catch(() => sampleOrders),
                ])
                setCustomers(Array.isArray(fetchedCustomers) ? fetchedCustomers : sampleCustomers)
                setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : sampleOrders)
            } finally {
                setIsLoading(false)
            }
        }
        hydrate()
    }, [])

    const metrics = useMemo(() => {
        const activeOrders = orders.filter((o) => ["confirmed", "in_progress"].includes(o.status)).length
        const leads = customers.filter((c) => c.status === "lead").length
        return [
            { title: "Customers", value: customers.length, hint: "+ ready for sync" },
            { title: "Active Orders", value: activeOrders, hint: "auto-routes by SLA" },
            { title: "Leads", value: leads, hint: "conversion playbooks" },
        ]
    }, [customers, orders])

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <Button asChild variant="outline">
                        <Link href="/crm/customers">
                            <Users className="h-4 w-4 mr-2" />
                            New Customer
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/crm/orders">
                            <ClipboardList className="h-4 w-4 mr-2" />
                            New Order
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((metric) => (
                    <Card key={metric.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {metric.title}
                            </CardTitle>
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {metric.hint}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>
                            Latest manufacturing orders and their status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-4">
                            {orders.slice(0, 5).map((order) => {
                                const customer = customers.find(c => c.id === order.customer_id)
                                return (
                                    <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                Order #{order.id}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {customer?.full_name || "Unknown Customer"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm text-muted-foreground hidden md:block">
                                                {new Date(order.created_at || "").toLocaleDateString()}
                                            </div>
                                            <Badge variant={order.status === 'confirmed' ? 'default' : 'secondary'} className="capitalize">
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                )
                            })}
                            {orders.length === 0 && (
                                <p className="text-sm text-muted-foreground py-4 text-center">No orders found.</p>
                            )}
                       </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and shortcuts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button asChild variant="ghost" className="w-full justify-between h-12">
                            <Link href="/crm/communications">
                                <div className="flex items-center gap-2">
                                     <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Sparkles className="h-4 w-4" />
                                     </div>
                                     <span>Send Campaign</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full justify-between h-12">
                            <Link href="/crm/settings">
                                <div className="flex items-center gap-2">
                                     <div className="h-8 w-8 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-500">
                                        <Layers className="h-4 w-4" />
                                     </div>
                                     <span>Configure Fields</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
