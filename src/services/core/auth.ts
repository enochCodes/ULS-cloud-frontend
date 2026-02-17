import { coreHttpClient } from "../http/client"

export interface LoginPayload {
    email: string
    password: string
}

export interface RegisterPayload {
    email: string
    password: string
    first_name: string
    last_name: string
    phone_number?: string
}

export interface CreateOrganizationPayload {
    name: string
    address?: string
    subdomain: string
}

interface SSOResponse<T = unknown> {
    success: boolean
    code?: number
    message?: string
    data?: T
}

export const authService = {
    login: async (payload: LoginPayload): Promise<string> => {
        const res = await coreHttpClient.post<SSOResponse<string>>("/auth/login", payload)
        if (!res.success || !res.data) {
            throw new Error(res.message || "Login failed")
        }
        return res.data
    },

    register: async (payload: RegisterPayload): Promise<string> => {
        const res = await coreHttpClient.post<SSOResponse<string>>("/auth/register", payload)
        if (!res.success || !res.data) {
            throw new Error(res.message || "Registration failed")
        }
        return res.data
    },

    createOrganization: async (payload: CreateOrganizationPayload): Promise<SSOResponse> => {
        const res = await coreHttpClient.post<SSOResponse>("/organization", payload)
        if (!res.success) {
            throw new Error(res.message || "Organization creation failed")
        }
        return res
    },
}
