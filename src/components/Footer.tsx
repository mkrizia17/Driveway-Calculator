import Link from 'next/link';
import '../app/globals.css';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-700 mt-auto" style={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78, sans-serif' }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="text-left">
            <h3 className="text-lg font-semibold text-blue-400">Driveway Calculator</h3>
            <p className="text-lg max-w-xs">Helping you estimate and plan your perfect driveway project with precision and ease.</p>
          </div>
          <div className="text-left">
            <h4 className="text-lg font-semibold text-blue-400">Quick Links</h4>
            <ul className="space-y-2 text-left m-0 p-0">
              <li><Link href="/gravel-calculator" className="hover:text-blue-400 transition-colors">Gravel Calculator</Link></li>
              <li><Link href="/concrete-calculator" className="hover:text-blue-400 transition-colors">Concrete Calculator</Link></li>
              <li><Link href="/asphalt-calculator" className="hover:text-blue-400 transition-colors">Asphalt Calculator</Link></li>
            </ul>
          </div>
          <div className="text-left">
            <h4 className="text-lg font-semibold text-blue-400">Resources</h4>
            <ul className="space-y-2 text-left m-0 p-0">
              <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link href="/FAQs" className="hover:text-blue-400 transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-left">
          <p className="text-sm">&copy; {new Date().getFullYear()} Driveway Calculator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 