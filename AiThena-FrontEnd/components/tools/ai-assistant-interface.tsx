"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Mic, Paperclip, Sparkles, BookOpen, Target, Brain, Clock } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "text" | "suggestion" | "quiz" | "summary"
}

const quickActions = [
  { icon: BookOpen, label: "Explain Concept", prompt: "Can you explain this concept in simple terms?" },
  { icon: Target, label: "Create Quiz", prompt: "Generate a quiz on this topic" },
  { icon: Brain, label: "Study Tips", prompt: "Give me study tips for this subject" },
  { icon: Clock, label: "Study Plan", prompt: "Create a study plan for this topic" },
]

export function AIAssistantInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI Study Assistant. I can help you understand concepts, create quizzes, generate summaries, and provide personalized study guidance. What would you like to work on today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const history = messages.map((m) => ({
        role: m.sender === "ai" ? "model" : "user",
        text: m.content,
      }))

      const resp = await fetch("http://localhost:4001/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history,
          systemInstruction:
            "You are AiThena, a concise and helpful AI study copilot. Prefer clear explanations, steps, and examples.",
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 512,
        }),
      })

      if (!resp.ok) {
        throw new Error(`Request failed: ${resp.status}`)
      }
      const data = await resp.json()
      const text = (data?.text as string) || ""

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: text || "(No response)",
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (e) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I ran into an issue reaching the study assistant. Please try again.",
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, aiMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt)
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-16rem)]">
      {/* Chat Interface */}
      <div className="lg:col-span-3 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-soft dark:shadow-soft-dark flex flex-col overflow-hidden">
        {/* Inner border effect */}
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

        {/* Chat Header */}
        <div className="p-6 border-b border-border/30 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Study Assistant</h3>
              <p className="text-sm text-muted-foreground">Online • Ready to help</p>
            </div>
            <div className="ml-auto flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600">Active</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-6 relative z-10">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  {message.sender === "ai" ? (
                    <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                  ) : (
                    <>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>You</AvatarFallback>
                    </>
                  )}
                </Avatar>

                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                </Avatar>
                <div className="bg-muted/50 rounded-2xl p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-6 border-t border-border/30 relative z-10">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Ask me anything about your studies..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                className="pr-12 bg-muted/30 border-border/50 focus:border-primary/50"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="h-10 px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Quick Actions</h3>
            </div>

            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-3 hover:bg-muted/50"
                  onClick={() => handleQuickAction(action.prompt)}
                >
                  <action.icon className="h-4 w-4 mr-3 text-primary" />
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Topics */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

          <div className="relative z-10">
            <h3 className="font-semibold text-foreground text-sm mb-4">Recent Topics</h3>

            <div className="space-y-3">
              {["Calculus Integration", "Organic Chemistry", "Data Structures", "World War II"].map((topic, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors duration-200"
                >
                  <p className="text-sm font-medium text-foreground">{topic}</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
