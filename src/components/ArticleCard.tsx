import { Link } from "react-router-dom";
import articlePlaceholder from "@/assets/article-placeholder.jpg";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl?: string | null;
  variant?: "default" | "featured" | "compact";
}

const ArticleCard = ({
  slug,
  title,
  excerpt,
  category,
  author,
  date,
  readTime,
  imageUrl,
  variant = "default",
}: ArticleCardProps) => {
  const img = imageUrl || articlePlaceholder;
  const articleUrl = `/article/${slug}`;

  if (variant === "compact") {
    return (
      <Link to={articleUrl} className="group flex gap-4 py-3">
        <div className="w-16 h-16 shrink-0 overflow-hidden">
          <img src={img} alt={title} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{category}</span>
          <h4 className="font-heading text-sm font-semibold text-foreground mt-0.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug">{title}</h4>
          <span className="text-[10px] text-muted-foreground mt-0.5 block">{readTime}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={articleUrl} className="group block">
      <div className="overflow-hidden aspect-[3/2] mb-3 bg-muted">
        <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" />
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{category}</span>
      <h3 className="font-heading text-base font-bold text-foreground mt-1 leading-snug line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{excerpt}</p>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-2">
        <span className="font-medium text-foreground">{author}</span>
        <span>·</span>
        <time>{new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time>
        <span>·</span>
        <span>{readTime}</span>
      </div>
    </Link>
  );
};

export default ArticleCard;
