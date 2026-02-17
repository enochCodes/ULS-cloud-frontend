import { createAxiosClient } from "@/services/http/client"

const adminBaseURL = process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:8084/api/v1"
const adminClient = createAxiosClient({
  baseURL: adminBaseURL,
  withAuth: true,
})

export interface AdminApp {
  id: string
  slug: string
  name: string
  description: string
  category: string
  available: boolean
  icon: string
}

export interface AdminActivity {
  id: string
  user: string
  action: string
  app: string
  time: string
  entity_id?: number
  entity_type?: string
}

export const adminService = {
  getApps: async (): Promise<AdminApp[]> => {
    try {
      const res = await adminClient.get<AdminApp[]>("/apps")
      return Array.isArray(res.data) ? res.data : []
    } catch {
      return []
    }
  },
  getActivities: async (): Promise<AdminActivity[]> => {
    try {
      const res = await adminClient.get<AdminActivity[]>("/activities")
      return Array.isArray(res.data) ? res.data : []
    } catch {
      return []
    }
  },
}
