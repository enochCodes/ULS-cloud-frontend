import { crmHttpClient } from "./client"
import {
    Customer,
    Order,
    OrderStatus,
    OrgSettings,
    Message,
    MessageTemplate,
    AuditLog,
    PaginatedParams,
    CreateCustomerPayload,
    CreateOrderPayload,
    UpdateOrderStatusPayload,
    SendMessagePayload,
    CreateTemplatePayload,
    UpdateSettingsPayload,
} from "./types"

// ---------------- Customers ----------------
export const crmCustomers = {
    list: (params?: { search?: string; status?: string }) => crmHttpClient.get<Customer[]>("/customers", { params }),
    get: (id: number) => crmHttpClient.get<Customer>(`/customers/${id}`),
    create: (payload: CreateCustomerPayload) => crmHttpClient.post<Customer>("/customers", payload),
}

// ---------------- Orders ----------------
export const crmOrders = {
    list: (params?: { status?: OrderStatus; overdue?: boolean; customer_id?: number }) =>
        crmHttpClient.get<Order[]>("/orders", { params }),
    get: (id: number) => crmHttpClient.get<Order>(`/orders/${id}`),
    createForCustomer: (customerId: number, payload: CreateOrderPayload) =>
        crmHttpClient.post<Order>(`/customers/${customerId}/orders`, payload),
    updateStatus: (id: number, status: OrderStatus) =>
        crmHttpClient.post(`/orders/${id}/status`, { status } satisfies UpdateOrderStatusPayload),
}

// ---------------- Communications ----------------
export const crmCommunications = {
    listMessages: (params?: { customer_id?: number }) => crmHttpClient.get<Message[]>("/communications/messages", { params }),
    sendMessage: (payload: SendMessagePayload) => crmHttpClient.post<Message>("/communications/send", payload),
    listTemplates: () => crmHttpClient.get<MessageTemplate[]>("/communications/templates"),
    createTemplate: (payload: CreateTemplatePayload) => crmHttpClient.post<MessageTemplate>("/communications/templates", payload),
}

// ---------------- Settings ----------------
export const crmSettings = {
    get: () => crmHttpClient.get<OrgSettings>("/settings"),
    update: (payload: UpdateSettingsPayload) => crmHttpClient.put<OrgSettings>("/settings", payload),
}

// ---------------- Audit ----------------
export const crmAudit = {
    list: (params?: PaginatedParams) => crmHttpClient.get<AuditLog[]>("/audit", { params }),
    forEntity: (entityType: "customer" | "order" | "message", entityId: number) =>
        crmHttpClient.get<AuditLog[]>(`/audit/${entityType}/${entityId}`),
}

export * from "./types"
