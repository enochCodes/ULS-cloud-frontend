"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Mail, Plus, Send, RefreshCw, Smartphone, X, Loader2 } from "lucide-react"
import { crmCommunications, crmCustomers, Customer, Message, MessageChannel, MessageTemplate } from "@/services/api/crm"

function getApiErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) return err.response?.data?.message || err.message || fallback
    if (err instanceof Error) return err.message || fallback
    return fallback
}

export default function CommunicationsPage() {
    const [activeTab, setActiveTab] = useState("messages")
    const [messages, setMessages] = useState<Message[]>([])
    const [templates, setTemplates] = useState<MessageTemplate[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [sendError, setSendError] = useState<string | null>(null)
    const [templateError, setTemplateError] = useState<string | null>(null)

    // Send Message Form State
    const [isSendOpen, setIsSendOpen] = useState(false)
    const [sendForm, setSendForm] = useState({
        customer_id: "",
        channel: "email" as MessageChannel,
        template_id: "",
        subject: "",
        content: ""
    })

    // Template Form State
    const [isTemplateOpen, setIsTemplateOpen] = useState(false)
    const [templateForm, setTemplateForm] = useState({
        name: "",
        subject: "",
        content: ""
    })

    const loadData = async () => {
        setIsLoading(true)
        try {
            const [msgs, tmpls, custs] = await Promise.all([
                crmCommunications.listMessages().catch(() => []),
                crmCommunications.listTemplates().catch(() => []),
                crmCustomers.list().catch(() => [])
            ])
            setMessages(Array.isArray(msgs) ? msgs : [])
            setTemplates(Array.isArray(tmpls) ? tmpls : [])
            setCustomers(Array.isArray(custs) ? custs : [])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleSendMessage = async () => {
        if (!sendForm.customer_id || !sendForm.content) return
        setIsLoading(true)
        setSendError(null)
        try {
            const customer = customers.find(c => c.id === Number(sendForm.customer_id))
            await crmCommunications.sendMessage({
                customer_id: Number(sendForm.customer_id),
                channel: sendForm.channel,
                content: sendForm.content,
                subject: sendForm.channel === 'email' ? sendForm.subject : undefined,
                recipient_email: customer?.emails?.[0], 
                recipient_phone: customer?.phones?.[0],
                template_id: sendForm.template_id ? Number(sendForm.template_id) : undefined
            })
            setIsSendOpen(false)
            setSendForm({ customer_id: "", channel: "email", template_id: "", subject: "", content: "" })
            loadData()
        } catch (err) {
            console.error("Failed to send message", err)
            setSendError(getApiErrorMessage(err, "Failed to send message. Please try again."))
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateTemplate = async () => {
        if (!templateForm.name || !templateForm.content) return
        setIsLoading(true)
        setTemplateError(null)
        try {
            await crmCommunications.createTemplate({
                name: templateForm.name,
                subject: templateForm.subject,
                content: templateForm.content,
                variables: []
            })
            setIsTemplateOpen(false)
            setTemplateForm({ name: "", subject: "", content: "" })
            loadData()
        } catch (err) {
            console.error("Failed to create template", err)
            setTemplateError(getApiErrorMessage(err, "Failed to save template. Please try again."))
        } finally {
            setIsLoading(false)
        }
    }

    const onTemplateSelect = (templateId: string) => {
        const tmpl = templates.find(t => t.id === Number(templateId))
        if (tmpl) {
            setSendForm(prev => ({
                ...prev,
                template_id: templateId,
                subject: tmpl.subject || prev.subject,
                content: tmpl.content || prev.content
            }))
        } else {
            setSendForm(prev => ({ ...prev, template_id: templateId }))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Communications</h1>
                    <p className="text-muted-foreground">Manage customer interactions via Email and SMS.</p>
                </div>
                <Button variant="ghost" onClick={loadData} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>

                <TabsContent value="messages" className="space-y-4">
                    <div className="flex justify-end">
                        <Sheet open={isSendOpen} onOpenChange={setIsSendOpen}>
                            <SheetTrigger asChild>
                                <Button>
                                    <Send className="h-4 w-4 mr-2" /> New Message
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-auto sm:max-w-xl">
                                <SheetHeader>
                                    <SheetTitle>Send Message</SheetTitle>
                                    <SheetDescription>
                                        Reach out to a customer via their preferred channel.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Customer</label>
                                        <select
                                            className="w-full rounded-md border px-3 py-2 bg-background"
                                            value={sendForm.customer_id}
                                            onChange={(e) => setSendForm({ ...sendForm, customer_id: e.target.value })}
                                        >
                                            <option value="" disabled>Select customer</option>
                                            {customers.map(c => (
                                                <option key={c.id} value={String(c.id)}>{c.full_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Channel</label>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant={sendForm.channel === 'email' ? 'default' : 'outline'}
                                                className="flex-1"
                                                onClick={() => setSendForm({ ...sendForm, channel: 'email' })}
                                            >
                                                <Mail className="h-4 w-4 mr-2" /> Email
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={sendForm.channel === 'sms' ? 'default' : 'outline'}
                                                className="flex-1"
                                                onClick={() => setSendForm({ ...sendForm, channel: 'sms' })}
                                            >
                                                <Smartphone className="h-4 w-4 mr-2" /> SMS
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Template</label>
                                        <select
                                            className="w-full rounded-md border px-3 py-2 bg-background"
                                            value={sendForm.template_id}
                                            onChange={(e) => onTemplateSelect(e.target.value)}
                                        >
                                            <option value="">Select a template (optional)</option>
                                            {templates.map(t => (
                                                <option key={t.id} value={String(t.id)}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {sendForm.channel === 'email' && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Subject</label>
                                            <Input
                                                value={sendForm.subject}
                                                onChange={(e) => setSendForm({ ...sendForm, subject: e.target.value })}
                                                placeholder="Message subject"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Content</label>
                                        <textarea
                                            className="w-full rounded-md border px-3 py-2 bg-background"
                                            value={sendForm.content}
                                            onChange={(e) => setSendForm({ ...sendForm, content: e.target.value })}
                                            placeholder="Type your message here..."
                                            rows={5}
                                        />
                                    </div>
                                </div>
                                {sendError && (
                                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium mb-2">
                                        {sendError}
                                    </div>
                                )}
                                <SheetFooter className="gap-2">
                                    <Button onClick={handleSendMessage} disabled={isLoading || !sendForm.customer_id || !sendForm.content}>
                                        {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending…</> : "Send Message"}
                                    </Button>
                                    <Button variant="ghost" onClick={() => setIsSendOpen(false)}>
                                        <X className="h-4 w-4 mr-1" /> Cancel
                                    </Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Messages</CardTitle>
                            <CardDescription>History of all communications.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {messages.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No messages found. Start a conversation!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((msg) => {
                                        const customer = customers.find(c => c.id === msg.customer_id)
                                        return (
                                            <div key={msg.id} className="flex items-start justify-between border p-4 rounded-lg">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={msg.channel === 'sms' ? 'outline' : 'secondary'}>
                                                            {msg.channel === 'sms' ? <Smartphone className="h-3 w-3 mr-1" /> : <Mail className="h-3 w-3 mr-1" />}
                                                            {msg.channel.toUpperCase()}
                                                        </Badge>
                                                        <span className="font-medium">{customer?.full_name || `Customer #${msg.customer_id}`}</span>
                                                        <span className="text-xs text-muted-foreground">• {new Date(msg.created_at || '').toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="font-semibold text-sm">{msg.subject || (msg.channel === 'sms' && 'SMS Message')}</p>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">{msg.content}</p>
                                                </div>
                                                <Badge className={
                                                    msg.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                                                    msg.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                                }>
                                                    {msg.status}
                                                </Badge>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="templates" className="space-y-4">
                    <div className="flex justify-end">
                        <Sheet open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline">
                                    <Plus className="h-4 w-4 mr-2" /> Create Template
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-auto sm:max-w-xl">
                                <SheetHeader>
                                    <SheetTitle>New Template</SheetTitle>
                                    <SheetDescription>Create a reusable message template.</SheetDescription>
                                </SheetHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Name</label>
                                        <Input
                                            value={templateForm.name}
                                            onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                                            placeholder="e.g., Welcome Email"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subject (Email only)</label>
                                        <Input
                                            value={templateForm.subject}
                                            onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                                            placeholder="Subject line..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Content</label>
                                        <textarea
                                            className="w-full rounded-md border px-3 py-2 bg-background"
                                            value={templateForm.content}
                                            onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                                            placeholder={`Hi [Customer Name],\n\nWe wanted to follow up on your recent order...`}
                                            rows={5}
                                        />
                                        <p className="text-xs text-muted-foreground">Use placeholders like [Customer Name] to personalize your message.</p>
                                    </div>
                                </div>
                                {templateError && (
                                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium mb-2">
                                        {templateError}
                                    </div>
                                )}
                                <SheetFooter className="gap-2">
                                    <Button onClick={handleCreateTemplate} disabled={isLoading || !templateForm.name || !templateForm.content}>
                                        {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : "Save Template"}
                                    </Button>
                                    <Button variant="ghost" onClick={() => setIsTemplateOpen(false)}>
                                        <X className="h-4 w-4 mr-1" /> Cancel
                                    </Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {templates.map((tmpl) => (
                            <Card key={tmpl.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{tmpl.name}</CardTitle>
                                    {tmpl.subject && <CardDescription>Subject: {tmpl.subject}</CardDescription>}
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-3 bg-muted p-3 rounded-md">
                                        {tmpl.content}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
