import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { AIAssistantInterface } from "@/components/tools/ai-assistant-interface"
import { Brain } from "lucide-react"

export default function AIAssistantPage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="AI Study Assistant"
        description="Your intelligent learning companion for personalized study support"
        icon={Brain}
        badge="AI Powered"
      >
        <AIAssistantInterface />
      </ToolLayout>
    </DashboardLayout>
  )
}
