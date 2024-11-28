import Link from 'next/link';

export function Header() {
  return (
    <div className="bg-gray-900 border-b border-gray-700 flex items-center justify-center" style={{ height: '60px' }}>
      <div className="container mx-auto flex items-center justify-center h-full">
        <Link 
          href="/" 
          className="text-gray-100 hover:text-blue-400 transition-colors font-bold mx-12 uppercase text-base" 
        >
          HOME
        </Link>
        <Link 
          href="/gravel-calculator" 
          className="text-gray-100 hover:text-blue-400 transition-colors font-bold mx-12 uppercase text-base" 
        >
          GRAVEL
        </Link>
        <Link 
          href="/concrete-calculator" 
          className="text-gray-100 hover:text-blue-400 transition-colors font-bold mx-12 uppercase text-base" 
        >
          CONCRETE
        </Link>
        <Link 
          href="/asphalt-calculator" 
          className="text-gray-100 hover:text-blue-400 transition-colors font-bold mx-12 uppercase text-base" 
        >
          ASPHALT
        </Link>
        <Link 
          href="/paver-calculator" 
          className="text-gray-100 hover:text-blue-400 transition-colors font-bold mx-12 uppercase text-base" 
        >
          PAVER
        </Link>
      </div>
    </div>
  );
} 