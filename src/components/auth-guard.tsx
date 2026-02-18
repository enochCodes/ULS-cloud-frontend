"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated, hasMinimumRole, hasRole, getStaffRole, StaffRole } from "@/lib/auth"
import { Loader2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AuthGuardProps {
    children: React.ReactNode
    requiredRole?: StaffRole
    allowedRoles?: StaffRole[]
    fallback?: React.ReactNode
}

export function AuthGuard({ children, requiredRole, allowedRoles, fallback }: AuthGuardProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(true)
    const [hasAccess, setHasAccess] = useState(false)

    useEffect(() => {
        const checkAuth = () => {
            if (!isAuthenticated()) {
                router.push(`/auth/login?from=${encodeURIComponent(pathname)}`)
                return
            }

            if (allowedRoles && !hasRole(allowedRoles)) {
                setHasAccess(false)
                setIsLoading(false)
                return
            }

            if (requiredRole && !hasMinimumRole(requiredRole)) {
                setHasAccess(false)
                setIsLoading(false)
                return
            }

            setHasAccess(true)
            setIsLoading(false)
        }

        checkAuth()
    }, [pathname, router, requiredRole, allowedRoles])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    if (!hasAccess) {
        if (fallback) {
            return <>{fallback}</>
        }

        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-6 text-center max-w-md p-6">
                    <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                        <ShieldAlert className="h-8 w-8 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">Access Denied</h1>
                        <p className="text-muted-foreground">
                            You don&apos;t have permission to access this page. 
                            {(requiredRole || allowedRoles) && (
                                <span className="block mt-1">
                                    Required role: <span className="font-semibold capitalize">{allowedRoles ? allowedRoles.join(", ") : requiredRole}</span>
                                    <br />
                                    Your role: <span className="font-semibold capitalize">{getStaffRole() || "none"}</span>
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button asChild variant="outline">
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/">Go Home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return <>{children}</>
}

// Higher-order component for wrapping pages with auth
export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    requiredRole?: StaffRole
) {
    return function WrappedComponent(props: P) {
        return (
            <AuthGuard requiredRole={requiredRole}>
                <Component {...props} />
            </AuthGuard>
        )
    }
}
