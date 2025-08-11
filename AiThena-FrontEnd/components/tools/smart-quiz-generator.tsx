"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Zap, Target, Clock, Settings } from "lucide-react"

interface QuizQuestion {
  id: string
  type: "multiple-choice" | "true-false" | "short-answer"
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  topic: string
}

const sampleQuestions: QuizQuestion[] = [
  {
    id: "1",
    type: "multiple-choice",
    question: "What is the derivative of x² with respect to x?",
    options: ["x", "2x", "x²", "2x²"],
    correctAnswer: 1,
    explanation: "Using the power rule, the derivative of x² is 2x¹ = 2x",
    difficulty: "easy",
    topic: "Calculus",
  },
  {
    id: "2",
    type: "true-false",
    question: "The integral of a constant is always zero.",
    correctAnswer: "false",
    explanation: "The integral of a constant c is cx + C, where C is the constant of integration.",
    difficulty: "medium",
    topic: "Calculus",
  },
]

export function SmartQuizGenerator() {
  const [activeTab, setActiveTab] = useState<"create" | "quiz" | "results">("create")
  const [quizSettings, setQuizSettings] = useState({
    topic: "",
    difficulty: "medium",
    questionCount: [10],
    questionTypes: ["multiple-choice"],
    timeLimit: [30],
    source: "document",
  })
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({})
  const [quizStarted, setQuizStarted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes

  const handleCreateQuiz = () => {
    setActiveTab("quiz")
    setQuizStarted(true)
  }

  const handleAnswerSelect = (questionId: string, answer: any) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setActiveTab("results")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (activeTab === "create") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quiz Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Quiz Configuration</h3>
                  <p className="text-sm text-muted-foreground">Customize your quiz settings</p>
                </div>
              </div>

              {/* Topic Input */}
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-sm font-medium">
                  Topic or Subject
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g., Calculus, Organic Chemistry, World War II"
                  value={quizSettings.topic}
                  onChange={(e) => setQuizSettings((prev) => ({ ...prev, topic: e.target.value }))}
                  className="bg-muted/30 border-border/50 focus:border-primary/50"
                />
              </div>

              {/* Source Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Generate From</Label>
                <Select
                  value={quizSettings.source}
                  onValueChange={(value) => setQuizSettings((prev) => ({ ...prev, source: value }))}
                >
                  <SelectTrigger className="bg-muted/30 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Uploaded Documents</SelectItem>
                    <SelectItem value="notes">Study Notes</SelectItem>
                    <SelectItem value="topic">Topic Knowledge</SelectItem>
                    <SelectItem value="custom">Custom Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Difficulty Level</Label>
                <Select
                  value={quizSettings.difficulty}
                  onValueChange={(value) => setQuizSettings((prev) => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger className="bg-muted/30 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Question Count */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Number of Questions: {quizSettings.questionCount[0]}</Label>
                <Slider
                  value={quizSettings.questionCount}
                  onValueChange={(value) => setQuizSettings((prev) => ({ ...prev, questionCount: value }))}
                  max={50}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5</span>
                  <span>25</span>
                  <span>50</span>
                </div>
              </div>

              {/* Time Limit */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Time Limit: {quizSettings.timeLimit[0]} minutes</Label>
                <Slider
                  value={quizSettings.timeLimit}
                  onValueChange={(value) => setQuizSettings((prev) => ({ ...prev, timeLimit: value }))}
                  max={120}
                  min={10}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10 min</span>
                  <span>60 min</span>
                  <span>120 min</span>
                </div>
              </div>

              {/* Question Types */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Question Types</Label>
                <div className="space-y-2">
                  {[
                    { id: "multiple-choice", label: "Multiple Choice" },
                    { id: "true-false", label: "True/False" },
                    { id: "short-answer", label: "Short Answer" },
                    { id: "fill-blank", label: "Fill in the Blank" },
                  ].map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.id}
                        checked={quizSettings.questionTypes.includes(type.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setQuizSettings((prev) => ({
                              ...prev,
                              questionTypes: [...prev.questionTypes, type.id],
                            }))
                          } else {
                            setQuizSettings((prev) => ({
                              ...prev,
                              questionTypes: prev.questionTypes.filter((t) => t !== type.id),
                            }))
                          }
                        }}
                      />
                      <Label htmlFor={type.id} className="text-sm">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleCreateQuiz} className="w-full bg-primary hover:bg-primary/90">
                <Zap className="h-4 w-4 mr-2" />
                Generate Quiz
              </Button>
            </div>
          </div>
        </div>

        {/* Preview/Recent Quizzes */}
        <div className="space-y-6">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <h3 className="font-semibold text-foreground mb-4">Recent Quizzes</h3>

              <div className="space-y-3">
                {[
                  { name: "Calculus Quiz #3", score: "87%", date: "2 hours ago" },
                  { name: "Chemistry Review", score: "92%", date: "1 day ago" },
                  { name: "Physics Practice", score: "78%", date: "3 days ago" },
                ].map((quiz, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm">{quiz.name}</p>
                        <p className="text-xs text-muted-foreground">{quiz.date}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {quiz.score}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === "quiz") {
    const question = sampleQuestions[currentQuestion]

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Quiz Header */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Calculus Quiz</h3>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {sampleQuestions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{formatTime(timeRemaining)}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {question.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

          <div className="relative z-10 space-y-6">
            <div>
              <Badge variant="secondary" className="text-xs mb-4">
                {question.topic}
              </Badge>
              <h2 className="text-xl font-semibold text-foreground mb-6">{question.question}</h2>
            </div>

            {question.type === "multiple-choice" && question.options && (
              <RadioGroup
                value={userAnswers[question.id]?.toString()}
                onValueChange={(value) => handleAnswerSelect(question.id, Number.parseInt(value))}
              >
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/30 transition-colors duration-200"
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {question.type === "true-false" && (
              <RadioGroup
                value={userAnswers[question.id]}
                onValueChange={(value) => handleAnswerSelect(question.id, value)}
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/30 transition-colors duration-200">
                    <RadioGroupItem value="true" id="true" />
                    <Label htmlFor="true" className="flex-1 cursor-pointer">
                      True
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/30 transition-colors duration-200">
                    <RadioGroupItem value="false" id="false" />
                    <Label htmlFor="false" className="flex-1 cursor-pointer">
                      False
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-border/30">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="bg-transparent"
              >
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                {sampleQuestions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentQuestion
                        ? "bg-primary"
                        : userAnswers[sampleQuestions[index].id] !== undefined
                          ? "bg-green-500"
                          : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNextQuestion}
                disabled={userAnswers[question.id] === undefined}
                className="bg-primary hover:bg-primary/90"
              >
                {currentQuestion === sampleQuestions.length - 1 ? "Finish Quiz" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Results view would go here
  return <div>Quiz Results</div>
}
