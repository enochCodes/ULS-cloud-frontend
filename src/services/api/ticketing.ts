import { ticketingHttpClient } from "@/services/http/client"

// ---- Types ----

export interface TicketingEvent {
    id?: number
    org_id?: number
    name: string
    description?: string
    date?: string
    location?: string
    capacity?: number
    status?: string
    created_at?: string
    updated_at?: string
}

export interface SubscriptionPlan {
    id?: number
    org_id?: number
    name: string
    description?: string
    price?: number
    currency?: string
    billing_cycle?: string
    features?: string[]
    status?: string
    created_at?: string
    updated_at?: string
}

export interface TicketingPayment {
    id?: number
    org_id?: number
    customer_id?: number
    amount?: number
    currency?: string
    status?: string
    payment_method?: string
    transaction_ref?: string
    created_at?: string
    updated_at?: string
}

export interface TicketingCustomer {
    id?: number
    org_id?: number
    name?: string
    email?: string
    phone?: string
    created_at?: string
    updated_at?: string
}

export interface TicketingCustomerSubscription {
    id?: number
    customer_id?: number
    plan_id?: number
    status?: string
    start_date?: string
    end_date?: string
    created_at?: string
    updated_at?: string
}

export interface Ticket {
    id?: number
    org_id?: number
    customer_id?: number
    subject?: string
    description?: string
    priority?: string
    status?: string
    assignee?: string
    created_at?: string
    updated_at?: string
}

// ---- Events ----

export const ticketingEvents = {
    list: (params?: { org_id?: number }) =>
        ticketingHttpClient.get<TicketingEvent[]>("/events", { params }),
    get: (id: number) =>
        ticketingHttpClient.get<TicketingEvent>(`/events/${id}`),
    create: (payload: Partial<TicketingEvent>) =>
        ticketingHttpClient.post<TicketingEvent>("/events", payload),
    update: (id: number, payload: Partial<TicketingEvent>) =>
        ticketingHttpClient.put<TicketingEvent>(`/events/${id}`, payload),
    delete: (id: number) =>
        ticketingHttpClient.delete<void>(`/events/${id}`),
}

// ---- Subscription Plans ----

export const ticketingPlans = {
    list: (params?: { org_id?: number }) =>
        ticketingHttpClient.get<SubscriptionPlan[]>("/subscription-plans", { params }),
    get: (id: number) =>
        ticketingHttpClient.get<SubscriptionPlan>(`/subscription-plans/${id}`),
    create: (payload: Partial<SubscriptionPlan>) =>
        ticketingHttpClient.post<SubscriptionPlan>("/subscription-plans", payload),
    update: (id: number, payload: Partial<SubscriptionPlan>) =>
        ticketingHttpClient.put<SubscriptionPlan>(`/subscription-plans/${id}`, payload),
    delete: (id: number) =>
        ticketingHttpClient.delete<void>(`/subscription-plans/${id}`),
}

// ---- Payments ----

export const ticketingPayments = {
    list: () =>
        ticketingHttpClient.get<TicketingPayment[]>("/payments"),
    get: (id: number) =>
        ticketingHttpClient.get<TicketingPayment>(`/payments/${id}`),
    initiate: (payload: Partial<TicketingPayment>) =>
        ticketingHttpClient.post<TicketingPayment>("/payments/initiate", payload),
    update: (id: number, payload: Partial<TicketingPayment>) =>
        ticketingHttpClient.put<TicketingPayment>(`/payments/${id}`, payload),
    delete: (id: number) =>
        ticketingHttpClient.delete<void>(`/payments/${id}`),
}

// ---- Customers ----

export const ticketingCustomers = {
    list: (params?: { org_id?: number }) =>
        ticketingHttpClient.get<TicketingCustomer[]>("/customers", { params }),
    get: (id: number) =>
        ticketingHttpClient.get<TicketingCustomer>(`/customers/${id}`),
    create: (payload: Partial<TicketingCustomer>) =>
        ticketingHttpClient.post<TicketingCustomer>("/customers", payload),
    update: (id: number, payload: Partial<TicketingCustomer>) =>
        ticketingHttpClient.put<TicketingCustomer>(`/customers/${id}`, payload),
    delete: (id: number) =>
        ticketingHttpClient.delete<void>(`/customers/${id}`),
    listSubscriptions: (customerId: number) =>
        ticketingHttpClient.get<TicketingCustomerSubscription[]>(`/customers/${customerId}/subscriptions`),
    getSubscription: (customerId: number, subId: number) =>
        ticketingHttpClient.get<TicketingCustomerSubscription>(`/customers/${customerId}/subscriptions/${subId}`),
    updateSubscription: (customerId: number, subId: number, payload: Partial<TicketingCustomerSubscription>) =>
        ticketingHttpClient.put<TicketingCustomerSubscription>(`/customers/${customerId}/subscriptions/${subId}`, payload),
    deleteSubscription: (customerId: number, subId: number) =>
        ticketingHttpClient.delete<void>(`/customers/${customerId}/subscriptions/${subId}`),
}

// ---- Tickets (Admin) ----

export const ticketingTickets = {
    adminList: (params?: Record<string, string | number>) =>
        ticketingHttpClient.get<Ticket[]>("/admin/tickets", { params }),
    adminGet: (id: number) =>
        ticketingHttpClient.get<Ticket>(`/admin/ticket/${id}`),
    customerGet: (id: number) =>
        ticketingHttpClient.get<Ticket>(`/ticket/${id}`),
    customerFilter: (params?: Record<string, string | number>) =>
        ticketingHttpClient.post<Ticket[]>("/tickets", params),
}
