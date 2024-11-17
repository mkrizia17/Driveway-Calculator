'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalculatorIcon, DollarSignIcon, TruckIcon, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero-driveway.jpg-JEa1BKUj9Gsp8ZxiApTdyULbn6sDU5.jpeg"
          alt="Beautiful residential property with a curved concrete driveway surrounded by manicured lawn and landscaping"
          fill
          style={{ objectFit: "cover", objectPosition: "center bottom" }}
          className="absolute inset-0"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-200 text-transparent bg-clip-text">
            Driveway Cost Calculator
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Estimate costs for gravel, concrete, asphalt, and paver driveways with precision
          </p>
        
        </div>
      </section>

      {/* Calculator Section */}
      <div className="container mx-auto py-12">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-200">
          Find Your Calculator
        </h2>
        
        <div className="flex justify-center space-x-8">
          <div className="rounded-xl border text-card-foreground shadow bg-gray-700 border-gray-600">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="relative w-[300px] h-[300px] mx-auto mb-4 overflow-hidden rounded-lg">
                <Image
                  src="/images/gravel.jpg"
                  alt="Gravel driveway"
                  fill
                  className="rounded-lg object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <Link 
                href="/gravel" 
                className="font-semibold tracking-tight text-3xl text-center text-blue-200"
              >
                Gravel
              </Link>
            </div>
            <div className="p-6 pt-0">
              <p className="text-gray-300 text-center text-base">Loose stone material, ideal for rustic and cost-effective driveways</p>
            </div>
          </div>

          <div className="rounded-xl border text-card-foreground shadow bg-gray-700 border-gray-600">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="relative w-[300px] h-[300px] mx-auto mb-4 overflow-hidden rounded-lg">
                <Image
                  src="/images/concrete.jpg"
                  alt="Concrete driveway"
                  fill
                  className="rounded-lg object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <Link 
                href="/concrete" 
                className="font-semibold tracking-tight text-3xl text-center text-blue-200"
              >
                Concrete
              </Link>
            </div>
            <div className="p-6 pt-0">
              <p className="text-gray-300 text-center text-base">Durable, low-maintenance material for long-lasting driveways</p>
            </div>
          </div>

          <div className="rounded-xl border text-card-foreground shadow bg-gray-700 border-gray-600">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="relative w-[300px] h-[300px] mx-auto mb-4 overflow-hidden rounded-lg">
                <Image
                  src="/images/asphalt.jpg"
                  alt="Asphalt driveway"
                  fill
                  className="rounded-lg object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <Link 
                href="/asphalt" 
                className="font-semibold tracking-tight text-3xl text-center text-blue-200"
              >
                Asphalt
              </Link>
            </div>
            <div className="p-6 pt-0">
              <p className="text-gray-300 text-center text-base">Smooth, weather-resistant surface for professional-looking driveways</p>
            </div>
          </div>

          <div className="rounded-xl border text-card-foreground shadow bg-gray-700 border-gray-600">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="relative w-[300px] h-[300px] mx-auto mb-4 overflow-hidden rounded-lg">
                <Image
                  src="/images/pavers.jpg"
                  alt="Paver driveway"
                  fill
                  className="rounded-lg object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <Link 
                href="/pavers" 
                className="font-semibold tracking-tight text-3xl text-center text-blue-200"
              >
                Pavers
              </Link>
            </div>
            <div className="p-6 pt-0">
              <p className="text-gray-300 text-center text-base">Decorative blocks for customizable, elegant driveway designs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-200">Why Use Our Driveway Calculator?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CalculatorIcon className="w-12 h-12 text-blue-400 mb-2 mx-auto" />
                <CardTitle className="text-xl text-center text-blue-200">Accurate Estimates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-center">Get precise cost calculations for various driveway materials, including gravel, concrete, and more.</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <DollarSignIcon className="w-12 h-12 text-blue-400 mb-2 mx-auto" />
                <CardTitle className="text-xl text-center text-blue-200">Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-center">See detailed breakdowns of material costs, labor expenses, and additional fees for your project.</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <TruckIcon className="w-12 h-12 text-blue-400 mb-2 mx-auto" />
                <CardTitle className="text-xl text-center text-blue-200">Material Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-center">Calculate exact quantities of materials needed, helping you avoid over-ordering or shortages.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-400 text-center">
                Benefits of Our Driveway Cost Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Precise estimates for gravel, concrete, asphalt, and paver driveways</li>
                <li>Calculate costs for various driveway types, including stamped concrete</li>
                <li>Get accurate material quantities to avoid over-ordering</li>
                <li>Compare costs between different driveway options</li>
                <li>Customizable options for your specific project needs</li>
                <li>Up-to-date pricing based on current market rates</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-400">
            Ready to Plan Your Driveway Project?
          </h2>
          <p className="text-xl mb-8 text-gray-300">Choose your driveway material and get started with your free estimate now.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <Link href="/gravel">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white w-full">Gravel Calculator</Button>
            </Link>
            <Link href="/concrete">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white w-full">Concrete Calculator</Button>
            </Link>
            <Link href="/asphalt">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white w-full">Asphalt Calculator</Button>
            </Link>
            <Link href="/pavers">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white w-full">Pavers Calculator</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Driveway Calculator</h3>
              <p className="text-sm">Helping you estimate and plan your perfect driveway project with precision and ease.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/gravel" className="hover:text-blue-400 transition-colors">Gravel Calculator</Link></li>
                <li><Link href="/concrete" className="hover:text-blue-400 transition-colors">Concrete Calculator</Link></li>
                <li><Link href="/asphalt" className="hover:text-blue-400 transition-colors">Asphalt Calculator</Link></li>
                <li><Link href="/pavers" className="hover:text-blue-400 transition-colors">Pavers Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <Twitter size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <Instagram size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} Driveway Calculator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}