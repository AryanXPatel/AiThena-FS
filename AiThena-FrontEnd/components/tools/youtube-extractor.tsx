"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Video,
  Download,
  Clock,
  FileText,
  BookOpen,
  Share,
  Copy,
  Search,
  MoreHorizontal,
  Trash2,
  Star,
  Eye,
  Calendar,
  User,
  Bookmark,
  List,
  Grid,
} from "lucide-react"
import { InteractiveCard } from "@/components/ui/interactive-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ExtractedVideo {
  id: string
  title: string
  channel: string
  duration: string
  thumbnail: string
  url: string
  transcript: string
  keyPoints: string[]
  summary: string
  extractedAt: Date
  tags: string[]
  isFavorite: boolean
  views: number
}

interface TranscriptSegment {
  timestamp: string
  text: string
  duration: number
}

const sampleVideos: ExtractedVideo[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    channel: "MIT OpenCourseWare",
    duration: "45:32",
    thumbnail: "/placeholder.svg?height=120&width=200",
    url: "https://youtube.com/watch?v=example1",
    transcript: "Welcome to this introduction to machine learning. Today we'll cover the fundamental concepts...",
    keyPoints: [
      "Machine learning is a subset of artificial intelligence",
      "Three main types: supervised, unsupervised, reinforcement learning",
      "Applications in healthcare, finance, and technology",
      "Importance of data quality and preprocessing",
    ],
    summary:
      "This lecture provides a comprehensive introduction to machine learning, covering basic concepts, types of learning algorithms, and real-world applications.",
    extractedAt: new Date("2024-01-20"),
    tags: ["machine learning", "AI", "education", "MIT"],
    isFavorite: true,
    views: 156,
  },
  {
    id: "2",
    title: "React Hooks Deep Dive",
    channel: "React Conference",
    duration: "32:18",
    thumbnail: "/placeholder.svg?height=120&width=200",
    url: "https://youtube.com/watch?v=example2",
    transcript: "Let's explore React Hooks in detail. We'll start with useState and useEffect...",
    keyPoints: [
      "useState for state management in functional components",
      "useEffect for side effects and lifecycle methods",
      "Custom hooks for reusable logic",
      "Performance optimization with useMemo and useCallback",
    ],
    summary:
      "A detailed exploration of React Hooks, demonstrating how to use built-in hooks and create custom ones for better code organization.",
    extractedAt: new Date("2024-01-18"),
    tags: ["react", "javascript", "web development", "hooks"],
    isFavorite: false,
    views: 89,
  },
  {
    id: "3",
    title: "Climate Change Solutions",
    channel: "TED Talks",
    duration: "18:45",
    thumbnail: "/placeholder.svg?height=120&width=200",
    url: "https://youtube.com/watch?v=example3",
    transcript: "Climate change is one of the most pressing issues of our time...",
    keyPoints: [
      "Renewable energy adoption is accelerating globally",
      "Carbon capture technology shows promise",
      "Individual actions can make a collective impact",
      "Policy changes are essential for systemic change",
    ],
    summary:
      "An inspiring talk about practical solutions to climate change, emphasizing both technological innovations and individual responsibility.",
    extractedAt: new Date("2024-01-15"),
    tags: ["climate change", "environment", "sustainability", "TED"],
    isFavorite: true,
    views: 234,
  },
]

const transcriptSegments: TranscriptSegment[] = [
  { timestamp: "00:00", text: "Welcome to this introduction to machine learning.", duration: 3 },
  {
    timestamp: "00:03",
    text: "Today we'll cover the fundamental concepts that form the foundation of ML.",
    duration: 4,
  },
  { timestamp: "00:07", text: "Machine learning is essentially a subset of artificial intelligence.", duration: 3 },
  {
    timestamp: "00:10",
    text: "It allows computers to learn and make decisions without being explicitly programmed.",
    duration: 5,
  },
  { timestamp: "00:15", text: "There are three main types of machine learning algorithms.", duration: 3 },
]

