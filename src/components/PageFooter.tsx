import { Link } from "react-router-dom";

interface PageFooterProps {
  pageName: string;
  relatedLinks?: { label: string; href: string }[];
}

const PageFooter = ({ pageName, relatedLinks }: PageFooterProps) => {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="px-6 sm:px-10 lg:px-16 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <span className="font-heading text-xl font-extrabold text-foreground">
              Afu<span className="text-primary">Blog</span>
            </span>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              The official tech newsroom for{" "}
              <a
                href="https://afuchat.com"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                AfuChat.com
              </a>
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Explore
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link to="/archive" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Stories</Link>
              <Link to="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">Search</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Company
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              <a href="https://afuchat.com" className="text-sm text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">AfuChat.com</a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Legal
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            </div>
          </div>
        </div>
        <div className="h-px bg-border mb-6" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} AfuBlog. All rights reserved.</span>
          {relatedLinks && relatedLinks.length > 0 && (
            <div className="flex gap-5">
              {relatedLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
