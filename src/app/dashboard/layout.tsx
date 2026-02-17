import { SystemLayout } from "@/components/system-layout"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SystemLayout>
            {children}
        </SystemLayout>
    )
}
