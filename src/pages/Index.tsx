import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ArticleCard from "@/components/ArticleCard";
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

  const featured = articles.filter((a) => a.featured).slice(0, 3);
  const latest = articles.filter((a) => !a.featured);
  const topStories = latest.slice(0, 3);
  const moreStories = latest.slice(3, 9);
  const sideStories = latest.slice(9, 14);

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

      {/* Hero Carousel */}
      <HeroCarousel
        articles={featured.map((a) => ({
          id: a.id,
          title: a.title,
          excerpt: a.excerpt || "",
          category: a.category,
          author: a.author_name,
          date: a.created_at,
        }))}
      />

      {/* Top Stories Grid */}
      {topStories.length > 0 && (
        <section className="py-12 px-6 sm:px-12 lg:px-20">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-8">
            Latest Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topStories.map((a) => (
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
      )}

      {/* Divider */}
      {moreStories.length > 0 && <div className="h-px bg-border mx-6 sm:mx-12 lg:mx-20" />}

      {/* More Stories + Sidebar */}
      {moreStories.length > 0 && (
        <section className="py-12 px-6 sm:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-8">
                More Stories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {moreStories.map((a) => (
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
            </div>

            {/* Sidebar */}
            {sideStories.length > 0 && (
              <aside className="hidden lg:block">
                <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
                  Trending
                </h2>
                <div className="divide-y divide-border">
                  {sideStories.map((a) => (
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
                      variant="compact"
                    />
                  ))}
                </div>
              </aside>
            )}
          </div>
        </section>
      )}

      {articles.length === 0 && (
        <div className="flex-1 flex items-center justify-center py-20">
          <p className="text-muted-foreground">No articles published yet.</p>
        </div>
      )}

      <PageFooter
        pageName="Home"
        relatedLinks={[
          { label: "About", href: "/about" },
          { label: "Archive", href: "/archive" },
          { label: "Contact", href: "/contact" },
        ]}
      />
    </div>
  );
};

export default Index;
