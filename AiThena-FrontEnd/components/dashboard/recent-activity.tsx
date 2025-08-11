"use client"

import { FileText, Brain, Target, BookOpen, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const activities = [
  {
    id: 1,
    type: "document",
    title: 'Uploaded "Advanced Calculus Notes"',
    description: "Generated 15 flashcards and 3 practice quizzes",
    time: "2 hours ago",
    icon: FileText,
    status: "completed",
  },
  {
    id: 2,
    type: "ai",
    title: "AI Assistant Session",
    description: "Discussed thermodynamics concepts for 25 minutes",
    time: "4 hours ago",
    icon: Brain,
    status: "completed",
  },
  {
    id: 3,
    type: "quiz",
    title: "Completed Organic Chemistry Quiz",
    description: "Scored 87% on 20 questions",
    time: "6 hours ago",
    icon: Target,
    status: "completed",
  },
  {
    id: 4,
    type: "study",
    title: "Study Session: Linear Algebra",
    description: "Reviewed eigenvalues and eigenvectors",
    time: "1 day ago",
    icon: BookOpen,
    status: "completed",
  },
  {
    id: 5,
    type: "document",
    title: 'Processing "Research Methods PDF"',
    description: "AI is analyzing content and creating summaries",
    time: "2 days ago",
    icon: Clock,
    status: "processing",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-500"
    case "processing":
      return "text-yellow-500"
    default:
      return "text-muted-foreground"
  }
}

export function RecentActivity() {
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
      {/* Inner border effect */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">Your latest study sessions and interactions</p>
          </div>
          <Button variant="ghost" size="sm" className="text-xs">
            View All
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-4 rounded-xl hover:bg-muted/20 transition-colors duration-200 group cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.status === "processing"
                    ? "bg-yellow-500/10 animate-pulse"
                    : "bg-primary/10 group-hover:bg-primary/20"
                } transition-colors duration-300`}
              >
                <activity.icon
                  className={`h-5 w-5 ${activity.status === "processing" ? "text-yellow-500" : "text-primary"}`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors duration-200">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{activity.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{activity.description}</p>

                {activity.status === "processing" && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">Processing...</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-6 pt-4 border-t border-border/30">
          <Button variant="ghost" className="w-full text-sm text-muted-foreground hover:text-foreground">
            Load More Activities
          </Button>
        </div>
      </div>
    </div>
  )
}
