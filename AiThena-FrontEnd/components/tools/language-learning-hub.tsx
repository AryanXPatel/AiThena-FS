"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Globe,
  Play,
  Volume2,
  Mic,
  BookOpen,
  Target,
  Trophy,
  Flame,
  Calendar,
  MessageSquare,
  Headphones,
  Eye,
  CheckCircle,
  RotateCcw,
  Zap,
} from "lucide-react"

const languages = [
  {
    id: 1,
    name: "Spanish",
    flag: "🇪🇸",
    level: "Intermediate",
    progress: 68,
    streak: 12,
    lessonsCompleted: 45,
    totalLessons: 120,
    nextLesson: "Past Tense Conjugations",
    color: "bg-red-500",
  },
  {
    id: 2,
    name: "French",
    flag: "🇫🇷",
    level: "Beginner",
    progress: 23,
    streak: 5,
    lessonsCompleted: 12,
    totalLessons: 100,
    nextLesson: "Basic Greetings",
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "German",
    flag: "🇩🇪",
    level: "Advanced",
    progress: 89,
    streak: 28,
    lessonsCompleted: 89,
    totalLessons: 100,
    nextLesson: "Business German",
    color: "bg-yellow-500",
  },
]

const todayLessons = [
  {
    id: 1,
    title: "Vocabulary: Food & Dining",
    language: "Spanish",
    type: "vocabulary",
    duration: 15,
    difficulty: "intermediate",
    completed: false,
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Pronunciation Practice",
    language: "Spanish",
    type: "speaking",
    duration: 10,
    difficulty: "intermediate",
    completed: true,
    icon: Mic,
  },
  {
    id: 3,
    title: "Listening Comprehension",
    language: "French",
    type: "listening",
    duration: 20,
    difficulty: "beginner",
    completed: false,
    icon: Headphones,
  },
  {
    id: 4,
    title: "Grammar: Articles",
    language: "German",
    type: "grammar",
    duration: 25,
    difficulty: "advanced",
    completed: false,
    icon: Target,
  },
]

