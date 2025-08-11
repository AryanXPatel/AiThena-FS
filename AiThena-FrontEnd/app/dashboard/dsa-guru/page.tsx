import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { DSAGuruPlatform } from "@/components/tools/dsa-guru-platform"

export default function DSAGuruPage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="DSA Guru Platform"
        description="Master Data Structures & Algorithms with interactive problem solving"
        icon="cpu"
      >
        <DSAGuruPlatform />
      </ToolLayout>
    </DashboardLayout>
  )
}
