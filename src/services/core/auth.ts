import { coreHttpClient } from "../http/client"

export interface LoginPayload {
    email: string
    password: string
}

export interface AuthResponse {
    token: string
}

export interface RegisterPayload {
    email: string
    password: string
    full_name?: string
    organization_name?: string
}

export const authService = {
    login: (payload: LoginPayload) => coreHttpClient.post<AuthResponse>("/auth/login", payload),
    register: (payload: RegisterPayload) => coreHttpClient.post<AuthResponse>("/auth/register", payload),
}
