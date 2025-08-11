"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AnimatedButton } from "@/components/ui/animated-button"
import { InteractiveCard } from "@/components/ui/interactive-card"
import { StatusIndicator } from "@/components/ui/status-indicator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  BookOpen,
  Brain,
  Target,
  BarChart3,
  Settings,
  HelpCircle,
  User,
  LogOut,
  Bell,
  Search,
  Plus,
  FileText,
  MessageSquare,
  Calendar,
  Database,
  Video,
  GitBranch,
  PenTool,
  Globe,
  Code,
  Cpu,
  Clock,
  DollarSign,
  Briefcase,
  Zap,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { cn } from "@/lib/utils"

const navigation = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", icon: Home, href: "/dashboard", isActive: true },
      { title: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    ],
  },
  {
    title: "AI Tools",
    items: [
      { title: "AI Study Assistant", icon: Brain, href: "/dashboard/ai-assistant" },
      { title: "Document Intelligence", icon: FileText, href: "/dashboard/document-intelligence" },
      { title: "Research Assistant", icon: Search, href: "/dashboard/research-assistant" },
      { title: "AI Debate Arena", icon: MessageSquare, href: "/dashboard/debate-arena" },
    ],
  },
  {
    title: "Study Tools",
    items: [
      { title: "Smart Quiz Generator", icon: Target, href: "/dashboard/quiz-generator" },
      { title: "Flashcard Studio", icon: BookOpen, href: "/dashboard/flashcard-studio" },
      { title: "Study Planner", icon: Calendar, href: "/dashboard/study-planner" },
      { title: "Knowledge Base", icon: Database, href: "/dashboard/knowledge-base" },
    ],
  },
  {
    title: "Learning Tools",
    items: [
      { title: "YouTube Extractor", icon: Video, href: "/dashboard/youtube-extractor" },
      { title: "Mind Mapping", icon: GitBranch, href: "/dashboard/mind-mapping" },
      { title: "Essay Writing", icon: PenTool, href: "/dashboard/essay-writing" },
      { title: "Language Learning", icon: Globe, href: "/dashboard/language-learning" },
    ],
  },
  {
    title: "Specialized",
    items: [
      { title: "Code Master", icon: Code, href: "/dashboard/code-master" },
      { title: "DSA Guru", icon: Cpu, href: "/dashboard/dsa-guru" },
      { title: "History Timeline", icon: Clock, href: "/dashboard/history-timeline" },
      { title: "Financial Literacy", icon: DollarSign, href: "/dashboard/financial-literacy" },
    ],
  },
  {
    title: "Settings",
    items: [
      { title: "Preferences", icon: Settings, href: "/dashboard/settings" },
      { title: "Help & Support", icon: HelpCircle, href: "/dashboard/help" },
    ],
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isNavigating, setIsNavigating] = useState(false)
  const [activeItem, setActiveItem] = useState("/dashboard")
  const [notifications] = useState(2)

  // Simulate initial loading with staggered animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleNavigation = async (href: string) => {
    if (href === activeItem) return

    setIsNavigating(true)
    setActiveItem(href)

    // Simulate navigation loading with realistic timing
    await new Promise((resolve) => setTimeout(resolve, 300))
    window.location.href = href
  }

  const handleLogout = async () => {
    setIsNavigating(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    window.location.href = "/"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex w-full bg-background">
        {/* Animated loading skeleton */}
        <div className="w-64 border-r border-border/50 p-4 animate-in slide-in-from-left duration-500">
          <div className="border-b border-border/50 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg animate-pulse" />
              <div>
                <div className="h-4 w-16 bg-muted rounded animate-pulse mb-1" />
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="h-3 w-16 bg-muted rounded animate-pulse mb-2" />
                <div className="space-y-1">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-8 w-full bg-muted/50 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 animate-in slide-in-from-right duration-500">
          <div className="h-16 border-b border-border/50 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <div className="h-6 w-6 bg-muted rounded animate-pulse" />
              <div className="h-10 w-64 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-24 bg-muted rounded animate-pulse" />
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
            </div>
          </div>

          <div className="p-6">
            <DashboardSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Enhanced Sidebar */}
        <Sidebar className="border-r border-border/50 backdrop-blur-sm">
          <SidebarHeader className="border-b border-border/50 p-4">
            <InteractiveCard className="p-0 border-0 bg-transparent">
              <div className="flex items-center space-x-3 p-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-bold text-sm">A</span>
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">AiThena</h2>
                  <p className="text-xs text-muted-foreground">Study Dashboard</p>
                </div>
              </div>
            </InteractiveCard>
          </SidebarHeader>

          <SidebarContent className="p-4">
            {navigation.map((section, sectionIndex) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center space-x-2">
                  <span>{section.title}</span>
                  {section.title === "AI Tools" && <Zap className="h-3 w-3 text-primary" />}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item, itemIndex) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={activeItem === item.href}
                          className="w-full justify-start transition-all duration-200 ease-out"
                        >
                          <button
                            onClick={() => handleNavigation(item.href)}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left group relative overflow-hidden",
                              "hover:bg-muted/50 hover:shadow-sm hover:scale-[1.02]",
                              "active:scale-[0.98]",
                              activeItem === item.href && "bg-primary/10 text-primary shadow-sm",
                            )}
                            disabled={isNavigating}
                            style={{ animationDelay: `${sectionIndex * 100 + itemIndex * 50}ms` }}
                          >
                            {/* Active indicator */}
                            {activeItem === item.href && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full animate-in slide-in-from-left duration-200" />
                            )}

                            {isNavigating && activeItem === item.href ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <item.icon
                                className={cn(
                                  "h-4 w-4 transition-colors duration-200",
                                  activeItem === item.href
                                    ? "text-primary"
                                    : "text-muted-foreground group-hover:text-foreground",
                                )}
                              />
                            )}
                            <span
                              className={cn(
                                "text-sm font-medium transition-colors duration-200",
                                activeItem === item.href ? "text-primary" : "text-foreground",
                              )}
                            >
                              {item.title}
                            </span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="border-t border-border/50 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InteractiveCard className="p-0 border-0 bg-transparent cursor-pointer">
                  <div className="flex items-center space-x-3 p-2">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <StatusIndicator status="online" size="sm" className="absolute -bottom-0.5 -right-0.5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">John Doe</p>
                      <p className="text-xs text-muted-foreground">john@university.edu</p>
                    </div>
                  </div>
                </InteractiveCard>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-bottom-2 duration-200">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation("/dashboard/profile")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/dashboard/settings")} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        {/* Enhanced Main Content */}
        <SidebarInset className="flex-1">
          {/* Enhanced Top Navigation */}
          <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-muted/50 transition-colors duration-200" />

                {/* Enhanced Search */}
                <div className="relative w-64 group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
                  <Input
                    placeholder="Search documents, notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-muted/30 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200 focus:shadow-sm"
                    disabled={isNavigating}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex bg-transparent hover:bg-muted/50"
                  disabled={isNavigating}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Document
                </AnimatedButton>

                <div className="relative">
                  <AnimatedButton
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-muted/50"
                    disabled={isNavigating}
                  >
                    <Bell className="h-4 w-4" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full text-xs flex items-center justify-center text-primary-foreground animate-in zoom-in duration-200">
                        {notifications}
                      </span>
                    )}
                  </AnimatedButton>
                </div>

                <div className="relative">
                  <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all duration-200">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <StatusIndicator status="online" size="sm" className="absolute -bottom-0.5 -right-0.5" />
                </div>
              </div>
            </div>
          </header>

          {/* Enhanced Page Content */}
          <main className="flex-1 p-6">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {isNavigating ? <DashboardSkeleton /> : children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
