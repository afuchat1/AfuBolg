import { Link } from "react-router-dom";
import articlePlaceholder from "@/assets/article-placeholder.jpg";

interface ArticleCardProps {
  id: string;
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
  id,
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

  if (variant === "featured") {
    return (
      <Link to={`/article/${id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl aspect-[16/9] mb-4">
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-white/80 mb-1.5">
              {category}
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white leading-tight line-clamp-2">
              {title}
            </h3>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link to={`/article/${id}`} className="group flex gap-4 py-4">
        <div className="w-20 h-20 shrink-0 overflow-hidden rounded-lg">
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            {category}
          </span>
          <h4 className="font-heading text-sm font-semibold text-foreground mt-0.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {title}
          </h4>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            {readTime} read
          </span>
        </div>
      </Link>
    );
  }

  // Default card — Samsung newsroom style
  return (
    <Link to={`/article/${id}`} className="group block">
      <div className="overflow-hidden rounded-2xl aspect-[4/3] mb-4 bg-muted">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
        {category}
      </span>
      <h3 className="font-heading text-lg font-bold text-foreground mt-1.5 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
        {excerpt}
      </p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
        <span className="font-medium text-foreground">{author}</span>
        <span className="w-1 h-1 rounded-full bg-border" />
        <time>
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </time>
        <span className="w-1 h-1 rounded-full bg-border" />
        <span>{readTime}</span>
      </div>
    </Link>
  );
};

export default ArticleCard;
