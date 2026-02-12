"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Key, Building2, Globe, Mail, Users, Bell } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Admin Control</h1>
                    <p className="text-muted-foreground mt-1">Manage organization-wide policies and configurations.</p>
                </div>
                <Button>Save Changes</Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="users">Team</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
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
                                <Input id="org-name" defaultValue="Acme Corp" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="domain">Primary Domain</Label>
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-mono text-muted-foreground">acme.uls.cloud</span>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contact">Contact Email</Label>
                                    <Input id="contact" defaultValue="admin@acme.com" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                System Notifications
                            </CardTitle>
                            <CardDescription>
                                Configure alert thresholds for system anomalies.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Critical Alerts</Label>
                                    <p className="text-xs text-muted-foreground">Receive SMS for system downtime.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Performance Reports</Label>
                                    <p className="text-xs text-muted-foreground">Weekly PDF summaries of system health.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Zero-Trust Parameters
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

                 <TabsContent value="users" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Team Directory
                            </CardTitle>
                            <CardDescription>
                                Manage access roles and permissions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { name: "Admin User", role: "Owner", email: "admin@acme.com", status: "Active" },
                                    { name: "Sarah Chen", role: "Manager", email: "sarah@acme.com", status: "Active" },
                                    { name: "Mike Ross", role: "Viewer", email: "mike@acme.com", status: "Inactive" },
                                ].map((user, i) => (
                                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                           <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{user.role}</span>
                                           <div className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
