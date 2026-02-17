"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    Settings,
    Package,
    MessageSquare,
    Loader2
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { adminService, AdminApp } from "@/services/api/admin"

const iconMap: Record<string, React.ElementType> = {
    "users": Users,
    "ticket": MessageSquare,
    "package": Package,
    "settings": Settings,
    "layout": LayoutDashboard
}

const slugToHref: Record<string, string> = {
    crm: "/crm",
    ticketing: "/ticketing",
    marketplace: "/marketplace",
    settings: "/settings",
}

export function DashboardNav() {
    const pathname = usePathname()
    const [apps, setApps] = React.useState<AdminApp[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await adminService.getApps()
                setApps(data.filter((a) => a.available))
            } catch (err) {
                console.error("Failed to fetch apps", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchApps()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-xs font-bold uppercase tracking-widest">Loading Apps</span>
            </div>
        )
    }

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

            {apps.map((app) => {
                const Icon = iconMap[app.icon] || Package
                const href = slugToHref[app.slug] || `/${app.slug}`

                return (
                    <Link
                        key={app.id}
                        href={href}
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            pathname.startsWith(href)
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
        </nav>
    )
}
