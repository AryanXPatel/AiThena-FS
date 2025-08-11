import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { FlashcardStudio } from "@/components/tools/flashcard-studio"
import { BookOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FlashcardStudioPage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="Flashcard Studio"
        description="Create, organize, and study with AI-powered flashcards"
        icon={BookOpen}
        badge="Interactive Learning"
        actions={
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Deck
          </Button>
        }
      >
        <FlashcardStudio />
      </ToolLayout>
    </DashboardLayout>
  )
}
