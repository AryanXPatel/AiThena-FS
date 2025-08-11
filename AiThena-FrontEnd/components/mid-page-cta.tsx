"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, Clock, ChevronDown, ChevronUp, Check } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

const benefits = [
  {
    icon: Zap,
    title: "Instant AI Processing",
    description: "Upload any document and get summaries, quizzes, and flashcards in seconds",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your study materials stay private with enterprise-grade security",
  },
  {
    icon: Clock,
    title: "Save 15+ Hours Weekly",
    description: "Automate note-taking, quiz creation, and study planning",
  },
]

const faqs = [
  {
    question: "Is AiThena really free?",
    answer:
      "Yes, completely free forever. No hidden fees, no credit card required. Premium features available for advanced users.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use enterprise-grade encryption and never share your study materials. Your data belongs to you.",
  },
  {
    question: "How quickly can I start?",
    answer: "30 seconds. Sign up, upload your first document, and get AI-generated study materials instantly.",
  },
]

export function MidPageCTA() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleGetStarted = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    window.location.href = "/auth/signup"
  }

  return (
    <section className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,120,150,0.04),rgba(10,10,10,0)_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(200,200,255,0.02),rgba(10,10,10,0)_70%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
              50,000+ students already learning smarter
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
              Ready to Master Your Studies?
            </h2>

            {/* Subheadline */}
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who have replaced anxiety and overwhelm with clarity and confidence.
            </p>

            {/* CTA Button */}
            <div className="mb-16">
              <Button
                size="lg"
                className="text-lg px-8 py-4 h-14 hover:shadow-glow dark:hover:shadow-glow-dark hover:-translate-y-1 transition-all duration-200 transform-gpu bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
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
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • Free forever • 30-second setup
              </p>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 group relative overflow-hidden"
              >
                {/* Inner border effect */}
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-lg">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h3>
              <p className="text-muted-foreground">Everything you need to know to get started</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 shadow-soft dark:shadow-soft-dark overflow-hidden transition-all duration-300 hover:shadow-floating dark:hover:shadow-floating-dark"
                >
                  {/* Inner border effect */}
                  <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]" />

                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/20 transition-colors duration-200 relative z-10"
                  >
                    <span className="font-medium text-foreground pr-4">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  {openFaq === index && (
                    <div className="px-6 pb-4 relative z-10">
                      <div className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="text-center mt-16 pt-12 border-t border-border/30">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
