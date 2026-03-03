import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Search, Menu, X, PenSquare, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";

const categories = ["All", "Technology", "AI", "Science", "Innovation", "Product", "Community"];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: "Stories", href: "/archive" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-6 sm:px-10 lg:px-16 h-16">
          <Link
            to="/"
            className="font-heading text-xl font-extrabold tracking-tight text-foreground"
          >
            Afu<span className="text-primary">Blog</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((p) => (
              <Link
                key={p.label}
                to={p.href}
                className={`text-sm font-medium transition-colors ${location.pathname === p.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {p.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/search"
              className="text-muted-foreground hover:text-foreground transition-colors p-2"
              aria-label="Search"
            >
              <Search size={18} />
            </Link>
            <ThemeToggle />
            {user ? (
              <>
                <Link
                  to="/write"
                  className="flex items-center gap-1.5 bg-primary text-primary-foreground px-5 py-2 text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  <PenSquare size={14} />
                  Write
                </Link>
                <Link
                  to="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors p-2"
                  title="Dashboard"
                >
                  <LayoutDashboard size={18} />
                </Link>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-foreground text-background px-5 py-2 text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-foreground p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Category strip — desktop only, shown on home */}
        {location.pathname === "/" && (
          <div className="hidden lg:block border-t border-border">
            <div className="flex items-center gap-1 px-6 sm:px-10 lg:px-16 py-2 overflow-x-auto">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={cat === "All" ? "/archive" : `/category/${cat}`}
                  className="px-4 py-1.5 text-xs font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-all whitespace-nowrap"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-border bg-background px-6 py-5 flex flex-col gap-4 animate-fade-in">
            {navLinks.map((p) => (
              <Link
                key={p.label}
                to={p.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-foreground py-1"
              >
                {p.label}
              </Link>
            ))}
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <div className="h-px bg-border" />
            {user ? (
              <>
                <Link
                  to="/write"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold rounded-full w-fit"
                >
                  <PenSquare size={14} /> Write
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-foreground py-1"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="bg-foreground text-background px-4 py-2.5 text-sm font-semibold rounded-full w-fit"
              >
                Sign In
              </Link>
            )}
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
