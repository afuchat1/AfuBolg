import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import PageFooter from "@/components/PageFooter";
import SEOHead from "@/components/SEOHead";
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title="Home" description="AfuBlog — The official news and updates platform for AfuChat.com. Read the latest tech stories, AI insights, and more." url="https://stark-news-flow.lovable.app" />
      <Header />

      <main className="flex-1 px-6 sm:px-10 lg:px-16 py-10">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {articles.map((a) => (
              <ArticleCard
                key={a.id}
                slug={a.slug}
                title={a.title}
                excerpt={a.excerpt || ""}
                category={a.category}
                author={a.author_name}
                date={a.created_at}
                readTime={a.read_time || "3 min"}
                imageUrl={a.image_url}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">No articles published yet.</p>
          </div>
        )}
      </main>

      <PageFooter pageName="Home" />
    </div>
  );
};

export default Index;
