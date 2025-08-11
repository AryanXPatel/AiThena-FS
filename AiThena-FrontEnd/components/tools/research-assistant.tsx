"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  BookOpen,
  Copy,
  Download,
  Filter,
  Calendar,
  User,
  Quote,
  ExternalLink,
  Plus,
  Bookmark,
  Star,
  FileText,
} from "lucide-react"

const researchSources = [
  {
    id: 1,
    title: "The Impact of Artificial Intelligence on Modern Education",
    authors: ["Dr. Sarah Johnson", "Prof. Michael Chen"],
    journal: "Journal of Educational Technology",
    year: 2024,
    type: "journal",
    abstract:
      "This comprehensive study examines how AI technologies are transforming educational practices across various institutions. The research analyzes implementation strategies, student outcomes, and institutional challenges in adopting AI-powered learning systems.",
    url: "https://example.com/paper1",
    citations: 127,
    relevance: 95,
    saved: true,
  },
  {
    id: 2,
    title: "Machine Learning Applications in Student Assessment",
    authors: ["Dr. Emily Rodriguez", "Dr. James Wilson"],
    journal: "Educational AI Review",
    year: 2023,
    type: "conference",
    abstract:
      "We present novel approaches to automated student assessment using machine learning algorithms. Our methodology demonstrates improved accuracy in evaluating student performance while reducing grading time by 60%.",
    url: "https://example.com/paper2",
    citations: 89,
    relevance: 88,
    saved: false,
  },
  {
    id: 3,
    title: "Personalized Learning Through Adaptive AI Systems",
    authors: ["Prof. Lisa Zhang", "Dr. Robert Kumar"],
    journal: "Nature Education",
    year: 2024,
    type: "journal",
    abstract:
      "This research explores how adaptive AI systems can create personalized learning experiences that adjust to individual student needs, learning styles, and progress rates in real-time.",
    url: "https://example.com/paper3",
    citations: 203,
    relevance: 92,
    saved: true,
  },
]

const savedCitations = [
  {
    id: 1,
    title: "The Impact of Artificial Intelligence on Modern Education",
    authors: "Johnson, S., & Chen, M.",
    year: 2024,
    journal: "Journal of Educational Technology",
    volume: "45",
    issue: "3",
    pages: "123-145",
    doi: "10.1234/jet.2024.001",
  },
  {
    id: 2,
    title: "Personalized Learning Through Adaptive AI Systems",
    authors: "Zhang, L., & Kumar, R.",
    year: 2024,
    journal: "Nature Education",
    volume: "12",
    issue: "8",
    pages: "67-89",
    doi: "10.1038/nedu.2024.002",
  },
]

