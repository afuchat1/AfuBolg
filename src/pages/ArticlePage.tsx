import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Tables } from "@/integrations/supabase/types";

type DbArticle = Tables<"articles">;

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<DbArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      setArticle(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container flex-1 py-20">
          <p className="text-muted-foreground">Article not found.</p>
          <Link to="/" className="mt-4 inline-block text-primary">← Back to home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <article className="flex-1 py-10">
        <div className="container max-w-3xl">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors no-underline">
            ← Back
          </Link>
          <span className="mt-6 block text-xs font-medium uppercase tracking-widest text-primary">
            {article.category}
          </span>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <span>{article.author_name}</span>
            <span>·</span>
            <span>{article.read_time} read</span>
            <span>·</span>
            <time>{new Date(article.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
          </div>
          {article.image_url && (
            <img src={article.image_url} alt={article.title} className="mt-6 w-full max-h-96 object-cover" />
          )}
          <div className="mt-8 h-px bg-muted" />
          <div
            className="mt-8 prose prose-invert max-w-none text-foreground/90 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default ArticlePage;
