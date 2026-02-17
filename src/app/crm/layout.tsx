"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { Search } from "lucide-react"
import {
    Users,
    BarChart3,
    LayoutGrid,
    ClipboardList,
    MessageSquare,
    Settings
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const crmNav = [
    { name: "Dashboard", href: "/crm", icon: LayoutGrid },
    { name: "Orders", href: "/crm/orders", icon: ClipboardList },
    { name: "Customers", href: "/crm/customers", icon: Users },
    { name: "Analytics", href: "/crm/analytics", icon: BarChart3 },
    { name: "Communications", href: "/crm/communications", icon: MessageSquare },
    { name: "Settings", href: "/crm/settings", icon: Settings },
]

export default function CRMLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
            {/* CRM Sidebar - theme-aware */}
            <aside className="w-20 lg:w-64 flex flex-col border-r border-border bg-card/50 transition-all duration-300">
                <div className="flex h-20 items-center border-b border-border px-6">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <Users className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="hidden lg:block text-lg font-black tracking-tighter uppercase italic">Neuro <span className="text-primary">CRM</span></span>
                    </Link>
                </div>

                <div className="flex-1 overflow-auto py-8">
                    <nav className="space-y-2 px-3 lg:px-4">
                        {crmNav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all group",
                                    pathname === item.href || (pathname === "/crm" && item.href === "/crm")
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary-foreground" : "group-hover:text-primary")} />
                                <span className="hidden lg:block">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-border flex flex-col gap-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                        <LayoutGrid className="h-4 w-4" />
                        <span className="hidden lg:block">System Hub</span>
                    </Link>
                </div>
            </aside>

            {/* Main CRM Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="h-20 border-b border-border bg-background/95 backdrop-blur-md px-8 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                placeholder="Search intelligence..."
                                className="bg-muted/40 border border-border rounded-full pl-10 pr-6 py-2 text-sm w-64 lg:w-96 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                        <UserNav />
                    </div>
                </header>
                <main className="flex-1 overflow-auto bg-background">
                    <div className="p-8 lg:p-12">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
