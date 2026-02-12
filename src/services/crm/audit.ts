import { crmHttpClient } from "../http/client"
import { AuditLog, PaginatedParams } from "./types"

export const auditService = {
    list: (params?: PaginatedParams) => crmHttpClient.get<AuditLog[]>("/audit", { params }),
    getForEntity: (entityType: "customer" | "order" | "message", entityId: number) => crmHttpClient.get<AuditLog[]>(`/audit/${entityType}/${entityId}`),
}
