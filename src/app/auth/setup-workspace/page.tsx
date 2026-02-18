"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"
import { Loader2, Building2, Package, CheckCircle, ArrowRight, Users, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authService } from "@/services/core/auth"
import { organizationService } from "@/services/api/organization"
import { isAuthenticated, removeToken, getUserDisplayName } from "@/lib/auth"

const formSchema = z.object({
    name: z.string().min(2, { message: "Organization name must be at least 2 characters" }),
    subdomain: z.string().min(3, { message: "Subdomain must be at least 3 characters" })
        .regex(/^[a-z0-9-]+$/, { message: "Only lowercase letters, numbers and hyphens allowed" }),
})

type FormData = z.infer<typeof formSchema>

interface AvailableApp {
    slug: string
    name: string
    description: string
    icon: React.ElementType
    isDefault: boolean
}

const AVAILABLE_APPS: AvailableApp[] = [
    {
        slug: "crm",
        name: "Neuro CRM",
        description: "Manage customers, orders, communications and analytics.",
        icon: Users,
        isDefault: true,
    },
    {
        slug: "ticketing",
        name: "Quantum Support",
        description: "Support ticketing and event management for your customers.",
        icon: MessageSquare,
        isDefault: false,
    },
]

export default function SetupWorkspacePage() {
    const router = useRouter()
    const [step, setStep] = React.useState<"create" | "apps">("create")
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [selectedApps, setSelectedApps] = React.useState<string[]>(["crm"])
    const [createdOrgId, setCreatedOrgId] = React.useState<number | null>(null)

    React.useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/auth/login")
        }
    }, [router])

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            subdomain: "",
        },
    })

    const subdomain = watch("subdomain")

    const onSubmitOrg = async (data: FormData) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await authService.createOrganization({
                name: data.name,
                subdomain: data.subdomain,
            })
            // Try to extract org ID from response for app update
            const orgData = res?.data as { id?: number } | undefined
            if (orgData?.id) {
                setCreatedOrgId(orgData.id)
            }
            // Move to app selection step
            setStep("apps")
        } catch (err) {
            console.error(err)
            let message = "Failed to create workspace. Please try again."
            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message || message
            } else if (err instanceof Error) {
                message = err.message || message
            }
            setError(message)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleApp = (slug: string) => {
        // Don't allow deselecting default apps
        const app = AVAILABLE_APPS.find(a => a.slug === slug)
        if (app?.isDefault) return

        setSelectedApps(prev =>
            prev.includes(slug)
                ? prev.filter(s => s !== slug)
                : [...prev, slug]
        )
    }

    const handleFinish = async () => {
        // Try to save selected apps if we have the org ID
        if (createdOrgId && selectedApps.length > 0) {
            try {
                await organizationService.updateApps({ id: createdOrgId, apps: selectedApps })
            } catch {
                // App selection can be managed later from the marketplace
            }
        }
        // Remove token and redirect to login to get a fresh token with org_id and staff_role
        removeToken()
        router.push("/auth/login?registered=true")
    }

    const displayName = getUserDisplayName()

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted/30 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg"
                key={step}
            >
                {step === "create" && (
                    <Card className="border-none shadow-2xl">
                        <CardHeader className="space-y-1 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Building2 className="h-6 w-6" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Set up your workspace</CardTitle>
                            <CardDescription>
                                Welcome{displayName !== "User" ? `, ${displayName}` : ""}! Create your organization to get started.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <div className="mb-6 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmitOrg)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Organization Name</Label>
                                    <Input id="name" placeholder="Acme Inc." {...register("name")} className="h-11" />
                                    {errors.name && <p className="text-xs font-medium text-destructive">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subdomain">Workspace URL</Label>
                                    <div className="relative">
                                        <Input
                                            id="subdomain"
                                            placeholder="your-company"
                                            {...register("subdomain")}
                                            className="h-11 pr-32"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground font-medium border-l pl-3">
                                            .ulsplatform.com
                                        </div>
                                    </div>
                                    {subdomain && !errors.subdomain && (
                                        <p className="text-[10px] text-muted-foreground">
                                            Your site will be available at <span className="text-primary font-bold">{subdomain}.ulsplatform.com</span>
                                        </p>
                                    )}
                                    {errors.subdomain && <p className="text-xs font-medium text-destructive">{errors.subdomain.message}</p>}
                                </div>

                                <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Setting up workspace...
                                        </>
                                    ) : "Create Workspace"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {step === "apps" && (
                    <Card className="border-none shadow-2xl">
                        <CardHeader className="space-y-1 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Package className="h-6 w-6" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Choose your apps</CardTitle>
                            <CardDescription>
                                Select the apps you want to use. CRM is included by default. You can always change this later.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {AVAILABLE_APPS.map((app) => {
                                const Icon = app.icon
                                const isSelected = selectedApps.includes(app.slug)
                                return (
                                    <button
                                        key={app.slug}
                                        type="button"
                                        onClick={() => toggleApp(app.slug)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                                            isSelected
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/30"
                                        } ${app.isDefault ? "cursor-default" : "cursor-pointer"}`}
                                    >
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm">{app.name}</span>
                                                {app.isDefault && (
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">Default</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5">{app.description}</p>
                                        </div>
                                        {isSelected && <CheckCircle className="h-5 w-5 text-primary shrink-0" />}
                                    </button>
                                )
                            })}

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-11"
                                    onClick={handleFinish}
                                >
                                    Skip for now
                                </Button>
                                <Button
                                    className="flex-1 h-11"
                                    onClick={handleFinish}
                                >
                                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </motion.div>
        </div>
    )
}
