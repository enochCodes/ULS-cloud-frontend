export type CustomerStatus = "lead" | "customer"

export interface Customer {
    id: number
    full_name: string
    emails: string[]
    phones: string[]
    status: CustomerStatus
    tags?: string[]
    source?: string
    address?: string
    can_email?: boolean
    can_sms?: boolean
    consent_source?: string
    consent_timestamp?: string
    org_id?: number
    created_at?: string
    updated_at?: string
    created_by?: number
    updated_by?: number
}

export type OrderStatus = "draft" | "confirmed" | "in_progress" | "delivered" | "closed" | "cancelled"
export type OrderPriority = "low" | "medium" | "high"
export type OrderType = "product" | "service"

export interface OrderItem {
    id?: number
    item_id?: string
    name: string
    quantity: number
    unit_price: number
    org_id?: number
    order_id?: number
    created_at?: string
    updated_at?: string
}

export interface Order {
    id: number
    customer_id: number
    order_type?: OrderType
    status: OrderStatus
    priority?: OrderPriority
    notes?: string
    deadline_at?: string
    items?: OrderItem[]
    required_fields_schema?: string
    required_fields_data?: string
    org_id?: number
    created_at?: string
    updated_at?: string
    created_by?: number
    updated_by?: number
    assigned_to_user_id?: number
}

export interface OrgSettings {
    id?: number
    org_id?: number
    branding_name?: string
    default_message_channel?: "sms" | "email"
    reminder_days_before?: number
    reminder_enabled?: boolean
    email_provider_config?: string
    sms_provider_config?: string
    created_at?: string
    updated_at?: string
}

export interface MessageTemplate {
    id?: number
    org_id?: number
    name: string
    subject?: string
    content?: string
    variables?: string[]
    created_at?: string
    updated_at?: string
}

export type MessageChannel = "sms" | "email"
export type MessageStatus = "pending" | "queued" | "sent" | "delivered" | "failed"

export interface Message {
    id?: number
    customer_id: number
    channel: MessageChannel
    content: string
    subject?: string
    recipient_email?: string
    recipient_phone?: string
    status?: MessageStatus
    provider_response?: string
    org_id?: number
    created_at?: string
    queued_at?: string
    sent_at?: string
    delivered_at?: string
    failed_at?: string
    scheduled_at?: string
}

export interface AuditLog {
    id: number
    entity_type: "customer" | "order" | "message"
    entity_id: number
    action: "create" | "update" | "delete"
    before?: string
    after?: string
    user_id?: number
    org_id?: number
    ip_address?: string
    user_agent?: string
    created_at?: string
}

export interface PaginatedParams {
    limit?: number
    offset?: number
    search?: string
}

export interface ListResponse<T> {
    data: T[]
    total?: number
}
