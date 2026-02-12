import { SystemLayout } from "@/components/system-layout"

export default function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { domain: string }
}) {
    return (
        <SystemLayout domain={params.domain}>
            {children}
        </SystemLayout>
    )
}
