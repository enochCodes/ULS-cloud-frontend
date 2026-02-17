"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    Plus,
    RefreshCw,
    Loader2,
    X,
    Calendar,
    MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ticketingTickets,
    ticketingEvents,
    ticketingPlans,
    Ticket,
    TicketingEvent,
    SubscriptionPlan,
} from "@/services/api/ticketing"

export default function TicketingPage() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [events, setEvents] = useState<TicketingEvent[]>([])
    const [plans, setPlans] = useState<SubscriptionPlan[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("tickets")

    const [isEventSheetOpen, setIsEventSheetOpen] = useState(false)
    const [eventForm, setEventForm] = useState({ name: "", description: "", date: "", location: "", capacity: "" })
    const [isPlanSheetOpen, setIsPlanSheetOpen] = useState(false)
    const [planForm, setPlanForm] = useState({ name: "", description: "", price: "", currency: "ETB", billing_cycle: "monthly" })

    const loadData = async () => {
        setIsLoading(true)
        try {
            const [tix, evts, pls] = await Promise.all([
                ticketingTickets.adminList().catch(() => []),
                ticketingEvents.list().catch(() => []),
                ticketingPlans.list().catch(() => []),
            ])
            setTickets(Array.isArray(tix) ? tix : [])
            setEvents(Array.isArray(evts) ? evts : [])
            setPlans(Array.isArray(pls) ? pls : [])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const filteredTickets = tickets.filter((t) => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return (
            t.subject?.toLowerCase().includes(q) ||
            t.status?.toLowerCase().includes(q) ||
            String(t.id).includes(q)
        )
    })

    const openCount = tickets.filter((t) => t.status === "Open" || t.status === "open").length
    const resolvedCount = tickets.filter((t) => t.status === "Resolved" || t.status === "resolved" || t.status === "closed").length
    const criticalCount = tickets.filter((t) => t.priority === "Critical" || t.priority === "critical" || t.priority === "High" || t.priority === "high").length

    const handleCreateEvent = async () => {
        if (!eventForm.name) return
        try {
            const created = await ticketingEvents.create({
                name: eventForm.name,
                description: eventForm.description,
                date: eventForm.date,
                location: eventForm.location,
                capacity: eventForm.capacity ? Number(eventForm.capacity) : undefined,
            })
            setEvents((prev) => [created, ...prev])
            setIsEventSheetOpen(false)
            setEventForm({ name: "", description: "", date: "", location: "", capacity: "" })
        } catch (err) {
            console.error("Failed to create event", err)
        }
    }

    const handleCreatePlan = async () => {
        if (!planForm.name) return
        try {
            const created = await ticketingPlans.create({
                name: planForm.name,
                description: planForm.description,
                price: planForm.price ? Number(planForm.price) : undefined,
                currency: planForm.currency,
                billing_cycle: planForm.billing_cycle,
            })
            setPlans((prev) => [created, ...prev])
            setIsPlanSheetOpen(false)
            setPlanForm({ name: "", description: "", price: "", currency: "ETB", billing_cycle: "monthly" })
        } catch (err) {
            console.error("Failed to create plan", err)
        }
    }

    const handleDeleteEvent = async (id: number) => {
        try {
            await ticketingEvents.delete(id)
            setEvents((prev) => prev.filter((e) => e.id !== id))
        } catch (err) {
            console.error("Failed to delete event", err)
        }
    }

    const handleDeletePlan = async (id: number) => {
        try {
            await ticketingPlans.delete(id)
            setPlans((prev) => prev.filter((p) => p.id !== id))
        } catch (err) {
            console.error("Failed to delete plan", err)
        }
    }

    const priorityStyle = (priority?: string) => {
        switch (priority?.toLowerCase()) {
            case "critical": return "bg-red-500 text-white"
            case "high": return "bg-orange-500/10 text-orange-600"
            case "medium": return "bg-yellow-500/10 text-yellow-600"
            default: return "bg-muted text-muted-foreground"
        }
    }

    const statusStyle = (status?: string) => {
        switch (status?.toLowerCase()) {
            case "open": return "border-blue-500 text-blue-600 border"
            case "in progress": case "in_progress": return "border-yellow-500 text-yellow-600 border"
            case "resolved": case "closed": return "border-green-500 text-green-600 border"
            default: return "border-muted text-muted-foreground border"
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Support & Ticketing</h2>
                <Button variant="ghost" onClick={loadData} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-none shadow-md bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                ) : (
                                    <>
                                        <div className="text-2xl font-bold">{openCount}</div>
                                        <div className="text-xs text-muted-foreground">Pending Tickets</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md bg-green-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                ) : (
                                    <>
                                        <div className="text-2xl font-bold">{resolvedCount}</div>
                                        <div className="text-xs text-muted-foreground">Resolved Successfully</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md bg-red-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-600">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                            <div>
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                ) : (
                                    <>
                                        <div className="text-2xl font-bold">{criticalCount}</div>
                                        <div className="text-xs text-muted-foreground">High / Critical</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="tickets">Tickets</TabsTrigger>
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
                </TabsList>

                <TabsContent value="tickets" className="space-y-4">
                    <Card className="border-none shadow-md">
                        <CardHeader className="border-b pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle>All Tickets</CardTitle>
                                <div className="relative w-72">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by ID or subject..."
                                        className="pl-10 h-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : filteredTickets.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-12 text-center">
                                    {searchQuery ? "No tickets match your search." : "No tickets found."}
                                </p>
                            ) : (
                                filteredTickets.map((t) => (
                                    <div key={t.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-4 mb-2 md:mb-0">
                                            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">#{t.id}</span>
                                            <div>
                                                <p className="font-semibold text-sm">{t.subject || "Untitled"}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Assignee: {t.assignee || "Unassigned"} &middot; {t.created_at ? new Date(t.created_at).toLocaleDateString() : ""}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${priorityStyle(t.priority)}`}>
                                                {t.priority || "Normal"}
                                            </span>
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${statusStyle(t.status)}`}>
                                                {t.status || "Unknown"}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="events" className="space-y-4">
                    <div className="flex justify-end">
                        <Sheet open={isEventSheetOpen} onOpenChange={setIsEventSheetOpen}>
                            <SheetTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" /> Create Event
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-auto sm:max-w-xl">
                                <SheetHeader>
                                    <SheetTitle>New Event</SheetTitle>
                                    <SheetDescription>Create a new event for your organization.</SheetDescription>
                                </SheetHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Event Name</label>
                                        <Input value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} placeholder="e.g. Annual Conference" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <textarea
                                            className="w-full rounded-md border px-3 py-2 bg-background"
                                            value={eventForm.description}
                                            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                            rows={3}
                                            placeholder="Event details..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Date</label>
                                            <Input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Capacity</label>
                                            <Input type="number" value={eventForm.capacity} onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })} placeholder="100" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Location</label>
                                        <Input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} placeholder="Venue or online" />
                                    </div>
                                </div>
                                <SheetFooter className="gap-2">
                                    <Button onClick={handleCreateEvent} disabled={!eventForm.name}>Create Event</Button>
                                    <Button variant="ghost" onClick={() => setIsEventSheetOpen(false)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                    ) : events.length === 0 ? (
                        <Card className="border-none shadow-md p-8 text-center">
                            <p className="text-sm text-muted-foreground">No events found. Create your first event.</p>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {events.map((evt) => (
                                <Card key={evt.id} className="border-none shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{evt.name}</CardTitle>
                                        {evt.description && <CardDescription>{evt.description}</CardDescription>}
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {evt.date && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" /> {new Date(evt.date).toLocaleDateString()}
                                            </div>
                                        )}
                                        {evt.location && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4" /> {evt.location}
                                            </div>
                                        )}
                                        {evt.capacity && (
                                            <Badge variant="secondary">Capacity: {evt.capacity}</Badge>
                                        )}
                                        <div className="pt-2">
                                            <Button variant="outline" size="sm" className="text-destructive" onClick={() => evt.id && handleDeleteEvent(evt.id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="plans" className="space-y-4">
                    <div className="flex justify-end">
                        <Sheet open={isPlanSheetOpen} onOpenChange={setIsPlanSheetOpen}>
                            <SheetTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" /> Create Plan
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-auto sm:max-w-xl">
                                <SheetHeader>
                                    <SheetTitle>New Subscription Plan</SheetTitle>
                                    <SheetDescription>Create a new subscription plan.</SheetDescription>
                                </SheetHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Plan Name</label>
                                        <Input value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} placeholder="e.g. Pro Plan" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <textarea
                                            className="w-full rounded-md border px-3 py-2 bg-background"
                                            value={planForm.description}
                                            onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                                            rows={3}
                                            placeholder="Plan details..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Price</label>
                                            <Input type="number" value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })} placeholder="99.99" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Currency</label>
                                            <select className="w-full rounded-md border px-3 py-2 bg-background" value={planForm.currency} onChange={(e) => setPlanForm({ ...planForm, currency: e.target.value })}>
                                                <option value="ETB">ETB</option>
                                                <option value="USD">USD</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Billing Cycle</label>
                                            <select className="w-full rounded-md border px-3 py-2 bg-background" value={planForm.billing_cycle} onChange={(e) => setPlanForm({ ...planForm, billing_cycle: e.target.value })}>
                                                <option value="monthly">Monthly</option>
                                                <option value="yearly">Yearly</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <SheetFooter className="gap-2">
                                    <Button onClick={handleCreatePlan} disabled={!planForm.name}>Create Plan</Button>
                                    <Button variant="ghost" onClick={() => setIsPlanSheetOpen(false)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                    ) : plans.length === 0 ? (
                        <Card className="border-none shadow-md p-8 text-center">
                            <p className="text-sm text-muted-foreground">No subscription plans found. Create your first plan.</p>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {plans.map((plan) => (
                                <Card key={plan.id} className="border-none shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                                        {plan.description && <CardDescription>{plan.description}</CardDescription>}
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {plan.price != null && (
                                            <p className="text-2xl font-black text-primary">
                                                {plan.currency || "ETB"} {plan.price}
                                                <span className="text-sm font-normal text-muted-foreground">/{plan.billing_cycle || "month"}</span>
                                            </p>
                                        )}
                                        <div className="pt-2">
                                            <Button variant="outline" size="sm" className="text-destructive" onClick={() => plan.id && handleDeletePlan(plan.id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
