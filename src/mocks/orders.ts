import type { Customer, Order } from "@/services/api/types"

export const mockCustomers: Customer[] = [
    {
        id: 1,
        full_name: "Acme Corp",
        emails: ["ops@acme.com"],
        phones: ["(555) 210-1010"],
        status: "customer",
        tags: ["key"],
        address: "123 Industrial Ave",
    },
    {
        id: 2,
        full_name: "Neuro Labs",
        emails: ["hello@neurolabs.ai"],
        phones: ["(555) 441-5522"],
        status: "lead",
        tags: ["ai"],
    },
]

export const mockOrders: Order[] = [
    {
        id: 301,
        customer_id: 1,
        order_type: "product",
        status: "in_progress",
        priority: "high",
        notes: "Migration to v2 platform",
        deadline_at: "2026-02-28T00:00:00Z",
        required_fields_data: JSON.stringify({ gsm: "80", width: "120", color: "White" }),
        items: [
            { id: 1, name: "Non-woven Roll A", quantity: 500, unit_price: 2.5 },
            { id: 2, name: "Non-woven Roll B", quantity: 200, unit_price: 3.0 },
        ],
        created_at: "2026-02-01T10:00:00Z",
    },
    {
        id: 302,
        customer_id: 2,
        order_type: "product",
        status: "draft",
        priority: "medium",
        notes: "Pilot seat expansion",
        deadline_at: "2026-03-10T00:00:00Z",
        required_fields_data: JSON.stringify({ gsm: "100", width: "150", color: "Gray" }),
        items: [{ id: 3, name: "Custom Fabric", quantity: 100, unit_price: 5.0 }],
        created_at: "2026-02-05T14:30:00Z",
    },
    {
        id: 303,
        customer_id: 1,
        order_type: "service",
        status: "delivered",
        priority: "low",
        notes: "Consulting package",
        deadline_at: "2026-02-15T00:00:00Z",
        required_fields_data: undefined,
        items: [],
        created_at: "2026-01-20T09:00:00Z",
    },
]
