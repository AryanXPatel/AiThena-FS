"use client"

import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "online" | "offline" | "busy" | "away"
  size?: "sm" | "md" | "lg"
  animated?: boolean
  className?: string
}

export function StatusIndicator({ status, size = "md", animated = true, className }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  }

  const statusClasses = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-red-500",
    away: "bg-yellow-500",
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "rounded-full",
          sizeClasses[size],
          statusClasses[status],
          animated && status === "online" && "animate-pulse",
        )}
      />
      {animated && status === "online" && (
        <div
          className={cn(
            "absolute inset-0 rounded-full animate-ping",
            sizeClasses[size],
            statusClasses[status],
            "opacity-75",
          )}
        />
      )}
    </div>
  )
}
