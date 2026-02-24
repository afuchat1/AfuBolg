import { articles } from "@/data/articles";
import Header from "@/components/Header";
import FeaturedArticle from "@/components/FeaturedArticle";
import ArticleList from "@/components/ArticleList";
import Footer from "@/components/Footer";

const Index = () => {
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {featured && <FeaturedArticle article={featured} />}
      <div className="h-px bg-muted container" />
      <ArticleList articles={rest} />
      <Footer />
    </div>
  );
};

export default Index;
