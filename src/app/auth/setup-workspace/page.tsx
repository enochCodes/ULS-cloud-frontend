"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"
import { Loader2, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authService } from "@/services/core/auth"
import { isAuthenticated, removeToken, getUserDisplayName } from "@/lib/auth"

const formSchema = z.object({
    name: z.string().min(2, { message: "Organization name must be at least 2 characters" }),
    subdomain: z.string().min(3, { message: "Subdomain must be at least 3 characters" })
        .regex(/^[a-z0-9-]+$/, { message: "Only lowercase letters, numbers and hyphens allowed" }),
})

type FormData = z.infer<typeof formSchema>

export default function SetupWorkspacePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

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

    const onSubmit = async (data: FormData) => {
        setIsLoading(true)
        setError(null)
        try {
            await authService.createOrganization({
                name: data.name,
                subdomain: data.subdomain,
            })

            removeToken()
            router.push("/auth/login?registered=true")
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

    const displayName = getUserDisplayName()

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted/30 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg"
            >
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

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            </motion.div>
        </div>
    )
}
