import { Link } from "react-router-dom";
import type { ArticleData } from "./FeaturedArticle";

const ArticleList = ({ articles }: { articles: ArticleData[] }) => {
  return (
    <section className="py-6">
      <div className="container">
        <h2 className="font-heading text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
          Latest
        </h2>
        <div className="space-y-0">
          {articles.map((article, i) => (
            <article key={article.id}>
              {i > 0 && <div className="h-px bg-muted my-6" />}
              <div className="grid md:grid-cols-[1fr_auto] gap-4">
                <div>
                  <span className="text-xs font-medium uppercase tracking-widest text-primary">
                    {article.category}
                  </span>
                  <h3 className="mt-1 font-heading text-xl font-semibold leading-snug">
                    <Link
                      to={`/article/${article.id}`}
                      className="text-foreground no-underline hover:text-primary transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
                <div className="flex items-end md:items-start gap-3 text-xs text-muted-foreground whitespace-nowrap">
                  <span>{article.author}</span>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticleList;
