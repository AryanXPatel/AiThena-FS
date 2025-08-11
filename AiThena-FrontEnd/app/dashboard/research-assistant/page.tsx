import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { ResearchAssistant } from "@/components/tools/research-assistant"
import { Search } from "lucide-react"

export default function ResearchAssistantPage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="Research Assistant"
        description="Search academic papers, manage citations, and organize research"
        icon={Search}
        badge="AI-Powered"
      >
        <ResearchAssistant />
      </ToolLayout>
    </DashboardLayout>
  )
}
