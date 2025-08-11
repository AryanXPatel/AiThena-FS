"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Send, Trophy, Clock, Users, Target, Zap, BookOpen, Play, RotateCcw } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { InteractiveCard } from "@/components/ui/interactive-card"
import { AnimatedButton } from "@/components/ui/animated-button"

interface Message {
  id: string
  sender: "user" | "ai"
  content: string
  timestamp: Date
  type: "argument" | "rebuttal" | "question"
}

interface DebateSession {
  id: string
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: number
  status: "active" | "completed" | "paused"
  userPosition: "for" | "against"
  aiPosition: "for" | "against"
  score: number
  messages: Message[]
}

const debateTopics = [
  {
    id: "1",
    title: "Artificial Intelligence in Education",
    description: "Should AI replace traditional teaching methods?",
    difficulty: "intermediate",
    participants: 1247,
    category: "Technology",
  },
  {
    id: "2",
    title: "Climate Change Policy",
    description: "Are carbon taxes the most effective climate solution?",
    difficulty: "advanced",
    participants: 892,
    category: "Environment",
  },
  {
    id: "3",
    title: "Social Media Regulation",
    description: "Should governments regulate social media platforms?",
    difficulty: "beginner",
    participants: 2156,
    category: "Politics",
  },
  {
    id: "4",
    title: "Universal Basic Income",
    description: "Would UBI solve economic inequality?",
    difficulty: "advanced",
    participants: 743,
    category: "Economics",
  },
]

const recentDebates = [
  {
    id: "1",
    topic: "Remote Work Benefits",
    result: "Won",
    score: 85,
    date: "2 hours ago",
    duration: "15 min",
  },
  {
    id: "2",
    topic: "Renewable Energy",
    result: "Lost",
    score: 72,
    date: "1 day ago",
    duration: "20 min",
  },
  {
    id: "3",
    topic: "Space Exploration",
    result: "Won",
    score: 91,
    date: "3 days ago",
    duration: "18 min",
  },
]

