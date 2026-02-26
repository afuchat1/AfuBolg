import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

type DbArticle = Tables<"articles">;

interface GroupedArticles {
  [monthYear: string]: DbArticle[];
}

const ArchivePage = () => {
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      setArticles(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const grouped: GroupedArticles = articles.reduce((acc, article) => {
    const date = new Date(article.created_at);
    const key = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(article);
    return acc;
  }, {} as GroupedArticles);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Archive" }]} />

          <h1 className="font-heading text-4xl font-bold tracking-tight">Archive</h1>
          <p className="mt-3 text-muted-foreground">
            Browse all published articles by date.
          </p>

          {loading ? (
            <p className="mt-8 text-muted-foreground text-sm">Loading...</p>
          ) : (
            <div className="mt-8 space-y-10">
              {Object.entries(grouped).map(([monthYear, monthArticles]) => (
                <section key={monthYear}>
                  <h2 className="font-heading text-xs font-medium uppercase tracking-widest text-primary mb-4">
                    {monthYear}
                  </h2>
                  <div className="space-y-0">
                    {monthArticles.map((article, i) => (
                      <div key={article.id}>
                        {i > 0 && <div className="h-px bg-muted my-4" />}
                        <div className="flex items-baseline justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="font-heading text-base font-semibold truncate">
                              <Link
                                to={`/article/${article.id}`}
                                className="text-foreground no-underline hover:text-primary transition-colors"
                              >
                                {article.title}
                              </Link>
                            </h3>
                            <span className="text-xs text-muted-foreground">{article.category}</span>
                          </div>
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
      <Footer />
    </div>
  );
};

export default ArchivePage;
