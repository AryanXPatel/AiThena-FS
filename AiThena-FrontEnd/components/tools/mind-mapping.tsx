"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  GitBranch,
  Plus,
  Download,
  Share,
  Trash2,
  Edit,
  Copy,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Square,
  Circle,
  Triangle,
  MoreHorizontal,
  ImageIcon,
  FileText,
  Lightbulb,
  Clock,
  Eye,
  Grid,
  List,
} from "lucide-react"
import { InteractiveCard } from "@/components/ui/interactive-card"
import { AnimatedButton } from "@/components/ui/animated-button"

interface MindMapNode {
  id: string
  text: string
  x: number
  y: number
  color: string
  shape: "circle" | "square" | "triangle"
  size: "small" | "medium" | "large"
  connections: string[]
  level: number
}

interface MindMap {
  id: string
  title: string
  description: string
  nodes: MindMapNode[]
  createdAt: Date
  updatedAt: Date
  tags: string[]
  isPublic: boolean
  views: number
  collaborators: string[]
}

const sampleMindMaps: MindMap[] = [
  {
    id: "1",
    title: "Machine Learning Concepts",
    description: "Comprehensive overview of ML algorithms and techniques",
    nodes: [
      {
        id: "1",
        text: "Machine Learning",
        x: 400,
        y: 300,
        color: "#3b82f6",
        shape: "circle",
        size: "large",
        connections: ["2", "3", "4"],
        level: 0,
      },
      {
        id: "2",
        text: "Supervised Learning",
        x: 200,
        y: 200,
        color: "#10b981",
        shape: "circle",
        size: "medium",
        connections: ["1", "5", "6"],
        level: 1,
      },
      {
        id: "3",
        text: "Unsupervised Learning",
        x: 600,
        y: 200,
        color: "#f59e0b",
        shape: "circle",
        size: "medium",
        connections: ["1", "7", "8"],
        level: 1,
      },
      {
        id: "4",
        text: "Reinforcement Learning",
        x: 400,
        y: 500,
        color: "#ef4444",
        shape: "circle",
        size: "medium",
        connections: ["1", "9"],
        level: 1,
      },
      {
        id: "5",
        text: "Classification",
        x: 100,
        y: 100,
        color: "#10b981",
        shape: "square",
        size: "small",
        connections: ["2"],
        level: 2,
      },
      {
        id: "6",
        text: "Regression",
        x: 100,
        y: 300,
        color: "#10b981",
        shape: "square",
        size: "small",
        connections: ["2"],
        level: 2,
      },
      {
        id: "7",
        text: "Clustering",
        x: 700,
        y: 100,
        color: "#f59e0b",
        shape: "square",
        size: "small",
        connections: ["3"],
        level: 2,
      },
      {
        id: "8",
        text: "Dimensionality Reduction",
        x: 700,
        y: 300,
        color: "#f59e0b",
        shape: "square",
        size: "small",
        connections: ["3"],
        level: 2,
      },
      {
        id: "9",
        text: "Q-Learning",
        x: 500,
        y: 600,
        color: "#ef4444",
        shape: "square",
        size: "small",
        connections: ["4"],
        level: 2,
      },
    ],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-22"),
    tags: ["machine learning", "AI", "algorithms"],
    isPublic: true,
    views: 156,
    collaborators: ["user1", "user2"],
  },
  {
    id: "2",
    title: "React Ecosystem",
    description: "Overview of React and its surrounding ecosystem",
    nodes: [
      {
        id: "1",
        text: "React",
        x: 400,
        y: 300,
        color: "#06b6d4",
        shape: "circle",
        size: "large",
        connections: ["2", "3", "4", "5"],
        level: 0,
      },
      {
        id: "2",
        text: "State Management",
        x: 200,
        y: 200,
        color: "#8b5cf6",
        shape: "circle",
        size: "medium",
        connections: ["1"],
        level: 1,
      },
      {
        id: "3",
        text: "Routing",
        x: 600,
        y: 200,
        color: "#f97316",
        shape: "circle",
        size: "medium",
        connections: ["1"],
        level: 1,
      },
      {
        id: "4",
        text: "Testing",
        x: 200,
        y: 400,
        color: "#84cc16",
        shape: "circle",
        size: "medium",
        connections: ["1"],
        level: 1,
      },
      {
        id: "5",
        text: "Build Tools",
        x: 600,
        y: 400,
        color: "#ec4899",
        shape: "circle",
        size: "medium",
        connections: ["1"],
        level: 1,
      },
    ],
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-21"),
    tags: ["react", "javascript", "web development"],
    isPublic: false,
    views: 89,
    collaborators: ["user3"],
  },
]

