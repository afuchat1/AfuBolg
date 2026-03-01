import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import articlePlaceholder from "@/assets/article-placeholder.jpg";
import type { Tables } from "@/integrations/supabase/types";
import ArticleEngagement from "@/components/ArticleEngagement";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 px-6 sm:px-12 lg:px-20 py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Not Found" }]} />
          <p className="text-muted-foreground">Article not found.</p>
        </div>
        <PageFooter pageName="Article" relatedLinks={[{ label: "Home", href: "/" }]} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero image */}
      <div className="relative w-full aspect-[21/9] max-h-[500px] overflow-hidden">
        <img
          src={article.image_url || articlePlaceholder}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <article className="flex-1 px-6 sm:px-12 lg:px-20 -mt-20 relative z-10">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: article.category, href: `/category/${article.category}` },
            { label: article.title },
          ]} />
          <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-primary font-medium mt-6">
            {article.category}
          </span>
          <h1 className="mt-2 font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1]">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{article.author_name}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{article.read_time} read</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <time>{new Date(article.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
          </div>
          <div className="mt-8 h-px bg-border" />
          <div
            className="mt-8 prose prose-invert max-w-none text-foreground/90 leading-relaxed text-[15px]"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>

      <section className="px-6 sm:px-12 lg:px-20">
        <ArticleEngagement articleId={article.id} articleTitle={article.title} />
      </section>

      <PageFooter
        pageName="Article"
        relatedLinks={[
          { label: "Home", href: "/" },
          { label: "Archive", href: "/archive" },
          { label: "Search", href: "/search" },
        ]}
      />
    </div>
  );
};

export default ArticlePage;
