import { Link } from "react-router-dom";

const Header = () => {
  const categories = ["Markets", "Technology", "Economy", "Energy", "Policy", "Science"];

  return (
    <header className="py-6">
      <div className="container">
        <div className="flex items-baseline justify-between">
          <Link to="/" className="font-heading text-2xl font-bold tracking-tight text-foreground no-underline hover:opacity-100">
            SIGNAL<span className="text-primary">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/category/${cat.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors no-underline"
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-4 h-px bg-muted" />
      </div>
    </header>
  );
};

export default Header;