export function YouTubeExtractor() {
  const [videos, setVideos] = useState<ExtractedVideo[]>(sampleVideos)
  const [filteredVideos, setFilteredVideos] = useState<ExtractedVideo[]>(sampleVideos)
  const [selectedVideo, setSelectedVideo] = useState<ExtractedVideo | null>(null)
  const [extractUrl, setExtractUrl] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChannel, setSelectedChannel] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("library")
  const [showTranscript, setShowTranscript] = useState(false)

  const extractVideo = async () => {
    if (!extractUrl.trim()) return

    setIsExtracting(true)
    setExtractionProgress(0)

    // Simulate extraction process
    const steps = [
      { progress: 20, message: "Fetching video information..." },
      { progress: 40, message: "Downloading transcript..." },
      { progress: 60, message: "Analyzing content..." },
      { progress: 80, message: "Generating key points..." },
      { progress: 100, message: "Extraction complete!" },
    ]

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setExtractionProgress(step.progress)
    }

    // Add new video to library
    const newVideo: ExtractedVideo = {
      id: Date.now().toString(),
      title: "New Extracted Video",
      channel: "Sample Channel",
      duration: "25:30",
      thumbnail: "/placeholder.svg?height=120&width=200",
      url: extractUrl,
      transcript: "This is a sample transcript of the extracted video...",
      keyPoints: ["Key point 1 from the video", "Important concept discussed", "Main takeaway from the content"],
      summary: "This is a summary of the extracted video content.",
      extractedAt: new Date(),
      tags: ["new", "extracted"],
      isFavorite: false,
      views: 0,
    }

    setVideos((prev) => [newVideo, ...prev])
    setFilteredVideos((prev) => [newVideo, ...prev])
    setExtractUrl("")
    setIsExtracting(false)
    setExtractionProgress(0)
  }

  const toggleFavorite = (id: string) => {
    setVideos((prev) => prev.map((video) => (video.id === id ? { ...video, isFavorite: !video.isFavorite } : video)))
    setFilteredVideos((prev) =>
      prev.map((video) => (video.id === id ? { ...video, isFavorite: !video.isFavorite } : video)),
    )
  }

  const deleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((video) => video.id !== id))
    setFilteredVideos((prev) => prev.filter((video) => video.id !== id))
  }

  const copyTranscript = (transcript: string) => {
    navigator.clipboard.writeText(transcript)
  }

  const generateQuiz = (video: ExtractedVideo) => {
    // Simulate quiz generation
    console.log("Generating quiz for:", video.title)
  }

  const generateFlashcards = (video: ExtractedVideo) => {
    // Simulate flashcard generation
    console.log("Generating flashcards for:", video.title)
  }

  const channels = Array.from(new Set(videos.map((v) => v.channel)))

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="extract">Extract Video</TabsTrigger>
          <TabsTrigger value="library">Video Library</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="extract" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5 text-primary" />
                <span>Extract YouTube Video</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Paste a YouTube URL to extract transcript and generate study materials
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={extractUrl}
                  onChange={(e) => setExtractUrl(e.target.value)}
                  className="flex-1"
                  disabled={isExtracting}
                />
                <AnimatedButton onClick={extractVideo} disabled={!extractUrl.trim() || isExtracting} className="px-6">
                  {isExtracting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Extract
                    </>
                  )}
                </AnimatedButton>
              </div>

              {isExtracting && (
                <div className="space-y-2">
                  <Progress value={extractionProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    {extractionProgress < 20
                      ? "Fetching video information..."
                      : extractionProgress < 40
                        ? "Downloading transcript..."
                        : extractionProgress < 60
                          ? "Analyzing content..."
                          : extractionProgress < 80
                            ? "Generating key points..."
                            : "Extraction complete!"}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <InteractiveCard>
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium text-foreground">Transcript</h3>
                    <p className="text-xs text-muted-foreground">Full video transcript with timestamps</p>
                  </CardContent>
                </InteractiveCard>
                <InteractiveCard>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium text-foreground">Key Points</h3>
                    <p className="text-xs text-muted-foreground">AI-generated summary points</p>
                  </CardContent>
                </InteractiveCard>
                <InteractiveCard>
                  <CardContent className="p-4 text-center">
                    <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium text-foreground">Study Materials</h3>
                    <p className="text-xs text-muted-foreground">Quizzes and flashcards</p>
                  </CardContent>
                </InteractiveCard>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Channels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    {channels.map((channel) => (
                      <SelectItem key={channel} value={channel}>
                        {channel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                  {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Video Library */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredVideos.map((video) => (
              <InteractiveCard key={video.id} className="cursor-pointer">
                <div className="relative">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(video.id)
                    }}
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                  >
                    <Star
                      className={`h-4 w-4 ${video.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white"}`}
                    />
                  </Button>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold text-foreground line-clamp-2">
                        {video.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {video.channel}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{video.views}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedVideo(video)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => generateQuiz(video)}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Generate Quiz
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => generateFlashcards(video)}>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Create Flashcards
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyTranscript(video.transcript)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Transcript
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <Separator />
                        <DropdownMenuItem className="text-red-600" onClick={() => deleteVideo(video.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{video.summary}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {video.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {video.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{video.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{video.extractedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{video.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </InteractiveCard>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No videos found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedChannel !== "all"
                    ? "Try adjusting your search or filters"
                    : "Start by extracting your first YouTube video"}
                </p>
                <AnimatedButton onClick={() => setActiveTab("extract")}>
                  <Download className="h-4 w-4 mr-2" />
                  Extract Video
                </AnimatedButton>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Video className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{videos.length}</p>
                    <p className="text-sm text-muted-foreground">Videos Extracted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">12.5h</p>
                    <p className="text-sm text-muted-foreground">Total Duration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <User className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{channels.length}</p>
                    <p className="text-sm text-muted-foreground">Channels</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Star className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{videos.filter((v) => v.isFavorite).length}</p>
                    <p className="text-sm text-muted-foreground">Favorites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Most Active Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channels.slice(0, 5).map((channel, index) => {
                  const channelVideos = videos.filter((v) => v.channel === channel).length
                  return (
                    <div key={channel} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">{index + 1}</span>
                        </div>
                        <span className="font-medium text-foreground">{channel}</span>
                      </div>
                      <Badge variant="secondary">{channelVideos} videos</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Video Detail Dialog */}
      {selectedVideo && (
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5 text-primary" />
                <span>{selectedVideo.title}</span>
              </DialogTitle>
              <DialogDescription>
                {selectedVideo.channel} • {selectedVideo.duration} • {selectedVideo.extractedAt.toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="keypoints">Key Points</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="space-y-4">
                <ScrollArea className="h-64 w-full rounded border p-4">
                  <p className="text-sm text-foreground">{selectedVideo.summary}</p>
                </ScrollArea>
                <div className="flex flex-wrap gap-2">
                  {selectedVideo.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="keypoints" className="space-y-4">
                <ScrollArea className="h-64 w-full rounded border p-4">
                  <ul className="space-y-2">
                    {selectedVideo.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm text-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="transcript" className="space-y-4">
                <ScrollArea className="h-64 w-full rounded border p-4">
                  <div className="space-y-2">
                    {transcriptSegments.map((segment, index) => (
                      <div key={index} className="flex items-start space-x-3 hover:bg-muted/50 p-2 rounded">
                        <Button variant="ghost" size="sm" className="h-6 w-16 text-xs font-mono text-primary">
                          {segment.timestamp}
                        </Button>
                        <p className="text-sm text-foreground flex-1">{segment.text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedVideo(null)}>
                Close
              </Button>
              <Button onClick={() => copyTranscript(selectedVideo.transcript)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Transcript
              </Button>
              <AnimatedButton onClick={() => generateQuiz(selectedVideo)}>
                <BookOpen className="h-4 w-4 mr-2" />
                Generate Quiz
              </AnimatedButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
