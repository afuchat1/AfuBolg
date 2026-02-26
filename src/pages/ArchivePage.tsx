import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

type DbArticle = Tables<"articles">;

const ArchivePage = () => {
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("articles").select("*").eq("published", true).order("created_at", { ascending: false });
      setArticles(data || []); setLoading(false);
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
      <main className="flex-1 py-10">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Archive" }]} />
          <h1 className="font-heading text-4xl font-bold tracking-tight">Archive</h1>
          <p className="mt-3 text-muted-foreground">Browse all published articles by date.</p>
          {loading ? (
            <div className="mt-8"><div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="mt-8 space-y-10">
              {Object.entries(grouped).map(([monthYear, monthArticles]) => (
                <section key={monthYear}>
                  <h2 className="font-heading text-xs font-medium uppercase tracking-widest text-primary mb-4">{monthYear}</h2>
                  <div className="space-y-0">
                    {monthArticles.map((article, i) => (
                      <div key={article.id}>
                        {i > 0 && <div className="h-px bg-muted my-4" />}
                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className="font-heading text-base font-semibold truncate min-w-0">
                            <Link to={`/article/${article.id}`} className="text-foreground no-underline hover:text-primary transition-colors">{article.title}</Link>
                          </h3>
                          <time className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(article.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </time>
                        </div>
                      </div>
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
