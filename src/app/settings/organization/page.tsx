"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Palette,
    Users,
    Upload,
    CreditCard,
    Receipt,
    Loader2
} from "lucide-react"
import {
    organizationService,
    subscriptionService,
    transactionService,
    Organization,
    Subscription,
    Transaction
} from "@/services/api/organization"
import { AuthGuard } from "@/components/auth-guard"

function OrganizationSettingsContent() {
    const [org, setOrg] = useState<Organization | null>(null)
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({ name: "", address: "" })

    useEffect(() => {
        const load = async () => {
            try {
                const [orgs, subs] = await Promise.all([
                    organizationService.list(),
                    subscriptionService.list(),
                ])
                if (orgs?.length) {
                    const o = orgs[0]
                    setOrg(o)
                    setFormData({ name: o.name ?? "", address: o.address ?? "" })
                    try {
                        const tx = await transactionService.listByOrg(o.id) as { data?: Transaction[] }
                        setTransactions(Array.isArray(tx?.data) ? tx.data : [])
                    } catch {
                        setTransactions([])
                    }
                }
                setSubscriptions(Array.isArray(subs) ? subs : [])
            } catch {
                setOrg(null)
                setSubscriptions([])
                setTransactions([])
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const handleSaveGeneral = async () => {
        if (!org?.id) return
        setSaving(true)
        try {
            await organizationService.update(org.id, { ...org, ...formData })
            setOrg((p) => p ? { ...p, ...formData } : null)
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Organization Settings</h2>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList className="bg-muted p-1 rounded-lg">
                    <TabsTrigger value="general" className="px-6 py-2">General</TabsTrigger>
                    <TabsTrigger value="branding" className="px-6 py-2">Branding</TabsTrigger>
                    <TabsTrigger value="team" className="px-6 py-2">Team</TabsTrigger>
                    <TabsTrigger value="billing" className="px-6 py-2">Billing</TabsTrigger>
                    <TabsTrigger value="security" className="px-6 py-2">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                            <CardDescription>Update your workspace details and basic settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Organization Name</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                                        placeholder="Organization name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Primary Domain</Label>
                                    <Input value={org?.subdomain ? `${org.subdomain}.ulsplatform.com` : "-"} disabled />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Input
                                    value={formData.address}
                                    onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                                    placeholder="Organization address"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Workspace ID</Label>
                                <Input value={org?.id ? `org_${org.id}` : "-"} disabled />
                            </div>
                            <Button onClick={handleSaveGeneral} disabled={saving}>
                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Save Changes
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="branding">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Whitelabel Branding</CardTitle>
                            <CardDescription>Customize the look and feel of your organization workspace.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="flex items-center gap-8">
                                <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center border-dashed border-2 text-muted-foreground relative group cursor-pointer">
                                    <Upload className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                    <div className="absolute inset-x-0 bottom-0 py-1 bg-black/50 text-[8px] text-white text-center opacity-0 group-hover:opacity-100">Upload Logo</div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold">Organization Logo</h4>
                                    <p className="text-sm text-muted-foreground">Display your logo on the login page and dashboard. Recommended 512x512px.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8 pt-4 border-t">
                                <div className="space-y-4">
                                    <h4 className="font-bold flex items-center gap-2"><Palette className="h-4 w-4" /> Workspace Accent</h4>
                                    <div className="flex gap-4">
                                        {[
                                            { name: "Indigo", color: "bg-indigo-500" },
                                            { name: "Red", color: "bg-red-500" },
                                            { name: "Cyan", color: "bg-cyan-500" },
                                            { name: "Green", color: "bg-green-500" },
                                        ].map((c) => (
                                            <div key={c.name} className={`h-10 w-10 rounded-full ${c.color} cursor-pointer border-2 border-transparent hover:border-black/20`} title={c.name} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Button>Update Branding</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="team">
                    <Card className="border-none shadow-md p-12 text-center space-y-4">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                        <h3 className="text-xl font-bold">Team Management</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">Manage your team members, roles, and administrative permissions for this organization. Team API integration coming soon.</p>
                        <Button variant="outline">Invite New Member</Button>
                    </Card>
                </TabsContent>

                <TabsContent value="billing">
                    <div className="space-y-6">
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Subscription Plans</CardTitle>
                                <CardDescription>Your current plan and available upgrades.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {subscriptions.length === 0 ? (
                                    <p className="text-sm text-muted-foreground py-8 text-center">No subscription plans configured. Contact support to set up billing.</p>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {subscriptions.map((s) => (
                                            <div key={s.id} className="p-4 rounded-lg border bg-card">
                                                <h4 className="font-bold">{s.name}</h4>
                                                <p className="text-2xl font-black text-primary mt-2">{s.currency} {s.price}</p>
                                                <p className="text-xs text-muted-foreground">{s.billing_cycle}</p>
                                                {s.description && <p className="text-sm mt-2">{s.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" /> Transaction History</CardTitle>
                                <CardDescription>Payment and billing history from SSO service.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {transactions.length === 0 ? (
                                    <p className="text-sm text-muted-foreground py-8 text-center">No transactions yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {transactions.map((t, i) => (
                                            <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                                                <span className="text-sm">{t.transaction_id ?? t.id ?? "-"}</span>
                                                <span className="text-sm font-medium">{t.amount ?? "-"} {t.status ?? ""}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="security">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Organization security settings. Backend integration coming soon.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Zero-trust protocol and isolated data governance options will be available when the backend is ready.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default function OrganizationSettings() {
    return (
        <AuthGuard requiredRole="system_admin">
            <OrganizationSettingsContent />
        </AuthGuard>
    )
}
