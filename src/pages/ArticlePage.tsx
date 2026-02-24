import { useParams, Link } from "react-router-dom";
import { articles } from "@/data/articles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArticlePage = () => {
  const { id } = useParams();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container flex-1 py-20">
          <p className="text-muted-foreground">Article not found.</p>
          <Link to="/" className="mt-4 inline-block text-primary">← Back to home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <article className="flex-1 py-10">
        <div className="container max-w-3xl">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors no-underline">
            ← Back
          </Link>
          <span className="mt-6 block text-xs font-medium uppercase tracking-widest text-primary">
            {article.category}
          </span>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <span>{article.author}</span>
            <span>·</span>
            <span>{article.readTime} read</span>
            <span>·</span>
            <time>{new Date(article.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
          </div>
          <div className="mt-8 h-px bg-muted" />
          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/90">
            {article.content.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default ArticlePage;
