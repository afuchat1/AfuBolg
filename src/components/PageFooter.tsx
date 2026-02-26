import { Link } from "react-router-dom";

interface PageFooterProps {
  pageName: string;
  relatedLinks?: { label: string; href: string }[];
}

const PageFooter = ({ pageName, relatedLinks }: PageFooterProps) => {
  return (
    <footer className="py-8 mt-auto">
      <div className="container">
        <div className="h-px bg-muted mb-6" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-heading text-sm font-bold text-foreground">
              Afu<span className="text-primary">Blog</span>
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              Powered by{" "}
              <a href="https://afuchat.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                AfuChat.com
              </a>
            </p>
          </div>
          {relatedLinks && relatedLinks.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {relatedLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors no-underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground/60 mt-4">
          © {new Date().getFullYear()} AfuBlog · {pageName}
        </p>
      </div>
    </footer>
  );
};

export default PageFooter;
