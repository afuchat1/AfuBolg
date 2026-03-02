import { Link } from "react-router-dom";
import articlePlaceholder from "@/assets/article-placeholder.jpg";

export interface ArticleData {
  id: string;
  slug: string;
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
    <article className="relative overflow-hidden">
      <div className="aspect-[21/9] w-full">
        <img src={article.imageUrl || articlePlaceholder} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 lg:p-20">
        <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-medium">{article.category}</span>
        <h1 className="mt-2 font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1]">
          <Link to={`/article/${article.slug}`} className="text-foreground no-underline hover:text-primary transition-colors">{article.title}</Link>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl">{article.excerpt}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{article.author}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>{article.readTime} read</span>
        </div>
      </div>
    </article>
  );
};

export default FeaturedArticle;
