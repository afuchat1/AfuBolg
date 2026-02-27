import { Link } from "react-router-dom";
import { useState } from "react";
import { Search, Menu, X, PenSquare, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

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
            <span className="text-xs text-muted-foreground ml-2 font-normal">by AfuChat.com</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5">
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
            {user ? (
              <>
                <Link
                  to="/write"
                  className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity no-underline"
                >
                  <PenSquare size={14} />
                  Write
                </Link>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors" title="Dashboard">
                  <LayoutDashboard size={16} />
                </Link>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity no-underline"
              >
                Start Writing
              </Link>
            )}
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
            <Link to="/search" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-primary transition-colors no-underline py-1">
              Search
            </Link>
            {user ? (
              <>
                <Link to="/write" onClick={() => setMobileOpen(false)} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity no-underline w-fit">
                  <PenSquare size={14} />
                  Write
                </Link>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-primary transition-colors no-underline py-1">
                  Dashboard
                </Link>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity no-underline w-fit">
                Start Writing
              </Link>
            )}
          </nav>
        )}

        <div className="mt-4 h-px bg-muted" />
      </div>
    </header>
  );
};

export default Header;
