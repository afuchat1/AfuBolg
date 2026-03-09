import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ArticleCard from "@/components/ArticleCard";
import PageFooter from "@/components/PageFooter";
import SEOHead from "@/components/SEOHead";
import { ArrowRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type DbArticle = Tables<"articles">;

const categories = ["Technology", "AI", "Science", "Innovation", "Product", "Community"];

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

  // Get unique categories that have articles
  const activeCats = [...new Set(articles.map((a) => a.category))].slice(0, 4);

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
      <HeroCarousel
        articles={featured.map((a) => ({
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt || "",
          category: a.category,
          author: a.author_name,
          date: a.created_at,
          imageUrl: a.image_url,
        }))}
      />

      {topStories.length > 0 && (
        <section className="py-16 px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground">Latest Stories</h2>
            <Link to="/archive" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topStories.map((a) => (
              <ArticleCard key={a.id} slug={a.slug} title={a.title} excerpt={a.excerpt || ""} category={a.category} author={a.author_name} date={a.created_at} readTime={a.read_time || "3 min"} imageUrl={a.image_url} />
            ))}
          </div>
        </section>
      )}

      {/* Category quick links */}
      <section className="py-12 px-6 sm:px-10 lg:px-16 border-y border-border">
        <h2 className="font-heading text-xl font-bold text-foreground mb-6">Explore Topics</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/category/${cat}`}
              className="px-5 py-2.5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary transition-all"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {moreStories.length > 0 && (
        <section className="py-16 px-6 sm:px-10 lg:px-16 bg-secondary">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-10">More Stories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {moreStories.map((a) => (
                  <ArticleCard key={a.id} slug={a.slug} title={a.title} excerpt={a.excerpt || ""} category={a.category} author={a.author_name} date={a.created_at} readTime={a.read_time || "3 min"} imageUrl={a.image_url} />
                ))}
              </div>
            </div>
            {sideStories.length > 0 && (
              <aside className="hidden lg:block">
                <h2 className="font-heading text-lg font-bold text-foreground mb-6">Trending</h2>
                <div className="divide-y divide-border">
                  {sideStories.map((a) => (
                    <ArticleCard key={a.id} slug={a.slug} title={a.title} excerpt={a.excerpt || ""} category={a.category} author={a.author_name} date={a.created_at} readTime={a.read_time || "3 min"} imageUrl={a.image_url} variant="compact" />
                  ))}
                </div>
              </aside>
            )}
          </div>
        </section>
      )}

      {/* Suggested content links */}
      <section className="py-16 px-6 sm:px-10 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Discover More</h2>
          <p className="text-muted-foreground text-sm mb-8">Explore everything AfuBlog has to offer</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link to="/archive" className="group p-6 rounded-xl border border-border hover:border-primary transition-all bg-card">
              <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">All Stories</h3>
              <p className="text-xs text-muted-foreground mt-1">Browse our complete archive of articles</p>
            </Link>
            <Link to="/about" className="group p-6 rounded-xl border border-border hover:border-primary transition-all bg-card">
              <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">About Us</h3>
              <p className="text-xs text-muted-foreground mt-1">Learn about AfuBlog and our mission</p>
            </Link>
            <a href="https://afuchat.com" target="_blank" rel="noopener noreferrer" className="group p-6 rounded-xl border border-border hover:border-primary transition-all bg-card">
              <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">AfuChat.com</h3>
              <p className="text-xs text-muted-foreground mt-1">Visit our AI-powered chat platform</p>
            </a>
          </div>
        </div>
      </section>

      {articles.length === 0 && (
        <div className="flex-1 flex items-center justify-center py-20">
          <p className="text-muted-foreground">No articles published yet.</p>
        </div>
      )}

      <PageFooter pageName="Home" relatedLinks={[{ label: "About", href: "/about" }, { label: "Archive", href: "/archive" }, { label: "Contact", href: "/contact" }]} />
    </div>
  );
};

export default Index;
