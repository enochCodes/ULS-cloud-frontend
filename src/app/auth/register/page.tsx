"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authService } from "@/services/core/auth"

const formSchema = z.object({
    first_name: z.string().min(2, { message: "First name must be at least 2 characters" }),
    last_name: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    subdomain: z.string().min(3, { message: "Subdomain must be at least 3 characters" })
        .regex(/^[a-z0-9-]+$/, { message: "Only lowercase letters, numbers and hyphens allowed" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

type FormData = z.infer<typeof formSchema>

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [step, setStep] = React.useState<"registering" | "creating_org" | null>(null)

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    })

    const subdomain = watch("subdomain")

    const onSubmit = async (data: FormData) => {
        setIsLoading(true)
        setError(null)
        try {
            setStep("registering")
            await authService.register({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
            })

            setStep("creating_org")
            const token = await authService.login({
                email: data.email,
                password: data.password,
            })
            localStorage.setItem("token", token)

            await authService.createOrganization({
                name: `${data.first_name}'s Organization`,
                subdomain: data.subdomain,
            })

            localStorage.removeItem("token")

            router.push("/auth/login?registered=true")
        } catch (err) {
            console.error(err)
            let message = "Registration failed. Please try again."
            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message || message
            } else if (err instanceof Error) {
                message = err.message || message
            }
            setError(message)
        } finally {
            setIsLoading(false)
            setStep(null)
        }
    }

    const loadingText = step === "creating_org" ? "Setting up workspace..." : "Creating account..."

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
                className="w-full max-w-lg"
            >
                <Card className="border-none shadow-2xl">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">U</div>
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Create your workspace</CardTitle>
                        <CardDescription>
                            Join organizations building on ULS Cloud
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-6 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input id="first_name" placeholder="John" {...register("first_name")} className="h-11" />
                                    {errors.first_name && <p className="text-xs font-medium text-destructive">{errors.first_name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input id="last_name" placeholder="Doe" {...register("last_name")} className="h-11" />
                                    {errors.last_name && <p className="text-xs font-medium text-destructive">{errors.last_name.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input id="email" placeholder="name@company.com" type="email" {...register("email")} className="h-11" />
                                {errors.email && <p className="text-xs font-medium text-destructive">{errors.email.message}</p>}
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" {...register("password")} className="h-11" />
                                    {errors.password && <p className="text-xs font-medium text-destructive">{errors.password.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="h-11" />
                                    {errors.confirmPassword && <p className="text-xs font-medium text-destructive">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {loadingText}
                                    </>
                                ) : "Create Workspace"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="font-medium text-primary hover:underline">
                                Sign in instead
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
