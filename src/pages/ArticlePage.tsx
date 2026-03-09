import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import articlePlaceholder from "@/assets/article-placeholder.jpg";
import type { Tables } from "@/integrations/supabase/types";

type DbArticle = Tables<"articles">;

/**
 * Processes article HTML to add IDs to blockquotes for anchor linking.
 * Writers can link to quotes using #quote-1, #quote-2, etc.
 */
const processContentWithAnchors = (html: string): string => {
  let quoteIndex = 0;
  return html.replace(/<blockquote/g, () => {
    quoteIndex++;
    return `<blockquote id="quote-${quoteIndex}"`;
  });
};

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

  // Scroll to hash anchor after content loads
  useEffect(() => {
    if (article && window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [article]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: article?.title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 px-6 sm:px-10 lg:px-16 py-20">
          <p className="text-muted-foreground">Article not found.</p>
        </div>
        <PageFooter pageName="Article" />
      </div>
    );
  }

  const authorSlug = article.author_name.toLowerCase().replace(/\s+/g, "-");
  const processedContent = processContentWithAnchors(article.content);

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

      {article.image_url && (
        <div className="w-full aspect-[21/9] max-h-[480px] overflow-hidden bg-muted">
          <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <article className="flex-1 px-6 sm:px-10 lg:px-16 py-10">
        <div className="max-w-3xl mx-auto">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">{article.category}</span>
          <h1 className="mt-2 font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.15] text-foreground">{article.title}</h1>
          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
            <Link to={`/writer/${authorSlug}`} className="flex items-center gap-2 no-underline">
              {authorAvatar ? (
                <img src={authorAvatar} alt={article.author_name} className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-[10px] font-bold text-muted-foreground">{article.author_name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <span className="font-semibold text-foreground hover:text-primary transition-colors">{article.author_name}</span>
            </Link>
            <span>·</span>
            <span>{article.read_time} read</span>
            <span>·</span>
            <time>{new Date(article.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
            <button onClick={handleShare} className="ml-auto text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Share2 size={13} /> Share
            </button>
          </div>
          <div className="mt-8 prose max-w-none text-foreground/85 leading-[1.85] text-[15px]" dangerouslySetInnerHTML={{ __html: processedContent }} />
        </div>
      </article>

      <PageFooter pageName="Article" />
    </div>
  );
};

export default ArticlePage;
