import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { KnowledgeBase } from "@/components/tools/knowledge-base"
import { Database } from "lucide-react"

export default function KnowledgeBasePage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="Knowledge Base"
        description="Organize and connect your learning materials in one place"
        icon={Database}
        badge="Organized"
      >
        <KnowledgeBase />
      </ToolLayout>
    </DashboardLayout>
  )
}
