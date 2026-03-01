import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link } from "react-router-dom";
import { Search as SearchIcon, FileQuestion, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-4xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

          <div className="mt-8 mb-12 text-center space-y-4">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl text-foreground">
              Search Articles
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Find news, updates, and tutorials from the AfuBlog.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-card p-2 rounded-2xl border shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent flex items-center">
            <div className="px-4 text-muted-foreground shrink-0">
              <SearchIcon size={24} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              autoFocus
              className="w-full bg-transparent text-foreground py-4 text-lg outline-none placeholder:text-muted-foreground/70"
            />
            {loading && (
              <div className="px-6 shrink-0">
                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
            {searched && results.length === 0 && !loading ? (
              <div className="bg-card text-card-foreground p-12 rounded-3xl border shadow-sm flex flex-col items-center text-center">
                <div className="p-4 bg-secondary rounded-full mb-4">
                  <FileQuestion className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-2">No results found</h3>
                <p className="text-muted-foreground">We couldn't find any articles matching "{query}". Try adjusting your keywords.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {results.map((article) => (
                  <article key={article.id} className="relative group bg-card text-card-foreground p-6 md:p-8 rounded-2xl border shadow-sm transition-all hover:shadow-md hover:border-primary/30 flex flex-col gap-3">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded">
                        {article.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(article.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <h3 className="font-heading text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                      <Link to={`/article/${article.id}`} className="focus:outline-none before:absolute before:inset-0 relative">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-base text-muted-foreground line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] text-muted-foreground uppercase">
                          {article.author_name.substring(0, 2)}
                        </div>
                        {article.author_name}
                      </div>
                      <Link to={`/article/${article.id}`} className="text-sm font-bold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 relative z-10 hover:underline">
                        Read more <ArrowRight size={16} />
                      </Link>
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
