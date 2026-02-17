import { paymentHttpClient } from "@/services/http/client"

export interface PaymentInitiation {
    amount?: number
    currency?: string
    email?: string
    first_name?: string
    last_name?: string
    tx_ref?: string
    callback_url?: string
    return_url?: string
    customization?: {
        title?: string
        description?: string
    }
}

export interface PaymentResponse {
    checkout_url?: string
    tx_ref?: string
    status?: string
    message?: string
}

export const paymentService = {
    initiate: (payload: PaymentInitiation) =>
        paymentHttpClient.get<PaymentResponse>("/payments/initiate", { params: payload }),

    health: () =>
        paymentHttpClient.get<{ status: string }>("/health"),
}
