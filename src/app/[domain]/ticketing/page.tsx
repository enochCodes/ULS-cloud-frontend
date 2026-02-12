"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Search,
    Clock,
    CheckCircle2,
    AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const tickets = [
    { id: "#T-1284", subject: "Unable to export report", priority: "High", status: "Open", assignee: "Alex M.", time: "2h ago" },
    { id: "#T-1285", subject: "Feature request: Dark mode", priority: "Low", status: "In Progress", assignee: "Sarah C.", time: "4h ago" },
    { id: "#T-1286", subject: "Billing issue - double charge", priority: "Critical", status: "Resolved", assignee: "System", time: "1d ago" },
    { id: "#T-1287", subject: "How to add new team member?", priority: "Medium", status: "Open", assignee: "Unassigned", time: "2d ago" },
]

export default function TicketingPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Support Ticketing</h2>
                <Button className="shadow-lg shadow-primary/20">
                    New Ticket
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
                                <div className="text-2xl font-bold">14</div>
                                <div className="text-xs text-muted-foreground">Pending Tickets</div>
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
                                <div className="text-2xl font-bold">128</div>
                                <div className="text-xs text-muted-foreground">Resolved Successfully</div>
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
                                <div className="text-2xl font-bold">2</div>
                                <div className="text-xs text-muted-foreground">Critical Escalations</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6">
                <Card className="border-none shadow-md">
                    <CardHeader className="border-b pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle>All Tickets</CardTitle>
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Search by ID or subject..." className="pl-10 h-9" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {tickets.map((t) => (
                            <div key={t.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-4 mb-2 md:mb-0">
                                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{t.id}</span>
                                    <div>
                                        <p className="font-semibold text-sm">{t.subject}</p>
                                        <p className="text-xs text-muted-foreground">Assignee: {t.assignee} • {t.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${t.priority === "Critical" ? "bg-red-500 text-white" :
                                        t.priority === "High" ? "bg-orange-500/10 text-orange-600" :
                                            "bg-muted text-muted-foreground"
                                        }`}>
                                        {t.priority}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${t.status === "Open" ? "border-blue-500 text-blue-600 border" :
                                        t.status === "In Progress" ? "border-yellow-500 text-yellow-600 border" :
                                            "border-green-500 text-green-600 border"
                                        }`}>
                                        {t.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
