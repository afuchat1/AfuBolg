import ArticleCard from "./ArticleCard";
import type { ArticleData } from "./FeaturedArticle";

const ArticleList = ({ articles }: { articles: ArticleData[] }) => {
  return (
    <section className="py-12 px-6 sm:px-12 lg:px-20">
      <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-8">All Stories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            slug={article.slug}
            title={article.title}
            excerpt={article.excerpt}
            category={article.category}
            author={article.author}
            date={article.date}
            readTime={article.readTime}
            imageUrl={article.imageUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default ArticleList;
