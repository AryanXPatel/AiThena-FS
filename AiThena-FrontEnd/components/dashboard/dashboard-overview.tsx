"use client"

import { TrendingUp, TrendingDown, BookOpen, Brain, Target, Clock } from "lucide-react"

const metrics = [
  {
    title: "Study Hours This Week",
    value: "24.5",
    unit: "hours",
    change: "+12%",
    trend: "up",
    icon: Clock,
    description: "2.5 hours above your weekly goal",
  },
  {
    title: "Documents Processed",
    value: "47",
    unit: "docs",
    change: "+8",
    trend: "up",
    icon: BookOpen,
    description: "New documents added this week",
  },
  {
    title: "AI Interactions",
    value: "156",
    unit: "queries",
    change: "+23%",
    trend: "up",
    icon: Brain,
    description: "Questions asked to AI assistant",
  },
  {
    title: "Quiz Accuracy",
    value: "87%",
    unit: "avg",
    change: "-3%",
    trend: "down",
    icon: Target,
    description: "Across all subjects this month",
  },
]

export function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 group relative overflow-hidden"
        >
          {/* Inner border effect */}
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <metric.icon className="h-5 w-5 text-primary" />
              </div>
              <div
                className={`flex items-center space-x-1 text-sm font-medium ${
                  metric.trend === "up" ? "text-green-600" : "text-red-500"
                }`}
              >
                {metric.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{metric.change}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-foreground">{metric.value}</span>
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
              </div>
              <h3 className="font-medium text-foreground text-sm">{metric.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{metric.description}</p>
            </div>
          </div>

          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        </div>
      ))}
    </div>
  )
}
