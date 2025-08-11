import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { StudyPlannerScheduler } from "@/components/tools/study-planner-scheduler"
import { Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StudyPlannerPage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="Study Planner & Scheduler"
        description="AI-powered study planning and time management"
        icon={Calendar}
        badge="Smart Planning"
        actions={
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            New Study Plan
          </Button>
        }
      >
        <StudyPlannerScheduler />
      </ToolLayout>
    </DashboardLayout>
  )
}
