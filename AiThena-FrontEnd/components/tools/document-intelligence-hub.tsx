"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

const documents = [
  {
    id: 1,
    name: "Advanced Calculus Notes.pdf",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    status: "processed",
    type: "pdf",
    summary: "Comprehensive notes covering limits, derivatives, and integrals with practical examples.",
    keyTopics: ["Limits", "Derivatives", "Integrals", "Applications"],
    processingTime: "45s",
  },
  {
    id: 2,
    name: "Organic Chemistry Textbook.pdf",
    size: "15.7 MB",
    uploadDate: "2024-01-14",
    status: "processing",
    type: "pdf",
    progress: 67,
  },
  {
    id: 3,
    name: "Research Paper - Machine Learning.pdf",
    size: "3.1 MB",
    uploadDate: "2024-01-13",
    status: "processed",
    type: "pdf",
    summary: "Research paper on neural networks and deep learning applications in computer vision.",
    keyTopics: ["Neural Networks", "Deep Learning", "Computer Vision", "AI"],
    processingTime: "1m 23s",
  },
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

export function DocumentIntelligenceHub() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors duration-200 relative overflow-hidden group cursor-pointer">
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Upload Documents</h3>
          <p className="text-muted-foreground mb-6">
            Drag and drop your PDFs, Word documents, or text files here, or click to browse
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button className="bg-primary hover:bg-primary/90">
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
            <p className="text-xs text-muted-foreground">Supports PDF, DOCX, TXT • Max 50MB per file</p>
          </div>
        </div>
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
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 group relative overflow-hidden"
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

                  {doc.status === "processing" && doc.progress && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Processing...</span>
                        <span className="font-medium text-foreground">{doc.progress}%</span>
                      </div>
                      <Progress value={doc.progress} className="h-2" />
                    </div>
                  )}

                  {doc.status === "processed" && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2 text-sm">AI Summary</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{doc.summary}</p>
                      </div>

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

                      <div className="flex items-center space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Brain className="h-4 w-4 mr-2" />
                          Ask AI
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
