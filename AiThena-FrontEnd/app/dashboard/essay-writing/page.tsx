import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { EssayWritingStudio } from "@/components/tools/essay-writing-studio"

export default function EssayWritingPage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="Essay Writing Studio"
        description="AI-powered writing assistant for academic essays and research papers"
        icon="pen-tool"
      >
        <EssayWritingStudio />
      </ToolLayout>
    </DashboardLayout>
  )
}
