"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Plus, Search, Filter, Play, Edit, Trash2, RotateCcw, CheckCircle, X, Star, Brain, FileText, Zap } from "lucide-react"

// API configuration
const FLASHCARD_API_BASE = 'http://localhost:4001/api/flashcards'
const DOCINTEL_API_BASE = 'http://localhost:4101'

// Define the interface for the ref methods
export interface FlashcardStudioRef {
  triggerCreateDeck: () => void;
}

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

export const FlashcardStudio = forwardRef<FlashcardStudioRef>((props, ref) => {
  const [activeTab, setActiveTab] = useState("decks")
  const [selectedDeck, setSelectedDeck] = useState<any>(null)
  const [studyMode, setStudyMode] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  // API state
  const [decks, setDecks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Create deck form state
  const [createFormData, setCreateFormData] = useState({
    name: "",
    subject: "",
    description: "",
    tags: [] as string[],
    color: "bg-blue-500"
  })
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState("")
  
  // AI Generation state
  const [documents, setDocuments] = useState<any[]>([])
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [documentsLoading, setDocumentsLoading] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [generationMode, setGenerationMode] = useState<'manual' | 'ai'>('manual')

  // Fetch decks from backend
  const fetchDecks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${FLASHCARD_API_BASE}/decks`)
      if (response.ok) {
        const data = await response.json()
        setDecks(data)
      } else {
        throw new Error('Failed to fetch decks')
      }
    } catch (err) {
      setError('Failed to load flashcard decks')
      console.error('Error fetching decks:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load decks and documents on component mount
  useEffect(() => {
    fetchDecks()
    fetchDocuments()
  }, [])

  // Fetch documents from DocIntel backend
  const fetchDocuments = async () => {
    try {
      setDocumentsLoading(true)
      const response = await fetch(`${DOCINTEL_API_BASE}/documents`)
      if (response.ok) {
        const docs = await response.json()
        // Fetch metadata for each document
        const documentsWithMetadata = await Promise.all(
          docs.map(async (doc: any) => {
            try {
              const metaResponse = await fetch(`${DOCINTEL_API_BASE}/documents/${doc.id}/metadata`)
              if (metaResponse.ok) {
                const metadata = await metaResponse.json()
                return { ...doc, ...metadata }
              }
              return { ...doc, name: `Document ${doc.id}`, pages: 0 }
            } catch {
              return { ...doc, name: `Document ${doc.id}`, pages: 0 }
            }
          })
        )
        setDocuments(documentsWithMetadata)
      }
    } catch (err) {
      console.error('Error fetching documents:', err)
    } finally {
      setDocumentsLoading(false)
    }
  }

  // Expose the triggerCreateDeck function to parent components
  useImperativeHandle(ref, () => ({
    triggerCreateDeck: () => {
      setActiveTab("create")
    }
  }))

  // Create deck function
  const createDeck = async () => {
    if (!createFormData.name.trim() || !createFormData.subject.trim()) {
      setCreateError('Name and subject are required')
      return
    }

    try {
      setCreateLoading(true)
      setCreateError(null)
      
      const response = await fetch(`${FLASHCARD_API_BASE}/decks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createFormData),
      })

      if (response.ok) {
        const newDeck = await response.json()
        setDecks(prev => [...prev, newDeck])
        
        // Reset form
        setCreateFormData({
          name: "",
          subject: "",
          description: "",
          tags: [],
          color: "bg-blue-500"
        })
        setTagInput("")
        
        // Switch to decks tab to show the new deck
        setActiveTab("decks")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create deck')
      }
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create deck')
      console.error('Error creating deck:', err)
    } finally {
      setCreateLoading(false)
    }
  }

  // Handle form input changes
  const handleCreateFormChange = (field: string, value: any) => {
    setCreateFormData(prev => ({ ...prev, [field]: value }))
    setCreateError(null)
  }

  // Add tag to the list
  const addTag = () => {
    if (tagInput.trim() && !createFormData.tags.includes(tagInput.trim())) {
      setCreateFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput("")
    }
  }

  // Remove tag from the list
  const removeTag = (tagToRemove: string) => {
    setCreateFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // Handle create deck button click
  const handleCreateDeckClick = () => {
    setActiveTab("create")
  }

  // Generate AI flashcards from selected documents
  const generateAIFlashcards = async () => {
    if (selectedDocuments.length === 0) {
      setAiError('Please select at least one document')
      return
    }

    try {
      setAiGenerating(true)
      setAiError(null)

      // Fetch document content from selected documents
      const documentContents = await Promise.all(
        selectedDocuments.map(async (docId) => {
          try {
            // Get document content from chunks endpoint
            const response = await fetch(`${DOCINTEL_API_BASE}/documents/${docId}/chunks`)
            if (response.ok) {
              const data = await response.json()
              // Extract chunks array from the response object
              const chunks = data.chunks || []
              // Combine all chunk content into a single text
              const content = chunks.join('\n\n')
              const doc = documents.find(d => d.id === docId)
              return {
                title: doc?.name || `Document ${docId}`,
                content: content.substring(0, 5000) // Limit content size for AI processing
              }
            }
          } catch (error) {
            console.error(`Error fetching document ${docId}:`, error)
          }
          return null
        })
      )

      const validContents = documentContents.filter(Boolean)
      if (validContents.length === 0) {
        throw new Error('Could not fetch content from selected documents')
      }

      // Prepare content for AI generation
      const combinedContent = validContents
        .map(doc => `Document: ${doc?.title || 'Unknown'}\n\n${doc?.content || ''}`)
        .join('\n\n---\n\n')

      // Generate flashcards using AI
      const response = await fetch(`${FLASHCARD_API_BASE}/generate/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: combinedContent,
          cardCount: Math.min(selectedDocuments.length * 10, 30), // 10 cards per document, max 30
          difficulty: 'medium',
          subject: createFormData.subject || 'General',
          createDeck: true,
          deckName: createFormData.name || `AI Generated from ${validContents.length} Document(s)`,
          deckDescription: `Automatically generated flashcards from: ${validContents.map(d => d?.title || 'Unknown Document').join(', ')}`
        }),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Refresh decks to show the new AI-generated deck
        await fetchDecks()
        
        // Reset form and switch to decks tab
        setCreateFormData({
          name: "",
          subject: "",
          description: "",
          tags: [],
          color: "bg-blue-500"
        })
        setSelectedDocuments([])
        setActiveTab("decks")
        
        // Show success message (you could add a toast notification here)
        console.log('AI deck generated successfully:', result)
        
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate AI flashcards')
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Failed to generate AI flashcards')
      console.error('Error generating AI flashcards:', err)
    } finally {
      setAiGenerating(false)
    }
  }

  // Handle document selection for AI generation
  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    )
  }

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

  // Study mode rendering
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
                {decks.length} decks
              </Badge>
            </div>
          </div>

          {/* Deck Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="text-muted-foreground">Loading flashcard decks...</div>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <div className="text-red-500">{error}</div>
                <Button onClick={fetchDecks} className="mt-2">Retry</Button>
              </div>
            ) : decks.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <div className="text-muted-foreground">No flashcard decks found. Create your first deck!</div>
              </div>
            ) : (
              decks.map((deck) => (
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
            )))}
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
          {/* Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick={() => setGenerationMode('ai')}
              className={`bg-card/50 backdrop-blur-sm rounded-2xl p-6 border cursor-pointer transition-all ${
                generationMode === 'ai' 
                  ? 'border-primary shadow-floating dark:shadow-floating-dark' 
                  : 'border-border/50 hover:border-primary/50'
              }`}
            >
              <div className="text-center">
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">AI-Powered Generation</h3>
                <p className="text-muted-foreground text-sm">
                  Automatically generate flashcards from your uploaded documents using AI
                </p>
                <Badge className="mt-3 bg-primary/10 text-primary">Recommended</Badge>
              </div>
            </div>
            
            <div 
              onClick={() => setGenerationMode('manual')}
              className={`bg-card/50 backdrop-blur-sm rounded-2xl p-6 border cursor-pointer transition-all ${
                generationMode === 'manual' 
                  ? 'border-primary shadow-floating dark:shadow-floating-dark' 
                  : 'border-border/50 hover:border-primary/50'
              }`}
            >
              <div className="text-center">
                <Plus className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Manual Creation</h3>
                <p className="text-muted-foreground text-sm">
                  Create a custom flashcard deck with your own content and structure
                </p>
              </div>
            </div>
          </div>

          {/* AI Generation Mode */}
          {generationMode === 'ai' && (
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-soft dark:shadow-soft-dark">
              <div className="space-y-6">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-foreground mb-2">AI Flashcard Generation</h3>
                  <p className="text-muted-foreground">
                    Select documents from your Document Intelligence library and let AI create flashcards automatically
                  </p>
                </div>

                {aiError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                    {aiError}
                  </div>
                )}

                {/* Basic Deck Info for AI Generation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Deck Name (Optional)
                    </label>
                    <Input
                      placeholder="Leave empty for AI to generate"
                      value={createFormData.name}
                      onChange={(e) => handleCreateFormChange('name', e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Subject (Optional)
                    </label>
                    <Input
                      placeholder="e.g., Computer Science, Biology"
                      value={createFormData.subject}
                      onChange={(e) => handleCreateFormChange('subject', e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                {/* Document Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Select Documents
                    </label>
                    {documentsLoading && (
                      <div className="text-sm text-muted-foreground flex items-center">
                        <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                        Loading documents...
                      </div>
                    )}
                  </div>
                  
                  {documents.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-border/50 rounded-lg">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No documents found</p>
                      <p className="text-sm text-muted-foreground">
                        Upload some PDFs to Document Intelligence first
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => toggleDocumentSelection(doc.id)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedDocuments.includes(doc.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border/50 hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded border-2 transition-colors ${
                              selectedDocuments.includes(doc.id)
                                ? 'bg-primary border-primary'
                                : 'border-border'
                            }`}>
                              {selectedDocuments.includes(doc.id) && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {doc.name || `Document ${doc.id}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {doc.pages} pages • ID: {doc.id}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedDocuments.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {selectedDocuments.length} document(s) selected • AI will generate ~{selectedDocuments.length * 10} flashcards
                    </div>
                  )}
                </div>

                {/* AI Generation Button */}
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setGenerationMode('manual')}
                    disabled={aiGenerating}
                  >
                    Back to Manual
                  </Button>
                  <Button
                    onClick={generateAIFlashcards}
                    disabled={aiGenerating || selectedDocuments.length === 0}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {aiGenerating ? (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                        Generating AI Flashcards...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate AI Flashcards
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Manual Creation Mode */}
          {generationMode === 'manual' && (
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-soft dark:shadow-soft-dark">
              <div className="space-y-6">
                <div className="text-center">
                  <Plus className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-foreground mb-2">Create New Deck</h3>
                  <p className="text-muted-foreground">
                    Build a custom flashcard deck to enhance your learning
                  </p>
                </div>

              {createError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {createError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Deck Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Deck Name *
                  </label>
                  <Input
                    placeholder="e.g., Spanish Vocabulary"
                    value={createFormData.name}
                    onChange={(e) => handleCreateFormChange('name', e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Subject *
                  </label>
                  <Input
                    placeholder="e.g., Language, Mathematics"
                    value={createFormData.subject}
                    onChange={(e) => handleCreateFormChange('subject', e.target.value)}
                    className="bg-background/50"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  placeholder="Brief description of what this deck covers..."
                  value={createFormData.description}
                  onChange={(e) => handleCreateFormChange('description', e.target.value)}
                  className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg resize-none h-20 text-sm"
                />
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Deck Color
                </label>
                <div className="flex space-x-3">
                  {[
                    'bg-blue-500',
                    'bg-green-500', 
                    'bg-purple-500',
                    'bg-red-500',
                    'bg-yellow-500',
                    'bg-indigo-500'
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleCreateFormChange('color', color)}
                      className={`w-8 h-8 ${color} rounded-full border-2 transition-all ${
                        createFormData.color === color 
                          ? 'border-foreground scale-110' 
                          : 'border-border hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Tags
                </label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="bg-background/50 flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                {createFormData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {createFormData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("decks")}
                  disabled={createLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createDeck}
                  disabled={createLoading || !createFormData.name.trim() || !createFormData.subject.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  {createLoading ? (
                    <>
                      <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
              <Plus className="h-4 w-4 mr-2" />
                      Create Deck
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
})
