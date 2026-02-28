import { Link } from "react-router-dom";

interface PageFooterProps {
  pageName: string;
  relatedLinks?: { label: string; href: string }[];
}

const PageFooter = ({ pageName, relatedLinks }: PageFooterProps) => {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="px-6 sm:px-12 lg:px-20 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <span className="font-heading text-lg font-bold text-foreground">
              Afu<span className="text-primary">Blog</span>
            </span>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              The official tech newsroom for{" "}
              <a href="https://afuchat.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                AfuChat.com
              </a>
            </p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">Explore</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors no-underline">Home</Link>
              <Link to="/archive" className="text-xs text-muted-foreground hover:text-foreground transition-colors no-underline">All Stories</Link>
              <Link to="/search" className="text-xs text-muted-foreground hover:text-foreground transition-colors no-underline">Search</Link>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">Company</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors no-underline">About</Link>
              <Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors no-underline">Contact</Link>
              <a href="https://afuchat.com" className="text-xs text-muted-foreground hover:text-foreground transition-colors no-underline" target="_blank" rel="noopener noreferrer">AfuChat.com</a>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors no-underline">Privacy</Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors no-underline">Terms</Link>
            </div>
          </div>
        </div>
        <div className="h-px bg-border mb-6" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-muted-foreground">
          <span>© {new Date().getFullYear()} AfuBlog. All rights reserved.</span>
          {relatedLinks && relatedLinks.length > 0 && (
            <div className="flex gap-4">
              {relatedLinks.map((link) => (
                <Link key={link.label} to={link.href} className="hover:text-foreground transition-colors no-underline">
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
