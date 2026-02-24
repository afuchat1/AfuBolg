import { useParams, Link } from "react-router-dom";
import { articles } from "@/data/articles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleList from "@/components/ArticleList";

const CategoryPage = () => {
  const { category } = useParams();
  const filtered = articles.filter(
    (a) => a.category.toLowerCase() === category?.toLowerCase()
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container flex-1 py-10">
        <h1 className="font-heading text-3xl font-bold capitalize">{category}</h1>
        {filtered.length > 0 ? (
          <ArticleList articles={filtered} />
        ) : (
          <p className="mt-6 text-muted-foreground">
            No articles in this category.{" "}
            <Link to="/">Browse all →</Link>
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
