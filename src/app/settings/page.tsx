"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Building2, Globe, Bell, Loader2, Save } from "lucide-react"
import { organizationService, Organization } from "@/services/api/organization"
import { crmSettings, OrgSettings } from "@/services/api/crm"
import { AuthGuard } from "@/components/auth-guard"

function SettingsContent() {
    const [org, setOrg] = useState<Organization | null>(null)
    const [, setSettings] = useState<OrgSettings | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({ name: "", address: "" })
    const [crmFormData, setCrmFormData] = useState({
        branding_name: "",
        default_message_channel: "email" as "sms" | "email",
        reminder_enabled: false,
        reminder_days_before: 7,
    })

    useEffect(() => {
        const load = async () => {
            try {
                const [orgs, crmSettingsData] = await Promise.all([
                    organizationService.list(),
                    crmSettings.get().catch(() => null),
                ])
                if (orgs?.length) {
                    const o = orgs[0]
                    setOrg(o)
                    setFormData({ name: o.name ?? "", address: o.address ?? "" })
                }
                if (crmSettingsData) {
                    setSettings(crmSettingsData)
                    setCrmFormData({
                        branding_name: crmSettingsData.branding_name || "",
                        default_message_channel: crmSettingsData.default_message_channel || "email",
                        reminder_enabled: crmSettingsData.reminder_enabled ?? false,
                        reminder_days_before: crmSettingsData.reminder_days_before ?? 7,
                    })
                }
            } catch {
                setOrg(null)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            if (org?.id) {
                await organizationService.update(org.id, { ...org, ...formData })
                setOrg((p) => p ? { ...p, ...formData } : null)
            }
            await crmSettings.update({
                branding_name: crmFormData.branding_name,
                default_message_channel: crmFormData.default_message_channel,
                reminder_enabled: crmFormData.reminder_enabled,
                reminder_days_before: crmFormData.reminder_days_before,
            })
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
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Admin Control</h1>
                    <p className="text-muted-foreground mt-1">Manage organization-wide policies and configurations.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[300px]">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                Organization Profile
                            </CardTitle>
                            <CardDescription>
                                Visible identity across the ULS ecosystem.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="org-name">Organization Name</Label>
                                <Input
                                    id="org-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Primary Domain</Label>
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-mono text-muted-foreground">
                                            {org?.subdomain ? `${org.subdomain}.ulsplatform.com` : "Not set"}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Address</Label>
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                                        placeholder="Organization address"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Branding Name</Label>
                                    <Input
                                        value={crmFormData.branding_name}
                                        onChange={(e) => setCrmFormData((p) => ({ ...p, branding_name: e.target.value }))}
                                        placeholder="Display name for branding"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Default Message Channel</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={crmFormData.default_message_channel}
                                        onChange={(e) => setCrmFormData((p) => ({ ...p, default_message_channel: e.target.value as "sms" | "email" }))}
                                    >
                                        <option value="email">Email</option>
                                        <option value="sms">SMS</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Active Apps</Label>
                                <p className="text-sm text-muted-foreground">{org?.apps?.length ? org.apps.join(", ") : "No apps activated"}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                Reminder Settings
                            </CardTitle>
                            <CardDescription>
                                Configure reminder notifications for orders and deadlines.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable Reminders</Label>
                                    <p className="text-xs text-muted-foreground">Send reminders before order deadlines.</p>
                                </div>
                                <Switch
                                    checked={crmFormData.reminder_enabled}
                                    onCheckedChange={(c: boolean) => setCrmFormData((p) => ({ ...p, reminder_enabled: c }))}
                                />
                            </div>
                            <Separator />
                            <div className="grid gap-2 max-w-[200px]">
                                <Label>Days Before Deadline</Label>
                                <Input
                                    type="number"
                                    value={crmFormData.reminder_days_before}
                                    onChange={(e) => setCrmFormData((p) => ({ ...p, reminder_days_before: Number(e.target.value) }))}
                                    min={1}
                                    max={30}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Security Settings
                            </CardTitle>
                            <CardDescription>
                                Configure authentication strength and session policies.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enforce MFA</Label>
                                    <p className="text-xs text-muted-foreground">Require Multi-Factor Auth for all admin roles.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>IP Whitelisting</Label>
                                    <p className="text-xs text-muted-foreground">Restrict access to corporate VPNs.</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="grid gap-2 mt-4">
                                <Label>Session Timeout (Minutes)</Label>
                                <Input type="number" defaultValue="30" className="max-w-[150px]" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default function SettingsPage() {
    return (
        <AuthGuard requiredRole="manager">
            <SettingsContent />
        </AuthGuard>
    )
}