const achievements = [
  { id: 1, title: "7-Day Streak", icon: Flame, earned: true, color: "text-orange-500" },
  { id: 2, title: "Vocabulary Master", icon: BookOpen, earned: true, color: "text-blue-500" },
  { id: 3, title: "Perfect Pronunciation", icon: Mic, earned: false, color: "text-gray-400" },
  { id: 4, title: "Grammar Guru", icon: Target, earned: false, color: "text-gray-400" },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
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

const getTypeIcon = (type: string) => {
  switch (type) {
    case "vocabulary":
      return BookOpen
    case "speaking":
      return Mic
    case "listening":
      return Headphones
    case "grammar":
      return Target
    case "reading":
      return Eye
    default:
      return BookOpen
  }
}

export function LanguageLearningHub() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedLanguage, setSelectedLanguage] = useState<any>(null)
  const [lessonMode, setLessonMode] = useState(false)

  const handleStartLesson = (lesson: any) => {
    setLessonMode(true)
  }

  if (lessonMode) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Lesson Header */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Vocabulary: Food & Dining</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Spanish 🇪🇸</span>
                  <span>•</span>
                  <span>15 minutes</span>
                  <span>•</span>
                  <Badge className={getDifficultyColor("intermediate")} variant="outline">
                    Intermediate
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setLessonMode(false)} className="bg-transparent">
                Exit Lesson
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">3 of 10 completed</span>
            </div>
            <Progress value={30} className="h-2" />
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden min-h-[500px]">
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

          <div className="relative z-10 p-8 text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">🍕</div>
              <h2 className="text-3xl font-bold text-foreground mb-2">pizza</h2>
              <p className="text-lg text-muted-foreground">feminine noun</p>
            </div>

            <div className="flex items-center justify-center space-x-4 mb-8">
              <Button variant="outline" size="lg" className="bg-transparent">
                <Volume2 className="h-5 w-5 mr-2" />
                Listen
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent">
                <Mic className="h-5 w-5 mr-2" />
                Speak
              </Button>
            </div>

            <div className="max-w-md mx-auto">
              <p className="text-muted-foreground mb-6">
                "Pizza" is a feminine noun in Spanish. It's pronounced "PEE-sah" with emphasis on the first syllable.
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="font-medium text-foreground">Example:</p>
                  <p className="text-muted-foreground italic">"Me gusta la pizza con queso"</p>
                  <p className="text-sm text-muted-foreground">(I like pizza with cheese)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Controls */}
        <div className="flex items-center justify-between">
          <Button variant="outline" className="bg-transparent">
            <RotateCcw className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <div className="w-2 h-2 bg-primary rounded-full" />
            <div className="w-2 h-2 bg-primary rounded-full" />
            <div className="w-2 h-2 bg-muted rounded-full" />
            <div className="w-2 h-2 bg-muted rounded-full" />
          </div>

          <Button className="bg-primary hover:bg-primary/90">
            Next
            <Zap className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-muted/30">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Current Streak", value: "12", icon: Flame, color: "text-orange-500" },
              { label: "Languages", value: "3", icon: Globe, color: "text-blue-500" },
              { label: "Lessons Today", value: "2/4", icon: Target, color: "text-green-500" },
              { label: "XP Points", value: "1,247", icon: Trophy, color: "text-yellow-500" },
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

          {/* Languages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {languages.map((language) => (
              <div
                key={language.id}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{language.flag}</div>
                      <div>
                        <h3 className="font-semibold text-foreground">{language.name}</h3>
                        <p className="text-sm text-muted-foreground">{language.level}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium text-foreground">{language.streak}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{language.progress}%</span>
                      </div>
                      <Progress value={language.progress} className="h-2" />
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>
                        {language.lessonsCompleted}/{language.totalLessons} lessons completed
                      </p>
                      <p className="mt-1">Next: {language.nextLesson}</p>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Today's Lessons */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Today's Lessons</h3>
                    <p className="text-sm text-muted-foreground">Complete your daily learning goals</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {todayLessons.map((lesson) => {
                  const TypeIcon = getTypeIcon(lesson.type)

                  return (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors duration-200 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            lesson.completed
                              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {lesson.completed ? <CheckCircle className="h-5 w-5" /> : <TypeIcon className="h-5 w-5" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-foreground">{lesson.title}</h4>
                            <Badge className={getDifficultyColor(lesson.difficulty)} variant="outline">
                              {lesson.difficulty}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{lesson.language}</span>
                            <span>•</span>
                            <span>{lesson.duration} min</span>
                            <span>•</span>
                            <span className="capitalize">{lesson.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {lesson.completed ? (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            Completed
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleStartLesson(lesson)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-6">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Lesson Library</h3>
            <p className="text-muted-foreground mb-6">Browse structured lessons organized by skill level and topic.</p>
            <Button className="bg-primary hover:bg-primary/90">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Lessons
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-soft dark:shadow-soft-dark text-center relative overflow-hidden">
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

              <div className="relative z-10">
                <Mic className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Speaking Practice</h3>
                <p className="text-muted-foreground mb-6">Practice pronunciation with AI-powered speech recognition.</p>
                <Button className="bg-primary hover:bg-primary/90">
                  <Mic className="h-4 w-4 mr-2" />
                  Start Speaking
                </Button>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-soft dark:shadow-soft-dark text-center relative overflow-hidden">
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

              <div className="relative z-10">
                <MessageSquare className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Conversation</h3>
                <p className="text-muted-foreground mb-6">Chat with AI tutors in your target language.</p>
                <Button className="bg-primary hover:bg-primary/90">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Achievements */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Achievements</h3>
                  <p className="text-sm text-muted-foreground">Your learning milestones</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                      achievement.earned
                        ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                        : "bg-muted/30 border-border/50 opacity-60"
                    }`}
                  >
                    <achievement.icon className={`h-8 w-8 mx-auto mb-2 ${achievement.color}`} />
                    <p className="text-sm font-medium text-foreground">{achievement.title}</p>
                    {achievement.earned && (
                      <Badge variant="outline" className="text-xs mt-2 bg-green-50 text-green-700 border-green-200">
                        Earned
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
