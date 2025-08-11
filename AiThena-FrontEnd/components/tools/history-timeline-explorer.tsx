"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Clock,
  Calendar,
  Globe,
  BookOpen,
  Search,
  Filter,
  Play,
  Eye,
  Share2,
  Download,
  Plus,
  MapPin,
  Brain,
  Star,
  TrendingUp,
  Award,
} from "lucide-react"

const historicalPeriods = [
  {
    id: 1,
    name: "Ancient Civilizations",
    timeRange: "3500 BCE - 500 CE",
    icon: "🏛️",
    color: "bg-amber-500",
    events: 127,
    regions: ["Mesopotamia", "Egypt", "Greece", "Rome"],
    keyEvents: ["Rise of Sumerian Cities", "Egyptian Pyramids", "Greek Democracy", "Roman Empire"],
  },
  {
    id: 2,
    name: "Medieval Period",
    timeRange: "500 - 1500 CE",
    icon: "🏰",
    color: "bg-purple-500",
    events: 89,
    regions: ["Europe", "Middle East", "Asia"],
    keyEvents: ["Fall of Rome", "Islamic Golden Age", "Crusades", "Black Death"],
  },
  {
    id: 3,
    name: "Renaissance & Exploration",
    timeRange: "1400 - 1600 CE",
    icon: "🎨",
    color: "bg-blue-500",
    events: 156,
    regions: ["Europe", "Americas", "Africa"],
    keyEvents: ["Renaissance Art", "Age of Exploration", "Protestant Reformation", "Scientific Revolution"],
  },
  {
    id: 4,
    name: "Industrial Revolution",
    timeRange: "1760 - 1840 CE",
    icon: "⚙️",
    color: "bg-gray-500",
    events: 203,
    regions: ["Britain", "Europe", "North America"],
    keyEvents: ["Steam Engine", "Factory System", "Railroad Expansion", "Urbanization"],
  },
  {
    id: 5,
    name: "Modern Era",
    timeRange: "1900 - Present",
    icon: "🌍",
    color: "bg-green-500",
    events: 445,
    regions: ["Global"],
    keyEvents: ["World Wars", "Cold War", "Space Age", "Digital Revolution"],
  },
]

const featuredTimelines = [
  {
    id: 1,
    title: "World War II Timeline",
    period: "1939-1945",
    events: 67,
    views: 12500,
    rating: 4.8,
    author: "Dr. Sarah Johnson",
    description: "Comprehensive timeline of WWII events, battles, and key decisions",
    tags: ["War", "Politics", "Military"],
    featured: true,
  },
  {
    id: 2,
    title: "Ancient Egyptian Dynasties",
    period: "3100-30 BCE",
    events: 89,
    views: 8900,
    rating: 4.6,
    author: "Prof. Ahmed Hassan",
    description: "Complete chronology of Egyptian pharaohs and major achievements",
    tags: ["Ancient", "Egypt", "Pharaohs"],
    featured: false,
  },
  {
    id: 3,
    title: "Scientific Revolution",
    period: "1543-1687",
    events: 45,
    views: 6700,
    rating: 4.9,
    author: "Dr. Maria Rodriguez",
    description: "Key discoveries and scientists that changed our understanding of the world",
    tags: ["Science", "Discovery", "Renaissance"],
    featured: true,
  },
]

const recentActivity = [
  {
    id: 1,
    action: "Studied",
    timeline: "American Civil War",
    time: "2 hours ago",
    progress: 78,
    icon: BookOpen,
  },
  {
    id: 2,
    action: "Created",
    timeline: "French Revolution Events",
    time: "1 day ago",
    progress: 100,
    icon: Plus,
  },
  {
    id: 3,
    action: "Explored",
    timeline: "Renaissance Art Movement",
    time: "3 days ago",
    progress: 45,
    icon: Eye,
  },
]

