"use client"

import { useState, useEffect } from "react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { InteractiveCard } from "@/components/ui/interactive-card"
import { ProgressRing } from "@/components/ui/progress-ring"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PenTool,
  FileText,
  Lightbulb,
  CheckCircle,
  Target,
  BookOpen,
  Search,
  Download,
  Share2,
  Edit,
  Trash2,
  Plus,
  Brain,
  Zap,
  Eye,
  RotateCcw,
  Clock,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

const essayTypes = [
  "Argumentative Essay",
  "Analytical Essay",
  "Expository Essay",
  "Narrative Essay",
  "Descriptive Essay",
  "Compare and Contrast",
  "Cause and Effect",
  "Research Paper",
]

const essays = [
  {
    id: 1,
    title: "The Impact of AI on Modern Education",
    type: "Argumentative Essay",
    subject: "Technology",
    wordCount: 1247,
    targetWords: 1500,
    status: "in-progress",
    lastEdited: "2 hours ago",
    grade: null,
    outline: true,
    draft: true,
  },
  {
    id: 2,
    title: "Climate Change Solutions",
    type: "Research Paper",
    subject: "Environmental Science",
    wordCount: 2834,
    targetWords: 3000,
    status: "completed",
    lastEdited: "1 day ago",
    grade: "A-",
    outline: true,
    draft: true,
  },
  {
    id: 3,
    title: "Shakespeare's Use of Symbolism",
    type: "Analytical Essay",
    subject: "Literature",
    wordCount: 0,
    targetWords: 1200,
    status: "planning",
    lastEdited: "3 days ago",
    grade: null,
    outline: false,
    draft: false,
  },
]

