import { SystemLayout } from "@/components/system-layout"

export default function SettingsLayout({
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
