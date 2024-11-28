import Link from 'next/link';

export function Header() {
  return (
    <div className="bg-gray-900 border-b border-gray-700 h-20 flex items-center" style={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78, sans-serif' }}>
      <div className="container mx-auto px-4 flex items-center justify-center">
        <Link 
          href="/" 
          className="text-gray-100 hover:text-blue-400 transition-colors mx-8 text-gl uppercase"
        >
          HOME
        </Link>
        <Link 
          href="/gravel-calculator" 
          className="text-gray-100 hover:text-blue-400 transition-colors mx-8 text-gl uppercase"
        >
          GRAVEL
        </Link>
        <Link 
          href="/concrete-calculator" 
          className="text-gray-100 hover:text-blue-400 transition-colors mx-8 text-gl uppercase"
        >
          CONCRETE
        </Link>
        <Link 
          href="/asphalt-calculator" 
          className="text-gray-100 hover:text-blue-400 transition-colors mx-8 text-gl uppercase"
        >
          ASPHALT
        </Link>
        <Link 
          href="/paver-calculator" 
          className="text-gray-100 hover:text-blue-400 transition-colors mx-8 text-gl uppercase"
        >
          PAVER
        </Link>
      </div>
    </div>
  );
} 