const Footer = () => {
  return (
    <footer className="py-10 mt-10">
      <div className="container">
        <div className="h-px bg-muted mb-8" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-muted-foreground">
          <span className="font-heading text-sm font-bold text-foreground">
            SIGNAL<span className="text-primary">.</span>
          </span>
          <span>© {new Date().getFullYear()} Signal. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
