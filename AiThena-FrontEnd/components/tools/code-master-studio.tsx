"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Code, Play, Bug, CheckCircle, Trophy, Target, BookOpen, Lightbulb, TrendingUp, ArrowRight } from "lucide-react"

const programmingLanguages = [
  { id: "python", name: "Python", icon: "🐍", color: "bg-blue-500" },
  { id: "javascript", name: "JavaScript", icon: "🟨", color: "bg-yellow-500" },
  { id: "java", name: "Java", icon: "☕", color: "bg-red-500" },
  { id: "cpp", name: "C++", icon: "⚡", color: "bg-purple-500" },
  { id: "go", name: "Go", icon: "🔵", color: "bg-cyan-500" },
  { id: "rust", name: "Rust", icon: "🦀", color: "bg-orange-500" },
]

const challenges = [
  {
    id: 1,
    title: "Two Sum Problem",
    difficulty: "Easy",
    language: "Python",
    category: "Arrays",
    completed: true,
    timeSpent: "12 min",
    score: 95,
    description: "Find two numbers in an array that add up to a target sum.",
  },
  {
    id: 2,
    title: "Binary Tree Traversal",
    difficulty: "Medium",
    language: "JavaScript",
    category: "Trees",
    completed: false,
    timeSpent: null,
    score: null,
    description: "Implement in-order, pre-order, and post-order traversal.",
  },
  {
    id: 3,
    title: "Dynamic Programming: Fibonacci",
    difficulty: "Hard",
    language: "Java",
    category: "Dynamic Programming",
    completed: false,
    timeSpent: null,
    score: null,
    description: "Optimize fibonacci calculation using memoization.",
  },
]

