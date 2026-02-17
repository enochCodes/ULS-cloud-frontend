"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Package,
    CheckCircle,
    Star,
    Search,
    BrainCircuit,
    LayoutGrid,
    MessageSquare,
    Shield,
    Loader2,
    Users
} from "lucide-react"
import { adminService, AdminApp } from "@/services/api/admin"
import { organizationService } from "@/services/api/organization"
import type { LucideIcon } from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
    users: Users,
    ticket: MessageSquare,
    package: Package,
    settings: Shield,
    brain: BrainCircuit,
    layout: LayoutGrid,
}

const COLOR_MAP: Record<string, string> = {
    crm: "text-indigo-500 bg-indigo-500/10",
    ticketing: "text-blue-500 bg-blue-500/10",
    marketplace: "text-purple-500 bg-purple-500/10",
    inventory: "text-amber-500 bg-amber-500/10",
    security: "text-emerald-500 bg-emerald-500/10",
    analytics: "text-purple-500 bg-purple-500/10",
}

const HREF_MAP: Record<string, string> = {
    crm: "/crm",
    ticketing: "/ticketing",
    marketplace: "/marketplace",
}

export default function MarketplacePage() {
    const [apps, setApps] = useState<AdminApp[]>([])
    const [orgApps, setOrgApps] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [activating, setActivating] = useState<string | null>(null)
    const [orgId, setOrgId] = useState<number | null>(null)

    useEffect(() => {
        const load = async () => {
            try {
                const [appList, orgs] = await Promise.all([
                    adminService.getApps(),
                    organizationService.list(),
                ])
                setApps(appList)
                if (orgs?.length) {
                    setOrgId(orgs[0].id)
                    setOrgApps(orgs[0].apps || [])
                }
            } catch {
                setApps([])
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [])

    const filteredApps = apps.filter((app) => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return app.name.toLowerCase().includes(q) || app.description.toLowerCase().includes(q) || app.category?.toLowerCase().includes(q)
    })

    const handleToggleApp = async (slug: string) => {
        if (!orgId) return
        setActivating(slug)
        try {
            const isActive = orgApps.includes(slug)
            const newApps = isActive ? orgApps.filter((a) => a !== slug) : [...orgApps, slug]
            await organizationService.updateApps({ id: orgId, apps: newApps })
            setOrgApps(newApps)
        } catch (err) {
            console.error("Failed to update apps", err)
        } finally {
            setActivating(null)
        }
    }

    const getIcon = (app: AdminApp): LucideIcon => {
        return ICON_MAP[app.icon] || ICON_MAP[app.slug] || BrainCircuit
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">App Marketplace</h1>
                    <p className="text-muted-foreground mt-1">Expand your workspace capabilities with modules.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search modules..."
                        className="pl-10 rounded-full bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : filteredApps.length === 0 ? (
                <div className="text-center py-24">
                    <p className="text-muted-foreground">{searchQuery ? "No apps match your search." : "No apps available yet."}</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredApps.map((app) => {
                        const Icon = getIcon(app)
                        const color = COLOR_MAP[app.slug] || "text-slate-500 bg-slate-500/10"
                        const isActivated = orgApps.includes(app.slug)
                        const href = HREF_MAP[app.slug] || "#"

                        return (
                            <Card key={app.id} className="border-none shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300 flex flex-col overflow-hidden group">
                                <div className={`h-2 w-full ${app.available ? 'bg-primary' : 'bg-muted'}`} />
                                <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                                        <Icon className="h-7 w-7" />
                                    </div>
                                    <div className="flex gap-2">
                                        {isActivated && (
                                            <Badge variant="default" className="uppercase tracking-widest text-[10px] font-bold">
                                                <CheckCircle className="h-3 w-3 mr-1" /> Active
                                            </Badge>
                                        )}
                                        <Badge variant={app.available ? "default" : "secondary"} className="uppercase tracking-widest text-[10px] font-bold">
                                            {app.available ? "Available" : "Coming Soon"}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4 pt-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{app.name}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{app.description}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="text-[10px]">{app.category}</Badge>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 gap-2">
                                    {app.available && isActivated && href !== "#" ? (
                                        <Link href={href} className="flex-1">
                                            <Button className="w-full" variant="outline">Open Module</Button>
                                        </Link>
                                    ) : app.available ? (
                                        <Button
                                            className="w-full"
                                            variant={isActivated ? "outline" : "default"}
                                            onClick={() => handleToggleApp(app.slug)}
                                            disabled={activating === app.slug}
                                        >
                                            {activating === app.slug ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : null}
                                            {isActivated ? "Deactivate" : "Activate"}
                                        </Button>
                                    ) : (
                                        <Button className="w-full" variant="secondary" disabled>
                                            Coming Soon
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}

            <div className="mt-12 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 -mr-12 -mt-12 opacity-10">
                    <BrainCircuit className="h-64 w-64" />
                </div>
                <div className="relative z-10 max-w-2xl space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white border border-white/20">
                        <Star className="h-3 w-3 fill-current" /> App Forge — Coming Soon
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Create your own apps in minutes.</h2>
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
