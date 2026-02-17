"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    Package,
    MessageSquare,
    Loader2
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { organizationService } from "@/services/api/organization"

const APP_CONFIG: Record<string, { name: string; href: string; icon: React.ElementType }> = {
    crm: { name: "Neuro CRM", href: "/crm", icon: Users },
    ticketing: { name: "Quantum Support", href: "/ticketing", icon: MessageSquare },
}

export function DashboardNav() {
    const pathname = usePathname()
    const [orgApps, setOrgApps] = React.useState<string[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchOrg = async () => {
            try {
                const orgs = await organizationService.list()
                if (orgs?.length) {
                    setOrgApps(orgs[0].apps || [])
                }
            } catch (err) {
                console.error("Failed to fetch organization", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchOrg()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-xs font-bold uppercase tracking-widest">Loading Apps</span>
            </div>
        )
    }

    const activeApps = orgApps
        .filter((slug) => APP_CONFIG[slug])
        .map((slug) => ({ slug, ...APP_CONFIG[slug] }))

    return (
        <nav className="grid items-start gap-2">
            <Link
                href="/dashboard"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    pathname === "/dashboard"
                        ? "bg-primary/10 text-primary font-bold shadow-sm"
                        : "transparent hover:bg-accent hover:text-accent-foreground",
                    "justify-start rounded-xl px-4 py-3"
                )}
            >
                <LayoutDashboard className="mr-3 h-4 w-4" />
                <span>Overview</span>
            </Link>

            {activeApps.map((app) => {
                const Icon = app.icon

                return (
                    <Link
                        key={app.slug}
                        href={app.href}
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            pathname.startsWith(app.href)
                                ? "bg-primary/10 text-primary font-bold shadow-sm"
                                : "transparent hover:bg-accent hover:text-accent-foreground",
                            "justify-start rounded-xl px-4 py-3"
                        )}
                    >
                        <Icon className="mr-3 h-4 w-4" />
                        <span>{app.name}</span>
                    </Link>
                )
            })}

            <Link
                href="/marketplace"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    pathname.startsWith("/marketplace")
                        ? "bg-primary/10 text-primary font-bold shadow-sm"
                        : "transparent hover:bg-accent hover:text-accent-foreground",
                    "justify-start rounded-xl px-4 py-3"
                )}
            >
                <Package className="mr-3 h-4 w-4" />
                <span>App Marketplace</span>
            </Link>
        </nav>
    )
}
