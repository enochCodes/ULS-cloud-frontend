"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ClipboardList, Plus, RefreshCw, ArrowLeft, CheckCircle2, Trash2, X, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet"
import { crmCustomers, crmOrders, crmSettings, Customer, Order, OrderStatus } from "@/services/api/crm"
import type { CustomOrderFieldSchema } from "@/services/api/types"

const orderTone: Record<OrderStatus, { label: string; className: string }> = {
    draft: { label: "Draft", className: "bg-slate-500/10 text-slate-400" },
    confirmed: { label: "Confirmed", className: "bg-blue-500/10 text-blue-400" },
    in_progress: { label: "In Progress", className: "bg-amber-500/10 text-amber-500" },
    delivered: { label: "Delivered", className: "bg-emerald-500/10 text-emerald-500" },
    closed: { label: "Closed", className: "bg-zinc-500/10 text-zinc-300" },
    cancelled: { label: "Cancelled", className: "bg-rose-500/10 text-rose-400" },
}

function getOrderQuantity(order: Order): number {
    if (!order.items?.length) return 0
    return order.items.reduce((sum, i) => sum + (i.quantity || 0), 0)
}

function parseCustomFieldsData(data: string | undefined): Record<string, string> {
    if (!data) return {}
    try {
        const parsed = JSON.parse(data) as Record<string, string>
        return typeof parsed === "object" ? parsed : {}
    } catch {
        return {}
    }
}

