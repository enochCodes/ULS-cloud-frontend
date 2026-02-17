"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { getUserDisplayName, getUserEmail, getUserInitials, getUserRole, hasMinimumRole, logout, UserRole } from "@/lib/auth"
import {
  LayoutGrid,
  Package,
  Settings,
  Search,
  Users,
  MessageSquare,
  LogOut
} from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { organizationService, Organization } from "@/services/api/organization"

const APP_SLUG_MAP: Record<string, { name: string; href: string; icon: React.ElementType; minRole?: UserRole }> = {
  crm: { name: "Neuro CRM", href: "/crm", icon: Users },
  ticketing: { name: "Quantum Support", href: "/ticketing", icon: MessageSquare },
  marketplace: { name: "App Marketplace", href: "/marketplace", icon: Package },
}

interface SystemLayoutProps {
  children: React.ReactNode
}

export function SystemLayout({ children }: SystemLayoutProps) {
  const pathname = usePathname()
  const [org, setOrg] = React.useState<Organization | null>(null)
  const [userName, setUserName] = React.useState("Admin User")
  const [userEmail, setUserEmail] = React.useState("admin@uls.cloud")
  const [userInitials, setUserInitials] = React.useState("A")
  const [userRole, setUserRole] = React.useState<UserRole>("user")

  React.useEffect(() => {
    setUserName(getUserDisplayName())
    setUserEmail(getUserEmail())
    setUserInitials(getUserInitials())
    setUserRole(getUserRole())
  }, [])

  React.useEffect(() => {
    const load = async () => {
      try {
        const orgs = await organizationService.list()
        if (orgs?.length) setOrg(orgs[0])
        else setOrg({ id: 0, name: "Organization", apps: ["crm"] })
      } catch {
        setOrg({ id: 0, name: "Organization", apps: ["crm"] })
      }
    }
    load()
  }, [])

  const activeAppSlugs = org?.apps?.filter((s) => APP_SLUG_MAP[s]) ?? ["crm"]
  const appItems = activeAppSlugs.map((slug) => APP_SLUG_MAP[slug]).filter(Boolean)
  
  // Build navigation items with role-based filtering
  const allItems = [
    ...appItems,
    { name: "App Marketplace", href: "/marketplace", icon: Package, minRole: undefined as UserRole | undefined },
    { name: "Admin Control", href: "/settings", icon: Settings, minRole: "system_admin" as UserRole | undefined },
  ].filter(item => !item.minRole || hasMinimumRole(item.minRole))

  const sidebarGroups = [
    { title: "Main Hub", items: [{ name: "Overview", href: "/dashboard", icon: LayoutGrid }] },
    { title: "Apps", items: allItems },
  ]

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <aside className="hidden w-64 flex-col border-r bg-muted/20 md:flex">
        <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-black uppercase tracking-tighter hover:opacity-80 transition-opacity">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                    U
                </div>
                <span className="text-lg">ULS <span className="text-primary">Admin</span></span>
            </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4">
            <nav className="space-y-8">
                {sidebarGroups.map((group) => (
                    <div key={group.title}>
                         <h3 className="mb-2 px-2 text-xs font-black uppercase tracking-widest text-muted-foreground/70">
                            {group.title}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                            isActive 
                                                ? "bg-primary/10 text-primary font-bold shadow-sm" 
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>
        </div>
        <div className="border-t p-4 bg-background/50 backdrop-blur-sm">
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-4 border border-primary/5">
                <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                        {org?.name || "Organization"}
                    </span>
                </div>
                {org?.subdomain && (
                    <p className="text-[10px] text-muted-foreground">{org.subdomain}.ulsplatform.com</p>
                )}
            </div>
            <div className="mt-4 flex items-center gap-3 px-1">
                 <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-lg">
                    {userInitials}
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold">{userName}</p>
                      <Badge variant="secondary" className="text-[8px] px-1 py-0 capitalize shrink-0">
                        {userRole}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
                 </div>
                 <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                    onClick={logout}
                 >
                    <LogOut className="h-4 w-4" />
                 </Button>
            </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 z-10 sticky top-0">
            <div className="flex items-center gap-4 w-full max-w-md">
                <div className="relative w-full group">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                        type="search" 
                        placeholder="Search system resources..." 
                        className="w-full rounded-full bg-muted/40 pl-9 border-transparent focus:bg-background focus:border-primary/20 transition-all font-medium placeholder:text-muted-foreground/70"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-[10px] font-black tracking-widest px-3 py-1 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 shadow-sm animate-pulse-slow">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    CORE CONNECTED
                </div>
                <ThemeToggle />
                <UserNav />
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 scroll-smooth">
            <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                {children}
            </div>
        </main>
      </div>
    </div>
  )
}
