"use client"

import { Target, Plus, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const goals = [
  {
    id: 1,
    title: "Complete Calculus Course",
    description: "Finish all 12 chapters by end of semester",
    progress: 75,
    target: 100,
    deadline: "Dec 15, 2024",
    status: "on-track",
  },
  {
    id: 2,
    title: "Study 25 Hours/Week",
    description: "Maintain consistent study schedule",
    progress: 18,
    target: 25,
    deadline: "This Week",
    status: "behind",
  },
  {
    id: 3,
    title: "Master Organic Chemistry",
    description: "Achieve 90%+ on all practice tests",
    progress: 100,
    target: 100,
    deadline: "Completed",
    status: "completed",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-500"
    case "on-track":
      return "text-blue-500"
    case "behind":
      return "text-red-500"
    default:
      return "text-muted-foreground"
  }
}

const getProgressColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500"
    case "on-track":
      return "bg-blue-500"
    case "behind":
      return "bg-red-500"
    default:
      return "bg-primary"
  }
}

export function StudyGoals() {
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
      {/* Inner border effect */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Study Goals</h3>
              <p className="text-sm text-muted-foreground">Track your progress</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {goal.status === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <h4 className="font-medium text-foreground text-sm">{goal.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{goal.description}</p>
                </div>
                <span className={`text-xs font-medium ${getStatusColor(goal.status)} whitespace-nowrap ml-2`}>
                  {goal.deadline}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {goal.progress} of {goal.target}{" "}
                    {goal.id === 2 ? "hours" : goal.id === 3 ? "% accuracy" : "chapters"}
                  </span>
                  <span className="font-medium text-foreground">
                    {Math.round((goal.progress / goal.target) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(goal.status)}`}
                    style={{ width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Goal Button */}
        <div className="mt-6 pt-4 border-t border-border/30">
          <Button variant="ghost" className="w-full text-sm text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Add New Goal
          </Button>
        </div>
      </div>
    </div>
  )
}
