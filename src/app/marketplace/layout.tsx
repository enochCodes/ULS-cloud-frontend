import { SystemLayout } from "@/components/system-layout"

export default function MarketplaceLayout({
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
