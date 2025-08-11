import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { SmartQuizGenerator } from "@/components/tools/smart-quiz-generator"
import { Target, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function QuizGeneratorPage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="Smart Quiz Generator"
        description="AI-powered quiz creation from your study materials"
        icon={Target}
        badge="Smart Generation"
        actions={
          <Button className="bg-primary hover:bg-primary/90">
            <Zap className="h-4 w-4 mr-2" />
            Generate Quiz
          </Button>
        }
      >
        <SmartQuizGenerator />
      </ToolLayout>
    </DashboardLayout>
  )
}
