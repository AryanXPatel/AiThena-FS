"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  Target,
  BookOpen,
  Brain,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
} from "lucide-react"

const studyPlans = [
  {
    id: 1,
    title: "Calculus Final Exam Prep",
    subject: "Mathematics",
    deadline: "2024-12-15",
    progress: 65,
    totalHours: 40,
    completedHours: 26,
    status: "active",
    priority: "high",
    sessions: [
      { date: "2024-01-20", topic: "Limits and Continuity", duration: 2, completed: true },
      { date: "2024-01-21", topic: "Derivatives", duration: 2.5, completed: true },
      { date: "2024-01-22", topic: "Integration", duration: 3, completed: false },
    ],
  },
  {
    id: 2,
    title: "Organic Chemistry Review",
    subject: "Chemistry",
    deadline: "2024-12-20",
    progress: 30,
    totalHours: 25,
    completedHours: 7.5,
    status: "active",
    priority: "medium",
    sessions: [
      { date: "2024-01-20", topic: "Alkanes and Alkenes", duration: 2, completed: true },
      { date: "2024-01-23", topic: "Functional Groups", duration: 2, completed: false },
    ],
  },
]

const todaySchedule = [
  {
    id: 1,
    time: "09:00",
    duration: 120,
    subject: "Calculus",
    topic: "Integration Techniques",
    type: "study",
    status: "completed",
  },
  {
    id: 2,
    time: "14:00",
    duration: 90,
    subject: "Chemistry",
    topic: "Organic Reactions",
    type: "review",
    status: "active",
  },
  {
    id: 3,
    time: "16:30",
    duration: 60,
    subject: "Physics",
    topic: "Quantum Mechanics Quiz",
    type: "quiz",
    status: "upcoming",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "active":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "upcoming":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "overdue":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-500"
    case "medium":
      return "text-yellow-500"
    case "low":
      return "text-green-500"
    default:
      return "text-muted-foreground"
  }
}

export function StudyPlannerScheduler() {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentSession, setCurrentSession] = useState<any>(null)

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-muted/30">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Study Plans</TabsTrigger>
          <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Active Plans", value: "3", icon: Target, color: "text-blue-500" },
              { label: "Hours Today", value: "4.5", icon: Clock, color: "text-green-500" },
              { label: "This Week", value: "18/25", icon: Calendar, color: "text-purple-500" },
              { label: "Completion", value: "72%", icon: CheckCircle, color: "text-emerald-500" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Today's Focus */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Today's Focus</h3>
                </div>

                <div className="space-y-4">
                  {todaySchedule.slice(0, 3).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors duration-200"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{session.topic}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.time} • {session.duration} min
                        </p>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(session.status)}`}>{session.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Upcoming Deadlines</h3>
                </div>

                <div className="space-y-4">
                  {studyPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors duration-200"
                    >
                      <div>
                        <p className="font-medium text-foreground text-sm">{plan.title}</p>
                        <p className="text-xs text-muted-foreground">{plan.deadline}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{plan.progress}%</p>
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${plan.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Study Plans</h3>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </div>

          <div className="grid gap-6">
            {studyPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-foreground">{plan.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {plan.subject}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <span>Due: {plan.deadline}</span>
                          <span>•</span>
                          <span>
                            {plan.completedHours}/{plan.totalHours} hours
                          </span>
                          <span>•</span>
                          <span className={getPriorityColor(plan.priority)}>{plan.priority} priority</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-foreground">{plan.progress}%</span>
                          </div>
                          <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${plan.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Recent Sessions */}
                  <div className="space-y-2">
                    <h5 className="font-medium text-foreground text-sm">Recent Sessions</h5>
                    <div className="space-y-2">
                      {plan.sessions.slice(0, 2).map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                          <div className="flex items-center space-x-3">
                            {session.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-foreground">{session.topic}</p>
                              <p className="text-xs text-muted-foreground">
                                {session.date} • {session.duration}h
                              </p>
                            </div>
                          </div>
                          {!session.completed && (
                            <Button variant="ghost" size="sm" className="text-xs">
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Today's Schedule</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </Badge>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Session
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {todaySchedule.map((session) => (
              <div
                key={session.id}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{session.time}</p>
                      <p className="text-xs text-muted-foreground">{session.duration} min</p>
                    </div>

                    <div className="w-px h-12 bg-border/50" />

                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-foreground">{session.topic}</h4>
                        <Badge variant="outline" className="text-xs">
                          {session.subject}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getStatusColor(session.status)}`}>{session.status}</Badge>
                        <span className="text-xs text-muted-foreground">{session.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {session.status === "active" && (
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    {session.status === "upcoming" && (
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Coming Soon</h3>
            <p className="text-muted-foreground">Detailed study analytics and insights will be available here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
