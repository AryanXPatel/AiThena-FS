"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ArrowRight, Sparkles, Zap, Target, Brain, Users } from "lucide-react"

// Custom AiThena-branded icons as SVG components
const ContextSwitchIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 12h18m-9-9l9 9-9 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="6" cy="6" r="2" fill="currentColor" opacity="0.3" />
    <circle cx="18" cy="18" r="2" fill="currentColor" opacity="0.3" />
    <path d="M8 8l8 8" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
  </svg>
)

const AutomationIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
)

const UnderstandingIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
  </svg>
)

export function FeaturesSection() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const sectionRef = useRef<HTMLElement>(null)

  // Mouse tracking for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent, itemId: string) => {
    if (hoveredItem !== itemId) return

    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    setMousePosition({
      x: (e.clientX - centerX) / (rect.width / 2),
      y: (e.clientY - centerY) / (rect.height / 2),
    })
  }

  // Intersection Observer for staggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemId = entry.target.getAttribute("data-item-id")
            if (itemId) {
              // Staggered delay based on item priority
              const delays = {
                "context-switching": 0,
                automation: 200,
                understanding: 400,
                collaboration: 600,
                progress: 800,
              }

              setTimeout(
                () => {
                  setVisibleItems((prev) => new Set([...prev, itemId]))
                },
                delays[itemId as keyof typeof delays] || 0,
              )
            }
          }
        })
      },
      { threshold: 0.2, rootMargin: "-50px" },
    )

    const items = sectionRef.current?.querySelectorAll("[data-item-id]")
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  const getTransformStyle = (itemId: string) => {
    if (hoveredItem !== itemId) return {}

    const tiltX = mousePosition.y * -10
    const tiltY = mousePosition.x * 10

    return {
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(20px)`,
      transition: "transform 0.1s ease-out",
    }
  }

  const getAnimationClass = (itemId: string) => {
    return visibleItems.has(itemId) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
  }

  return (
    <section ref={sectionRef} id="features" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,120,150,0.08),rgba(10,10,10,0)_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(200,200,255,0.03),rgba(10,10,10,0)_50%)]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by Advanced AI
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Finally, a Smarter Way to Study
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your learning experience with AI-powered tools designed to eliminate chaos and maximize
            understanding.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-4 auto-rows-fr">
          {/* Main Feature - Large Box */}
          <div
            data-item-id="context-switching"
            className={`md:col-span-4 lg:col-span-5 md:row-span-2 bg-gradient-to-br from-card to-card/80 rounded-2xl p-8 border border-border/50 shadow-floating dark:shadow-floating-dark hover:shadow-glow dark:hover:shadow-glow-dark transition-all duration-500 group cursor-pointer relative overflow-hidden transform-gpu ${getAnimationClass("context-switching")}`}
            style={getTransformStyle("context-switching")}
            onMouseEnter={() => setHoveredItem("context-switching")}
            onMouseLeave={() => {
              setHoveredItem(null)
              setMousePosition({ x: 0, y: 0 })
            }}
            onMouseMove={(e) => handleMouseMove(e, "context-switching")}
          >
            {/* Inner border effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center text-primary transition-all duration-300 ${hoveredItem === "context-switching" ? "scale-110 shadow-[0_0_20px_rgba(var(--primary),0.3)] bg-gradient-to-br from-primary/30 to-primary/20" : ""}`}
                >
                  <ContextSwitchIcon />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                End Context-Switching Chaos
              </h3>

              <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                Stop juggling dozens of apps, browser tabs, and scattered notes. Upload your PDFs, lecture recordings,
                and YouTube links into one unified workspace where our AI connects all the dots for you.
              </p>

              {/* Illustrative graphic */}
              <div className="mt-auto">
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-12 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
                    <span className="text-xs font-medium text-red-600 relative z-10">15 tabs</span>
                  </div>
                  <div className="h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-yellow-500/20 animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    />
                    <span className="text-xs font-medium text-yellow-600 relative z-10">47 PDFs</span>
                  </div>
                  <div className="h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 rounded-lg flex items-center justify-center relative overflow-hidden group-hover:ring-2 group-hover:ring-primary/50 transition-all duration-300">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-600 ml-1">AiThena</span>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto group-hover:text-primary transition-colors duration-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Automation Feature */}
          <div
            data-item-id="automation"
            className={`md:col-span-2 lg:col-span-3 bg-gradient-to-br from-card to-card/80 rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-500 group cursor-pointer relative overflow-hidden transform-gpu ${getAnimationClass("automation")}`}
            style={getTransformStyle("automation")}
            onMouseEnter={() => setHoveredItem("automation")}
            onMouseLeave={() => {
              setHoveredItem(null)
              setMousePosition({ x: 0, y: 0 })
            }}
            onMouseMove={(e) => handleMouseMove(e, "automation")}
          >
            {/* Inner border effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 h-full flex flex-col">
              <div
                className={`w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center text-accent mb-4 transition-all duration-300 ${hoveredItem === "automation" ? "scale-110 shadow-[0_0_20px_rgba(var(--accent),0.3)] bg-gradient-to-br from-accent/30 to-accent/20" : ""}`}
              >
                <AutomationIcon />
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                Automate Your Revision
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                Never waste time manually creating study materials again. Instantly generate summaries, flashcards, and
                quizzes from any document or video.
              </p>

              <div className="mt-4 flex items-center space-x-2">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 bg-primary/20 rounded-full border-2 border-background" />
                  <div className="w-6 h-6 bg-accent/20 rounded-full border-2 border-background" />
                  <div className="w-6 h-6 bg-green-500/20 rounded-full border-2 border-background" />
                </div>
                <span className="text-xs text-muted-foreground">Auto-generated</span>
              </div>
            </div>
          </div>

          {/* Understanding Feature */}
          <div
            data-item-id="understanding"
            className={`md:col-span-2 lg:col-span-3 bg-gradient-to-br from-card to-card/80 rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-500 group cursor-pointer relative overflow-hidden transform-gpu ${getAnimationClass("understanding")}`}
            style={getTransformStyle("understanding")}
            onMouseEnter={() => setHoveredItem("understanding")}
            onMouseLeave={() => {
              setHoveredItem(null)
              setMousePosition({ x: 0, y: 0 })
            }}
            onMouseMove={(e) => handleMouseMove(e, "understanding")}
          >
            {/* Inner border effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 h-full flex flex-col">
              <div
                className={`w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl flex items-center justify-center text-green-600 mb-4 transition-all duration-300 ${hoveredItem === "understanding" ? "scale-110 shadow-[0_0_20px_rgba(34,197,94,0.3)] bg-gradient-to-br from-green-500/30 to-green-500/20" : ""}`}
              >
                <UnderstandingIcon />
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-green-600 transition-colors duration-300">
                Understand, Don't Just Memorize
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                Go beyond simple memorization. Use our AI assistant and debate arena to challenge your understanding and
                walk into exams with total confidence.
              </p>

              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-green-600" />
                  <div className="h-1 bg-green-200 rounded-full flex-grow overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full w-3/4 group-hover:w-full transition-all duration-1000" />
                  </div>
                  <span className="text-xs text-green-600 font-medium">Deep Learning</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features - Smaller boxes */}
          <div
            data-item-id="collaboration"
            className={`md:col-span-3 lg:col-span-2 bg-gradient-to-br from-card to-card/80 rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-500 group cursor-pointer relative overflow-hidden transform-gpu ${getAnimationClass("collaboration")}`}
            style={getTransformStyle("collaboration")}
            onMouseEnter={() => setHoveredItem("collaboration")}
            onMouseLeave={() => {
              setHoveredItem(null)
              setMousePosition({ x: 0, y: 0 })
            }}
            onMouseMove={(e) => handleMouseMove(e, "collaboration")}
          >
            {/* Inner border effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 h-full flex flex-col">
              <div
                className={`w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 mb-3 transition-all duration-300 ${hoveredItem === "collaboration" ? "scale-110 shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-gradient-to-br from-blue-500/30 to-blue-500/20" : ""}`}
              >
                <Users className="w-5 h-5" />
              </div>

              <h4 className="font-semibold text-foreground mb-2 group-hover:text-blue-600 transition-colors duration-300">
                Study Together
              </h4>

              <p className="text-muted-foreground text-sm leading-relaxed">
                Collaborate with classmates in AI-moderated study groups.
              </p>
            </div>
          </div>

          <div
            data-item-id="progress"
            className={`md:col-span-3 lg:col-span-3 bg-gradient-to-br from-card to-card/80 rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-500 group cursor-pointer relative overflow-hidden transform-gpu ${getAnimationClass("progress")}`}
            style={getTransformStyle("progress")}
            onMouseEnter={() => setHoveredItem("progress")}
            onMouseLeave={() => {
              setHoveredItem(null)
              setMousePosition({ x: 0, y: 0 })
            }}
            onMouseMove={(e) => handleMouseMove(e, "progress")}
          >
            {/* Inner border effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 h-full flex flex-col">
              <div
                className={`w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-lg flex items-center justify-center text-purple-600 mb-3 transition-all duration-300 ${hoveredItem === "progress" ? "scale-110 shadow-[0_0_20px_rgba(168,85,247,0.3)] bg-gradient-to-br from-purple-500/30 to-purple-500/20" : ""}`}
              >
                <Target className="w-5 h-5" />
              </div>

              <h4 className="font-semibold text-foreground mb-2 group-hover:text-purple-600 transition-colors duration-300">
                Track Progress
              </h4>

              <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                Monitor your learning journey with detailed analytics and personalized insights.
              </p>

              <div className="mt-3 grid grid-cols-3 gap-1">
                <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-full group-hover:animate-pulse" />
                </div>
                <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full w-2/3 group-hover:animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
                <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full w-1/3 group-hover:animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Ready to experience the difference?</p>
          <div className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
            Explore All Features
            <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  )
}