const nodeColors = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#84cc16",
  "#ec4899",
  "#6b7280",
]

export function MindMapping() {
  const [mindMaps, setMindMaps] = useState<MindMap[]>(sampleMindMaps)
  const [selectedMap, setSelectedMap] = useState<MindMap | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState("gallery")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newMapTitle, setNewMapTitle] = useState("")
  const [newMapDescription, setNewMapDescription] = useState("")
  const canvasRef = useRef<HTMLDivElement>(null)

  const createNewMap = () => {
    if (!newMapTitle.trim()) return

    const newMap: MindMap = {
      id: Date.now().toString(),
      title: newMapTitle,
      description: newMapDescription,
      nodes: [
        {
          id: "1",
          text: newMapTitle,
          x: 400,
          y: 300,
          color: nodeColors[0],
          shape: "circle",
          size: "large",
          connections: [],
          level: 0,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      isPublic: false,
      views: 0,
      collaborators: [],
    }

    setMindMaps((prev) => [newMap, ...prev])
    setNewMapTitle("")
    setNewMapDescription("")
    setIsCreateDialogOpen(false)
    setSelectedMap(newMap)
    setActiveTab("editor")
    setIsEditing(true)
  }

  const addNode = (parentId?: string) => {
    if (!selectedMap) return

    const parentNode = parentId ? selectedMap.nodes.find((n) => n.id === parentId) : null
    const newNode: MindMapNode = {
      id: Date.now().toString(),
      text: "New Node",
      x: parentNode ? parentNode.x + 150 : 400,
      y: parentNode ? parentNode.y + 100 : 300,
      color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
      shape: "circle",
      size: "medium",
      connections: parentId ? [parentId] : [],
      level: parentNode ? parentNode.level + 1 : 0,
    }

    const updatedMap = {
      ...selectedMap,
      nodes: [...selectedMap.nodes, newNode],
      updatedAt: new Date(),
    }

    if (parentId && parentNode) {
      updatedMap.nodes = updatedMap.nodes.map((node) =>
        node.id === parentId ? { ...node, connections: [...node.connections, newNode.id] } : node,
      )
    }

    setSelectedMap(updatedMap)
    setMindMaps((prev) => prev.map((map) => (map.id === selectedMap.id ? updatedMap : map)))
  }

  const deleteNode = (nodeId: string) => {
    if (!selectedMap) return

    const updatedNodes = selectedMap.nodes.filter((node) => node.id !== nodeId)
    const updatedMap = {
      ...selectedMap,
      nodes: updatedNodes.map((node) => ({
        ...node,
        connections: node.connections.filter((id) => id !== nodeId),
      })),
      updatedAt: new Date(),
    }

    setSelectedMap(updatedMap)
    setMindMaps((prev) => prev.map((map) => (map.id === selectedMap.id ? updatedMap : map)))
    setSelectedNode(null)
  }

  const updateNode = (nodeId: string, updates: Partial<MindMapNode>) => {
    if (!selectedMap) return

    const updatedMap = {
      ...selectedMap,
      nodes: selectedMap.nodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)),
      updatedAt: new Date(),
    }

    setSelectedMap(updatedMap)
    setMindMaps((prev) => prev.map((map) => (map.id === selectedMap.id ? updatedMap : map)))
  }

  const handleNodeDrag = useCallback(
    (nodeId: string, deltaX: number, deltaY: number) => {
      if (!selectedMap || !isEditing) return

      updateNode(nodeId, {
        x: Math.max(50, Math.min(750, selectedMap.nodes.find((n) => n.id === nodeId)!.x + deltaX)),
        y: Math.max(50, Math.min(550, selectedMap.nodes.find((n) => n.id === nodeId)!.y + deltaY)),
      })
    },
    [selectedMap, isEditing],
  )

  const exportMap = (format: "json" | "png" | "svg") => {
    if (!selectedMap) return

    console.log(`Exporting map as ${format}:`, selectedMap.title)
    // Implementation would depend on the format
  }

  const duplicateMap = (mapId: string) => {
    const mapToDuplicate = mindMaps.find((m) => m.id === mapId)
    if (!mapToDuplicate) return

    const duplicatedMap: MindMap = {
      ...mapToDuplicate,
      id: Date.now().toString(),
      title: `${mapToDuplicate.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    }

    setMindMaps((prev) => [duplicatedMap, ...prev])
  }

  const deleteMap = (mapId: string) => {
    setMindMaps((prev) => prev.filter((map) => map.id !== mapId))
    if (selectedMap?.id === mapId) {
      setSelectedMap(null)
      setActiveTab("gallery")
    }
  }

  if (selectedMap && activeTab === "editor") {
    return (
      <div className="space-y-6">
        {/* Editor Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <GitBranch className="h-5 w-5 text-primary" />
                  <span>{selectedMap.title}</span>
                  {isEditing && <Badge variant="secondary">Editing</Badge>}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{selectedMap.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "View Mode" : "Edit Mode"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("gallery")}>
                  Back to Gallery
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => exportMap("json")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportMap("png")}>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Export PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportMap("svg")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export SVG
                    </DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem>
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Editor Toolbar */}
        {isEditing && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AnimatedButton size="sm" onClick={() => addNode()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Node
                  </AnimatedButton>
                  <Button variant="outline" size="sm" disabled>
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Redo className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedNode && (
                    <>
                      <Select
                        value={selectedNode.color}
                        onValueChange={(color) => updateNode(selectedNode.id, { color })}
                      >
                        <SelectTrigger className="w-24">
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: selectedNode.color }} />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {nodeColors.map((color) => (
                            <SelectItem key={color} value={color}>
                              <div className="flex items-center space-x-2">
                                <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: color }} />
                                <span>{color}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={selectedNode.shape}
                        onValueChange={(shape: "circle" | "square" | "triangle") =>
                          updateNode(selectedNode.id, { shape })
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="circle">
                            <div className="flex items-center space-x-2">
                              <Circle className="h-4 w-4" />
                              <span>Circle</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="square">
                            <div className="flex items-center space-x-2">
                              <Square className="h-4 w-4" />
                              <span>Square</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="triangle">
                            <div className="flex items-center space-x-2">
                              <Triangle className="h-4 w-4" />
                              <span>Triangle</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="destructive" size="sm" onClick={() => deleteNode(selectedNode.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mind Map Canvas */}
        <Card className="flex-1">
          <CardContent className="p-0">
            <div
              ref={canvasRef}
              className="relative w-full h-96 bg-gradient-to-br from-background to-muted/20 overflow-hidden rounded-lg border"
              style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
            >
              {/* Render connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {selectedMap.nodes.map((node) =>
                  node.connections.map((connectionId) => {
                    const connectedNode = selectedMap.nodes.find((n) => n.id === connectionId)
                    if (!connectedNode) return null

                    return (
                      <line
                        key={`${node.id}-${connectionId}`}
                        x1={node.x}
                        y1={node.y}
                        x2={connectedNode.x}
                        y2={connectedNode.y}
                        stroke="#e5e7eb"
                        strokeWidth="2"
                        strokeDasharray={node.level !== connectedNode.level ? "5,5" : "none"}
                      />
                    )
                  }),
                )}
              </svg>

              {/* Render nodes */}
              {selectedMap.nodes.map((node) => (
                <div
                  key={node.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                    selectedNode?.id === node.id ? "ring-2 ring-primary" : ""
                  } ${isEditing ? "hover:scale-110" : ""}`}
                  style={{
                    left: node.x,
                    top: node.y,
                    zIndex: selectedNode?.id === node.id ? 10 : node.level,
                  }}
                  onClick={() => setSelectedNode(node)}
                  onDoubleClick={() => {
                    if (isEditing) {
                      const newText = prompt("Edit node text:", node.text)
                      if (newText) updateNode(node.id, { text: newText })
                    }
                  }}
                >
                  <div
                    className={`flex items-center justify-center text-white font-medium text-sm shadow-lg ${
                      node.shape === "circle" ? "rounded-full" : node.shape === "square" ? "rounded-lg" : "rounded-none"
                    } ${node.size === "small" ? "w-16 h-16" : node.size === "medium" ? "w-20 h-20" : "w-24 h-24"}`}
                    style={{ backgroundColor: node.color }}
                  >
                    <span className="text-center px-2 leading-tight">{node.text}</span>
                  </div>
                  {isEditing && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        addNode(node.id)
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Node Properties Panel */}
        {selectedNode && isEditing && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Node Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Text</label>
                <Input
                  value={selectedNode.text}
                  onChange={(e) => updateNode(selectedNode.id, { text: e.target.value })}
                  placeholder="Node text..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Size</label>
                  <Select
                    value={selectedNode.size}
                    onValueChange={(size: "small" | "medium" | "large") => updateNode(selectedNode.id, { size })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Level</label>
                  <Input
                    type="number"
                    value={selectedNode.level}
                    onChange={(e) => updateNode(selectedNode.id, { level: Number.parseInt(e.target.value) || 0 })}
                    min="0"
                    max="5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gallery">Mind Map Gallery</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="shared">Shared Maps</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <GitBranch className="h-5 w-5 text-primary" />
                    <span>My Mind Maps</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Create and organize your visual thinking maps</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  >
                    {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                  </Button>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <AnimatedButton>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Map
                      </AnimatedButton>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Mind Map</DialogTitle>
                        <DialogDescription>
                          Start with a central topic and build your ideas around it.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
                          <Input
                            value={newMapTitle}
                            onChange={(e) => setNewMapTitle(e.target.value)}
                            placeholder="Enter mind map title..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                          <Textarea
                            value={newMapDescription}
                            onChange={(e) => setNewMapDescription(e.target.value)}
                            placeholder="Brief description of your mind map..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <AnimatedButton onClick={createNewMap} disabled={!newMapTitle.trim()}>
                          Create Map
                        </AnimatedButton>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Mind Maps Grid */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {mindMaps.map((map) => (
              <InteractiveCard key={map.id} className="cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold text-foreground line-clamp-1">
                        {map.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{map.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={map.isPublic ? "default" : "secondary"} className="text-xs">
                          {map.isPublic ? "Public" : "Private"}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{map.views}</span>
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
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMap(map)
                            setActiveTab("editor")
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMap(map)
                            setActiveTab("editor")
                            setIsEditing(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateMap(map.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => exportMap("json")}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <Separator />
                        <DropdownMenuItem className="text-red-600" onClick={() => deleteMap(map.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Mini preview of the mind map */}
                  <div className="relative h-24 bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg mb-3 overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full">
                      {map.nodes.slice(0, 5).map((node, index) => (
                        <circle
                          key={node.id}
                          cx={20 + index * 30}
                          cy={48}
                          r={node.size === "large" ? 8 : node.size === "medium" ? 6 : 4}
                          fill={node.color}
                          opacity={0.8}
                        />
                      ))}
                      {map.nodes.slice(0, 4).map((node, index) => (
                        <line
                          key={`line-${index}`}
                          x1={20 + index * 30}
                          y1={48}
                          x2={50 + index * 30}
                          y2={48}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {map.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {map.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{map.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{map.updatedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitBranch className="h-3 w-3" />
                      <span>{map.nodes.length} nodes</span>
                    </div>
                  </div>
                </CardContent>
              </InteractiveCard>
            ))}
          </div>

          {mindMaps.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No mind maps yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first mind map to start organizing your ideas visually
                </p>
                <AnimatedButton onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Map
                </AnimatedButton>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardContent className="py-12 text-center">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Templates Coming Soon</h3>
              <p className="text-muted-foreground">
                Pre-built mind map templates for common use cases will be available here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared" className="space-y-6">
          <Card>
            <CardContent className="py-12 text-center">
              <Share className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Shared Maps</h3>
              <p className="text-muted-foreground">Mind maps shared with you by collaborators will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
