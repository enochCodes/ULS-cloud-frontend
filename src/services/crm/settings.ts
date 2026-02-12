import { crmHttpClient } from "../http/client"
import { OrgSettings } from "./types"

type UpdateSettingsPayload = Partial<OrgSettings>

export const settingsService = {
    get: () => crmHttpClient.get<OrgSettings>("/settings"),
    update: (payload: UpdateSettingsPayload) => crmHttpClient.put<OrgSettings>("/settings", payload),
}

export type { UpdateSettingsPayload }
