"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Cpu,
  GitBranch,
  Database,
  Layers,
  Zap,
  Target,
  Trophy,
  Clock,
  CheckCircle,
  Play,
  BookOpen,
  TrendingUp,
  Star,
  BarChart3,
  ArrowRight,
  Code,
} from "lucide-react"

const dsaTopics = [
  {
    id: 1,
    name: "Arrays & Strings",
    icon: Database,
    progress: 85,
    problems: 45,
    solved: 38,
    difficulty: "Beginner",
    color: "bg-blue-500",
    description: "Master fundamental array operations and string manipulation",
  },
  {
    id: 2,
    name: "Linked Lists",
    icon: GitBranch,
    progress: 67,
    problems: 30,
    solved: 20,
    difficulty: "Beginner",
    color: "bg-green-500",
    description: "Understand pointer manipulation and linked data structures",
  },
  {
    id: 3,
    name: "Trees & Graphs",
    icon: GitBranch,
    progress: 42,
    problems: 55,
    solved: 23,
    difficulty: "Intermediate",
    color: "bg-purple-500",
    description: "Explore hierarchical and network data structures",
  },
  {
    id: 4,
    name: "Dynamic Programming",
    icon: Layers,
    progress: 23,
    problems: 40,
    solved: 9,
    difficulty: "Advanced",
    color: "bg-red-500",
    description: "Master optimization problems with memoization",
  },
  {
    id: 5,
    name: "Sorting & Searching",
    icon: Target,
    progress: 78,
    problems: 25,
    solved: 19,
    difficulty: "Intermediate",
    color: "bg-yellow-500",
    description: "Learn efficient sorting and searching algorithms",
  },
  {
    id: 6,
    name: "Graph Algorithms",
    icon: Cpu,
    progress: 34,
    problems: 35,
    solved: 12,
    difficulty: "Advanced",
    color: "bg-indigo-500",
    description: "Implement BFS, DFS, and shortest path algorithms",
  },
]

const recentProblems = [
  {
    id: 1,
    title: "Two Sum",
    topic: "Arrays",
    difficulty: "Easy",
    status: "solved",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    lastAttempt: "2 hours ago",
    attempts: 1,
    score: 95,
  },
  {
    id: 2,
    title: "Reverse Linked List",
    topic: "Linked Lists",
    difficulty: "Easy",
    status: "solved",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    lastAttempt: "1 day ago",
    attempts: 2,
    score: 88,
  },
  {
    id: 3,
    title: "Binary Tree Inorder Traversal",
    topic: "Trees",
    difficulty: "Medium",
    status: "attempted",
    timeComplexity: null,
    spaceComplexity: null,
    lastAttempt: "2 days ago",
    attempts: 3,
    score: null,
  },
  {
    id: 4,
    title: "Longest Common Subsequence",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    status: "unsolved",
    timeComplexity: null,
    spaceComplexity: null,
    lastAttempt: null,
    attempts: 0,
    score: null,
  },
]

const studyPlans = [
  {
    id: 1,
    title: "FAANG Interview Prep",
    duration: "12 weeks",
    problems: 150,
    completed: 45,
    difficulty: "Advanced",
    topics: ["Arrays", "Trees", "DP", "Graphs"],
    popular: true,
  },
  {
    id: 2,
    title: "Beginner's DSA Journey",
    duration: "8 weeks",
    problems: 80,
    completed: 12,
    difficulty: "Beginner",
    topics: ["Arrays", "Strings", "Linked Lists"],
    popular: false,
  },
  {
    id: 3,
    title: "Competitive Programming",
    duration: "16 weeks",
    problems: 200,
    completed: 0,
    difficulty: "Expert",
    topics: ["Math", "Graphs", "DP", "Geometry"],
    popular: true,
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "medium":
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "hard":
    case "advanced":
    case "expert":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "solved":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "attempted":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "unsolved":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function DSAGuruPlatform() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedTopic, setSelectedTopic] = useState<any>(null)

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-muted/30">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="problems">Problems</TabsTrigger>
          <TabsTrigger value="study-plans">Study Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Problems Solved", value: "127", icon: CheckCircle, color: "text-green-500" },
              { label: "Current Streak", value: "15", icon: Zap, color: "text-orange-500" },
              { label: "Topics Mastered", value: "3/6", icon: Trophy, color: "text-yellow-500" },
              { label: "Global Rank", value: "#2,847", icon: TrendingUp, color: "text-blue-500" },
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

          {/* Topic Progress */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Topic Progress</h3>
                    <p className="text-sm text-muted-foreground">Your mastery across different DSA topics</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dsaTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors duration-200 cursor-pointer"
                    onClick={() => setSelectedTopic(topic)}
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
                        {topic.solved}/{topic.problems} problems solved
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Problems */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Recent Problems</h3>
                    <p className="text-sm text-muted-foreground">Your latest problem-solving activity</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {recentProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          problem.status === "solved"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : problem.status === "attempted"
                              ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {problem.status === "solved" ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Code className="h-5 w-5" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-foreground">{problem.title}</h4>
                          <Badge className={getDifficultyColor(problem.difficulty)} variant="outline">
                            {problem.difficulty}
                          </Badge>
                          <Badge className={getStatusColor(problem.status)} variant="outline">
                            {problem.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{problem.topic}</span>
                          {problem.timeComplexity && (
                            <>
                              <span>•</span>
                              <span>Time: {problem.timeComplexity}</span>
                            </>
                          )}
                          {problem.spaceComplexity && (
                            <>
                              <span>•</span>
                              <span>Space: {problem.spaceComplexity}</span>
                            </>
                          )}
                          {problem.attempts > 0 && (
                            <>
                              <span>•</span>
                              <span>{problem.attempts} attempts</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {problem.score && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Score: {problem.score}
                        </Badge>
                      )}
                      <Button size="sm" variant="outline" className="bg-transparent">
                        {problem.status === "unsolved" ? "Solve" : "Review"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="topics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dsaTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 ${topic.color} rounded-xl flex items-center justify-center`}>
                      <topic.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                        {topic.name}
                      </h3>
                      <Badge className={getDifficultyColor(topic.difficulty)} variant="outline">
                        {topic.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{topic.description}</p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{topic.progress}%</span>
                      </div>
                      <Progress value={topic.progress} className="h-2" />
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>
                        {topic.solved}/{topic.problems} problems solved
                      </p>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Play className="h-4 w-4 mr-2" />
                      Practice Problems
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="problems" className="space-y-6">
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Problem Bank</h3>
            <p className="text-muted-foreground mb-6">
              Access thousands of curated DSA problems with detailed solutions and explanations.
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              <Target className="h-4 w-4 mr-2" />
              Browse Problems
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="study-plans" className="space-y-6">
          <div className="grid gap-6">
            {studyPlans.map((plan) => (
              <div
                key={plan.id}
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
                            {plan.title}
                          </h3>
                          {plan.popular && (
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <span>{plan.duration}</span>
                          <span>•</span>
                          <span>{plan.problems} problems</span>
                          <span>•</span>
                          <Badge className={getDifficultyColor(plan.difficulty)} variant="outline">
                            {plan.difficulty}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {plan.topics.map((topic, index) => (
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
                          {plan.completed}/{plan.problems} completed
                        </span>
                      </div>
                      <Progress value={(plan.completed / plan.problems) * 100} className="h-2" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button className="bg-primary hover:bg-primary/90">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        {plan.completed > 0 ? "Continue Plan" : "Start Plan"}
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
