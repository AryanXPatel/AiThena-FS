import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { DebateArena } from "@/components/tools/debate-arena"
import { MessageSquare } from "lucide-react"

export default function DebateArenaPage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="AI Debate Arena"
        description="Practice argumentation skills with AI opponents on various topics"
        icon={MessageSquare}
        badge="Interactive"
      >
        <DebateArena />
      </ToolLayout>
    </DashboardLayout>
  )
}
