"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Github, Twitter, Linkedin, Mail, ArrowRight, Heart, Globe, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubscribed(true)
    setEmail("")
    setIsLoading(false)

    setTimeout(() => setIsSubscribed(false), 3000)
  }

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "AI Study Tools", href: "/dashboard/ai-assistant" },
        { name: "Integrations", href: "/integrations" },
        { name: "Mobile App", href: "/mobile" },
        { name: "Chrome Extension", href: "/extension" },
      ],
    },
    {
      title: "Use Cases",
      links: [
        { name: "Computer Science", href: "/use-cases/computer-science" },
        { name: "Pre-Med", href: "/use-cases/pre-med" },
        { name: "Engineering", href: "/use-cases/engineering" },
        { name: "Business", href: "/use-cases/business" },
        { name: "Liberal Arts", href: "/use-cases/liberal-arts" },
        { name: "Graduate School", href: "/use-cases/graduate" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/docs" },
        { name: "Study Guides", href: "/guides" },
        { name: "Blog", href: "/blog" },
        { name: "Webinars", href: "/webinars" },
        { name: "Success Stories", href: "/success-stories" },
        { name: "Research", href: "/research" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Partners", href: "/partners" },
        { name: "Investors", href: "/investors" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Community", href: "/community" },
        { name: "Status", href: "/status" },
        { name: "Bug Reports", href: "/bugs" },
        { name: "Feature Requests", href: "/features" },
        { name: "API Status", href: "/api-status" },
      ],
    },
  ]

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/aithena", color: "hover:text-blue-400" },
    { name: "GitHub", icon: Github, href: "https://github.com/aithena", color: "hover:text-gray-400" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/aithena", color: "hover:text-blue-600" },
    { name: "Email", icon: Mail, href: "mailto:hello@aithena.ai", color: "hover:text-green-500" },
  ]

  return (
    <footer id="contact" className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(120,120,150,0.03),rgba(10,10,10,0)_70%)] dark:bg-[radial-gradient(circle_at_50%_100%,rgba(200,200,255,0.01),rgba(10,10,10,0)_70%)]" />

      {/* Newsletter Section */}
      <div className="relative border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Stay ahead of the curve</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get the latest study tips, AI insights, and product updates delivered to your inbox. Join 50,000+ students
              who are already learning smarter.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="flex-1 bg-background/50 border-border/50 focus:border-primary/50 shadow-soft dark:shadow-soft-dark"
              />
              <Button
                type="submit"
                className="hover:shadow-soft dark:hover:shadow-soft-dark hover:-translate-y-0.5 transition-all duration-200"
                disabled={isSubscribed || isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Subscribing...
                  </>
                ) : isSubscribed ? (
                  <>
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-4">
              No spam, unsubscribe at any time. Read our{" "}
              <Link href="/privacy" className="underline hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <div className="mb-6">
                <Link href="/">
                  <h3 className="text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                    AiThena
                  </h3>
                </Link>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Your AI-powered study copilot that transforms chaos into clarity. Making learning smarter, not harder.
                </p>

                {/* Trust Indicators */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Shield className="w-3 h-3 mr-2 text-green-500" />
                    SOC 2 Type II Certified
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Globe className="w-3 h-3 mr-2 text-blue-500" />
                    Available in 50+ countries
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Zap className="w-3 h-3 mr-2 text-yellow-500" />
                    99.9% uptime guarantee
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-muted-foreground ${social.color} transition-colors duration-200 hover:scale-110 transform`}
                      aria-label={social.name}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title} className="col-span-1">
                <h4 className="font-semibold text-foreground mb-4 text-sm">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© 2024 AiThena. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Made with ❤️ for students everywhere</span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookies"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Cookie Policy
              </Link>
              <Link
                href="/accessibility"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Accessibility
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-border/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div>
                <h5 className="font-medium text-foreground mb-2 text-sm">🎓 For Students</h5>
                <p className="text-xs text-muted-foreground">
                  Free forever plan available. Student discounts on premium features.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground mb-2 text-sm">🏫 For Institutions</h5>
                <p className="text-xs text-muted-foreground">Campus-wide licenses and custom integrations available.</p>
              </div>
              <div>
                <h5 className="font-medium text-foreground mb-2 text-sm">🌍 Global Impact</h5>
                <p className="text-xs text-muted-foreground">
                  Supporting education equity through AI-powered learning tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
