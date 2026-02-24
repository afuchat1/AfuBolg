import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-10 mt-10">
      <div className="container">
        <div className="h-px bg-muted mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <span className="font-heading text-sm font-bold text-foreground">
              Afu<span className="text-primary">Blog</span>
            </span>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Independent journalism and analysis on the topics that shape our world.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-primary mb-3">Categories</h4>
            <div className="flex flex-col gap-2">
              {["Markets", "Technology", "Economy", "Energy", "Policy", "Science"].map((cat) => (
                <Link
                  key={cat}
                  to={`/category/${cat.toLowerCase()}`}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors no-underline"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-primary mb-3">Pages</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-xs text-muted-foreground hover:text-primary transition-colors no-underline">About</Link>
              <Link to="/archive" className="text-xs text-muted-foreground hover:text-primary transition-colors no-underline">Archive</Link>
              <Link to="/contact" className="text-xs text-muted-foreground hover:text-primary transition-colors no-underline">Contact</Link>
              <Link to="/search" className="text-xs text-muted-foreground hover:text-primary transition-colors no-underline">Search</Link>
              <Link to="/admin" className="text-xs text-muted-foreground hover:text-primary transition-colors no-underline">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-primary mb-3">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors no-underline">Privacy Policy</Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors no-underline">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className="h-px bg-muted mb-6" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} AfuBlog. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
