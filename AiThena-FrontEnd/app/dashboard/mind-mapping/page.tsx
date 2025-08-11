import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { MindMapping } from "@/components/tools/mind-mapping"
import { GitBranch } from "lucide-react"

export default function MindMappingPage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="Mind Mapping"
        description="Create visual representations of concepts and their relationships"
        icon={GitBranch}
        badge="Visual Learning"
      >
        <MindMapping />
      </ToolLayout>
    </DashboardLayout>
  )
}
