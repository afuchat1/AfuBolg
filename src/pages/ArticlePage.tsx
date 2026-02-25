import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tables } from "@/integrations/supabase/types";

type DbArticle = Tables<"articles">;

const ArticlePageSkeleton = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <div className="flex-1 py-10">
      <div className="container max-w-3xl">
        <Skeleton className="h-4 w-48 mb-6" />
        <Skeleton className="h-3 w-20 mb-3" />
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-10 w-1/2 mb-4" />
        <div className="flex gap-3 mb-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-px w-full mb-6" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full mb-3" />
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

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

  if (loading) return <ArticlePageSkeleton />;

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container flex-1 py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Articles" }]} />
          <p className="text-muted-foreground">Article not found.</p>
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
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: article.category, href: `/category/${article.category.toLowerCase()}` },
            { label: article.title },
          ]} />
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
