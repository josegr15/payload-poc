import Link from 'next/link'

export function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-pink-600 rounded-lg group-hover:bg-pink-700 transition-colors duration-200" />
            <span className="text-xl font-bold text-black tracking-tight">
              front
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-black font-medium transition-colors duration-200 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-black font-medium transition-colors duration-200 relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              href="/services" 
              className="text-gray-700 hover:text-black font-medium transition-colors duration-200 relative group"
            >
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-black font-medium transition-colors duration-200 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 group-hover:w-full transition-all duration-300" />
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/get-started" 
              className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-gray-700 hover:text-black transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

