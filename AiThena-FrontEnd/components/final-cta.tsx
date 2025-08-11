"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function FinalCTA() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    window.location.href = "/auth/signup"
  }

  return (
    <section className="py-20 sm:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Subtle radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),rgba(255,255,255,0)_50%)]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Stop Surviving Your Semester. Start Mastering It.
          </h2>
          <p className="text-xl mb-10 text-primary-foreground/90">
            Join thousands of students who have replaced anxiety and overwhelm with clarity and confidence. Your AI
            Study Copilot is waiting.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 transform-gpu"
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
                Get Started Now - It's Free!
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}
