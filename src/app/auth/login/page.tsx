"use client"

import * as React from "react"
import { Suspense } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authService } from "@/services/core/auth"
import { setToken, hasOrganization } from "@/lib/auth"

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type FormData = z.infer<typeof formSchema>

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const isRegistered = searchParams.get("registered") === "true"
    const fromPath = searchParams.get("from")

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async (data: FormData) => {
        setIsLoading(true)
        setError(null)
        try {
            const token = await authService.login(data)
            setToken(token)
            // If user has no organization, redirect to workspace setup
            if (!hasOrganization()) {
                router.push("/auth/setup-workspace")
                return
            }
            // Redirect to the original page if exists, otherwise dashboard
            router.push(fromPath || "/dashboard")
        } catch (err) {
            console.error(err)
            let message = "Invalid email or password"
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

    return (
        <>
            {isRegistered && (
                <div className="mb-6 rounded-lg bg-green-500/10 p-3 text-sm font-medium text-green-600">
                    Account created successfully! Please sign in.
                </div>
            )}
            {error && (
                <div className="mb-6 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" placeholder="name@example.com" type="email" {...register("email")} className="h-11" />
                    {errors.email && <p className="text-xs font-medium text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
                    </div>
                    <Input id="password" type="password" {...register("password")} className="h-11" />
                    {errors.password && <p className="text-xs font-medium text-destructive">{errors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : "Sign In"}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have a workspace yet?{" "}
                <Link href="/auth/register" className="font-medium text-primary hover:underline">
                    Create an account
                </Link>
            </div>
        </>
    )
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted/30 px-4 py-12">
            <div className="absolute top-8 left-8">
                <Link href="/" className="group flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to home
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <Card className="border-none shadow-2xl">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">U</div>
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your workspace
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}>
                            <LoginForm />
                        </Suspense>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
