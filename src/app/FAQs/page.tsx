import { HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const faqItems = [
  {
    question: "What is this service?",
    answer: "The Driveway Calculator is a free online tool that helps homeowners and contractors accurately estimate materials needed for driveway projects. It provides calculations for various materials including gravel, concrete, asphalt, and pavers, helping you plan your project and budget more effectively."
  },
  {
    question: "How do I get started?",
    answer: "Simply select your desired calculator type (gravel, concrete, asphalt, or pavers), enter your driveway dimensions, and specify any additional requirements. Our calculator will instantly provide you with material estimates, helping you plan your project with precision."
  },
  {
    question: "Is there a free trial?",
    answer: "Our driveway calculator is completely free to use! There's no trial period or subscription required. You can use all our calculators and access our educational resources without any cost."
  },
  {
    question: "What payment methods do you accept?",
    answer: "As our service is entirely free, no payment methods are required. We provide all calculations, guides, and resources at no cost to help you plan your driveway project effectively."
  },
  {
    question: "How can I contact support?",
    answer: "For any questions or assistance, you can reach our support team through our contact form on the website, or email us directly at support@drivewaycalculator.com. We typically respond within 24 hours on business days."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-100 flex items-center justify-center gap-2">
            <HelpCircle className="h-8 w-8" />
            Frequently Asked Questions
          </h1>
          <p className="text-gray-300 text-center mb-12">
            Find answers to common questions about our service.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible>
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-700">
                <AccordionTrigger className="flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:text-blue-400 text-gray-100">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>

      <Footer />
    </div>
  );
} 