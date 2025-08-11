"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface InteractiveCardProps {
  children: React.ReactNode
  className?: string
  hoverScale?: boolean
  glowOnHover?: boolean
  pressEffect?: boolean
  onClick?: () => void
}

export function InteractiveCard({
  children,
  className,
  hoverScale = true,
  glowOnHover = true,
  pressEffect = true,
  onClick,
}: InteractiveCardProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 ease-out",
        hoverScale && "hover:scale-[1.02]",
        glowOnHover && "hover:shadow-2xl hover:shadow-primary/10",
        pressEffect && isPressed && "scale-[0.98]",
        onClick && "cursor-pointer",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
    >
      {/* Inner border glow */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

      {/* Hover gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 rounded-2xl",
          isHovered && "opacity-100",
        )}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
