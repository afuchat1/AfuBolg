import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleEngagement from "@/components/ArticleEngagement";
import SEOHead from "@/components/SEOHead";
import articlePlaceholder from "@/assets/article-placeholder.jpg";
import type { Tables } from "@/integrations/supabase/types";

type DbArticle = Tables<"articles">;

const ArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<DbArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorAvatar, setAuthorAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      setArticle(data);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  useEffect(() => {
    if (article?.author_id) {
      supabase.from("profiles").select("avatar_url").eq("user_id", article.author_id).maybeSingle().then(({ data }) => {
        if (data?.avatar_url) setAuthorAvatar(data.avatar_url);
      });
    }
  }, [article]);

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
        <div className="flex-1 px-6 sm:px-10 lg:px-16 py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Not Found" }]} />
          <p className="text-muted-foreground">Article not found.</p>
        </div>
        <PageFooter pageName="Article" relatedLinks={[{ label: "Home", href: "/" }]} />
      </div>
    );
  }

  const authorSlug = article.author_name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={article.title}
        description={article.excerpt || article.title}
        url={`https://stark-news-flow.lovable.app/article/${article.slug}`}
        image={article.image_url || undefined}
        type="article"
        author={article.author_name}
        publishedTime={article.created_at}
      />
      <Header />

      <div className="relative w-full aspect-[21/9] max-h-[520px] overflow-hidden bg-muted">
        <img src={article.image_url || articlePlaceholder} alt={article.title} className="w-full h-full object-cover" />
      </div>

      <article className="flex-1 px-6 sm:px-10 lg:px-16 py-12">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: article.category, href: `/category/${article.category}` }, { label: article.title }]} />
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mt-6">{article.category}</span>
          <h1 className="mt-3 font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.15] text-foreground">{article.title}</h1>
          <div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
            <Link to={`/writer/${authorSlug}`} className="flex items-center gap-2 no-underline">
              {authorAvatar ? (
                <img src={authorAvatar} alt={article.author_name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">{article.author_name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <span className="font-semibold text-foreground hover:text-primary transition-colors">{article.author_name}</span>
            </Link>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{article.read_time} read</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <time>{new Date(article.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
          </div>
          <div className="mt-10 h-px bg-border" />
          <div className="mt-10 prose max-w-none text-foreground/85 leading-[1.85] text-[16px]" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </article>

      <section className="px-6 sm:px-10 lg:px-16">
        <ArticleEngagement articleId={article.id} articleTitle={article.title} />
      </section>

      <PageFooter pageName="Article" relatedLinks={[{ label: "Home", href: "/" }, { label: "Archive", href: "/archive" }, { label: "Search", href: "/search" }]} />
    </div>
  );
};

export default ArticlePage;
