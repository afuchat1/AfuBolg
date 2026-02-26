import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import FeaturedArticle from "@/components/FeaturedArticle";
import ArticleList from "@/components/ArticleList";
import PageFooter from "@/components/PageFooter";
import type { Tables } from "@/integrations/supabase/types";

type DbArticle = Tables<"articles">;

const Index = () => {
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      setArticles(data || []);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => a.id !== featured?.id);

  const mapArticle = (a: DbArticle) => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt || "",
    content: a.content,
    category: a.category,
    author: a.author_name,
    date: a.created_at,
    readTime: a.read_time || "3 min",
    featured: a.featured,
    imageUrl: a.image_url,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {featured && <FeaturedArticle article={mapArticle(featured)} />}
      {rest.length > 0 && (
        <>
          <div className="h-px bg-muted container" />
          <ArticleList articles={rest.map(mapArticle)} />
        </>
      )}
      {articles.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No updates published yet.</p>
        </div>
      )}
      <PageFooter
        pageName="Home"
        relatedLinks={[
          { label: "About", href: "/about" },
          { label: "Archive", href: "/archive" },
          { label: "Contact", href: "/contact" },
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ]}
      />
    </div>
  );
};

export default Index;
