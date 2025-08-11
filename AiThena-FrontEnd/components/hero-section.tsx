"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function HeroSection() {
  const [animationStep, setAnimationStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 3)
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  const handleGetStarted = async () => {
    setIsLoading(true)
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 300))
    window.location.href = "/auth/signup"
  }

  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,120,150,0.1),rgba(10,10,10,0)_40%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(200,200,255,0.05),rgba(10,10,10,0)_40%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Stop Drowning in Coursework. <span className="text-primary">Start Understanding It.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Feeling buried under a mountain of PDFs, lecture notes, and endless browser tabs? Turn your study chaos
              into crystal clarity. AiThena is your AI-powered copilot that transforms your materials into knowledge
              that actually sticks.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleGetStarted}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Loading...
                  </>
                ) : (
                  <>
                    Create Your Free Account Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground mt-2 sm:mt-4">No credit card required. Ever.</p>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              {/* Before Panel - Chaos */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 shadow-soft dark:shadow-soft-dark backdrop-blur-sm transform perspective-1000 rotate-y-2 hover:rotate-y-0 hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-500 relative overflow-hidden">
                  {/* Inner border effect */}
                  <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/20 rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-red-600 text-lg">😰</span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">2:00 AM</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2.5 bg-gradient-to-r from-muted to-muted/60 rounded-full animate-pulse"></div>
                    <div
                      className="h-2.5 bg-gradient-to-r from-muted to-muted/60 rounded-full w-3/4 animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2.5 bg-gradient-to-r from-muted to-muted/60 rounded-full w-1/2 animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground font-medium">
                    15 tabs open • 47 PDFs • Overwhelmed
                  </div>
                  {/* Subtle chaos indicators */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>

              {/* After Panel - Confidence */}
              <div className="space-y-4 mt-8">
                <div className="bg-gradient-to-br from-card to-card/80 border-2 border-green-200/50 dark:border-green-800/30 rounded-xl p-6 shadow-floating dark:shadow-floating-dark backdrop-blur-sm transform perspective-1000 -rotate-y-2 hover:rotate-y-0 hover:shadow-glow dark:hover:shadow-glow-dark transition-all duration-500 relative overflow-hidden">
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10 dark:to-transparent rounded-xl"></div>
                  {/* Inner border effect */}
                  <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />

                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 rounded-full flex items-center justify-center shadow-inner">
                        <span className="text-green-600 text-lg">😌</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Confident</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2.5 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-800 dark:to-green-700 rounded-full relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 dark:from-green-600 dark:to-green-500 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: animationStep >= 1 ? "100%" : "0%",
                            transition: "width 1s ease-out",
                          }}
                        ></div>
                      </div>
                      <div className="h-2.5 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-800 dark:to-green-700 rounded-full relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 dark:from-green-600 dark:to-green-500 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: animationStep >= 2 ? "80%" : "0%",
                            transition: "width 1s ease-out 0.3s",
                          }}
                        ></div>
                      </div>
                      <div className="h-2.5 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-800 dark:to-green-700 rounded-full relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 dark:from-green-600 dark:to-green-500 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: animationStep >= 0 ? "60%" : "0%",
                            transition: "width 1s ease-out 0.6s",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground font-medium">
                      1 clean interface • Organized • In control
                    </div>
                  </div>

                  {/* Success indicator */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Floating elements for depth */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
            <div
              className="absolute -bottom-4 -right-4 w-16 h-16 bg-accent/10 rounded-full blur-lg animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  )
}
