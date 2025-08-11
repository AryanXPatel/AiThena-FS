"use client"

import { useState, useEffect, useRef } from "react"
import { Star, ChevronLeft, ChevronRight, Play, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Alex Chen",
    title: "Computer Science Student",
    university: "Stanford University",
    avatar: "/placeholder.svg?height=60&width=60&text=AC",
    rating: 5,
    content:
      "Before AiThena, I was at my breaking point. I felt like a fraud, just trying to survive my CS degree. Now, I feel like I'm in control. I'm not just passing; I'm actually learning. It turned my mess of notes and readings into a clear path forward. This tool didn't just save my grades, it gave me back my time and my sanity.",
    highlight: "Saved 15+ hours per week",
    year: "Junior Year",
  },
  {
    id: 2,
    name: "Sarah Martinez",
    title: "Pre-Med Student",
    university: "Harvard University",
    avatar: "/placeholder.svg?height=60&width=60&text=SM",
    rating: 5,
    content:
      "The AI-generated quizzes are incredible. They actually test my understanding, not just memorization. I went from struggling with organic chemistry to acing my midterms. The flashcard system adapts to what I'm weak on, so I'm not wasting time on stuff I already know.",
    highlight: "Improved GPA from 3.2 to 3.8",
    year: "Sophomore Year",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    title: "Engineering Student",
    university: "MIT",
    avatar: "/placeholder.svg?height=60&width=60&text=MJ",
    rating: 5,
    content:
      "I used to spend hours making study guides that I'd never look at again. AiThena creates summaries that actually make sense and connect concepts across different lectures. The debate feature helped me understand thermodynamics better than any textbook ever did.",
    highlight: "Reduced study time by 40%",
    year: "Senior Year",
  },
  {
    id: 4,
    name: "Emma Thompson",
    title: "Psychology Major",
    university: "UCLA",
    avatar: "/placeholder.svg?height=60&width=60&text=ET",
    rating: 5,
    content:
      "The way AiThena connects different research papers and creates concept maps is mind-blowing. I can see relationships between theories that I never noticed before. My professors have commented on how much deeper my analysis has become.",
    highlight: "Achieved Dean's List 3 semesters",
    year: "Graduate Student",
  },
  {
    id: 5,
    name: "David Kim",
    title: "Business Student",
    university: "Wharton",
    avatar: "/placeholder.svg?height=60&width=60&text=DK",
    rating: 5,
    content:
      "Case study analysis used to take me forever. Now I can upload the case, get key insights, and focus on developing my own strategic thinking. I'm contributing more in class discussions and my group projects are so much stronger.",
    highlight: "Top 10% of class ranking",
    year: "MBA Candidate",
  },
  {
    id: 6,
    name: "Lisa Wang",
    title: "Medical Student",
    university: "Johns Hopkins",
    avatar: "/placeholder.svg?height=60&width=60&text=LW",
    rating: 5,
    content:
      "Medical school is overwhelming, but AiThena helps me break down complex pathophysiology into digestible chunks. The spaced repetition system ensures I retain everything for boards. I actually feel confident going into my clinical rotations.",
    highlight: "USMLE Step 1: 260+",
    year: "3rd Year",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [visibleCards, setVisibleCards] = useState(3)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  // Responsive visible cards
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1)
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2)
      } else {
        setVisibleCards(3)
      }
    }

    updateVisibleCards()
    window.addEventListener("resize", updateVisibleCards)
    return () => window.removeEventListener("resize", updateVisibleCards)
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIndex = testimonials.length - visibleCards
          return prev >= maxIndex ? 0 : prev + 1
        })
      }, 5000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, visibleCards])

  // Scroll to current testimonial
  useEffect(() => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.scrollWidth / testimonials.length
      scrollContainerRef.current.scrollTo({
        left: currentIndex * cardWidth,
        behavior: "smooth",
      })
    }
  }, [currentIndex])

  const goToNext = () => {
    const maxIndex = testimonials.length - visibleCards
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const goToPrevious = () => {
    const maxIndex = testimonials.length - visibleCards
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  return (
    <section className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-background to-muted/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,120,150,0.05),rgba(10,10,10,0)_60%)] dark:bg-[radial-gradient(circle_at_50%_20%,rgba(200,200,255,0.02),rgba(10,10,10,0)_60%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Loved by 50,000+ Students
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Real Stories, Real Results
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how students across top universities are transforming their academic journey with AiThena
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="rounded-full hover:shadow-soft dark:hover:shadow-soft-dark transition-all duration-200 bg-transparent border-border/30 hover:border-border/60"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="rounded-full hover:shadow-soft dark:hover:shadow-soft-dark transition-all duration-200 bg-transparent border-border/30 hover:border-border/60"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAutoPlay}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <Play className={`h-4 w-4 ${isAutoPlaying ? "animate-pulse" : ""}`} />
            <span className="text-sm">{isAutoPlaying ? "Auto-playing" : "Paused"}</span>
          </Button>
        </div>

        {/* Testimonials Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`flex-shrink-0 w-full md:w-1/2 lg:w-1/3 transition-all duration-500 ${
                  index >= currentIndex && index < currentIndex + visibleCards
                    ? "opacity-100 scale-100"
                    : "opacity-70 scale-95"
                }`}
              >
                <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 dark:from-zinc-950/90 dark:to-zinc-900/90 rounded-2xl p-8 border border-zinc-700/30 dark:border-zinc-800/30 shadow-floating dark:shadow-floating-dark hover:shadow-glow dark:hover:shadow-glow-dark transition-all duration-300 h-full relative overflow-hidden group backdrop-blur-sm">
                  {/* Inner border effect */}
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-transparent dark:from-zinc-900/20 dark:to-transparent rounded-2xl" />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Quote Icon */}
                    <div className="flex items-start justify-between mb-6">
                      <Quote className="h-8 w-8 text-zinc-400 dark:text-zinc-500 opacity-60" />

                      {/* Rating */}
                      <div className="flex items-center space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-zinc-300 text-zinc-300 dark:fill-zinc-400 dark:text-zinc-400"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-zinc-100 dark:text-zinc-200 leading-relaxed mb-8 text-sm lg:text-base font-medium">
                      "{testimonial.content}"
                    </blockquote>

                    {/* Highlight Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium mb-8 bg-zinc-800/60 dark:bg-zinc-900/60 text-zinc-300 dark:text-zinc-400 border border-zinc-700/30 dark:border-zinc-800/30">
                      <div className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full mr-2 animate-pulse" />
                      {testimonial.highlight}
                    </div>

                    {/* Author */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-zinc-700/50 dark:border-zinc-800/50 shadow-sm"
                        />
                        {/* Online indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-zinc-600 dark:bg-zinc-700 rounded-full border-2 border-zinc-900 dark:border-zinc-950 flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="font-semibold text-zinc-100 dark:text-zinc-200 text-base">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">{testimonial.title}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="text-xs text-zinc-500 dark:text-zinc-600">{testimonial.university}</div>
                          <div className="w-1 h-1 bg-zinc-600 dark:bg-zinc-700 rounded-full" />
                          <div className="text-xs text-zinc-500 dark:text-zinc-600">{testimonial.year}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                  {/* Subtle border glow on hover */}
                  <div className="absolute inset-0 rounded-2xl border border-zinc-600/0 group-hover:border-zinc-600/20 transition-colors duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: testimonials.length - visibleCards + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-zinc-400 dark:bg-zinc-500 w-8"
                  : "bg-zinc-600/40 dark:bg-zinc-700/40 hover:bg-zinc-500/60 dark:hover:bg-zinc-600/60 w-2"
              }`}
            />
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-zinc-700/30 dark:border-zinc-800/30">
          <div className="text-center">
            <div className="text-3xl font-bold text-zinc-200 dark:text-zinc-300 mb-2">50K+</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-600">Active Students</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-zinc-200 dark:text-zinc-300 mb-2">4.9/5</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-zinc-200 dark:text-zinc-300 mb-2">2M+</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-600">Study Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-zinc-200 dark:text-zinc-300 mb-2">500+</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-600">Universities</div>
          </div>
        </div>
      </div>
    </section>
  )
}
