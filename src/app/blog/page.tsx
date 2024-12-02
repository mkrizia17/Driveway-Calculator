import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

interface BlogPost {
  title: string;
  date: string;
  excerpt: string;
  href: string;
}

const blogPosts: BlogPost[] = [
  {
    title: "Understanding Different Types of Gravel for Your Driveway",
    date: "March 15, 2024",
    excerpt: "Learn about the various types of gravel available for driveways and which one might be best for your project...",
    href: "/blog/posts/gravel-types"
  },
  {
    title: "How to Properly Install Pavers: A Step-by-Step Guide",
    date: "March 10, 2024",
    excerpt: "Discover the essential steps and best practices for installing pavers to ensure a beautiful and lasting result...",
    href: "/blog/posts/paver-installation"
  },
  {
    title: "Comparing Concrete vs Asphalt Driveways",
    date: "March 5, 2024",
    excerpt: "An in-depth comparison of concrete and asphalt driveways, including costs, durability, and maintenance requirements...",
    href: "/blog/posts/concrete-vs-asphalt"
  }
];

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800" style={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78, sans-serif' }}>
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-16">
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
                <Link href={post.href} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Read More →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
} 