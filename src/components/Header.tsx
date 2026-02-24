import { Link } from "react-router-dom";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const categories = ["Markets", "Technology", "Economy", "Energy", "Policy", "Science"];
  const pages = [
    { label: "About", href: "/about" },
    { label: "Archive", href: "/archive" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="py-6">
      <div className="container">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-heading text-2xl font-bold tracking-tight text-foreground no-underline hover:opacity-100">
            Afu<span className="text-primary">Blog</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/category/${cat.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors no-underline"
              >
                {cat}
              </Link>
            ))}
            <div className="w-px h-4 bg-muted" />
            {pages.map((p) => (
              <Link
                key={p.label}
                to={p.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors no-underline"
              >
                {p.label}
              </Link>
            ))}
            <Link to="/search" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Search">
              <Search size={16} />
            </Link>
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors no-underline">
              Dashboard
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden mt-4 flex flex-col gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/category/${cat.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors no-underline py-1"
              >
                {cat}
              </Link>
            ))}
            <div className="h-px bg-muted my-1" />
            {pages.map((p) => (
              <Link
                key={p.label}
                to={p.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors no-underline py-1"
              >
                {p.label}
              </Link>
            ))}
            <Link
              to="/search"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors no-underline py-1"
            >
              Search
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors no-underline py-1"
            >
              Dashboard
            </Link>
          </nav>
        )}

        <div className="mt-4 h-px bg-muted" />
      </div>
    </header>
  );
};

export default Header;
