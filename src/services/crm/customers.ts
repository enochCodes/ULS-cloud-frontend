import { crmHttpClient } from "../http/client"
import { Customer, PaginatedParams } from "./types"

interface ListCustomersParams extends PaginatedParams {
    status?: string
}

type CreateCustomerPayload = Omit<Customer, "id" | "created_at" | "updated_at" | "created_by" | "updated_by" | "org_id"> & {
    emails?: string[]
    phones?: string[]
}

export const customerService = {
    list: (params?: ListCustomersParams) => crmHttpClient.get<Customer[]>("/customers", { params }),
    getById: (id: number) => crmHttpClient.get<Customer>(`/customers/${id}`),
    create: (payload: CreateCustomerPayload) => crmHttpClient.post<Customer>("/customers", payload),
}

export type { ListCustomersParams, CreateCustomerPayload }
