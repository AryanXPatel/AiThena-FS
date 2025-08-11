"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Upload, Brain, Target, BookOpen, Zap } from "lucide-react"

const actions = [
  {
    title: "Upload Document",
    description: "Add new study materials",
    icon: Upload,
    action: () => console.log("Upload document"),
  },
  {
    title: "Ask AI Assistant",
    description: "Get help with concepts",
    icon: Brain,
    action: () => console.log("Ask AI"),
  },
  {
    title: "Create Quiz",
    description: "Generate practice questions",
    icon: Target,
    action: () => console.log("Create quiz"),
  },
  {
    title: "New Flashcards",
    description: "Make study cards",
    icon: BookOpen,
    action: () => console.log("New flashcards"),
  },
  {
    title: "Start Study Session",
    description: "Begin focused learning",
    icon: Zap,
    action: () => console.log("Start session"),
  },
]

export function QuickActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="hover:shadow-soft dark:hover:shadow-soft-dark hover:-translate-y-0.5 transition-all duration-200">
          <Plus className="h-4 w-4 mr-2" />
          Quick Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {actions.map((action, index) => (
          <DropdownMenuItem key={index} onClick={action.action} className="flex items-start space-x-3 p-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <action.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{action.title}</div>
              <div className="text-xs text-muted-foreground">{action.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
