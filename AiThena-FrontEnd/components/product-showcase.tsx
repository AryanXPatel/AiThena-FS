"use client"

import React, { useState, useEffect } from "react"
import { FileText, Brain, CheckCircle, Upload, Loader2, Sparkles, BookOpen, Target, Clock } from "lucide-react"

export function ProductShowcase() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTransformation, setShowTransformation] = useState(false)
  const [builtElements, setBuiltElements] = useState<Set<string>>(new Set())

  const steps = [
    {
      icon: Upload,
      title: "Upload Your Materials",
      description: "Drag and drop any PDF, document, or paste YouTube links",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-500/10 to-blue-600/5",
      id: "upload",
    },
    {
      icon: Brain,
      title: "AI Processing",
      description: "Our AI analyzes and structures your content in seconds",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-500/10 to-purple-600/5",
      id: "processing",
    },
    {
      icon: CheckCircle,
      title: "Ready to Learn",
      description: "Get summaries, quizzes, and flashcards instantly",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-500/10 to-green-600/5",
      id: "ready",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true)

      setTimeout(() => {
        setCurrentStep((prev) => {
          const nextStep = (prev + 1) % steps.length

          // Reset elements when starting over
          if (nextStep === 0) {
            setShowTransformation(false)
            setBuiltElements(new Set())
          }

          // Build elements progressively
          if (nextStep === 1) {
            setBuiltElements(new Set(["summary"]))
          } else if (nextStep === 2) {
            setShowTransformation(true)
            setBuiltElements(new Set(["summary", "quiz"]))
          } else if (nextStep === 0 && prev === 2) {
            setBuiltElements(new Set(["summary", "quiz", "flashcards"]))
          }

          return nextStep
        })
        setIsAnimating(false)
      }, 300)
    }, 4000)

    return () => clearInterval(timer)
  }, [steps.length])

  const ConnectionLine = ({
    isActive,
    delay = 0,
    stepIndex,
  }: { isActive: boolean; delay?: number; stepIndex: number }) => (
    <div className="relative flex items-center justify-center h-16 w-full">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-0.5 bg-gradient-to-r from-muted via-border to-muted"></div>
      </div>
      {isActive && (
        <div className="absolute inset-0 flex items-center overflow-hidden" style={{ animationDelay: `${delay}ms` }}>
          {/* Animated glowing line */}
          <div className="w-full h-0.5 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary to-primary/0 animate-pulse"
              style={{
                animation: `flowLine 2s ease-in-out infinite`,
                animationDelay: `${delay}ms`,
              }}
            />
          </div>
          {/* Glowing dot that travels along the line */}
          <div
            className="absolute w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.6)]"
            style={{
              animation: `travelDot 2s ease-in-out infinite`,
              animationDelay: `${delay}ms`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes flowLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes travelDot {
          0% { left: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  )

  return (
    <section className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-background to-muted/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(120,120,150,0.06),rgba(10,10,10,0)_60%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(200,200,255,0.02),rgba(10,10,10,0)_60%)]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Live Demo
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">See AiThena in Action</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how we transform your study chaos into organized clarity in real-time
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm rounded-3xl p-8 shadow-glow dark:shadow-glow-dark border border-border/50 relative overflow-hidden">
            {/* Inner border effect */}
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Process Flow */}
              <div className="space-y-0">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div
                      className={`relative p-6 rounded-2xl transition-all duration-700 overflow-hidden ${
                        currentStep === index
                          ? `bg-gradient-to-br ${step.bgColor} border-2 border-primary/30 shadow-floating dark:shadow-floating-dark scale-105`
                          : currentStep > index
                            ? "bg-gradient-to-br from-green-500/5 to-green-600/5 border-2 border-green-500/20 shadow-soft dark:shadow-soft-dark"
                            : "bg-card/50 border border-border/30 hover:bg-card/70 shadow-soft dark:shadow-soft-dark"
                      }`}
                    >
                      {/* Inner border effect */}
                      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                      {/* Glowing background for active step */}
                      {currentStep === index && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent animate-pulse rounded-2xl" />
                      )}

                      <div className="flex items-start space-x-4 relative z-10">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                            currentStep === index
                              ? `bg-gradient-to-br ${step.color} text-white shadow-lg shadow-primary/25 ${
                                  index === 1 && currentStep === 1 ? "animate-spin" : ""
                                }`
                              : currentStep > index
                                ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index === 1 && currentStep === 1 ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : currentStep > index ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <step.icon className="h-6 w-6" />
                          )}
                        </div>

                        <div className="flex-1">
                          <h3
                            className={`font-semibold text-lg mb-2 transition-colors duration-300 ${
                              currentStep === index
                                ? "text-foreground"
                                : currentStep > index
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {step.title}
                          </h3>
                          <p
                            className={`text-sm leading-relaxed transition-colors duration-300 ${
                              currentStep === index
                                ? "text-muted-foreground"
                                : currentStep > index
                                  ? "text-muted-foreground"
                                  : "text-muted-foreground/70"
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>

                        {/* Step indicator */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                            currentStep === index
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : currentStep > index
                                ? "bg-green-500 text-white"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {currentStep > index ? "✓" : index + 1}
                        </div>
                      </div>

                      {/* Progress bar for active step */}
                      {currentStep === index && (
                        <div className="mt-4 w-full bg-muted/50 rounded-full h-1 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-4000 ease-linear"
                            style={{
                              width: "100%",
                              animation: "progressFill 4s linear infinite",
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Connection line between steps */}
                    {index < steps.length - 1 && (
                      <ConnectionLine isActive={currentStep > index} delay={index * 200} stepIndex={index} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Right Side - Dynamic Preview */}
              <div className="relative">
                <div className="bg-gradient-to-br from-background to-muted/20 rounded-2xl p-6 border border-border/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] min-h-[500px] overflow-hidden relative">
                  {/* Inner border effect */}
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />

                  {/* Before State - Chaos */}
                  <div
                    className={`transition-all duration-1000 ${
                      showTransformation ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-semibold text-foreground">Your Current Workspace</h4>
                      <div className="flex items-center text-red-500 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        2:47 AM
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Messy tabs simulation */}
                      <div className="grid grid-cols-3 gap-2">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className="h-12 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/20 rounded-lg flex items-center justify-center relative overflow-hidden animate-pulse"
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
                            <FileText className="w-4 h-4 text-red-600" />
                          </div>
                        ))}
                      </div>

                      <div className="text-center text-muted-foreground text-sm">
                        <p>47 PDFs • 15 browser tabs • 23 bookmarks</p>
                        <p className="text-red-500 mt-2">😰 Feeling overwhelmed...</p>
                      </div>
                    </div>
                  </div>

                  {/* After State - Clarity */}
                  <div
                    className={`absolute inset-6 transition-all duration-1000 ${
                      showTransformation ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-semibold text-foreground">Your AiThena Dashboard</h4>
                      <div className="flex items-center text-green-500 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Organized
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Summary - appears first */}
                      <div
                        className={`bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 rounded-xl p-4 border border-green-200/50 transition-all duration-700 ${
                          builtElements.has("summary")
                            ? "opacity-100 transform translate-y-0 scale-100"
                            : "opacity-0 transform translate-y-4 scale-95"
                        }`}
                      >
                        <div className="flex items-center mb-3">
                          <BookOpen className="w-5 h-5 text-green-600 mr-2" />
                          <span className="font-medium text-green-800 dark:text-green-200">Summary Generated</span>
                          {builtElements.has("summary") && (
                            <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-ping" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-green-200 rounded-full w-full"></div>
                          <div className="h-2 bg-green-200 rounded-full w-4/5"></div>
                          <div className="h-2 bg-green-200 rounded-full w-3/5"></div>
                        </div>
                      </div>

                      {/* Quiz - appears second */}
                      <div
                        className={`bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-4 border border-blue-200/50 transition-all duration-700 delay-300 ${
                          builtElements.has("quiz")
                            ? "opacity-100 transform translate-y-0 scale-100"
                            : "opacity-0 transform translate-y-4 scale-95"
                        }`}
                      >
                        <div className="flex items-center mb-3">
                          <Target className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium text-blue-800 dark:text-blue-200">Quiz Ready</span>
                          {builtElements.has("quiz") && (
                            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-8 bg-blue-200 rounded-lg flex items-center justify-center text-xs font-medium text-blue-700">
                            Q1
                          </div>
                          <div className="h-8 bg-blue-200 rounded-lg flex items-center justify-center text-xs font-medium text-blue-700">
                            Q2
                          </div>
                        </div>
                      </div>

                      {/* Flashcards - appears third */}
                      <div
                        className={`bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl p-4 border border-purple-200/50 transition-all duration-700 delay-600 ${
                          builtElements.has("flashcards")
                            ? "opacity-100 transform translate-y-0 scale-100"
                            : "opacity-0 transform translate-y-4 scale-95"
                        }`}
                      >
                        <div className="flex items-center mb-3">
                          <Brain className="w-5 h-5 text-purple-600 mr-2" />
                          <span className="font-medium text-purple-800 dark:text-purple-200">Flashcards Created</span>
                          {builtElements.has("flashcards") && (
                            <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full animate-ping" />
                          )}
                        </div>
                        <div className="text-center text-purple-600 text-sm">24 cards ready for review</div>
                      </div>

                      <div className="text-center text-muted-foreground text-sm">
                        <p className="text-green-500 mt-2">😌 Ready to ace your exam!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating transformation indicator */}
                {showTransformation && (
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-bounce">
                    ✨ Transformed!
                  </div>
                )}
              </div>
            </div>

            {/* Bottom summary */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full">
                <span className="text-lg font-semibold text-foreground mr-2">
                  Your Entire Study Toolkit. In One Place.
                </span>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressFill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  )
}
