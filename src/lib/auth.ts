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

export type UserRole = "admin" | "manager" | "user" | "viewer"

export function parseJWT(token: string): JWTPayload | null {
    try {
        const parts = token.split(".")
        if (parts.length !== 3) return null
        const payload = parts[1]
        // Handle base64url padding - add padding if needed
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
        const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=")
        const decoded = atob(padded)
        const parsed = JSON.parse(decoded)
        // Validate expected structure
        if (typeof parsed !== "object" || parsed === null) return null
        return parsed as JWTPayload
    } catch {
        return null
    }
}

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null
    return null
}

function setCookie(name: string, value: string, days: number = 7) {
    if (typeof document === "undefined") return
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = `expires=${date.toUTCString()}`
    // Add Secure flag in production (HTTPS)
    const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? ";Secure" : ""
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax${secure}`
}

function deleteCookie(name: string) {
    if (typeof document === "undefined") return
    const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? ";Secure" : ""
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/${secure}`
}

export function getToken(): string | null {
    if (typeof window === "undefined") return null
    // Check cookie first, then localStorage for backward compatibility
    const cookieToken = getCookie("token")
    if (cookieToken) return cookieToken
    return localStorage.getItem("token")
}

export function setToken(token: string) {
    if (typeof window === "undefined") return
    // Store in both cookie (for middleware) and localStorage (for backward compatibility)
    setCookie("token", token, 7)
    localStorage.setItem("token", token)
}

export function removeToken() {
    if (typeof window === "undefined") return
    deleteCookie("token")
    localStorage.removeItem("token")
}

export function getTokenPayload(): JWTPayload | null {
    const token = getToken()
    if (!token) return null
    return parseJWT(token)
}

export function isTokenExpired(): boolean {
    const payload = getTokenPayload()
    if (!payload?.exp) return true
    return Date.now() >= payload.exp * 1000
}

export function isAuthenticated(): boolean {
    const token = getToken()
    if (!token) return false
    return !isTokenExpired()
}

export function getUserRole(): UserRole {
    const payload = getTokenPayload()
    const role = payload?.role?.toLowerCase()
    if (role === "admin" || role === "manager" || role === "user" || role === "viewer") {
        return role
    }
    return "user" // Default role
}

export function hasRole(requiredRoles: UserRole[]): boolean {
    const userRole = getUserRole()
    return requiredRoles.includes(userRole)
}

export function hasMinimumRole(minimumRole: UserRole): boolean {
    const roleHierarchy: UserRole[] = ["viewer", "user", "manager", "admin"]
    const userRole = getUserRole()
    const userRoleIndex = roleHierarchy.indexOf(userRole)
    const minimumRoleIndex = roleHierarchy.indexOf(minimumRole)
    return userRoleIndex >= minimumRoleIndex
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
    removeToken()
    window.location.href = "/auth/login"
}
