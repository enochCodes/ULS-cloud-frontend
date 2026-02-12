"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Package,
    CheckCircle,
    Star,
    Zap,
    Search,
    BrainCircuit,
    LayoutGrid,
    MessageSquare,
    Shield
} from "lucide-react"

// Only Neural CRM is available; others coming soon. Apps loaded dynamically when app management API is ready.
const apps = [
    { 
        id: "crm", 
        name: "Neuro CRM", 
        desc: "Autonomous relationship management. Predicts churn and automates outreach.", 
        category: "Growth",
        available: true,
        comingSoon: false,
        icon: BrainCircuit,
        color: "text-indigo-500 bg-indigo-500/10",
        href: "/crm"
    },
    { 
        id: "support", 
        name: "Quantum Support", 
        desc: "AI-native ticketing that resolves 80% of issues autonomously via NLP.", 
        category: "Service",
        available: false,
        comingSoon: true,
        icon: MessageSquare,
        color: "text-blue-500 bg-blue-500/10",
        href: "#"
    },
    { 
        id: "inventory", 
        name: "Sync Inventory", 
        desc: "Hyper-accurate supply chain sync leveraging predictive logistics.", 
        category: "Operations",
        available: false,
        comingSoon: true,
        icon: Package,
        color: "text-amber-500 bg-amber-500/10",
        href: "#"
    },
    { 
        id: "security", 
        name: "Sentinel Auth", 
        desc: "Biometric and behavioral-based zero-trust security layer.", 
        category: "Security",
        available: false,
        comingSoon: true,
        icon: Shield,
        color: "text-emerald-500 bg-emerald-500/10",
        href: "#"
    },
    { 
        id: "analytics", 
        name: "Edge Analytics", 
        desc: "Sub-millisecond decisioning powered by local organizational LLMs.", 
        category: "Intelligence",
        available: false,
        comingSoon: true,
        icon: LayoutGrid,
        color: "text-purple-500 bg-purple-500/10",
        href: "#"
    },
]

export default function MarketplacePage() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">App Marketplace</h1>
                    <p className="text-muted-foreground mt-1">Expand your workspace capabilities with neural modules.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search modules..." className="pl-10 rounded-full bg-background" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {apps.map((app) => (
                    <Card key={app.id} className="border-none shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300 flex flex-col overflow-hidden group">
                        <div className={`h-2 w-full ${app.available ? 'bg-primary' : 'bg-muted'}`} />
                        <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${app.color} group-hover:scale-110 transition-transform`}>
                                <app.icon className="h-7 w-7" />
                            </div>
                            <Badge variant={app.available ? "default" : "secondary"} className="uppercase tracking-widest text-[10px] font-bold">
                                {app.available ? (
                                    <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Available</span>
                                ) : "Coming Soon"}
                            </Badge>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4 pt-4">
                            <div>
                                <h3 className="text-xl font-bold mb-1">{app.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{app.desc}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="text-[10px]">{app.category}</Badge>
                                {app.available && <Badge variant="outline" className="text-[10px] border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950">v1.0</Badge>}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            {app.available ? (
                                <Link href={app.href} className="w-full">
                                    <Button className="w-full" variant="outline">Open Module</Button>
                                </Link>
                            ) : (
                                <Button className="w-full" variant="secondary" disabled>
                                    Coming Soon
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="mt-12 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 -mr-12 -mt-12 opacity-10">
                    <BrainCircuit className="h-64 w-64" />
                </div>
                <div className="relative z-10 max-w-2xl space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white border border-white/20">
                        <Star className="h-3 w-3 fill-current" /> App Forge — Coming Soon
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Create your own neural apps in minutes.</h2>
                    <p className="text-lg text-white/70">
                        No code required. Describe your logic, and our generative engine builds the schema, UI, and API endpoints instantly. App Forge is currently in development.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <Button size="lg" variant="secondary" className="font-bold rounded-full" disabled>Coming Soon</Button>
                        <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 rounded-full" asChild>
                            <Link href="/marketplace">View Marketplace</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