export default function OrdersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [detailsOrder, setDetailsOrder] = useState<Order | null>(null)
    const [form, setForm] = useState({
        customer_id: 0,
        order_type: "service",
        priority: "medium",
        status: "draft" as OrderStatus,
        notes: "",
        deadline_at: "",
        custom_fields: {} as Record<string, string>
    })
    const [error, setError] = useState<string | null>(null)
    const [customFieldsSchema, setCustomFieldsSchema] = useState<CustomOrderFieldSchema[]>([])

    function parseSchema(s: string | CustomOrderFieldSchema[] | undefined): CustomOrderFieldSchema[] {
        if (!s) return []
        if (Array.isArray(s)) return s
        try {
            const parsed = JSON.parse(s) as CustomOrderFieldSchema[]
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }

    const defaultSchema: CustomOrderFieldSchema[] = [
        { id: "gsm", label: "GSM", type: "number", required: true },
        { id: "width", label: "Width (cm)", type: "number", required: true },
        { id: "color", label: "Color", type: "text", required: true },
    ]

    useEffect(() => {
        const load = async () => {
            setIsLoading(true)
            try {
                const [c, o, settings] = await Promise.all([
                    crmCustomers.list().catch(() => []),
                    crmOrders.list().catch(() => []),
                    crmSettings.get().catch(() => null),
                ])
                let custList = Array.isArray(c) ? c : []
                let orderList = Array.isArray(o) ? o : []
                if (custList.length === 0 || orderList.length === 0) {
                    const { mockCustomers, mockOrders } = await import("@/mocks/orders")
                    if (custList.length === 0) custList = mockCustomers
                    if (orderList.length === 0) orderList = mockOrders
                }
                setCustomers(custList)
                setOrders(orderList)
                setForm((f) => ({ ...f, customer_id: f.customer_id || custList[0]?.id || 0 }))
                const schema = parseSchema(settings?.custom_order_fields_schema)
                setCustomFieldsSchema(schema.length ? schema : defaultSchema)
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [])

    const handleCreateOrder = async () => {
        if (!customers.length) return
        setIsLoading(true)
        setError(null)
        const customerId = form.customer_id || customers[0].id
        try {
            const created = await crmOrders.createForCustomer(customerId, {
                customer_id: customerId,
                status: form.status,
                order_type: form.order_type as Order["order_type"],
                priority: form.priority as Order["priority"],
                notes: form.notes,
                deadline_at: form.deadline_at,
                items: [],
                required_fields_data: JSON.stringify(form.custom_fields)
            })
            setOrders((prev) => [created, ...prev])
            setIsSheetOpen(false)
            setForm((p) => ({ ...p, notes: "", deadline_at: "", custom_fields: {} }))
        } catch (err) {
            console.error(err)
            setError("API unavailable. Please check your connection and try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateStatus = async (orderId: number, nextStatus: OrderStatus) => {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)))
        if (detailsOrder?.id === orderId) setDetailsOrder((o) => o ? { ...o, status: nextStatus } : null)
        try {
            await crmOrders.updateStatus(orderId, nextStatus)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = (orderId: number) => {
        setOrders((prev) => prev.filter((o) => o.id !== orderId))
        if (detailsOrder?.id === orderId) setDetailsOrder(null)
    }

    const openDetails = (order: Order) => setDetailsOrder(order)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <ClipboardList className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Orders</h1>
                        <p className="text-muted-foreground">Manage and track customer orders.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" disabled={isLoading || !customers.length}>
                                <Plus className="h-4 w-4 mr-2" /> New order
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-xl overflow-auto">
                            <SheetHeader>
                                <SheetTitle>Create order</SheetTitle>
                                <SheetDescription>Enter order details below to create a new order.</SheetDescription>
                            </SheetHeader>
                            <div className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Customer</label>
                                    <select
                                        className="w-full rounded-md border px-3 py-2 bg-background"
                                        value={form.customer_id}
                                        onChange={(e) => setForm((p) => ({ ...p, customer_id: Number(e.target.value) }))}
                                    >
                                        {customers.map((c) => (
                                            <option key={c.id} value={c.id}>{c.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Type</label>
                                        <select
                                            className="w-full rounded-md border px-3 py-2 bg-background"
                                            value={form.order_type}
                                            onChange={(e) => setForm((p) => ({ ...p, order_type: e.target.value }))}
                                        >
                                            <option value="service">Service</option>
                                            <option value="product">Product</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Priority</label>
                                        <select
                                            className="w-full rounded-md border px-3 py-2 bg-background"
                                            value={form.priority}
                                            onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Status</label>
                                        <select
                                            className="w-full rounded-md border px-3 py-2 bg-background"
                                            value={form.status}
                                            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as OrderStatus }))}
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="in_progress">In progress</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="closed">Closed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Deadline</label>
                                        <Input
                                            type="date"
                                            value={form.deadline_at}
                                            onChange={(e) => setForm((p) => ({ ...p, deadline_at: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Notes</label>
                                    <textarea
                                        className="w-full rounded-md border px-3 py-2 bg-background"
                                        rows={2}
                                        value={form.notes}
                                        onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                                        placeholder="Context for this work order"
                                    />
                                </div>
                                {customFieldsSchema.length > 0 && (
                                    <div className="space-y-3 pt-2 border-t">
                                        <h4 className="text-sm font-semibold">Custom Fields</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {customFieldsSchema.map((field) => (
                                                <div key={field.id} className="space-y-2">
                                                    <label className="text-sm font-medium">
                                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                                    </label>
                                                    {field.type === "select" ? (
                                                        <select
                                                            className="w-full rounded-md border px-3 py-2 bg-background"
                                                            value={form.custom_fields[field.id] || ""}
                                                            onChange={(e) => setForm(p => ({
                                                                ...p,
                                                                custom_fields: { ...p.custom_fields, [field.id]: e.target.value }
                                                            }))}
                                                        >
                                                            <option value="">Select...</option>
                                                            {field.options?.map((opt) => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <Input
                                                            type={field.type}
                                                            value={form.custom_fields[field.id] || ""}
                                                            onChange={(e) => setForm(p => ({
                                                                ...p,
                                                                custom_fields: { ...p.custom_fields, [field.id]: e.target.value }
                                                            }))}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {error && <p className="text-xs text-destructive">{error}</p>}
                            </div>
                            <SheetFooter className="mt-4 flex gap-2">
                                <Button onClick={handleCreateOrder} disabled={isLoading || !form.customer_id}>
                                    {isLoading ? "Creating..." : "Create order"}
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
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Open orders</CardTitle>
                            <CardDescription>Recent orders from all channels.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-muted-foreground">
                            <tr>
                                <th className="px-4 py-2">Order ID</th>
                                <th className="px-4 py-2">Customer</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Qty</th>
                                <th className="px-4 py-2">Priority</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Created</th>
                                <th className="px-4 py-2">Deadline</th>
                                <th className="px-4 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.map((order) => {
                                const customer = customers.find((c) => c.id === order.customer_id)
                                const qty = getOrderQuantity(order)
                                return (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-muted/40 cursor-pointer"
                                        onClick={() => openDetails(order)}
                                    >
                                        <td className="px-4 py-3 font-semibold">#{order.id}</td>
                                        <td className="px-4 py-3 font-medium">{customer?.full_name || "Unknown"}</td>
                                        <td className="px-4 py-3 text-muted-foreground capitalize">{order.order_type || "service"}</td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium">{qty}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="secondary" className="capitalize">{order.priority || "medium"}</Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge className={orderTone[order.status]?.className}>{orderTone[order.status]?.label}</Badge>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{order.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{order.deadline_at ? new Date(order.deadline_at).toLocaleDateString() : "-"}</td>
                                        <td className="px-4 py-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openDetails(order)} title="View details">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {order.status !== "confirmed" && (
                                                <Button size="sm" variant="ghost" onClick={() => handleUpdateStatus(order.id, "confirmed")} className="text-primary hover:text-primary/80">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(order.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <OrderDetailsSheet
                order={detailsOrder}
                customers={customers}
                customFieldsSchema={customFieldsSchema.length ? customFieldsSchema : defaultSchema}
                onClose={() => setDetailsOrder(null)}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
            />

            <Button variant="ghost" asChild>
                <Link href="/crm">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to CRM dashboard
                </Link>
            </Button>
        </div>
    )
}

function OrderDetailsSheet({
    order,
    customers,
    customFieldsSchema,
    onClose,
    onUpdateStatus,
    onDelete,
}: {
    order: Order | null
    customers: Customer[]
    customFieldsSchema: CustomOrderFieldSchema[]
    onClose: () => void
    onUpdateStatus: (id: number, status: OrderStatus) => void
    onDelete: (id: number) => void
}) {
    const customer = order ? customers.find((c) => c.id === order.customer_id) : null
    const customData = order ? parseCustomFieldsData(order.required_fields_data) : {}
    const qty = order ? getOrderQuantity(order) : 0

    return (
        <Sheet open={!!order} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="sm:max-w-lg overflow-auto">
                <SheetHeader>
                    <SheetTitle>Order #{order?.id}</SheetTitle>
                    <SheetDescription>Full order details and custom fields</SheetDescription>
                </SheetHeader>
                <div className="space-y-6 py-6">
                    {order && (
                    <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground">Customer</p>
                            <p className="font-medium">{customer?.full_name || "Unknown"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Status</p>
                            <Badge className={orderTone[order.status]?.className}>{orderTone[order.status]?.label}</Badge>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Type</p>
                            <p className="text-sm capitalize">{order.order_type || "service"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Priority</p>
                            <Badge variant="secondary" className="capitalize">{order.priority || "medium"}</Badge>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Quantity</p>
                            <p className="font-medium">{qty}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Created</p>
                            <p className="text-sm">{order.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Deadline</p>
                            <p className="text-sm">{order.deadline_at ? new Date(order.deadline_at).toLocaleDateString() : "-"}</p>
                        </div>
                    </div>
                    {order.notes && (
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Notes</p>
                            <p className="text-sm bg-muted/50 p-3 rounded">{order.notes}</p>
                        </div>
                    )}
                    {order.items?.length ? (
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Items</p>
                            <div className="border rounded divide-y">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between px-4 py-2 text-sm">
                                        <span>{item.name}</span>
                                        <span className="text-muted-foreground">
                                            {item.quantity} × {item.unit_price} = {(item.quantity * item.unit_price).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                    {customFieldsSchema.length > 0 && Object.keys(customData).length > 0 && (
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Custom Fields</p>
                            <div className="border rounded divide-y">
                                {customFieldsSchema.map((f) =>
                                    customData[f.id] != null ? (
                                        <div key={f.id} className="flex justify-between px-4 py-2 text-sm">
                                            <span className="text-muted-foreground">{f.label}</span>
                                            <span>{(customData[f.id] ?? "").toString()}</span>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex gap-2 pt-4 border-t">
                        {order.status !== "confirmed" && (
                            <Button size="sm" onClick={() => onUpdateStatus(order.id, "confirmed")}>Confirm</Button>
                        )}
                        <Button variant="outline" size="sm" className="text-destructive" onClick={() => onDelete(order.id)}>Delete</Button>
                        <Button variant="ghost" onClick={onClose}>Close</Button>
                    </div>
                    </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
