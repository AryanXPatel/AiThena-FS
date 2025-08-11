"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean
  success?: boolean
  children: React.ReactNode
}

export function AnimatedButton({
  loading = false,
  success = false,
  children,
  className,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = { id: Date.now(), x, y }
    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 600)

    onClick?.(e)
  }

  return (
    <Button
      className={cn(
        "relative overflow-hidden transition-all duration-200 ease-out",
        "hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5",
        "active:translate-y-0 active:shadow-md",
        success && "bg-green-500 hover:bg-green-600",
        className,
      )}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={handleClick}
      disabled={loading}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}

      {/* Button content */}
      <span className={cn("flex items-center space-x-2 transition-opacity duration-200", loading && "opacity-0")}>
        {children}
      </span>

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}

      {/* Success checkmark */}
      {success && !loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-4 w-4 text-white animate-in zoom-in duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </Button>
  )
}