export function DebateArena() {
  const [activeTab, setActiveTab] = useState("browse")
  const [currentSession, setCurrentSession] = useState<DebateSession | null>(null)
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string>("")
  const [selectedPosition, setSelectedPosition] = useState<"for" | "against">("for")
  const [selectedDifficulty, setSelectedDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentSession?.messages])

  const startDebate = (topicId: string) => {
    const topic = debateTopics.find((t) => t.id === topicId)
    if (!topic) return

    const newSession: DebateSession = {
      id: Date.now().toString(),
      topic: topic.title,
      difficulty: selectedDifficulty,
      duration: 0,
      status: "active",
      userPosition: selectedPosition,
      aiPosition: selectedPosition === "for" ? "against" : "for",
      score: 0,
      messages: [
        {
          id: "1",
          sender: "ai",
          content: `Welcome to the debate on "${topic.title}". I'll be arguing ${selectedPosition === "for" ? "against" : "for"} this topic. You have the ${selectedPosition} position. Let's begin with your opening argument.`,
          timestamp: new Date(),
          type: "question",
        },
      ],
    }

    setCurrentSession(newSession)
    setActiveTab("debate")
  }

  const sendMessage = async () => {
    if (!message.trim() || !currentSession) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: message,
      timestamp: new Date(),
      type: "argument",
    }

    setCurrentSession((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, userMessage],
          }
        : null,
    )

    setMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        content: `That's an interesting point. However, I would argue that your perspective doesn't fully consider the broader implications. Let me present a counterargument that challenges your position...`,
        timestamp: new Date(),
        type: "rebuttal",
      }

      setCurrentSession((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, aiMessage],
              score: prev.score + Math.floor(Math.random() * 10) + 5,
            }
          : null,
      )

      setIsTyping(false)
    }, 2000)
  }

  const endDebate = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        status: "completed",
      })
    }
  }

  if (currentSession && activeTab === "debate") {
    return (
      <div className="space-y-6">
        {/* Debate Header */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">{currentSession.topic}</CardTitle>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Your Position: {currentSession.userPosition.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    {currentSession.difficulty.charAt(0).toUpperCase() + currentSession.difficulty.slice(1)}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {Math.floor(currentSession.duration / 60)}:
                      {(currentSession.duration % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{currentSession.score}</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Debate Messages */}
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Debate Session</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setActiveTab("browse")}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Debate
                </Button>
                <Button variant="destructive" size="sm" onClick={endDebate}>
                  End Debate
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 pr-4">
              <div className="space-y-4">
                {currentSession.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex space-x-3 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      <Avatar className="h-8 w-8">
                        {msg.sender === "user" ? (
                          <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-secondary">AI</AvatarFallback>
                        )}
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge
                            variant={
                              msg.type === "argument"
                                ? "default"
                                : msg.type === "rebuttal"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {msg.type}
                          </Badge>
                          <span className="text-xs opacity-70">{msg.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex space-x-3 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-secondary">AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-3 bg-muted">
                        <LoadingSpinner size="sm" />
                        <span className="text-sm text-muted-foreground ml-2">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            {/* Message Input */}
            <div className="flex space-x-2">
              <Textarea
                placeholder="Type your argument or rebuttal..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                className="min-h-[60px] resize-none"
                disabled={currentSession.status !== "active"}
              />
              <AnimatedButton
                onClick={sendMessage}
                disabled={!message.trim() || currentSession.status !== "active"}
                className="px-6"
              >
                <Send className="h-4 w-4" />
              </AnimatedButton>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Topics</TabsTrigger>
          <TabsTrigger value="history">Debate History</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Quick Start Debate</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Choose Your Position</label>
                  <Select
                    value={selectedPosition}
                    onValueChange={(value: "for" | "against") => setSelectedPosition(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="for">For (Supporting)</SelectItem>
                      <SelectItem value="against">Against (Opposing)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Difficulty Level</label>
                  <Select
                    value={selectedDifficulty}
                    onValueChange={(value: "beginner" | "intermediate" | "advanced") => setSelectedDifficulty(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full" disabled={!selectedTopic}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Random Debate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Topics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {debateTopics.map((topic) => (
              <InteractiveCard key={topic.id} className="cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-foreground">{topic.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {topic.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4" />
                        <span className="capitalize">{topic.difficulty}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{topic.participants.toLocaleString()}</span>
                      </div>
                    </div>
                    <AnimatedButton
                      size="sm"
                      onClick={() => {
                        setSelectedTopic(topic.id)
                        startDebate(topic.id)
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Debate
                    </AnimatedButton>
                  </div>
                </CardContent>
              </InteractiveCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Recent Debates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDebates.map((debate) => (
                  <div
                    key={debate.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${debate.result === "Won" ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <div>
                        <h4 className="font-medium text-foreground">{debate.topic}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{debate.date}</span>
                          <span>{debate.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{debate.score}/100</div>
                      <Badge variant={debate.result === "Won" ? "default" : "destructive"}>{debate.result}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span>Top Debaters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, name: "Alex Chen", score: 2847, debates: 156, winRate: 78 },
                  { rank: 2, name: "Sarah Johnson", score: 2634, debates: 142, winRate: 74 },
                  { rank: 3, name: "Mike Rodriguez", score: 2521, debates: 138, winRate: 71 },
                  { rank: 4, name: "You", score: 1892, debates: 89, winRate: 65 },
                ].map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      user.name === "You" ? "border-primary/50 bg-primary/5" : "border-border/50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1
                            ? "bg-yellow-500 text-white"
                            : user.rank === 2
                              ? "bg-gray-400 text-white"
                              : user.rank === 3
                                ? "bg-amber-600 text-white"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.rank}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{user.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{user.debates} debates</span>
                          <span>{user.winRate}% win rate</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-foreground">{user.score.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
