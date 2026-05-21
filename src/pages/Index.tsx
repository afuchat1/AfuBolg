import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import PageFooter from "@/components/PageFooter";
import SEOHead from "@/components/SEOHead";
import AfuChatAd from "@/components/AfuChatAd";
import articlePlaceholder from "@/assets/article-placeholder.jpg";
import type { Tables } from "@/integrations/supabase/types";

type DbArticle = Tables<"articles">;

const BASE_URL = "https://stark-news-flow.lovable.app";

const formatDay = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

const formatShort = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

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

  const { lead, secondary, latest, rail, byCategory, categories } = useMemo(() => {
    const lead = articles[0];
    const secondary = articles.slice(1, 3);
    const rail = articles.slice(3, 8);
    const latest = articles.slice(3, 11);
    const map = new Map<string, DbArticle[]>();
    for (const a of articles) {
      if (!map.has(a.category)) map.set(a.category, []);
      map.get(a.category)!.push(a);
    }
    const categories = Array.from(map.keys());
    return { lead, secondary, latest, rail, byCategory: map, categories };
  }, [articles]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        name: "AfuBlog",
        alternateName: "AfuChat Blog",
        url: BASE_URL,
        description:
          "The official newsroom for AfuChat — breaking AI news, chatbot updates, machine learning insights, and tech innovation.",
        publisher: { "@id": `${BASE_URL}/#org` },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/search?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "NewsMediaOrganization",
        "@id": `${BASE_URL}/#org`,
        name: "AfuBlog",
        url: BASE_URL,
        logo: { "@type": "ImageObject", url: `${BASE_URL}/favicon.png` },
        sameAs: ["https://afuchat.com"],
      },
      articles.length > 0 && {
        "@type": "ItemList",
        name: "Top Stories",
        itemListElement: articles.slice(0, 10).map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${BASE_URL}/article/${a.slug}`,
          name: a.title,
        })),
      },
    ].filter(Boolean),
  };

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

  const today = formatDay(new Date());

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Breaking AI News & Tech Insights"
        description="AfuBlog — the AfuChat newsroom. Breaking artificial intelligence news, chatbot platform updates, machine learning research, NLP advances, and tech innovation analysis."
        url={BASE_URL}
        keywords="breaking AI news, AfuChat newsroom, chatbot platform, machine learning news, NLP research, AI tools, generative AI, tech innovation, AI startups, AfuBlog top stories"
        jsonLd={jsonLd}
      />
      <Header />

      {/* Date strip */}
      <div className="px-6 sm:px-10 lg:px-16 py-2 text-[11px] uppercase tracking-widest text-muted-foreground flex items-center justify-between">
        <time>{today}</time>
        <span className="hidden sm:inline">AfuBlog · The AfuChat Newsroom</span>
      </div>

      {/* Category strip */}
      {categories.length > 0 && (
        <nav aria-label="Sections" className="px-6 sm:px-10 lg:px-16 py-2 overflow-x-auto">
          <ul className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
            {categories.slice(0, 8).map((c) => (
              <li key={c}>
                <Link
                  to={`/category/${c.toLowerCase()}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {c}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/archive" className="text-muted-foreground hover:text-primary transition-colors">
                All stories →
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <main className="flex-1 px-6 sm:px-10 lg:px-16 py-6">
        {articles.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">No articles published yet.</p>
          </div>
        ) : (
          <>
            {/* HERO: Lead + secondary + rail */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-8 pb-10">
              {/* Lead story */}
              {lead && (
                <article className="lg:col-span-7">
                  <Link to={`/article/${lead.slug}`} className="group block">
                    <div className="aspect-[16/10] overflow-hidden bg-muted mb-4">
                      <img
                        src={lead.image_url || articlePlaceholder}
                        alt={lead.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="eager"
                      />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                      {lead.category}
                    </span>
                    <h1 className="mt-2 font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05] text-foreground group-hover:text-primary transition-colors">
                      {lead.title}
                    </h1>
                    {lead.excerpt && (
                      <p className="mt-3 text-base text-muted-foreground leading-relaxed line-clamp-3 max-w-2xl">
                        {lead.excerpt}
                      </p>
                    )}
                    <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                      <span className="font-semibold text-foreground">{lead.author_name}</span>
                      <span>·</span>
                      <time dateTime={lead.created_at}>{formatShort(lead.created_at)}</time>
                      <span>·</span>
                      <span>{lead.read_time}</span>
                    </div>
                  </Link>
                </article>
              )}

              {/* Secondary column */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-6 lg:divide-y lg:divide-muted">
                {secondary.map((a, idx) => (
                  <div key={a.id} className={idx > 0 ? "lg:pt-6" : ""}>
                    <ArticleCard
                      slug={a.slug}
                      title={a.title}
                      excerpt={a.excerpt || ""}
                      category={a.category}
                      author={a.author_name}
                      date={a.created_at}
                      readTime={a.read_time || "3 min"}
                      imageUrl={a.image_url}
                    />
                  </div>
                ))}
                {rail.length > 0 && (
                  <div className="lg:pt-6 sm:col-span-2 lg:col-span-1">
                    <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-foreground mb-2">
                      Most Recent
                    </h2>
                    <ol className="divide-y divide-muted">
                      {rail.map((a, i) => (
                        <li key={a.id} className="py-2.5">
                          <Link to={`/article/${a.slug}`} className="group flex gap-3 items-start">
                            <span className="font-heading text-base font-extrabold text-primary leading-none w-5 shrink-0">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {a.category}
                              </span>
                              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                {a.title}
                              </h3>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </section>

            <AfuChatAd variant="leaderboard" className="my-8" />

            {/* Latest grid */}
            {latest.length > 0 && (
              <section className="py-8">
                <div className="flex items-baseline justify-between mb-5">
                  <h2 className="font-heading text-xl font-extrabold uppercase tracking-wider text-foreground">
                    Latest
                  </h2>
                  <Link to="/archive" className="text-xs font-semibold uppercase tracking-wider text-primary">
                    See all →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {latest.map((a) => (
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
              </section>
            )}

            {/* Sections by category */}
            {categories.slice(0, 4).map((cat) => {
              const items = (byCategory.get(cat) || []).slice(0, 4);
              if (items.length < 2) return null;
              return (
                <section key={cat} className="py-8">
                  <div className="flex items-baseline justify-between mb-5">
                    <h2 className="font-heading text-xl font-extrabold uppercase tracking-wider text-foreground">
                      {cat}
                    </h2>
                    <Link
                      to={`/category/${cat.toLowerCase()}`}
                      className="text-xs font-semibold uppercase tracking-wider text-primary"
                    >
                      More in {cat} →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {items.map((a) => (
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
                </section>
              );
            })}

            <AfuChatAd variant="in-feed" className="mt-10" />
            <AfuChatAd variant="sticky-bottom" />
          </>
        )}
      </main>

      <PageFooter pageName="Home" />
    </div>
  );
};

export default Index;
