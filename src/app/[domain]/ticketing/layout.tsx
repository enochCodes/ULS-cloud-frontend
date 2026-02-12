"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import {
    Ticket,
    MessageSquare,
    Inbox,
    Clock,
    UserCheck,
    LayoutGrid
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const ticketNav = [
    { name: "Live Queue", href: "/ticketing", icon: Inbox },
    { name: "My Tickets", href: "/ticketing/mine", icon: UserCheck },
    { name: "Internal Chat", href: "/ticketing/chat", icon: MessageSquare },
    { name: "SLAs & Time", href: "/ticketing/sla", icon: Clock },
]

export default function TicketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">
            {/* Unique Support Sidebar */}
            <aside className="w-20 lg:w-72 flex flex-col border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300">
                <div className="flex h-16 items-center px-6 border-b border-slate-200 dark:border-zinc-800">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-emerald-600 flex items-center justify-center">
                            <Ticket className="h-4 w-4 text-white" />
                        </div>
                        <span className="hidden lg:block text-sm font-black tracking-widest uppercase">Quantum <span className="text-emerald-600">Support</span></span>
                    </Link>
                </div>

                <div className="flex-1 overflow-auto py-6">
                    <div className="px-6 mb-4 hidden lg:block">
                        <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Service Desk</p>
                    </div>
                    <nav className="space-y-1 px-3">
                        {ticketNav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all group",
                                    pathname === item.href
                                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                        : "text-slate-500 dark:text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-zinc-800"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", pathname === item.href ? "text-emerald-600 dark:text-emerald-400" : "group-hover:text-emerald-500")} />
                                <span className="hidden lg:block">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="p-4 bg-slate-100/50 dark:bg-zinc-800/30">
                    <Link href="/dashboard" className="flex items-center justify-center lg:justify-start gap-3 rounded-lg px-4 py-2 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm">
                        <LayoutGrid className="h-3 w-3" />
                        <span className="hidden lg:block">System Hub</span>
                    </Link>
                </div>
            </aside>

            {/* Main Support Workspace */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="h-16 border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => <div key={i} className="h-6 w-6 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-300" />)}
                        </div>
                        <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 ml-2">8 agents online</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <div className="h-8 w-px bg-slate-200 dark:border-zinc-800" />
                        <UserNav />
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
