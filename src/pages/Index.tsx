import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ArticleCard from "@/components/ArticleCard";
import PageFooter from "@/components/PageFooter";
import { ArrowRight, Flame, Sparkles, BookOpen } from "lucide-react";
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
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
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

      {/* Latest Stories */}
      {topStories.length > 0 && (
        <section className="py-20 px-6 sm:px-10 lg:px-16 container max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">Latest Stories</h2>
            </div>
            <a
              href="/archive"
              className="group flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors bg-primary/5 px-4 py-2 rounded-full hover:bg-primary/10"
            >
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
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

      {/* More Stories + Sidebar */}
      {moreStories.length > 0 && (
        <section className="py-20 px-6 sm:px-10 lg:px-16 bg-secondary/30 border-y">
          <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">
                  More Stories
                </h2>
              </div>
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
              <aside className="hidden lg:block relative">
                <div className="sticky top-24">
                  <div className="bg-card rounded-3xl p-8 border shadow-sm">
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b">
                      <div className="p-2 bg-rose-500/10 rounded-lg">
                        <Flame className="w-5 h-5 text-rose-500" />
                      </div>
                      <h2 className="font-heading text-xl font-bold text-foreground">
                        Trending
                      </h2>
                    </div>
                    <div className="divide-y divide-border/50 flex flex-col gap-6">
                      {sideStories.map((a) => (
                        <div key={a.id} className="pt-6 first:pt-0">
                          <ArticleCard
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
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </section>
      )}

      {articles.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-32 text-center">
          <div className="p-6 bg-secondary rounded-full mb-6">
            <BookOpen className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold font-heading mb-2">No articles yet</h2>
          <p className="text-muted-foreground">The first publication is coming soon.</p>
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
