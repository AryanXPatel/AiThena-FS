import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { HistoryTimelineExplorer } from "@/components/tools/history-timeline-explorer"

export default function HistoryTimelinePage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="History Timeline Explorer"
        description="Interactive historical timelines with AI-powered insights and analysis"
        icon="clock"
      >
        <HistoryTimelineExplorer />
      </ToolLayout>
    </DashboardLayout>
  )
}
