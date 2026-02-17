"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Save, Loader2 } from "lucide-react"
import { crmSettings } from "@/services/api/crm"
import type { CustomOrderFieldSchema } from "@/services/api/types"

const defaultFields: CustomOrderFieldSchema[] = [
    { id: "gsm", label: "GSM", type: "number", required: true },
    { id: "width", label: "Width (cm)", type: "number", required: true },
    { id: "color", label: "Color", type: "text", required: true },
]

function parseSchema(s: string | CustomOrderFieldSchema[] | undefined): CustomOrderFieldSchema[] {
    if (!s) return defaultFields
    if (Array.isArray(s)) return s
    try {
        const parsed = JSON.parse(s) as CustomOrderFieldSchema[]
        return Array.isArray(parsed) ? parsed : defaultFields
    } catch {
        return defaultFields
    }
}

export default function SettingsPage() {
    const [customFields, setCustomFields] = useState<CustomOrderFieldSchema[]>(defaultFields)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                const settings = await crmSettings.get()
                setCustomFields(parseSchema(settings?.custom_order_fields_schema))
            } catch {
                setCustomFields(defaultFields)
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [])

    const handleSaveFields = async () => {
        setIsSaving(true)
        try {
            await crmSettings.update({
                custom_order_fields_schema: JSON.stringify(customFields),
            })
        } catch (e) {
            console.error(e)
        } finally {
            setIsSaving(false)
        }
    }

    const addField = () => {
        setCustomFields([...customFields, { id: `field_${Date.now()}`, label: "New Field", type: "text", required: false }])
    }

    const removeField = (id: string) => {
        setCustomFields(customFields.filter(f => f.id !== id))
    }

    const updateField = (id: string, updates: Partial<CustomOrderFieldSchema>) => {
        setCustomFields(customFields.map(f => f.id === id ? { ...f, ...updates } : f))
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black tracking-tight">CRM Settings</h1>
                <p className="text-muted-foreground">Configure CRM-specific options for your organization.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Order Custom Fields</CardTitle>
                            <CardDescription>Define product attributes for your orders (e.g., GSM, dimensions).</CardDescription>
                        </div>
                        <Button onClick={handleSaveFields} disabled={isSaving || isLoading}>
                            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Save
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        <div className="py-8 flex items-center justify-center text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {customFields.map((field) => (
                                <div key={field.id} className="flex gap-4 items-end border p-4 rounded-lg bg-muted/20">
                                    <div className="space-y-2 flex-1">
                                        <Label>Field Label</Label>
                                        <Input value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })} />
                                    </div>
                                    <div className="space-y-2 w-32">
                                        <Label>Type</Label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={field.type}
                                            onChange={(e) => updateField(field.id, { type: e.target.value as CustomOrderFieldSchema["type"] })}
                                        >
                                            <option value="text">Text</option>
                                            <option value="number">Number</option>
                                            <option value="date">Date</option>
                                            <option value="select">Select</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 flex items-center h-10 pb-2">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={field.required}
                                                onCheckedChange={(c: boolean) => updateField(field.id, { required: c })}
                                            />
                                            <Label>Required</Label>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeField(field.id)} className="text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full" onClick={addField}>
                                <Plus className="h-4 w-4 mr-2" /> Add Field
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
