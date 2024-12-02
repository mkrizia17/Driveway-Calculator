"use client";

import { Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useForm, ValidationError } from '@formspree/react';

export default function ContactPage() {
  const [state, handleSubmit] = useForm("xnnqlvbz");

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-100">
            Contact Us
          </h1>
          <p className="text-gray-300 text-center mb-12">
            Have questions? We'd love to hear from you.
          </p>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              {state.succeeded ? (
                <div className="text-green-400 text-center py-8">
                  <p className="text-xl font-semibold">Thanks for reaching out!</p>
                  <p className="mt-2">We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                      Name
                    </label>
                    <Input 
                      id="name"
                      name="name"
                      className="bg-gray-700 border-gray-600 text-gray-100"
                      placeholder="Your name"
                      required
                    />
                    <ValidationError prefix="Name" field="name" errors={state.errors} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                      Email
                    </label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      className="bg-gray-700 border-gray-600 text-gray-100"
                      placeholder="your@email.com"
                      required
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                      Message
                    </label>
                    <Textarea 
                      id="message"
                      name="message"
                      className="bg-gray-700 border-gray-600 text-gray-100 min-h-[150px]"
                      placeholder="How can we help you?"
                      required
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors} />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={state.submitting}
                  >
                    {state.submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-100 mb-4">
                  Get in Touch
                </h2>
                <p className="text-gray-300">
                  Have questions about our calculators or need assistance with your project? 
                  Our team is here to help.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span>support@calcmydrive.com</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-100 mb-4">
                  Business Hours
                </h2>
                <div className="space-y-2 text-gray-300">
                  <p>Monday - Sunday: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 