const writingSteps = [
  { id: 1, title: "Topic & Thesis", icon: Lightbulb, completed: true },
  { id: 2, title: "Research & Outline", icon: Search, completed: true },
  { id: 3, title: "First Draft", icon: PenTool, completed: false, active: true },
  { id: 4, title: "Review & Edit", icon: Edit, completed: false },
  { id: 5, title: "Final Polish", icon: CheckCircle, completed: false },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "planning":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function EssayWritingStudio() {
  const [activeTab, setActiveTab] = useState("essays")
  const [selectedEssay, setSelectedEssay] = useState<any>(null)
  const [writingMode, setWritingMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [wordCount, setWordCount] = useState(247)
  const [isTyping, setIsTyping] = useState(false)

  // Simulate typing indicator
  useEffect(() => {
    if (writingMode) {
      const interval = setInterval(() => {
        setIsTyping((prev) => !prev)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [writingMode])

  const handleStartWriting = (essay: any) => {
    setSelectedEssay(essay)
    setWritingMode(true)
  }

  if (writingMode && selectedEssay) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Enhanced Writing Header */}
        <InteractiveCard className="p-6" hoverScale={false}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <PenTool className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">{selectedEssay.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <Badge className={getStatusColor(selectedEssay.status)} variant="outline">
                    {selectedEssay.status}
                  </Badge>
                  <span>{selectedEssay.type}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Last saved 2 min ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ProgressRing
                progress={(wordCount / selectedEssay.targetWords) * 100}
                size={60}
                strokeWidth={4}
                showPercentage={false}
              />
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">{wordCount}</p>
                <p className="text-xs text-muted-foreground">of {selectedEssay.targetWords} words</p>
              </div>
            </div>
          </div>

          {/* Real-time progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Writing Progress</span>
              <span className="font-medium text-foreground">
                {Math.round((wordCount / selectedEssay.targetWords) * 100)}%
              </span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min((wordCount / selectedEssay.targetWords) * 100, 100)}%` }}
              />
            </div>
          </div>
        </InteractiveCard>

        {/* Enhanced Writing Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <InteractiveCard className="min-h-[600px]" hoverScale={false}>
              <div className="p-6">
                {/* Editor Toolbar */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/30">
                  <div className="flex items-center space-x-2">
                    <AnimatedButton variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Format
                    </AnimatedButton>
                    <AnimatedButton variant="ghost" size="sm">
                      <Brain className="h-4 w-4 mr-2" />
                      AI Assist
                    </AnimatedButton>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isTyping && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span>Auto-saving...</span>
                      </div>
                    )}
                    <AnimatedButton variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </AnimatedButton>
                  </div>
                </div>

                <Textarea
                  placeholder="Start writing your essay here..."
                  className="min-h-[500px] border-none bg-transparent resize-none focus:ring-0 text-base leading-relaxed"
                  defaultValue="The rapid advancement of artificial intelligence has fundamentally transformed the landscape of modern education, presenting both unprecedented opportunities and significant challenges that educators, students, and policymakers must navigate carefully..."
                  onChange={(e) => {
                    const words = e.target.value.split(" ").filter((word) => word.length > 0).length
                    setWordCount(words)
                    setIsTyping(true)
                    setTimeout(() => setIsTyping(false), 1000)
                  }}
                />
              </div>
            </InteractiveCard>
          </div>

          {/* Enhanced Sidebar Tools */}
          <div className="space-y-6">
            {/* Writing Process */}
            <InteractiveCard className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground text-sm">Writing Process</h3>
              </div>

              <div className="space-y-3">
                {writingSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-3 group">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                        step.completed
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : step.active
                            ? "bg-primary/10 text-primary animate-pulse"
                            : "bg-muted text-muted-foreground group-hover:bg-muted/80",
                      )}
                    >
                      {step.completed ? <CheckCircle className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium transition-colors duration-200",
                          step.active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        {step.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </InteractiveCard>

            {/* AI Suggestions */}
            <InteractiveCard className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-4 w-4 text-primary animate-pulse" />
                <h3 className="font-semibold text-foreground text-sm">AI Suggestions</h3>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Strengthen your thesis",
                    desc: "Consider adding a counterargument to make your position stronger.",
                  },
                  { title: "Add transition", desc: "The flow between paragraphs 2 and 3 could be smoother." },
                  { title: "Citation needed", desc: "This claim would benefit from supporting evidence." },
                ].map((suggestion, index) => (
                  <InteractiveCard
                    key={index}
                    className="p-3 cursor-pointer hover:bg-primary/5 border-primary/20"
                    hoverScale={false}
                  >
                    <p className="text-sm font-medium text-foreground mb-1">{suggestion.title}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.desc}</p>
                  </InteractiveCard>
                ))}
              </div>
            </InteractiveCard>

            {/* Quick Actions */}
            <InteractiveCard className="p-6">
              <h3 className="font-semibold text-foreground text-sm mb-4">Quick Actions</h3>

              <div className="space-y-2">
                {[
                  { icon: Zap, label: "Grammar Check", color: "text-blue-500" },
                  { icon: Target, label: "Plagiarism Check", color: "text-red-500" },
                  { icon: BookOpen, label: "Find Sources", color: "text-green-500" },
                  { icon: RotateCcw, label: "Rephrase Text", color: "text-purple-500" },
                ].map((action, index) => (
                  <AnimatedButton
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto p-3 hover:bg-muted/50"
                  >
                    <action.icon className={`h-4 w-4 mr-3 ${action.color}`} />
                    <span>{action.label}</span>
                  </AnimatedButton>
                ))}
              </div>
            </InteractiveCard>
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-6 right-6 flex items-center space-x-3 animate-in slide-in-from-bottom duration-300">
          <AnimatedButton
            variant="outline"
            size="sm"
            onClick={() => setWritingMode(false)}
            className="bg-background/80 backdrop-blur-sm"
          >
            Back to Essays
          </AnimatedButton>
          <AnimatedButton className="shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            Export
          </AnimatedButton>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-muted/30">
          <TabsTrigger value="essays" className="transition-all duration-200">
            My Essays
          </TabsTrigger>
          <TabsTrigger value="templates" className="transition-all duration-200">
            Templates
          </TabsTrigger>
          <TabsTrigger value="research" className="transition-all duration-200">
            Research
          </TabsTrigger>
          <TabsTrigger value="feedback" className="transition-all duration-200">
            Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="essays" className="space-y-6">
          {/* Enhanced Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative w-64 group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
                <Input
                  placeholder="Search essays..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/30 border-border/50 focus:border-primary/50 transition-all duration-200"
                />
              </div>
              <AnimatedButton variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Essay
              </AnimatedButton>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {essays.length} essays
              </Badge>
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />2 in progress
              </Badge>
            </div>
          </div>

          {/* Enhanced Essays Grid */}
          <div className="grid gap-6">
            {essays.map((essay, index) => (
              <InteractiveCard
                key={essay.id}
                className="p-6 group"
                onClick={() => handleStartWriting(essay)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                          {essay.title}
                        </h3>
                        {essay.grade && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            {essay.grade}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <span>{essay.type}</span>
                        <span>•</span>
                        <span>{essay.subject}</span>
                        <span>•</span>
                        <span>
                          {essay.wordCount.toLocaleString()}/{essay.targetWords.toLocaleString()} words
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <Badge className={`text-xs ${getStatusColor(essay.status)}`}>
                          {essay.status.replace("-", " ")}
                        </Badge>
                        {essay.outline && (
                          <Badge variant="outline" className="text-xs">
                            Outlined
                          </Badge>
                        )}
                        {essay.draft && (
                          <Badge variant="outline" className="text-xs">
                            Draft Ready
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">Last edited {essay.lastEdited}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <AnimatedButton variant="ghost" size="icon" className="h-8 w-8">
                      <Share2 className="h-4 w-4" />
                    </AnimatedButton>
                    <AnimatedButton variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </AnimatedButton>
                    <AnimatedButton variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </AnimatedButton>
                  </div>
                </div>

                {/* Enhanced Progress Visualization */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">
                      {Math.round((essay.wordCount / essay.targetWords) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${Math.min((essay.wordCount / essay.targetWords) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <AnimatedButton className="bg-primary hover:bg-primary/90">
                    <PenTool className="h-4 w-4 mr-2" />
                    {essay.status === "planning" ? "Start Writing" : "Continue Writing"}
                  </AnimatedButton>
                  <AnimatedButton variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </AnimatedButton>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Essay Templates</h3>
            <p className="text-muted-foreground mb-6">
              Choose from pre-built templates to jumpstart your writing process.
            </p>
            <AnimatedButton className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Browse Templates
            </AnimatedButton>
          </div>
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Research Assistant</h3>
            <p className="text-muted-foreground mb-6">Find credible sources and manage citations for your essays.</p>
            <AnimatedButton className="bg-primary hover:bg-primary/90">
              <Search className="h-4 w-4 mr-2" />
              Start Research
            </AnimatedButton>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">AI Feedback</h3>
            <p className="text-muted-foreground mb-6">
              Get detailed feedback on your writing style, structure, and content.
            </p>
            <AnimatedButton className="bg-primary hover:bg-primary/90">
              <Brain className="h-4 w-4 mr-2" />
              Analyze Writing
            </AnimatedButton>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
