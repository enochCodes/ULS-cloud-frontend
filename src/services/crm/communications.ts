import { crmHttpClient } from "../http/client"
import { Message, MessageTemplate } from "./types"

interface ListMessagesParams {
    customer_id?: number
}

type SendMessagePayload = Omit<Message, "id" | "status" | "org_id" | "created_at" | "queued_at" | "sent_at" | "delivered_at" | "failed_at"> & {
    template_id?: number
}

type CreateTemplatePayload = Omit<MessageTemplate, "id" | "org_id" | "created_at" | "updated_at">

export const communicationsService = {
    listMessages: (params?: ListMessagesParams) => crmHttpClient.get<Message[]>("/communications/messages", { params }),
    sendMessage: (payload: SendMessagePayload) => crmHttpClient.post<Message>("/communications/send", payload),
    listTemplates: () => crmHttpClient.get<MessageTemplate[]>("/communications/templates"),
    createTemplate: (payload: CreateTemplatePayload) => crmHttpClient.post<MessageTemplate>("/communications/templates", payload),
}

export type { ListMessagesParams, SendMessagePayload, CreateTemplatePayload }
