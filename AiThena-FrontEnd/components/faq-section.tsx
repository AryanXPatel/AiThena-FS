import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "Is AiThena really free? What's the catch?",
      answer:
        "Yes, it's 100% free. Our mission is to make powerful learning tools accessible to every student. As we grow, we may introduce optional premium features, but the core toolkit you see today will remain free.",
    },
    {
      question: "Is my data private and secure?",
      answer:
        "Absolutely. We know your study materials are personal. We use industry-standard encryption and will never share or sell your data. Your knowledge base is yours alone.",
    },
    {
      question: "How long does it take to get started?",
      answer:
        "About 30 seconds. Sign up with your email, upload your first document, and you can have your first AI-generated summary or quiz in less than a minute. There's no complex setup.",
    },
  ]

  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Your Questions, Answered</h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
