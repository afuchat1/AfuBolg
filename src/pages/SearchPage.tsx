import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type DbArticle = Tables<"articles">;

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DbArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true); setSearched(true);
    const { data } = await supabase
      .from("articles").select("*").eq("published", true)
      .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,category.ilike.%${q}%,author_name.ilike.%${q}%`)
      .order("created_at", { ascending: false }).limit(20);
    setResults(data || []); setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
          <h1 className="font-heading text-4xl font-bold tracking-tight">Search</h1>
          <div className="mt-6 relative max-w-xl">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles..." autoFocus className="w-full bg-secondary text-foreground pl-10 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="mt-8">
            {loading ? (
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : searched && results.length === 0 ? (
              <p className="text-muted-foreground">No articles found for "{query}"</p>
            ) : (
              <div className="space-y-0">
                {results.map((article, i) => (
                  <article key={article.id}>
                    {i > 0 && <div className="h-px bg-muted my-6" />}
                    <h3 className="font-heading text-xl font-semibold leading-snug">
                      <Link to={`/article/${article.slug}`} className="text-foreground no-underline hover:text-primary transition-colors">{article.title}</Link>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{article.excerpt}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{article.author_name}</span><span>·</span><span>{article.read_time}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <PageFooter pageName="Search" relatedLinks={[{ label: "Home", href: "/" }, { label: "Archive", href: "/archive" }]} />
    </div>
  );
};

export default SearchPage;
