import Link from 'next/link';
import { CalculatorIcon } from 'lucide-react';

export function Header() {
  return (
    <div className="bg-gray-900 border-b border-gray-700 h-20 flex items-center" style={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78, sans-serif' }}>
      <div className="container mx-auto px-4">
        <Link 
          href="/" 
          className="text-gray-100 hover:text-blue-400 transition-colors flex items-center gap-3 text-3xl font-bold"
        >
          <CalculatorIcon className="w-8 h-8" />
          Driveway Calculator
        </Link>
      </div>
    </div>
  );
} 