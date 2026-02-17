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
import { setToken } from "@/lib/auth"

const formSchema = z.object({
    first_name: z.string().min(2, { message: "First name must be at least 2 characters" }),
    last_name: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone_number: z.string().optional(),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
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

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async (data: FormData) => {
        setIsLoading(true)
        setError(null)
        try {
            const token = await authService.register({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
                phone_number: data.phone_number || undefined,
            })

            setToken(token)
            router.push("/auth/setup-workspace")
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
        }
    }

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
                        <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
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
                                <Label htmlFor="phone_number">Phone Number <span className="text-muted-foreground">(optional)</span></Label>
                                <Input id="phone_number" placeholder="+1 (555) 000-0000" type="tel" {...register("phone_number")} className="h-11" />
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
                                        Creating account...
                                    </>
                                ) : "Create Account"}
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
