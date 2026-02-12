import { crmHttpClient } from "../http/client"
import { Order, OrderStatus } from "./types"

interface ListOrdersParams {
    status?: OrderStatus
    overdue?: boolean
    customer_id?: number
}

type CreateOrderPayload = Omit<Order, "id" | "status" | "org_id" | "created_at" | "updated_at"> & {
    status?: OrderStatus
}

type UpdateOrderStatusPayload = {
    status: OrderStatus
}

export const orderService = {
    list: (params?: ListOrdersParams) => crmHttpClient.get<Order[]>("/orders", { params }),
    getById: (id: number) => crmHttpClient.get<Order>(`/orders/${id}`),
    createForCustomer: (customerId: number, payload: CreateOrderPayload) => crmHttpClient.post<Order>(`/customers/${customerId}/orders`, payload),
    updateStatus: (id: number, status: OrderStatus) => crmHttpClient.post(`/orders/${id}/status`, { status } satisfies UpdateOrderStatusPayload),
}

export type { ListOrdersParams, CreateOrderPayload, UpdateOrderStatusPayload }
