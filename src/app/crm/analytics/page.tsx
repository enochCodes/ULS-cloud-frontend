"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, Activity, Loader2, ClipboardList } from "lucide-react"
import { crmCustomers, crmOrders, Customer, Order } from "@/services/api/crm"

export default function AnalyticsPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const [c, o] = await Promise.all([
                    crmCustomers.list().catch(() => []),
                    crmOrders.list().catch(() => []),
                ])
                setCustomers(Array.isArray(c) ? c : [])
                setOrders(Array.isArray(o) ? o : [])
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [])

    const totalCustomers = customers.length
    const leads = customers.filter((c) => c.status === "lead").length
    const activeCustomers = customers.filter((c) => c.status === "customer").length
    const inactiveCustomers = customers.filter((c) => c.status === "inactive").length

    const totalOrders = orders.length
    const activeOrders = orders.filter((o) => ["confirmed", "in_progress"].includes(o.status)).length
    const completedOrders = orders.filter((o) => ["delivered", "closed"].includes(o.status)).length
    const cancelledOrders = orders.filter((o) => o.status === "cancelled").length

    const totalRevenue = orders.reduce((sum, o) => {
        if (!o.items?.length) return sum
        return sum + o.items.reduce((s, item) => s + (item.quantity || 0) * (item.unit_price || 0), 0)
    }, 0)

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const kpis = [
        { title: "Total Revenue", value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, hint: "from order items", icon: DollarSign },
        { title: "Active Orders", value: String(activeOrders), hint: `of ${totalOrders} total orders`, icon: ClipboardList },
        { title: "Total Customers", value: String(totalCustomers), hint: `${leads} leads, ${activeCustomers} active`, icon: Users },
        { title: "Avg. Order Value", value: `$${avgOrderValue.toFixed(2)}`, hint: "per order", icon: Activity },
    ]

    const customerStatusData = [
        { label: "Active Customers", count: activeCustomers, percent: totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0, color: "bg-emerald-500" },
        { label: "Leads", count: leads, percent: totalCustomers > 0 ? Math.round((leads / totalCustomers) * 100) : 0, color: "bg-amber-500" },
        { label: "Inactive", count: inactiveCustomers, percent: totalCustomers > 0 ? Math.round((inactiveCustomers / totalCustomers) * 100) : 0, color: "bg-slate-500" },
    ]

    const orderStatusData = [
        { label: "Active (Confirmed / In Progress)", count: activeOrders },
        { label: "Completed (Delivered / Closed)", count: completedOrders },
        { label: "Cancelled", count: cancelledOrders },
        { label: "Draft", count: orders.filter((o) => o.status === "draft").length },
    ]

    const maxOrderStatus = Math.max(...orderStatusData.map((d) => d.count), 1)

    const orderPriority = {
        high: orders.filter((o) => o.priority === "high").length,
        medium: orders.filter((o) => o.priority === "medium").length,
        low: orders.filter((o) => o.priority === "low").length,
    }
    const totalPriority = orderPriority.high + orderPriority.medium + orderPriority.low || 1

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground">Insights from your CRM data.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-xs font-medium border border-indigo-500/20">
                    <TrendingUp className="h-3 w-3" />
                    <span>Live Data</span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {kpis.map((kpi) => (
                            <Card key={kpi.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                                    <kpi.icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{kpi.value}</div>
                                    <p className="text-xs text-muted-foreground">{kpi.hint}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Status Breakdown</CardTitle>
                                <CardDescription>Distribution of orders by status.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-end justify-between gap-4 mt-4 px-2">
                                    {orderStatusData.map((d) => {
                                        const h = Math.max(5, (d.count / maxOrderStatus) * 100)
                                        return (
                                            <div key={d.label} className="flex-1 flex flex-col items-center gap-2 group relative">
                                                <div className="w-full flex items-end justify-center h-full">
                                                    <div
                                                        className="w-full bg-indigo-600 rounded-t-sm transition-all hover:bg-indigo-500"
                                                        style={{ height: `${h}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-muted-foreground font-medium text-center leading-tight">{d.label.split("(")[0].trim()}</span>
                                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-popover text-popover-foreground text-xs p-2 rounded border shadow-lg z-10 whitespace-nowrap">
                                                    {d.label}: {d.count}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Customer Distribution</CardTitle>
                                    <CardDescription>Breakdown by customer status.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {customerStatusData.map(score => (
                                        <div key={score.label} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium">{score.label}</span>
                                                <span className="text-muted-foreground">{score.count} ({score.percent}%)</span>
                                            </div>
                                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                <div className={`h-full ${score.color}`} style={{ width: `${score.percent}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Priority</CardTitle>
                                    <CardDescription>Distribution by priority level.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center py-6">
                                        <div className="relative h-32 w-32 flex items-center justify-center">
                                            <div
                                                className="absolute inset-0 rounded-full"
                                                style={{
                                                    background: `conic-gradient(#ef4444 0% ${(orderPriority.high / totalPriority) * 100}%, #f59e0b ${(orderPriority.high / totalPriority) * 100}% ${((orderPriority.high + orderPriority.medium) / totalPriority) * 100}%, #64748b ${((orderPriority.high + orderPriority.medium) / totalPriority) * 100}% 100%)`
                                                }}
                                            />
                                            <div className="absolute inset-2 bg-card rounded-full flex flex-col items-center justify-center">
                                                <span className="text-2xl font-bold">{totalOrders}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Orders</span>
                                            </div>
                                        </div>
                                        <div className="ml-8 space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                                <span>High ({orderPriority.high})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                <span>Medium ({orderPriority.medium})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-slate-500" />
                                                <span>Low ({orderPriority.low})</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
