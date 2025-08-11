"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Database,
  Plus,
  Search,
  BookOpen,
  FileText,
  Link,
  Calendar,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  Share,
  Download,
  Eye,
  Grid,
  List,
} from "lucide-react"
import { InteractiveCard } from "@/components/ui/interactive-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface KnowledgeItem {
  id: string
  title: string
  content: string
  type: "note" | "document" | "link" | "image"
  tags: string[]
  category: string
  createdAt: Date
  updatedAt: Date
  isFavorite: boolean
  connections: string[]
  views: number
}

interface Category {
  id: string
  name: string
  color: string
  count: number
}

const categories: Category[] = [
  { id: "1", name: "Computer Science", color: "bg-blue-500", count: 24 },
  { id: "2", name: "Mathematics", color: "bg-green-500", count: 18 },
  { id: "3", name: "Physics", color: "bg-purple-500", count: 12 },
  { id: "4", name: "History", color: "bg-orange-500", count: 15 },
  { id: "5", name: "Literature", color: "bg-pink-500", count: 9 },
  { id: "6", name: "Biology", color: "bg-teal-500", count: 21 },
]

const sampleItems: KnowledgeItem[] = [
  {
    id: "1",
    title: "Machine Learning Fundamentals",
    content: "Key concepts in ML including supervised, unsupervised, and reinforcement learning...",
    type: "note",
    tags: ["AI", "ML", "algorithms"],
    category: "Computer Science",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    isFavorite: true,
    connections: ["2", "3"],
    views: 45,
  },
  {
    id: "2",
    title: "Neural Networks Architecture",
    content: "Deep dive into neural network structures, backpropagation, and optimization...",
    type: "document",
    tags: ["neural networks", "deep learning"],
    category: "Computer Science",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-22"),
    isFavorite: false,
    connections: ["1", "4"],
    views: 32,
  },
  {
    id: "3",
    title: "Linear Algebra for ML",
    content: "Essential linear algebra concepts for machine learning applications...",
    type: "note",
    tags: ["mathematics", "linear algebra", "ML"],
    category: "Mathematics",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-25"),
    isFavorite: true,
    connections: ["1"],
    views: 67,
  },
  {
    id: "4",
    title: "TensorFlow Documentation",
    content: "https://tensorflow.org/docs",
    type: "link",
    tags: ["tensorflow", "documentation", "ML"],
    category: "Computer Science",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
    isFavorite: false,
    connections: ["2"],
    views: 23,
  },
]

export function KnowledgeBase() {
  const [items, setItems] = useState<KnowledgeItem[]>(sampleItems)
  const [filteredItems, setFilteredItems] = useState<KnowledgeItem[]>(sampleItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // New item form state
  const [newItem, setNewItem] = useState({
    title: "",
    content: "",
    type: "note" as const,
    tags: "",
    category: "",
  })

  useEffect(() => {
    let filtered = items

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType)
    }

    setFilteredItems(filtered)
  }, [items, searchQuery, selectedCategory, selectedType])

  const addNewItem = () => {
    if (!newItem.title.trim()) return

    const item: KnowledgeItem = {
      id: Date.now().toString(),
      title: newItem.title,
      content: newItem.content,
      type: newItem.type,
      tags: newItem.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      category: newItem.category || "Uncategorized",
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
      connections: [],
      views: 0,
    }

    setItems((prev) => [item, ...prev])
    setNewItem({ title: "", content: "", type: "note", tags: "", category: "" })
    setIsAddDialogOpen(false)
  }

  const toggleFavorite = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)))
  }

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "note":
        return <FileText className="h-4 w-4" />
      case "document":
        return <BookOpen className="h-4 w-4" />
      case "link":
        return <Link className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "note":
        return "bg-blue-500"
      case "document":
        return "bg-green-500"
      case "link":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-primary" />
                <span>Knowledge Base</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Organize and connect your learning materials</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <AnimatedButton>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </AnimatedButton>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add New Knowledge Item</DialogTitle>
                    <DialogDescription>
                      Create a new note, document, or link to add to your knowledge base.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Title</label>
                      <Input
                        className="col-span-3"
                        value={newItem.title}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter title..."
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Type</label>
                      <Select
                        value={newItem.type}
                        onValueChange={(value: "note" | "document" | "link") =>
                          setNewItem((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="note">Note</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="link">Link</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Category</label>
                      <Select
                        value={newItem.category}
                        onValueChange={(value) => setNewItem((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select category..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Tags</label>
                      <Input
                        className="col-span-3"
                        value={newItem.tags}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, tags: e.target.value }))}
                        placeholder="tag1, tag2, tag3..."
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <label className="text-right text-sm font-medium pt-2">Content</label>
                      <Textarea
                        className="col-span-3"
                        value={newItem.content}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter content or URL..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <AnimatedButton onClick={addNewItem} disabled={!newItem.title.trim()}>
                      Add Item
                    </AnimatedButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="note">Notes</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="link">Links</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Categories Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <InteractiveCard
            key={category.id}
            className={`cursor-pointer transition-all ${
              selectedCategory === category.name ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedCategory(selectedCategory === category.name ? "all" : category.name)}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-8 h-8 ${category.color} rounded-lg mx-auto mb-2`} />
              <h3 className="font-medium text-sm text-foreground">{category.name}</h3>
              <p className="text-xs text-muted-foreground">{category.count} items</p>
            </CardContent>
          </InteractiveCard>
        ))}
      </div>

      {/* Knowledge Items */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredItems.map((item) => (
            <InteractiveCard key={item.id} className="cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div
                      className={`w-8 h-8 ${getTypeColor(item.type)} rounded-lg flex items-center justify-center text-white`}
                    >
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold text-foreground truncate">{item.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{item.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(item.id)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Star
                        className={`h-4 w-4 ${item.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                      />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedItem(item)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <Separator />
                        <DropdownMenuItem className="text-red-600" onClick={() => deleteItem(item.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{item.content}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{item.updatedAt.toLocaleDateString()}</span>
                  </div>
                  {item.connections.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Link className="h-3 w-3" />
                      <span>{item.connections.length} connections</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </InteractiveCard>
          ))}
        </div>
      )}

      {filteredItems.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "all" || selectedType !== "all"
                ? "Try adjusting your search or filters"
                : "Start building your knowledge base by adding your first item"}
            </p>
            <AnimatedButton onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </AnimatedButton>
          </CardContent>
        </Card>
      )}

      {/* Item Detail Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 ${getTypeColor(selectedItem.type)} rounded flex items-center justify-center text-white`}
                >
                  {getTypeIcon(selectedItem.type)}
                </div>
                <span>{selectedItem.title}</span>
              </DialogTitle>
              <DialogDescription>
                {selectedItem.category} • Updated {selectedItem.updatedAt.toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <ScrollArea className="h-64 w-full rounded border p-4">
                <p className="text-sm text-foreground whitespace-pre-wrap">{selectedItem.content}</p>
              </ScrollArea>
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedItem.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
              <AnimatedButton>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </AnimatedButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
