import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { StudyMetrics } from "@/components/dashboard/study-metrics"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { StudyGoals } from "@/components/dashboard/study-goals"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back! Here's your learning progress overview.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <QuickActions />
          </div>
        </div>

        {/* Overview Cards */}
        <DashboardOverview />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            <StudyMetrics />
            <RecentActivity />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-8">
            <StudyGoals />
            <UpcomingDeadlines />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
