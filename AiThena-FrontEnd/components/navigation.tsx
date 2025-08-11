"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleAuthClick = async (path: string) => {
    setIsLoading(true)
    // Simulate loading state
    await new Promise((resolve) => setTimeout(resolve, 300))
    window.location.href = path
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-soft dark:shadow-soft-dark">
      {/* Inner border effect */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">AiThena</h1>
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleAuthClick("/auth/login")}
              disabled={isLoading}
              className="bg-transparent"
            >
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Sign In
            </Button>

            <Button
              onClick={() => handleAuthClick("/auth/signup")}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Get Started
            </Button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
              >
                Contact
              </a>
              <div className="pt-4 pb-3 border-t border-border">
                <div className="flex items-center px-3 space-x-3">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => handleAuthClick("/auth/login")}
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                    Sign In
                  </Button>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => handleAuthClick("/auth/signup")}
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
