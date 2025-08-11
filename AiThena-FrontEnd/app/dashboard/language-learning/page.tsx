import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { LanguageLearningHub } from "@/components/tools/language-learning-hub"

export default function LanguageLearningPage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="Language Learning Hub"
        description="Interactive language learning with AI tutors and immersive practice"
        icon="globe"
      >
        <LanguageLearningHub />
      </ToolLayout>
    </DashboardLayout>
  )
}
