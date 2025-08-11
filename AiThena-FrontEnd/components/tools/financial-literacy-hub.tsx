"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Target,
  BookOpen,
  Calculator,
  BarChart3,
  Shield,
  Home,
  Award,
  Clock,
  Zap,
  Brain,
  Star,
  Play,
  Eye,
} from "lucide-react"

const financialTopics = [
  {
    id: 1,
    name: "Budgeting Basics",
    icon: Calculator,
    progress: 85,
    lessons: 12,
    completed: 10,
    difficulty: "Beginner",
    color: "bg-blue-500",
    description: "Master the fundamentals of creating and managing a personal budget",
  },
  {
    id: 2,
    name: "Saving & Emergency Funds",
    icon: PiggyBank,
    progress: 67,
    lessons: 8,
    completed: 5,
    difficulty: "Beginner",
    color: "bg-green-500",
    description: "Build financial security with smart saving strategies",
  },
  {
    id: 3,
    name: "Credit & Debt Management",
    icon: CreditCard,
    progress: 42,
    lessons: 15,
    completed: 6,
    difficulty: "Intermediate",
    color: "bg-red-500",
    description: "Understand credit scores, loans, and debt repayment strategies",
  },
  {
    id: 4,
    name: "Investing Fundamentals",
    icon: TrendingUp,
    progress: 23,
    lessons: 20,
    completed: 4,
    difficulty: "Intermediate",
    color: "bg-purple-500",
    description: "Learn about stocks, bonds, and building investment portfolios",
  },
  {
    id: 5,
    name: "Insurance & Protection",
    icon: Shield,
    progress: 78,
    lessons: 10,
    completed: 8,
    difficulty: "Intermediate",
    color: "bg-orange-500",
    description: "Protect your finances with the right insurance coverage",
  },
  {
    id: 6,
    name: "Retirement Planning",
    icon: Target,
    progress: 34,
    lessons: 18,
    completed: 6,
    difficulty: "Advanced",
    color: "bg-indigo-500",
    description: "Plan for a secure financial future and retirement",
  },
]

const financialGoals = [
  {
    id: 1,
    title: "Emergency Fund",
    target: 10000,
    current: 6500,
    deadline: "Dec 2024",
    category: "Savings",
    icon: Shield,
    color: "text-green-500",
    priority: "High",
  },
  {
    id: 2,
    title: "Pay Off Credit Card",
    target: 5000,
    current: 3200,
    deadline: "Jun 2024",
    category: "Debt",
    icon: CreditCard,
    color: "text-red-500",
    priority: "High",
  },
  {
    id: 3,
    title: "House Down Payment",
    target: 50000,
    current: 12000,
    deadline: "Dec 2025",
    category: "Savings",
    icon: Home,
    color: "text-blue-500",
    priority: "Medium",
  },
  {
    id: 4,
    title: "Investment Portfolio",
    target: 25000,
    current: 8500,
    deadline: "Dec 2024",
    category: "Investment",
    icon: TrendingUp,
    color: "text-purple-500",
    priority: "Medium",
  },
]

const learningPaths = [
  {
    id: 1,
    title: "Personal Finance Mastery",
    duration: "8 weeks",
    lessons: 45,
    completed: 12,
    difficulty: "Beginner",
    topics: ["Budgeting", "Saving", "Credit", "Insurance"],
    popular: true,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Investment Fundamentals",
    duration: "12 weeks",
    lessons: 60,
    completed: 0,
    difficulty: "Intermediate",
    topics: ["Stocks", "Bonds", "ETFs", "Portfolio"],
    popular: true,
    rating: 4.9,
  },
  {
    id: 3,
    title: "Retirement Planning",
    duration: "6 weeks",
    lessons: 30,
    completed: 5,
    difficulty: "Advanced",
    topics: ["401k", "IRA", "Social Security", "Estate"],
    popular: false,
    rating: 4.7,
  },
]

