"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Calendar, Filter } from "lucide-react"

const chartData = [
  { day: "Mon", hours: 3.5, sessions: 4 },
  { day: "Tue", hours: 4.2, sessions: 5 },
  { day: "Wed", hours: 2.8, sessions: 3 },
  { day: "Thu", hours: 5.1, sessions: 6 },
  { day: "Fri", hours: 3.9, sessions: 4 },
  { day: "Sat", hours: 6.2, sessions: 7 },
  { day: "Sun", hours: 4.5, sessions: 5 },
]

export function StudyMetrics() {
  const [activeTab, setActiveTab] = useState("hours")
  const [timeRange, setTimeRange] = useState("week")

  const maxValue = Math.max(...chartData.map((d) => (activeTab === "hours" ? d.hours : d.sessions)))

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
      {/* Inner border effect */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Study Analytics</h3>
              <p className="text-sm text-muted-foreground">Your learning patterns this week</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="text-xs bg-transparent">
              <Calendar className="h-3 w-3 mr-1" />
              This Week
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-muted/30 rounded-lg p-1">
          <Button
            variant={activeTab === "hours" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("hours")}
            className="flex-1 text-xs"
          >
            Study Hours
          </Button>
          <Button
            variant={activeTab === "sessions" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("sessions")}
            className="flex-1 text-xs"
          >
            Sessions
          </Button>
        </div>

        {/* Chart */}
        <div className="space-y-4">
          <div className="flex items-end justify-between h-48 px-2">
            {chartData.map((data, index) => {
              const value = activeTab === "hours" ? data.hours : data.sessions
              const height = (value / maxValue) * 100

              return (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="w-full flex justify-center">
                    <div
                      className="bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-500 hover:from-primary/80 hover:to-primary/40 cursor-pointer group relative"
                      style={{
                        height: `${height}%`,
                        width: "24px",
                        minHeight: "8px",
                      }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {value} {activeTab === "hours" ? "hrs" : "sessions"}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{data.day}</span>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">
                  {activeTab === "hours" ? "+2.3 hrs" : "+5 sessions"} vs last week
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-foreground">
                {activeTab === "hours" ? "30.2" : "34"}
                <span className="text-sm text-muted-foreground ml-1">
                  {activeTab === "hours" ? "total hours" : "total sessions"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
