import type React from "react"

import { ArrowLeft, Settings, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ToolLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  actions?: React.ReactNode
}

export function ToolLayout({ children, title, description, icon: Icon, badge, actions }: ToolLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                {badge && (
                  <Badge variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {actions}
          <Button variant="outline" size="sm" className="bg-transparent">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[calc(100vh-12rem)]">{children}</div>
    </div>
  )
}
