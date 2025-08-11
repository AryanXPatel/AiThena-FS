"use client"

import { Calendar, AlertTriangle, Clock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

const deadlines = [
  {
    id: 1,
    title: "Calculus Midterm Exam",
    course: "MATH 201",
    date: "Nov 28, 2024",
    time: "2:00 PM",
    daysLeft: 3,
    priority: "high",
    type: "exam",
  },
  {
    id: 2,
    title: "Chemistry Lab Report",
    course: "CHEM 101",
    date: "Dec 2, 2024",
    time: "11:59 PM",
    daysLeft: 7,
    priority: "medium",
    type: "assignment",
  },
  {
    id: 3,
    title: "Physics Problem Set #8",
    course: "PHYS 151",
    date: "Dec 5, 2024",
    time: "5:00 PM",
    daysLeft: 10,
    priority: "low",
    type: "homework",
  },
  {
    id: 4,
    title: "Final Project Presentation",
    course: "CS 350",
    date: "Dec 12, 2024",
    time: "10:00 AM",
    daysLeft: 17,
    priority: "high",
    type: "project",
  },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-500 bg-red-500/10"
    case "medium":
      return "text-yellow-500 bg-yellow-500/10"
    case "low":
      return "text-green-500 bg-green-500/10"
    default:
      return "text-muted-foreground bg-muted/10"
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "exam":
      return AlertTriangle
    case "assignment":
      return BookOpen
    case "homework":
      return Clock
    case "project":
      return Calendar
    default:
      return Calendar
  }
}

export function UpcomingDeadlines() {
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
      {/* Inner border effect */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Upcoming Deadlines</h3>
              <p className="text-sm text-muted-foreground">Stay on track</p>
            </div>
          </div>
        </div>

        {/* Deadlines List */}
        <div className="space-y-4">
          {deadlines.map((deadline) => {
            const TypeIcon = getTypeIcon(deadline.type)

            return (
              <div
                key={deadline.id}
                className="flex items-start space-x-4 p-4 rounded-xl hover:bg-muted/20 transition-colors duration-200 group cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${getPriorityColor(deadline.priority)} transition-colors duration-300`}
                >
                  <TypeIcon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors duration-200">
                      {deadline.title}
                    </h4>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        deadline.daysLeft <= 3
                          ? "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
                          : deadline.daysLeft <= 7
                            ? "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30"
                            : "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                      }`}
                    >
                      {deadline.daysLeft}d left
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">{deadline.course}</p>

                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{deadline.date}</span>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>{deadline.time}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="mt-6 pt-4 border-t border-border/30">
          <Button variant="ghost" className="w-full text-sm text-muted-foreground hover:text-foreground">
            View All Deadlines
          </Button>
        </div>
      </div>
    </div>
  )
}
