import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Search, Menu, X, PenSquare, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";

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
    <header className="sticky top-0 z-50 bg-background">
      <div className="flex items-center justify-between px-6 sm:px-10 lg:px-16 h-14">
        <Link to="/" className="font-heading text-lg font-extrabold tracking-tight text-foreground">
          Afu<span className="text-primary">Blog</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((p) => (
            <Link
              key={p.label}
              to={p.href}
              className={`text-sm font-medium transition-colors ${
                location.pathname === p.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <ThemeToggle />
          <Link to="/search" className="text-muted-foreground hover:text-foreground transition-colors p-2" aria-label="Search">
            <Search size={17} />
          </Link>
          {user ? (
            <>
              <Link to="/write" className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity">
                <PenSquare size={13} /> Write
              </Link>
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors p-2" title="Dashboard">
                <LayoutDashboard size={17} />
              </Link>
            </>
          ) : (
            <Link to="/auth" className="bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity">
              Sign In
            </Link>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-foreground p-2" aria-label="Toggle menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden bg-background px-6 py-4 flex flex-col gap-3">
          {navLinks.map((p) => (
            <Link key={p.label} to={p.href} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground py-1">
              {p.label}
            </Link>
          ))}
          <Link to="/search" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground py-1">Search</Link>
          <div className="flex items-center gap-2 pt-2">
            <ThemeToggle />
          </div>
          {user ? (
            <>
              <Link to="/write" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold w-fit">
                <PenSquare size={13} /> Write
              </Link>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground py-1">Dashboard</Link>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold w-fit">
              Sign In
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
