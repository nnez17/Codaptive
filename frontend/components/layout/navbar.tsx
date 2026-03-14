export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-8 h-16 flex items-center justify-between font-sans">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <img src="public/icon.png" alt="Logo" width={24} height={24} />
        <span className="text-[17px] font-semibold text-gray-900 tracking-tight">
          Codaptive
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {["Path", "Community"].map((link) => (
          <a
            key={link}
            href="#"
            className="text-sm text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
          >
            {link}
          </a>
        ))}

        <button
          type="button"
          className="text-sm font-medium text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl px-5 py-2 transition-colors cursor-pointer"
        >
          Log in
        </button>

        <button
          type="button"
          className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl px-5 py-2 transition-colors cursor-pointer"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}
