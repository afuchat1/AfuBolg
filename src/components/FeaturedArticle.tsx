import { Link } from "react-router-dom";

export interface ArticleData {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
  imageUrl?: string | null;
}

const FeaturedArticle = ({ article }: { article: ArticleData }) => {
  return (
    <article className="py-10">
      <div className="container">
        <span className="text-xs font-medium uppercase tracking-widest text-primary">
          {article.category}
        </span>
        <h1 className="mt-3 font-heading text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
          <Link to={`/article/${article.id}`} className="text-foreground no-underline hover:text-primary transition-colors">
            {article.title}
          </Link>
        </h1>
        {article.imageUrl && (
          <img src={article.imageUrl} alt={article.title} className="mt-4 w-full max-h-96 object-cover" />
        )}
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          <span>{article.author}</span>
          <span>·</span>
          <span>{article.readTime} read</span>
          <span>·</span>
          <time>{new Date(article.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
        </div>
      </div>
    </article>
  );
};

export default FeaturedArticle;
