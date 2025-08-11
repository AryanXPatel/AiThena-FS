import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ProductShowcase } from "@/components/product-showcase"
import { MidPageCTA } from "@/components/mid-page-cta"
import { FAQSection } from "@/components/faq-section"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <ProductShowcase />
        <MidPageCTA />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