export function HistoryTimelineExplorer() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState<any>(null)
  const [timelineMode, setTimelineMode] = useState(false)

  const handleExploreTimeline = (timeline: any) => {
    setTimelineMode(true)
  }

  if (timelineMode) {
    return (
      <div className="space-y-6">
        {/* Timeline Header */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">World War II Timeline</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>1939-1945</span>
                  <span>•</span>
                  <span>67 events</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    <span>4.8</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="bg-transparent">
                <Brain className="h-4 w-4 mr-2" />
                AI Insights
              </Button>
              <Button variant="outline" size="sm" onClick={() => setTimelineMode(false)} className="bg-transparent">
                Back to Explorer
              </Button>
            </div>
          </div>
        </div>

        {/* Interactive Timeline */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

          <div className="relative z-10 p-6">
            {/* Timeline Controls */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  1939
                </Button>
                <div className="w-64 h-2 bg-muted/30 rounded-full relative">
                  <div className="absolute left-0 top-0 w-1/3 h-full bg-primary rounded-full" />
                  <div className="absolute left-1/3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  1945
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Play className="h-4 w-4 mr-2" />
                  Auto Play
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Timeline Events */}
            <div className="space-y-8">
              {[
                {
                  date: "September 1, 1939",
                  title: "Germany Invades Poland",
                  description:
                    "Nazi Germany launches Operation Fall Weiss, marking the beginning of World War II in Europe.",
                  location: "Poland",
                  significance: "High",
                  type: "Military",
                },
                {
                  date: "December 7, 1941",
                  title: "Attack on Pearl Harbor",
                  description:
                    "Japanese forces launch a surprise attack on the US naval base at Pearl Harbor, bringing America into the war.",
                  location: "Hawaii, USA",
                  significance: "Critical",
                  type: "Military",
                },
                {
                  date: "June 6, 1944",
                  title: "D-Day Normandy Landings",
                  description: "Allied forces launch Operation Overlord, the largest seaborne invasion in history.",
                  location: "Normandy, France",
                  significance: "Critical",
                  type: "Military",
                },
              ].map((event, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-primary rounded-full border-2 border-background" />
                    {index < 2 && <div className="w-0.5 h-16 bg-border/50 mt-2" />}
                  </div>

                  <div className="flex-1 pb-8">
                    <div className="bg-muted/30 rounded-xl p-6 hover:bg-muted/50 transition-colors duration-200 cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{event.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="font-medium">{event.date}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                            <span>•</span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                event.significance === "Critical"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                              }`}
                            >
                              {event.significance}
                            </Badge>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{event.description}</p>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          Learn More
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Brain className="h-4 w-4 mr-2" />
                          AI Analysis
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-muted/30">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="periods">Time Periods</TabsTrigger>
          <TabsTrigger value="timelines">Timelines</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Timelines Studied", value: "23", icon: BookOpen, color: "text-blue-500" },
              { label: "Historical Events", value: "1,247", icon: Clock, color: "text-green-500" },
              { label: "Time Periods", value: "12", icon: Calendar, color: "text-purple-500" },
              { label: "Knowledge Score", value: "847", icon: Award, color: "text-yellow-500" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Featured Timelines */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Featured Timelines</h3>
                    <p className="text-sm text-muted-foreground">Popular and highly-rated historical timelines</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  View All
                </Button>
              </div>

              <div className="grid gap-4">
                {featuredTimelines.map((timeline) => (
                  <div
                    key={timeline.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors duration-200 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                            {timeline.title}
                          </h4>
                          {timeline.featured && (
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <span>{timeline.period}</span>
                          <span>•</span>
                          <span>{timeline.events} events</span>
                          <span>•</span>
                          <span>{timeline.views.toLocaleString()} views</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            <span>{timeline.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{timeline.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {timeline.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleExploreTimeline(timeline)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Explore
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Recent Activity</h3>
                  <p className="text-sm text-muted-foreground">Your latest timeline interactions</p>
                </div>
              </div>

              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action} <span className="text-primary">{activity.timeline}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    {activity.progress < 100 && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">{activity.progress}%</p>
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${activity.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="periods" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historicalPeriods.map((period) => (
              <div
                key={period.id}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-3xl">{period.icon}</div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                        {period.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{period.timeRange}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <p>{period.events} historical events</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2 text-sm">Key Regions</h4>
                      <div className="flex flex-wrap gap-1">
                        {period.regions.map((region, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2 text-sm">Key Events</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {period.keyEvents.map((event, index) => (
                          <li key={index}>• {event}</li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Globe className="h-4 w-4 mr-2" />
                      Explore Period
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timelines" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search timelines..."
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
                {featuredTimelines.length} timelines
              </Badge>
            </div>
          </div>

          {/* Timelines Grid */}
          <div className="grid gap-6">
            {featuredTimelines.map((timeline) => (
              <div
                key={timeline.id}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                            {timeline.title}
                          </h3>
                          {timeline.featured && (
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <span>{timeline.period}</span>
                          <span>•</span>
                          <span>{timeline.events} events</span>
                          <span>•</span>
                          <span>By {timeline.author}</span>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{timeline.description}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {timeline.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{timeline.views.toLocaleString()} views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            <span>{timeline.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button onClick={() => handleExploreTimeline(timeline)} className="bg-primary hover:bg-primary/90">
                      <Eye className="h-4 w-4 mr-2" />
                      Explore Timeline
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Brain className="h-4 w-4 mr-2" />
                      AI Analysis
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <div className="text-center py-12">
            <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Create Timeline</h3>
            <p className="text-muted-foreground mb-6">
              Build custom historical timelines with AI assistance and interactive features.
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
