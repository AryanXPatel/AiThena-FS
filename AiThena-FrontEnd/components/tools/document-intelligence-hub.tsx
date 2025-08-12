"use client"

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Upload,
  FileText,
  Brain,
  Search,
  Download,
  Eye,
  Trash2,
  Filter,
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  X,
  MessageSquare,
  BookOpen,
  Lightbulb,
  FileQuestion,
  Sparkles,
} from "lucide-react"

// Types for our backend integration
interface Document {
  id: string
  name: string
  size: string
  uploadDate: string
  status: "processed" | "processing" | "error"
  type: string
  summary?: string
  keyTopics?: string[]
  processingTime?: string
}

interface ApiDocument {
  id: string
}

interface QueryResponse {
  answer: string
  citations: Array<{
    docId: string
    chunkId: number
  }>
}

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "text" | "summary" | "question"
  relatedDocuments?: string[]
}

// API configuration
const DOCINTEL_API_BASE = 'http://localhost:4101'

const quickActions = [
  { icon: BookOpen, label: "Summarize Document", prompt: "Can you provide a comprehensive summary of the uploaded documents?" },
  { icon: FileQuestion, label: "Key Points", prompt: "What are the main key points and takeaways from these documents?" },
  { icon: Lightbulb, label: "Explain Concept", prompt: "Can you explain the main concepts discussed in these documents?" },
  { icon: Brain, label: "Ask Questions", prompt: "Generate some questions I should ask about this content" },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "processed":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "processing":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "processed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "processing":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "error":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

// Define the interface for the ref methods
export interface DocumentIntelligenceHubRef {
  triggerUpload: () => void;
}

export const DocumentIntelligenceHub = forwardRef<DocumentIntelligenceHubRef>((props, ref) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Chat interface state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hello! I'm your Document Intelligence Assistant. Upload some PDFs and I'll help you analyze, summarize, and answer questions about your documents. What would you like to explore today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Expose the triggerUpload function to parent components
  useImperativeHandle(ref, () => ({
    triggerUpload: () => {
      fileInputRef.current?.click();
    }
  }));

  // API functions
  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${DOCINTEL_API_BASE}/documents`)
      if (response.ok) {
        const docs: ApiDocument[] = await response.json()
        
        // Fetch metadata for each document
        const transformedDocs: Document[] = await Promise.all(
          docs.map(async (doc) => {
            try {
              const metaResponse = await fetch(`${DOCINTEL_API_BASE}/documents/${doc.id}/metadata`)
              if (metaResponse.ok) {
                const metadata = await metaResponse.json()
                return {
                  id: doc.id,
                  name: metadata.name || `Document-${doc.id}.pdf`,
                  size: metadata.size || "Unknown",
                  uploadDate: metadata.uploadDate || new Date().toISOString().split('T')[0],
                  status: metadata.status || "processed" as const,
                  type: metadata.type || "pdf",
                  summary: metadata.summary || "Document ready for analysis",
                  keyTopics: metadata.keyTopics || ["Document", "Analysis"],
                  processingTime: metadata.processingTime || "Processed"
                }
              } else {
                // Fallback to default values if metadata fetch fails
                return {
                  id: doc.id,
                  name: `Document-${doc.id}.pdf`,
                  size: "Unknown",
                  uploadDate: new Date().toISOString().split('T')[0],
                  status: "processed" as const,
                  type: "pdf",
                  summary: "Document ready for analysis",
                  keyTopics: ["Document", "Analysis"],
                  processingTime: "Processed"
                }
              }
            } catch (error) {
              console.error(`Failed to fetch metadata for document ${doc.id}:`, error)
              // Fallback to default values
              return {
                id: doc.id,
                name: `Document-${doc.id}.pdf`,
                size: "Unknown",
                uploadDate: new Date().toISOString().split('T')[0],
                status: "processed" as const,
                type: "pdf",
                summary: "Document ready for analysis",
                keyTopics: ["Document", "Analysis"],
                processingTime: "Processed"
              }
            }
          })
        )
        
        setDocuments(transformedDocs)
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    } finally {
      setLoading(false)
    }
  }

  // Delete document function
  const deleteDocument = async (documentId: string) => {
    try {
      setDeleting(documentId)
      const response = await fetch(`${DOCINTEL_API_BASE}/documents/${documentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from local state
        setDocuments(prev => prev.filter(doc => doc.id !== documentId))
        console.log(`Document ${documentId} deleted successfully`)
      } else {
        throw new Error('Failed to delete document')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete document. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  // Export/download document function
  const exportDocument = async (documentId: string, fileName: string) => {
    try {
      const response = await fetch(`${DOCINTEL_API_BASE}/documents/${documentId}/download`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        console.log(`Document ${fileName} downloaded successfully`)
      } else {
        throw new Error('Failed to download document')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export document. Please try again.')
    }
  }

  // View document function (opens in new tab)
  const viewDocument = (documentId: string) => {
    const viewUrl = `${DOCINTEL_API_BASE}/documents/${documentId}/download`
    window.open(viewUrl, '_blank')
  }

  const uploadFile = async (file: File) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${DOCINTEL_API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Upload successful:', result)
        
        // Fetch real metadata for the uploaded document
        try {
          const metaResponse = await fetch(`${DOCINTEL_API_BASE}/documents/${result.id}/metadata`)
          if (metaResponse.ok) {
            const metadata = await metaResponse.json()
            const newDoc: Document = {
              id: result.id,
              name: metadata.name || file.name,
              size: metadata.size || `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              uploadDate: metadata.uploadDate || new Date().toISOString().split('T')[0],
              status: metadata.status || "processing",
              type: metadata.type || "pdf",
              summary: metadata.summary || "Document uploaded successfully",
              keyTopics: metadata.keyTopics || ["Uploaded", "Processing"],
              processingTime: metadata.processingTime || "Just now"
            }
            setDocuments(prev => [newDoc, ...prev])
          } else {
            // Fallback to basic info if metadata fetch fails
            const newDoc: Document = {
              id: result.id,
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              uploadDate: new Date().toISOString().split('T')[0],
              status: "processing",
              type: "pdf",
              summary: "Document uploaded successfully",
              keyTopics: ["Uploaded", "Processing"],
              processingTime: "Just now"
            }
            setDocuments(prev => [newDoc, ...prev])
          }
        } catch (metaError) {
          console.error('Failed to fetch metadata after upload:', metaError)
          // Fallback to basic info
          const newDoc: Document = {
            id: result.id,
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            uploadDate: new Date().toISOString().split('T')[0],
            status: "processing",
            type: "pdf",
            summary: "Document uploaded successfully",
            keyTopics: ["Uploaded", "Processing"],
            processingTime: "Just now"
          }
          setDocuments(prev => [newDoc, ...prev])
        }
        
        return result
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  // Chat functionality
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setChatMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await fetch(`${DOCINTEL_API_BASE}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: content }),
      })

      if (response.ok) {
        const result: QueryResponse = await response.json()
        
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: result.answer || "I couldn't find information about that in your documents.",
          sender: "ai",
          timestamp: new Date(),
          type: "text",
          relatedDocuments: result.citations?.map(c => c.docId) || []
        }
        setChatMessages((prev) => [...prev, aiMessage])
      } else {
        throw new Error('Query failed')
      }
    } catch (error) {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error while processing your question. Please make sure you have uploaded some documents first.",
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      }
      setChatMessages((prev) => [...prev, aiMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt)
  }

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadFile(file).catch(error => {
        alert('Upload failed: ' + error.message)
      })
    }
  }

  // Handle drag and drop
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      uploadFile(file).catch(error => {
        alert('Upload failed: ' + error.message)
      })
    } else {
      alert('Please select a PDF file')
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  // Handle AI query submit (deprecated - now using chat)
  const handleAiQuery = async () => {
    // This function is deprecated in favor of chat interface
    return
  }

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [chatMessages])

  // Load documents on component mount
  useEffect(() => {
    fetchDocuments()
  }, [])

  // Filter documents based on selected tab and search query
  const filteredDocuments = documents.filter(doc => {
    // First filter by search query
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Then filter by selected tab
    switch (selectedTab) {
      case 'recent':
        // Show recently uploaded documents (within last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const docDate = new Date(doc.uploadDate);
        return docDate >= weekAgo;
      
      case 'processing':
        return doc.status === 'processing' || doc.status === 'uploaded';
      
      case 'processed':
        return doc.status === 'processed';
      
      default:
        return true;
    }
  })

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf"
        className="hidden"
      />

      {/* Upload Area */}
      <div 
        className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors duration-200 relative overflow-hidden group"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            ) : (
              <Upload className="h-8 w-8 text-primary" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {uploading ? "Uploading..." : "Upload Documents"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {uploading 
              ? "Processing your document..." 
              : "Drag and drop your PDFs here, or click to browse"
            }
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button 
              className="bg-primary hover:bg-primary/90" 
              disabled={uploading}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Uploading..." : "Choose Files"}
            </Button>
            <p className="text-xs text-muted-foreground">Supports PDF • Max 10MB per file</p>
          </div>
        </div>
      </div>

      {/* Chat Interface Toggle and Container */}
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />
        
        {/* Chat Header */}
        <div className="p-6 border-b border-border/30 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Document Chat</h3>
                <p className="text-sm text-muted-foreground">
                  {documents.length} documents loaded • Chat with your PDFs
                </p>
              </div>
            </div>
            <Button
              variant={showChat ? "default" : "outline"}
              onClick={() => setShowChat(!showChat)}
              className="relative z-10"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {showChat ? "Hide Chat" : "Open Chat"}
            </Button>
          </div>
        </div>

        {/* Chat Interface */}
        {showChat && (
          <div className="relative z-10">
            {/* Chat Messages */}
            <ScrollArea ref={scrollAreaRef} className="h-96 p-6">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      {message.sender === "ai" ? (
                        <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
                          <Brain className="h-4 w-4 text-primary" />
                        </div>
                      ) : (
                        <>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>You</AvatarFallback>
                        </>
                      )}
                    </Avatar>

                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.sender === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted/50 text-foreground"
                      }`}
                    >
                      {message.sender === "ai" ? (
                        <div className="text-sm leading-relaxed [&_code]:rounded [&_code]:bg-background/60 [&_code]:px-1 [&_code]:py-0.5 [&_pre]:bg-background/80 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      )}
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                    </Avatar>
                    <div className="bg-muted/50 rounded-2xl p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-6 border-t border-border/30">
              <div className="flex items-center space-x-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleQuickAction(action.prompt)}
                      disabled={documents.length === 0}
                    >
                      <action.icon className="h-3 w-3 mr-1" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Ask me anything about your documents..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendMessage(inputValue);
                      }
                    }}
                    className="pr-12 bg-muted/30 border-border/50 focus:border-primary/50"
                    disabled={isTyping || documents.length === 0}
                  />
                </div>
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping || documents.length === 0}
                  className="h-10 px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {documents.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Upload some documents first to start chatting with them
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-muted/30 border-border/50 focus:border-primary/50"
            />
          </div>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-transparent"
            onClick={fetchDocuments}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {documents.length} documents
          </Badge>
          <Badge variant="outline" className="text-xs">
            {documents.filter((d) => d.status === "processed").length} processed
          </Badge>
        </div>
      </div>

      {/* Document Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 bg-muted/30">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="processed">Processed</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Loading documents...</span>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No documents found</h3>
              <p className="text-muted-foreground">
                {documents.length === 0 
                  ? "Upload your first document to get started" 
                  : "No documents match your search"
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 group relative overflow-hidden cursor-pointer"
                  onClick={() => setSelectedDocumentId(selectedDocumentId === doc.id ? null : doc.id)}
                >
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                              {doc.name}
                            </h3>
                            {getStatusIcon(doc.status)}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>Uploaded {doc.uploadDate}</span>
                            {doc.processingTime && (
                              <>
                                <span>•</span>
                                <span>Processed in {doc.processingTime}</span>
                              </>
                            )}
                          </div>

                          <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {selectedDocumentId === doc.id && (doc.status === "processed" || doc.status === "processing") && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-foreground mb-2 text-sm">Document Info</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {doc.status === "processed" 
                              ? (doc.summary || "Document ready for analysis and queries")
                              : "Document is being processed and will be available for analysis soon"
                            }
                          </p>
                        </div>

                        {doc.keyTopics && doc.keyTopics.length > 0 && (
                          <div>
                            <h4 className="font-medium text-foreground mb-2 text-sm">Key Topics</h4>
                            <div className="flex flex-wrap gap-2">
                              {doc.keyTopics?.map((topic, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-transparent"
                            onClick={() => viewDocument(doc.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-transparent"
                            onClick={() => {
                              setShowChat(true)
                              setInputValue(`Tell me about ${doc.name}`)
                            }}
                          >
                            <Brain className="h-4 w-4 mr-2" />
                            Ask AI
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-transparent"
                            onClick={() => exportDocument(doc.id, doc.name)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600"
                            onClick={() => deleteDocument(doc.id)}
                            disabled={deleting === doc.id}
                          >
                            {deleting === doc.id ? (
                              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
})

// Set display name for better debugging
DocumentIntelligenceHub.displayName = 'DocumentIntelligenceHub';
