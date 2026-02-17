"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Sparkles, ArrowRight, Layers, ClipboardList, Users, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { crmCustomers, crmOrders, Customer, Order } from "@/services/api/crm"

export default function CRMPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const hydrate = async () => {
            setIsLoading(true)
            try {
                const [fetchedCustomers, fetchedOrders] = await Promise.all([
                    crmCustomers.list().catch(() => []),
                    crmOrders.list().catch(() => []),
                ])
                setCustomers(Array.isArray(fetchedCustomers) ? fetchedCustomers : [])
                setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : [])
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
            { title: "Customers", value: customers.length, hint: "total in your CRM" },
            { title: "Active Orders", value: activeOrders, hint: "confirmed or in progress" },
            { title: "Leads", value: leads, hint: "potential customers" },
        ]
    }, [customers, orders])

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back. Here&apos;s what&apos;s happening today.</p>
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
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{metric.value}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {metric.hint}
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>
                            Latest orders and their status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                       ) : (
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
                                                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}
                                                </div>
                                                <Badge variant={order.status === 'confirmed' ? 'default' : 'secondary'} className="capitalize">
                                                    {order.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    )
                                })}
                                {orders.length === 0 && (
                                    <p className="text-sm text-muted-foreground py-4 text-center">No orders found. Create your first order to get started.</p>
                                )}
                           </div>
                       )}
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
