"use client"

import { useRef } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { FlashcardStudio, type FlashcardStudioRef } from "@/components/tools/flashcard-studio"
import { BookOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FlashcardStudioPage() {
  const flashcardStudioRef = useRef<FlashcardStudioRef>(null)

  const handleCreateDeckClick = () => {
    flashcardStudioRef.current?.triggerCreateDeck()
  }

  return (
    <DashboardLayout>
      <ToolLayout
        title="Flashcard Studio"
        description="Create, organize, and study with AI-powered flashcards"
        icon={BookOpen}
        badge="Interactive Learning"
        actions={
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={handleCreateDeckClick}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Deck
          </Button>
        }
      >
        <FlashcardStudio ref={flashcardStudioRef} />
      </ToolLayout>
    </DashboardLayout>
  )
}
