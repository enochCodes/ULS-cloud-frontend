import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DomainLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { domain: string }
}) {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
            {params.domain !== "_root" && (
                <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
                    <div className="container flex h-16 items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold uppercase">
                                {params.domain.charAt(0)}
                            </div>
                            <span className="text-xl font-bold tracking-tight capitalize">{params.domain}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <Link href="/auth/login">
                                <button className="text-sm font-medium hover:text-primary transition-colors">SignIn</button>
                            </Link>
                        </div>
                    </div>
                </header>
            )}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
            {params.domain !== "_root" && (
                <footer className="border-t py-6 bg-muted/20 mt-auto">
                    <div className="container text-center text-sm text-muted-foreground">
                        <p>© 2026 {params.domain}. Powered by <span className="text-primary font-semibold">ULS Cloud</span></p>
                    </div>
                </footer>
            )}
        </div>
    )
}
