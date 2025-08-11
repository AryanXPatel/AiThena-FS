"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"

interface FloatingActionButtonProps {
  onClick?: () => void
  icon?: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
}

export function FloatingActionButton({
  onClick,
  icon = <Plus className="h-6 w-6" />,
  className,
  size = "md",
}: FloatingActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-14 w-14",
    lg: "h-16 w-16",
  }

  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 rounded-full shadow-lg transition-all duration-300 ease-out z-50",
        "hover:shadow-2xl hover:shadow-primary/25 hover:scale-110",
        "active:scale-95",
        sizeClasses[size],
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("transition-transform duration-200", isHovered && "rotate-45")}>{icon}</div>
    </Button>
  )
}
