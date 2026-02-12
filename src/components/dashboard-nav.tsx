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
import { appService, AppConfig } from "@/services/appService"

const iconMap: Record<string, React.ElementType> = {
    "users": Users,
    "ticket": MessageSquare,
    "package": Package,
    "settings": Settings,
    "layout": LayoutDashboard
}

export function DashboardNav() {
    const pathname = usePathname()
    const [apps, setApps] = React.useState<AppConfig[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await appService.getApps()
                setApps(data)
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
            {/* Direct Dashboard Link */}
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

            {apps.map((app, index) => {
                const Icon = iconMap[app.icon] || Package
                const href = app.slug.startsWith("/") ? app.slug : `/${app.slug}`

                return (
                    <Link
                        key={index}
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
