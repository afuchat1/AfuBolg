import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PageFooter from "@/components/PageFooter";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Page not found</p>
          <a href="/" className="text-primary underline hover:text-primary/90">Return to Home</a>
        </div>
      </div>
      <PageFooter pageName="404" relatedLinks={[{ label: "Home", href: "/" }]} />
    </div>
  );
};

export default NotFound;