export function ResearchAssistant() {
  const [activeTab, setActiveTab] = useState("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [selectedSources, setSelectedSources] = useState<number[]>([])
  const [citationStyle, setCitationStyle] = useState("apa")
  const [researchNotes, setResearchNotes] = useState("")

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    // Simulate search
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSearching(false)
  }

  const toggleSourceSelection = (id: number) => {
    setSelectedSources((prev) => (prev.includes(id) ? prev.filter((sourceId) => sourceId !== id) : [...prev, id]))
  }

  const toggleSaveSource = (id: number) => {
    const sourceIndex = researchSources.findIndex((source) => source.id === id)
    if (sourceIndex !== -1) {
      researchSources[sourceIndex].saved = !researchSources[sourceIndex].saved
    }
  }

  const formatCitation = (citation: any, style = "apa") => {
    switch (style) {
      case "apa":
        return `${citation.authors} (${citation.year}). ${citation.title}. ${citation.journal}, ${citation.volume}(${citation.issue}), ${citation.pages}. https://doi.org/${citation.doi}`
      case "mla":
        return `${citation.authors.split(", ")[0]}. "${citation.title}." ${citation.journal}, vol. ${citation.volume}, no. ${citation.issue}, ${citation.year}, pp. ${citation.pages}.`
      case "chicago":
        return `${citation.authors} "${citation.title}." ${citation.journal} ${citation.volume}, no. ${citation.issue} (${citation.year}): ${citation.pages}.`
      default:
        return `${citation.authors} (${citation.year}). ${citation.title}. ${citation.journal}.`
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-muted/30">
          <TabsTrigger value="search">Research Search</TabsTrigger>
          <TabsTrigger value="citations">Citations</TabsTrigger>
          <TabsTrigger value="notes">Research Notes</TabsTrigger>
          <TabsTrigger value="bibliography">Bibliography</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Search Interface */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Academic Search</h3>
                  <p className="text-sm text-muted-foreground">Search across millions of academic papers and sources</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter your research topic or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-muted/30 border-border/50 focus:border-primary/50"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Search in:</span>
                  <Badge variant="outline">All Sources</Badge>
                  <Badge variant="outline">2020-2024</Badge>
                  <Badge variant="outline">Peer Reviewed</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-4">
            {researchSources.map((source) => (
              <div
                key={source.id}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                          {source.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {source.type}
                        </Badge>
                        {source.saved && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{source.authors.join(", ")}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{source.year}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{source.journal}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{source.abstract}</p>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Citations: {source.citations}</span>
                        <span>•</span>
                        <span>Relevance: {source.relevance}%</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <div className="text-right mb-2">
                        <div className="text-sm font-medium text-foreground">{source.relevance}%</div>
                        <div className="text-xs text-muted-foreground">Relevance</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSourceSelection(source.id)}
                        className={`bg-transparent ${selectedSources.includes(source.id) ? "border-primary text-primary" : ""}`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {selectedSources.includes(source.id) ? "Selected" : "Select"}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => toggleSaveSource(source.id)}
                      >
                        <Bookmark className={`h-4 w-4 mr-2 ${source.saved ? "fill-current text-primary" : ""}`} />
                        {source.saved ? "Saved" : "Save"}
                      </Button>

                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Quote className="h-4 w-4 mr-2" />
                        Cite
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Paper
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="citations" className="space-y-6">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-foreground">Citation Manager</h3>
                  <p className="text-sm text-muted-foreground">Manage and format your citations</p>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={citationStyle}
                    onChange={(e) => setCitationStyle(e.target.value)}
                    className="px-3 py-1 text-sm border border-border/50 rounded bg-background"
                  >
                    <option value="apa">APA Style</option>
                    <option value="mla">MLA Style</option>
                    <option value="chicago">Chicago Style</option>
                  </select>
                  <Badge variant="secondary" className="text-xs">
                    {savedCitations.length} citations
                  </Badge>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {savedCitations.map((citation) => (
                  <div
                    key={citation.id}
                    className="p-4 rounded-xl border border-border/30 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">{citation.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {citation.authors} ({citation.year})
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(formatCitation(citation, citationStyle))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">{citationStyle.toUpperCase()}:</span>
                        <p className="text-muted-foreground mt-1 font-mono text-xs bg-muted/30 p-2 rounded">
                          {formatCitation(citation, citationStyle)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-foreground">Research Notes</h3>
                  <p className="text-sm text-muted-foreground">Organize your research findings and insights</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Templates
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    New Note
                  </Button>
                </div>
              </div>

              <Textarea
                placeholder="Start writing your research notes here...

You can organize your thoughts, key findings, and insights from your research. Consider including:
- Main arguments and themes
- Supporting evidence
- Connections between sources
- Your own analysis and interpretations
- Questions for further investigation"
                value={researchNotes}
                onChange={(e) => setResearchNotes(e.target.value)}
                className="min-h-[400px] bg-muted/30 border-border/50 focus:border-primary/50 resize-none"
              />

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                <div className="text-xs text-muted-foreground">{researchNotes.length} characters • Auto-saved</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bibliography" className="space-y-6">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-foreground">Bibliography Generator</h3>
                  <p className="text-sm text-muted-foreground">Generate formatted bibliographies in various styles</p>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={citationStyle}
                    onChange={(e) => setCitationStyle(e.target.value)}
                    className="px-3 py-1 text-sm border border-border/50 rounded bg-background"
                  >
                    <option value="apa">APA Style</option>
                    <option value="mla">MLA Style</option>
                    <option value="chicago">Chicago Style</option>
                    <option value="harvard">Harvard Style</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                    onClick={() =>
                      copyToClipboard(savedCitations.map((c) => formatCitation(c, citationStyle)).join("\n\n"))
                    }
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="bg-muted/30 rounded-xl p-4 font-mono text-sm">
                <h4 className="font-bold mb-4 text-foreground">References</h4>
                {savedCitations.length > 0 ? (
                  savedCitations.map((citation, index) => (
                    <p key={index} className="mb-3 text-muted-foreground leading-relaxed">
                      {formatCitation(citation, citationStyle)}
                    </p>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">
                    No citations saved yet. Add citations from your search results to generate a bibliography.
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
