import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import { Archive } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-6xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All Stories" }]} />

          <div className="mt-8 mb-16 text-center space-y-4">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-6xl text-foreground">
              All Stories
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our complete archive of published articles, updates, and insights.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center mt-12">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="bg-card p-12 rounded-3xl border shadow-sm flex flex-col items-center text-center mt-12">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Archive className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold font-heading mb-2">No articles found</h2>
              <p className="text-muted-foreground">Check back later for new content.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(grouped).map(([monthYear, monthArticles]) => (
                <section key={monthYear} className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
                      {monthYear}
                    </h2>
                    <div className="h-px bg-border flex-1" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {monthArticles.map((a) => (
                      <ArticleCard
                        key={a.id}
                        id={a.id}
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
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <PageFooter pageName="Archive" relatedLinks={[{ label: "Home", href: "/" }, { label: "Search", href: "/search" }]} />
    </div>
  );
};

export default ArchivePage;