const recentActivity = [
  {
    id: 1,
    action: "Completed",
    item: "Budgeting 101 Lesson",
    time: "2 hours ago",
    type: "lesson",
    icon: BookOpen,
  },
  {
    id: 2,
    action: "Updated",
    item: "Emergency Fund Goal",
    time: "1 day ago",
    type: "goal",
    icon: Target,
  },
  {
    id: 3,
    action: "Started",
    item: "Credit Score Improvement",
    time: "3 days ago",
    type: "course",
    icon: TrendingUp,
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
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

export function FinancialLiteracyHub() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-muted/30">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="learn">Learn</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Lessons Completed", value: "34", icon: BookOpen, color: "text-blue-500" },
              { label: "Financial Goals", value: "4", icon: Target, color: "text-green-500" },
              { label: "Learning Streak", value: "12", icon: Zap, color: "text-orange-500" },
              { label: "Knowledge Score", value: "847", icon: Award, color: "text-purple-500" },
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

          {/* Financial Goals Progress */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Financial Goals</h3>
                    <p className="text-sm text-muted-foreground">Track your progress towards financial milestones</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  View All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {financialGoals.slice(0, 4).map((goal) => {
                  const progress = (goal.current / goal.target) * 100

                  return (
                    <div
                      key={goal.id}
                      className="p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              goal.category === "Debt"
                                ? "bg-red-100 dark:bg-red-900/30"
                                : "bg-green-100 dark:bg-green-900/30"
                            }`}
                          >
                            <goal.icon className={`h-4 w-4 ${goal.color}`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground text-sm">{goal.title}</h4>
                            <Badge className={getPriorityColor(goal.priority)} variant="outline">
                              {goal.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">
                            ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{Math.round(progress)}% complete</span>
                          <span>Due: {goal.deadline}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Learning Progress */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Learning Progress</h3>
                    <p className="text-sm text-muted-foreground">Your progress across financial topics</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {financialTopics.slice(0, 6).map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-8 h-8 ${topic.color} rounded-lg flex items-center justify-center`}>
                        <topic.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm">{topic.name}</h4>
                        <Badge className={getDifficultyColor(topic.difficulty)} variant="outline">
                          {topic.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{topic.progress}%</span>
                      </div>
                      <Progress value={topic.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {topic.completed}/{topic.lessons} lessons completed
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Recent Activity</h3>
                  <p className="text-sm text-muted-foreground">Your latest learning activities</p>
                </div>
              </div>

              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action} <span className="text-primary">{activity.item}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="learn" className="space-y-6">
          {/* Learning Paths */}
          <div className="grid gap-6">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                            {path.title}
                          </h3>
                          {path.popular && (
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <span>{path.duration}</span>
                          <span>•</span>
                          <span>{path.lessons} lessons</span>
                          <span>•</span>
                          <Badge className={getDifficultyColor(path.difficulty)} variant="outline">
                            {path.difficulty}
                          </Badge>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            <span>{path.rating}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {path.topics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">
                          {path.completed}/{path.lessons} completed
                        </span>
                      </div>
                      <Progress value={(path.completed / path.lessons) * 100} className="h-2" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button className="bg-primary hover:bg-primary/90">
                        <Play className="h-4 w-4 mr-2" />
                        {path.completed > 0 ? "Continue Learning" : "Start Learning"}
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid gap-6">
            {financialGoals.map((goal) => {
              const progress = (goal.current / goal.target) * 100

              return (
                <div
                  key={goal.id}
                  className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            goal.category === "Debt"
                              ? "bg-red-100 dark:bg-red-900/30"
                              : "bg-green-100 dark:bg-green-900/30"
                          }`}
                        >
                          <goal.icon className={`h-6 w-6 ${goal.color}`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                              {goal.title}
                            </h3>
                            <Badge className={`text-xs ${getPriorityColor(goal.priority)}`} variant="outline">
                              {goal.priority} Priority
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                            <span>{goal.category}</span>
                            <span>•</span>
                            <span>Due: {goal.deadline}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">
                            ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                          <span>{Math.round(progress)}% complete</span>
                          <span>${(goal.target - goal.current).toLocaleString()} remaining</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Update Progress
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Brain className="h-4 w-4 mr-2" />
                          AI Tips
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Budget Calculator",
                description: "Create and manage your monthly budget with AI recommendations",
                icon: Calculator,
                color: "text-blue-500",
              },
              {
                title: "Investment Simulator",
                description: "Practice investing with virtual portfolios and real market data",
                icon: TrendingUp,
                color: "text-green-500",
              },
              {
                title: "Debt Payoff Planner",
                description: "Optimize your debt repayment strategy with smart algorithms",
                icon: CreditCard,
                color: "text-red-500",
              },
              {
                title: "Retirement Calculator",
                description: "Plan your retirement savings and see projected outcomes",
                icon: Target,
                color: "text-purple-500",
              },
              {
                title: "Emergency Fund Tracker",
                description: "Build and track your emergency fund progress",
                icon: Shield,
                color: "text-orange-500",
              },
              {
                title: "Financial Health Score",
                description: "Get a comprehensive assessment of your financial wellness",
                icon: BarChart3,
                color: "text-indigo-500",
              },
            ].map((tool, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 group relative overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <tool.icon className={`h-8 w-8 ${tool.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{tool.description}</p>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Play className="h-4 w-4 mr-2" />
                    Launch Tool
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
