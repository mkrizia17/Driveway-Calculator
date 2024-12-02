import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RecentPosts } from '@/components/RecentPosts';
import { getRecentPosts } from '@/data/blogPosts';

interface BlogPostLayoutProps {
  children: React.ReactNode;
  currentPath: string;
}

export function BlogPostLayout({ children, currentPath }: BlogPostLayoutProps) {
  const recentPosts = getRecentPosts(currentPath);

  return (
    <div className="min-h-screen bg-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-8 max-w-7xl">
        {/* Main article content */}
        <article className="lg:w-3/4 text-gray-300">
          {children}
        </article>

        {/* Recent posts sidebar */}
        <aside className="lg:w-1/4">
          <div className="sticky top-8">
            <RecentPosts posts={recentPosts} />
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
