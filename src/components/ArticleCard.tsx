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

const ArticleCard = ({ id, title, excerpt, category, author, date, readTime, imageUrl, variant = "default" }: ArticleCardProps) => {
  const img = imageUrl || articlePlaceholder;

  if (variant === "featured") {
    return (
      <Link to={`/article/${id}`} className="group block no-underline">
        <div className="relative overflow-hidden aspect-[16/9] mb-4">
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-medium">{category}</span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mt-1 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link to={`/article/${id}`} className="group flex gap-4 no-underline py-4">
        <div className="w-20 h-20 shrink-0 overflow-hidden">
          <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] uppercase tracking-[0.15em] text-primary font-medium">{category}</span>
          <h4 className="font-heading text-sm font-semibold text-foreground mt-0.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {title}
          </h4>
          <span className="text-[10px] text-muted-foreground mt-1 block">{readTime} read</span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${id}`} className="group block no-underline">
      <div className="overflow-hidden aspect-[4/3] mb-3">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-medium">{category}</span>
      <h3 className="font-heading text-base sm:text-lg font-semibold text-foreground mt-1 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{excerpt}</p>
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-3">
        <span>{author}</span>
        <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground" />
        <time>{new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time>
        <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground" />
        <span>{readTime}</span>
      </div>
    </Link>
  );
};

export default ArticleCard;