const learningPaths = [
  {
    id: 1,
    title: "Python Fundamentals",
    progress: 78,
    lessons: 24,
    completedLessons: 19,
    estimatedTime: "2 weeks",
    difficulty: "Beginner",
    icon: "🐍",
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    progress: 45,
    lessons: 32,
    completedLessons: 14,
    estimatedTime: "6 weeks",
    difficulty: "Intermediate",
    icon: "🔗",
  },
  {
    id: 3,
    title: "Web Development with React",
    progress: 23,
    lessons: 28,
    completedLessons: 6,
    estimatedTime: "4 weeks",
    difficulty: "Intermediate",
    icon: "⚛️",
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "hard":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function CodeMasterStudio() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null)
  const [codingMode, setCodingMode] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("python")
  const [code, setCode] = useState(`def two_sum(nums, target):
    """
    Find two numbers in the array that add up to target.
    
    Args:
        nums: List of integers
        target: Target sum
        
    Returns:
        List of two indices
    """
    # Your solution here
    pass`)

  const handleStartChallenge = (challenge: any) => {
    setSelectedChallenge(challenge)
    setCodingMode(true)
  }

  if (codingMode && selectedChallenge) {
    return (
      <div className="space-y-6">
        {/* Challenge Header */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Code className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{selectedChallenge.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <Badge className={getDifficultyColor(selectedChallenge.difficulty)} variant="outline">
                    {selectedChallenge.difficulty}
                  </Badge>
                  <span>{selectedChallenge.category}</span>
                  <span>•</span>
                  <span>{selectedChallenge.language}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="bg-transparent">
                <Lightbulb className="h-4 w-4 mr-2" />
                Hint
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCodingMode(false)} className="bg-transparent">
                Back to Challenges
              </Button>
            </div>
          </div>
        </div>

        {/* Coding Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <h4 className="font-semibold text-foreground mb-4">Problem Description</h4>

              <div className="space-y-4 text-sm">
                <p className="text-muted-foreground leading-relaxed">{selectedChallenge.description}</p>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h5 className="font-medium text-foreground mb-2">Example:</h5>
                  <div className="font-mono text-sm">
                    <p className="text-muted-foreground">Input: nums = [2,7,11,15], target = 9</p>
                    <p className="text-muted-foreground">Output: [0,1]</p>
                    <p className="text-muted-foreground mt-2">Explanation: nums[0] + nums[1] = 2 + 7 = 9</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-foreground">Constraints:</h5>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• 2 ≤ nums.length ≤ 10⁴</li>
                    <li>• -10⁹ ≤ nums[i] ≤ 10⁹</li>
                    <li>• -10⁹ ≤ target ≤ 10⁹</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              {/* Editor Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/30">
                <div className="flex items-center space-x-4">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-32 bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {programmingLanguages.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id}>
                          <div className="flex items-center space-x-2">
                            <span>{lang.icon}</span>
                            <span>{lang.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Bug className="h-4 w-4 mr-2" />
                    Debug
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Play className="h-4 w-4 mr-2" />
                    Run
                  </Button>
                </div>
              </div>

              {/* Code Area */}
              <div className="p-4">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-[400px] font-mono text-sm border-none bg-transparent resize-none focus:ring-0"
                  placeholder="Write your code here..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-foreground">Test Results</h4>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  3/3 Passed
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { test: "Test Case 1", input: "[2,7,11,15], 9", output: "[0,1]", status: "passed" },
                { test: "Test Case 2", input: "[3,2,4], 6", output: "[1,2]", status: "passed" },
                { test: "Test Case 3", input: "[3,3], 6", output: "[0,1]", status: "passed" },
              ].map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{result.test}</p>
                      <p className="text-xs text-muted-foreground">Input: {result.input}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">Output: {result.output}</p>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Passed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Runtime: 52ms</span>
                <span>•</span>
                <span>Memory: 14.2MB</span>
                <span>•</span>
                <span>Time Complexity: O(n)</span>
              </div>

              <Button className="bg-primary hover:bg-primary/90">
                <Trophy className="h-4 w-4 mr-2" />
                Submit Solution
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-muted/30">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="learning">Learning Paths</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Problems Solved", value: "47", icon: CheckCircle, color: "text-green-500" },
              { label: "Current Streak", value: "12", icon: Target, color: "text-orange-500" },
              { label: "Languages", value: "6", icon: Code, color: "text-blue-500" },
              { label: "Rank", value: "#1,247", icon: Trophy, color: "text-yellow-500" },
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

          {/* Recent Challenges */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Recent Challenges</h3>
                    <p className="text-sm text-muted-foreground">Continue your coding journey</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  View All
                </Button>
              </div>

              <div className="grid gap-4">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors duration-200 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          challenge.completed
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {challenge.completed ? <CheckCircle className="h-5 w-5" /> : <Code className="h-5 w-5" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-foreground">{challenge.title}</h4>
                          <Badge className={getDifficultyColor(challenge.difficulty)} variant="outline">
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{challenge.language}</span>
                          <span>•</span>
                          <span>{challenge.category}</span>
                          {challenge.timeSpent && (
                            <>
                              <span>•</span>
                              <span>{challenge.timeSpent}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {challenge.completed ? (
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 mb-1">
                            Score: {challenge.score}
                          </Badge>
                          <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleStartChallenge(challenge)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Paths Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-2xl">{path.icon}</div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                        {path.title}
                      </h3>
                      <Badge className={getDifficultyColor(path.difficulty)} variant="outline">
                        {path.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{path.progress}%</span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>
                        {path.completedLessons}/{path.lessons} lessons completed
                      </p>
                      <p className="mt-1">Est. time: {path.estimatedTime}</p>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="text-center py-12">
            <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Coding Challenges</h3>
            <p className="text-muted-foreground mb-6">
              Practice with thousands of coding problems across different difficulty levels.
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              <Target className="h-4 w-4 mr-2" />
              Browse Challenges
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Learning Paths</h3>
            <p className="text-muted-foreground mb-6">
              Structured learning paths to master programming concepts step by step.
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowRight className="h-4 w-4 mr-2" />
              Explore Paths
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Progress Analytics</h3>
            <p className="text-muted-foreground mb-6">
              Track your coding journey with detailed analytics and insights.
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
