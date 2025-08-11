import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { CodeMasterStudio } from "@/components/tools/code-master-studio"

export default function CodeMasterPage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="Code Master Studio"
        description="Master programming through interactive challenges and AI-guided learning"
        icon="code"
      >
        <CodeMasterStudio />
      </ToolLayout>
    </DashboardLayout>
  )
}
