import { crmHttpClient } from "@/services/http/client"

export interface InventoryItem {
    id: number
    name: string
    sku?: string
    stock: number
    reserved?: number
    status?: "active" | "inactive" | "low" | "out"
    location?: string
    org_id?: number
    created_at?: string
    updated_at?: string
}

export interface CreateInventoryItemPayload {
    name: string
    sku?: string
    stock?: number
    status?: InventoryItem["status"]
    location?: string
}

export interface UpdateInventoryItemPayload extends Partial<CreateInventoryItemPayload> {}

export const inventoryService = {
    list: () => crmHttpClient.get<InventoryItem[]>("/inventory/items"),
    create: (payload: CreateInventoryItemPayload) => crmHttpClient.post<InventoryItem>("/inventory/items", payload),
    update: (id: number, payload: UpdateInventoryItemPayload) => crmHttpClient.put<InventoryItem>(`/inventory/items/${id}`, payload),
    adjustStock: (id: number, delta: number) => crmHttpClient.post<InventoryItem>(`/inventory/items/${id}/stock`, { delta }),
    delete: (id: number) => crmHttpClient.delete<void>(`/inventory/items/${id}`),
}
