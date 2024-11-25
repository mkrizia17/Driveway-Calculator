import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { CalculatorIcon, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

interface BlogPost {
  title: string;
  date: string;
  excerpt: string;
}

const blogPosts: BlogPost[] = [
  {
    title: "Understanding Different Types of Gravel for Your Driveway",
    date: "March 15, 2024",
    excerpt: "Learn about the various types of gravel available for driveways and which one might be best for your project..."
  },
  {
    title: "How to Properly Install Pavers: A Step-by-Step Guide",
    date: "March 10, 2024",
    excerpt: "Discover the essential steps and best practices for installing pavers to ensure a beautiful and lasting result..."
  },
  {
    title: "Comparing Concrete vs Asphalt Driveways",
    date: "March 5, 2024",
    excerpt: "An in-depth comparison of concrete and asphalt driveways, including costs, durability, and maintenance requirements..."
  },
  {
    title: "Understanding Different Types of Gravel for Your Driveway",
    date: "March 15, 2024",
    excerpt: "Learn about the various types of gravel available for driveways and which one might be best for your project..."
  },
  {
    title: "How to Properly Install Pavers: A Step-by-Step Guide",
    date: "March 10, 2024",
    excerpt: "Discover the essential steps and best practices for installing pavers to ensure a beautiful and lasting result..."
  },
  {
    title: "Comparing Concrete vs Asphalt Driveways",
    date: "March 5, 2024",
    excerpt: "An in-depth comparison of concrete and asphalt driveways, including costs, durability, and maintenance requirements..."
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/" 
            className="text-gray-100 hover:text-blue-400 transition-colors flex items-center gap-3 text-3xl font-bold"
          >
            <CalculatorIcon className="w-8 h-8" />
            Driveway Calculator
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-100">
          Our Latest Articles
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gray-700 border-gray-600">
              <CardContent className="p-6">
                <p className="text-sm text-blue-400 mb-3">{post.date}</p>
                <h2 className="text-2xl font-semibold text-gray-100 mb-4 hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-300 mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <button className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Read More →
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer Section */}
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
                <li><Link href="/gravel-calculator" className="hover:text-blue-400 transition-colors">Gravel Calculator</Link></li>
                <li><Link href="/concrete-calculator" className="hover:text-blue-400 transition-colors">Concrete Calculator</Link></li>
                <li><Link href="/asphalt-calculator" className="hover:text-blue-400 transition-colors">Asphalt Calculator</Link></li>
                <li><Link href="/paver-calculator" className="hover:text-blue-400 transition-colors">Paver Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
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
    </div>
  );
} 