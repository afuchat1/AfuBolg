import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import ArticleList from "@/components/ArticleList";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { Tables } from "@/integrations/supabase/types";

type DbArticle = Tables<"articles">;

const CategoryPage = () => {
  const { category } = useParams();
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("articles").select("*").eq("published", true)
        .ilike("category", category || "").order("created_at", { ascending: false });
      setArticles(data || []); setLoading(false);
    };
    fetch();
  }, [category]);

  const mapArticle = (a: DbArticle) => ({
    id: a.id, slug: a.slug, title: a.title, excerpt: a.excerpt || "", content: a.content,
    category: a.category, author: a.author_name, date: a.created_at,
    readTime: a.read_time || "3 min", imageUrl: a.image_url,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container flex-1 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: category || "Category" }]} />
        <h1 className="font-heading text-3xl font-bold capitalize">{category}</h1>
        {loading ? (
          <div className="mt-6"><div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : articles.length > 0 ? (
          <ArticleList articles={articles.map(mapArticle)} />
        ) : (
          <p className="mt-6 text-muted-foreground">No articles in this category. <Link to="/">Browse all →</Link></p>
        )}
      </div>
      <PageFooter pageName={category || "Category"} relatedLinks={[{ label: "Home", href: "/" }, { label: "Archive", href: "/archive" }]} />
    </div>
  );
};

export default CategoryPage;
