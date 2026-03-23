export default function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-[#F1F5F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <nav className="flex flex-col md:flex-row justify-center items-center gap-y-6 md:gap-y-4 md:gap-x-8 mb-8">
            <a
              href="/path"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Learning Path
            </a>
            <a
              href="/community"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Community
            </a>
            <a
              href="/about"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              About Us
            </a>
            <a
              href="/contact"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </a>
          </nav>
          <p className="text-gray-400 text-sm">© 2026 Codaptive</p>
        </div>
      </div>
    </footer>
  );
}
