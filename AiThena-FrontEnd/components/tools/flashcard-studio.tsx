"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Plus, Search, Filter, Play, Edit, Trash2, RotateCcw, CheckCircle, X, Star } from "lucide-react"

const flashcardDecks = [
  {
    id: 1,
    name: "Calculus Fundamentals",
    subject: "Mathematics",
    cardCount: 45,
    studiedCount: 32,
    masteredCount: 18,
    lastStudied: "2 hours ago",
    difficulty: "medium",
    progress: 71,
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Organic Chemistry Reactions",
    subject: "Chemistry",
    cardCount: 67,
    studiedCount: 23,
    masteredCount: 12,
    lastStudied: "1 day ago",
    difficulty: "hard",
    progress: 34,
    color: "bg-green-500",
  },
  {
    id: 3,
    name: "Spanish Vocabulary",
    subject: "Language",
    cardCount: 120,
    studiedCount: 89,
    masteredCount: 56,
    lastStudied: "3 hours ago",
    difficulty: "easy",
    progress: 74,
    color: "bg-purple-500",
  },
]

const sampleCards = [
  {
    id: 1,
    front: "What is the derivative of sin(x)?",
    back: "cos(x)",
    difficulty: "easy",
    mastered: true,
    lastReviewed: "2024-01-20",
  },
  {
    id: 2,
    front: "Define the limit of a function",
    back: "The limit of f(x) as x approaches a is L if f(x) can be made arbitrarily close to L by taking x sufficiently close to a",
    difficulty: "medium",
    mastered: false,
    lastReviewed: "2024-01-19",
  },
]

export function FlashcardStudio() {
  const [activeTab, setActiveTab] = useState("decks")
  const [selectedDeck, setSelectedDeck] = useState<any>(null)
  const [studyMode, setStudyMode] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleStudyDeck = (deck: any) => {
    setSelectedDeck(deck)
    setStudyMode(true)
    setCurrentCard(0)
    setShowAnswer(false)
  }

  const handleNextCard = () => {
    if (currentCard < sampleCards.length - 1) {
      setCurrentCard((prev) => prev + 1)
      setShowAnswer(false)
    } else {
      setStudyMode(false)
      setSelectedDeck(null)
    }
  }

  const handleCardResponse = (difficulty: "easy" | "medium" | "hard") => {
    // Handle spaced repetition logic here
    handleNextCard()
  }

  if (studyMode && selectedDeck) {
    const card = sampleCards[currentCard]

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Study Header */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 ${selectedDeck.color} rounded-xl flex items-center justify-center`}>
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{selectedDeck.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Card {currentCard + 1} of {sampleCards.length}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {sampleCards.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentCard ? "bg-primary" : index < currentCard ? "bg-green-500" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => setStudyMode(false)} className="bg-transparent">
                <X className="h-4 w-4 mr-2" />
                Exit Study
              </Button>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div
          className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-floating dark:shadow-floating-dark relative overflow-hidden min-h-[400px] cursor-pointer group"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

          <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center text-center">
            <div className="mb-4">
              <Badge variant="outline" className="text-xs mb-4">
                {showAnswer ? "Answer" : "Question"}
              </Badge>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <p className="text-xl font-medium text-foreground leading-relaxed max-w-2xl">
                {showAnswer ? card.back : card.front}
              </p>
            </div>

            {!showAnswer && <p className="text-sm text-muted-foreground mt-6">Click to reveal answer</p>}
          </div>
        </div>

        {/* Study Controls */}
        {showAnswer && (
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <p className="text-center text-muted-foreground mb-6">How well did you know this?</p>

              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handleCardResponse("hard")}
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                >
                  <X className="h-4 w-4 mr-2" />
                  Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCardResponse("medium")}
                  className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Hard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCardResponse("easy")}
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Easy
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-muted/30">
          <TabsTrigger value="decks">My Decks</TabsTrigger>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>

        <TabsContent value="decks" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search decks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-muted/30 border-border/50 focus:border-primary/50"
                />
              </div>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {flashcardDecks.length} decks
              </Badge>
            </div>
          </div>

          {/* Deck Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcardDecks.map((deck) => (
              <div
                key={deck.id}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${deck.color} rounded-xl flex items-center justify-center`}>
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                        {deck.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{deck.subject}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-foreground">{deck.cardCount}</p>
                        <p className="text-xs text-muted-foreground">Cards</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-500">{deck.masteredCount}</p>
                        <p className="text-xs text-muted-foreground">Mastered</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{deck.progress}%</p>
                        <p className="text-xs text-muted-foreground">Progress</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${deck.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Last studied {deck.lastStudied}</p>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Button onClick={() => handleStudyDeck(deck)} className="flex-1 bg-primary hover:bg-primary/90">
                        <Play className="h-4 w-4 mr-2" />
                        Study
                      </Button>
                      <Button variant="outline" size="icon" className="bg-transparent">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="browse" className="space-y-6">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Browse Public Decks</h3>
            <p className="text-muted-foreground">Discover and import flashcard decks created by other students.</p>
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <div className="text-center py-12">
            <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Create New Deck</h3>
            <p className="text-muted-foreground mb-6">
              Build custom flashcard decks or generate them from your documents.
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Start Creating
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
