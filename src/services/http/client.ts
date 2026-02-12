import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

export interface HttpClient {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>
    post<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T>
    put<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T>
    patch<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T>
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>
    instance: AxiosInstance
}

interface ClientOptions {
    baseURL: string
    withAuth?: boolean
    defaultHeaders?: Record<string, string>
}

const attachInterceptors = (instance: AxiosInstance, withAuth: boolean) => {
    instance.interceptors.request.use((config) => {
        if (withAuth && typeof window !== "undefined") {
            const token = localStorage.getItem("token")
            if (token) {
                config.headers = config.headers ?? {}
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    })

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (withAuth && error.response?.status === 401 && typeof window !== "undefined") {
                if (!window.location.pathname.startsWith("/auth")) {
                    window.location.href = "/auth/login"
                }
            }
            return Promise.reject(error)
        }
    )
}

export const createAxiosClient = ({ baseURL, withAuth = true, defaultHeaders }: ClientOptions): AxiosInstance => {
    const instance = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
            ...defaultHeaders,
        },
    })

    attachInterceptors(instance, withAuth)
    return instance
}

const wrap = (instance: AxiosInstance): HttpClient => ({
    get: async <T>(url: string, config?: AxiosRequestConfig) => (await instance.get<T>(url, config)).data,
    post: async <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) => (await instance.post<T>(url, body, config)).data,
    put: async <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) => (await instance.put<T>(url, body, config)).data,
    patch: async <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) => (await instance.patch<T>(url, body, config)).data,
    delete: async <T>(url: string, config?: AxiosRequestConfig) => (await instance.delete<T>(url, config)).data,
    instance,
})

export const coreAxiosClient = createAxiosClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
    withAuth: true,
})

export const crmAxiosClient = createAxiosClient({
    baseURL: process.env.NEXT_PUBLIC_CRM_API_URL || "http://localhost:8081/api/v1",
    withAuth: true,
})

export const coreHttpClient = wrap(coreAxiosClient)
export const crmHttpClient = wrap(crmAxiosClient)

export type { AxiosRequestConfig }
