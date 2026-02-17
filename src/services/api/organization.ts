import { coreHttpClient } from "@/services/http/client"

export interface Organization {
  id: number
  name: string
  address?: string
  subdomain?: string
  owner_id?: number
  apps?: string[]
  created_date?: string
}

export interface Subscription {
  id: number
  name: string
  description?: string
  price: number
  currency: string
  billing_cycle: string
  apps?: string[]
  created_at?: string
}

export interface Transaction {
  id?: string
  org_id?: number
  amount?: number
  status?: string
  transaction_id?: string
  created_at?: string
}

interface GenericResponse<T = unknown> {
  success: boolean
  code?: number
  message?: string
  data?: T
}

async function unwrapData<T>(p: Promise<GenericResponse<T>>): Promise<T | undefined> {
  const res = await p
  return res?.data
}

export const organizationService = {
  list: async () => {
    const data = await unwrapData(coreHttpClient.get<GenericResponse<Organization[]>>("/organizations"))
    return (Array.isArray(data) ? data : []) as Organization[]
  },
  getById: async (id: number) => {
    const res = await coreHttpClient.get<GenericResponse<Organization>>(`/organization/${id}`)
    return res?.data as Organization | undefined
  },
  create: (data: Partial<Organization>) => coreHttpClient.post<GenericResponse>("/organization", data),
  update: (id: number, data: Partial<Organization>) => coreHttpClient.put<GenericResponse>(`/organization/${id}`, data),
  delete: (id: number) => coreHttpClient.delete<GenericResponse>(`/organization/${id}`),
  updateApps: (data: { id: number; apps: string[] }) => coreHttpClient.put<GenericResponse>("/organization/apps", data),
}

export const subscriptionService = {
  list: async () => {
    const data = await unwrapData(coreHttpClient.get<GenericResponse<Subscription[]>>("/organization/subscriptions"))
    return (Array.isArray(data) ? data : []) as Subscription[]
  },
  getById: async (id: number) => {
    const res = await coreHttpClient.get<GenericResponse<Subscription>>(`/organization/subscriptions/${id}`)
    return res?.data as Subscription | undefined
  },
  create: (data: Partial<Subscription>) => coreHttpClient.post<GenericResponse>("/organization/subscriptions", data),
  update: (data: Partial<Subscription>) => coreHttpClient.put<GenericResponse>("/organization/subscriptions", data),
  delete: (id: number) => coreHttpClient.delete<GenericResponse>(`/organization/subscriptions/${id}`),
}

export const transactionService = {
  listByOrg: async (orgId: number) => {
    const res = await coreHttpClient.get<GenericResponse<Transaction[]>>(`/organization/${orgId}/transactions`)
    return { data: Array.isArray(res?.data) ? res.data : [] }
  },
  getById: async (transactionId: string) => {
    const res = await coreHttpClient.get<GenericResponse<Transaction>>(`/organization/transactions/${transactionId}`)
    return { data: res?.data }
  },
}
