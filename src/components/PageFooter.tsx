import { Link } from "react-router-dom";

interface PageFooterProps {
  pageName: string;
  relatedLinks?: { label: string; href: string }[];
}

const PageFooter = ({ pageName, relatedLinks }: PageFooterProps) => {
  return (
    <footer className="mt-auto bg-card">
      <div className="px-6 sm:px-10 lg:px-16 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <span className="font-heading text-lg font-extrabold text-foreground">
              Afu<span className="text-primary">Blog</span>
            </span>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              The official tech newsroom for{" "}
              <a href="https://afuchat.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">AfuChat.com</a>
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Explore</h4>
            <div className="flex flex-col gap-1.5">
              <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link to="/archive" className="text-xs text-muted-foreground hover:text-primary transition-colors">Stories</Link>
              <Link to="/about" className="text-xs text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/contact" className="text-xs text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Legal</h4>
            <div className="flex flex-col gap-1.5">
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            </div>
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} AfuBlog. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
