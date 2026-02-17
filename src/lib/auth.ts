export interface JWTPayload {
    sub?: string
    email?: string
    first_name?: string
    last_name?: string
    name?: string
    org_id?: number
    role?: string
    exp?: number
    iat?: number
}

export function parseJWT(token: string): JWTPayload | null {
    try {
        const parts = token.split(".")
        if (parts.length !== 3) return null
        const payload = parts[1]
        const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        return JSON.parse(decoded) as JWTPayload
    } catch {
        return null
    }
}

export function getTokenPayload(): JWTPayload | null {
    if (typeof window === "undefined") return null
    const token = localStorage.getItem("token")
    if (!token) return null
    return parseJWT(token)
}

export function isTokenExpired(): boolean {
    const payload = getTokenPayload()
    if (!payload?.exp) return true
    return Date.now() >= payload.exp * 1000
}

export function getUserDisplayName(): string {
    const payload = getTokenPayload()
    if (!payload) return "User"
    if (payload.name) return payload.name
    if (payload.first_name && payload.last_name) return `${payload.first_name} ${payload.last_name}`
    if (payload.first_name) return payload.first_name
    if (payload.email) return payload.email.split("@")[0]
    return "User"
}

export function getUserEmail(): string {
    const payload = getTokenPayload()
    return payload?.email || ""
}

export function getUserInitials(): string {
    const name = getUserDisplayName()
    const parts = name.split(" ")
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.substring(0, 2).toUpperCase()
}

export function logout() {
    localStorage.removeItem("token")
    window.location.href = "/auth/login"
}
