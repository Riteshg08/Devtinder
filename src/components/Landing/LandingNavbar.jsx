import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LandingNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
  ];

  return (
    <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-5 relative z-20">
      <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <div className="logo-icon">{"</>"}</div>
        <span className="text-lg sm:text-xl font-bold text-white">DevTinder</span>
      </Link>

      <ul className="hidden md:flex gap-8 text-gray-400">
        {navItems.map((item) => (
          <li key={item.label}>
            <a href={item.href} className="hover:text-white transition-colors text-sm font-medium">
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="hidden md:flex gap-3">
        <Link to="/login" className="btn-secondary text-sm px-4 py-2">
          Login
        </Link>
        <Link to="/signup" className="btn-primary text-sm px-4 py-2">
          Get Started
        </Link>
      </div>

      <button
        className="md:hidden btn-ghost p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {menuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 card p-4 flex flex-col gap-3 md:hidden shadow-xl">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-gray-300 hover:text-white py-2 text-sm font-medium"
            >
              {item.label}
            </a>
          ))}
          <hr className="border-border" />
          <Link to="/login" className="btn-secondary text-sm text-center" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
          <Link to="/signup" className="btn-primary text-sm text-center" onClick={() => setMenuOpen(false)}>
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
