import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import SEOHead from "@/components/SEOHead";
import type { Tables } from "@/integrations/supabase/types";

type DbArticle = Tables<"articles">;

const ArchivePage = () => {
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("articles").select("*").eq("published", true).order("created_at", { ascending: false });
      setArticles(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const grouped = articles.reduce((acc, article) => {
    const key = new Date(article.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(article);
    return acc;
  }, {} as Record<string, DbArticle[]>);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SEOHead title="All Stories" description="Browse the complete archive of AfuBlog articles on AI, chatbots, machine learning, and tech innovation from AfuChat." url="https://stark-news-flow.lovable.app/archive" keywords="AfuChat articles archive, AI blog posts, tech stories, chatbot news archive" />
      <main className="flex-1 py-10 px-6 sm:px-12 lg:px-20">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All Stories" }]} />
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mt-4">All Stories</h1>
        <p className="mt-2 text-sm text-muted-foreground">Browse all published articles.</p>
        {loading ? (
          <div className="mt-8"><div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="mt-10 space-y-12">
            {Object.entries(grouped).map(([monthYear, monthArticles]) => (
              <section key={monthYear}>
                <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary mb-6">{monthYear}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {monthArticles.map((a) => (
                    <ArticleCard key={a.id} slug={a.slug} title={a.title} excerpt={a.excerpt || ""} category={a.category} author={a.author_name} date={a.created_at} readTime={a.read_time || "3 min"} imageUrl={a.image_url} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
      <PageFooter pageName="Archive" relatedLinks={[{ label: "Home", href: "/" }, { label: "Search", href: "/search" }]} />
    </div>
  );
};

export default ArchivePage;
