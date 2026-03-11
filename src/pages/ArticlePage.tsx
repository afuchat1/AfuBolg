import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import SEOHead from "@/components/SEOHead";
import AfuChatAd from "@/components/AfuChatAd";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type DbArticle = Tables<"articles">;

const BASE_URL = "https://stark-news-flow.lovable.app";

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
  const articleUrl = `${BASE_URL}/article/${article.slug}`;
  const plainText = article.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

  // Extract keywords from title and category
  const articleKeywords = `${article.category}, ${article.title.split(" ").slice(0, 5).join(", ")}, AfuChat blog, ${article.author_name}`;

  // JSON-LD Article structured data for Google rich results with images
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt || plainText.slice(0, 160),
    "image": article.image_url ? [article.image_url] : [],
    "author": {
      "@type": "Person",
      "name": article.author_name,
      "url": `${BASE_URL}/writer/${authorSlug}`,
    },
    "publisher": {
      "@type": "Organization",
      "name": "AfuBlog",
      "url": BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/favicon.png`,
      },
    },
    "datePublished": article.created_at,
    "dateModified": article.updated_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    "wordCount": wordCount,
    "articleSection": article.category,
    "inLanguage": "en-US",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={article.title}
        description={article.excerpt || plainText.slice(0, 155)}
        url={articleUrl}
        image={article.image_url || undefined}
        type="article"
        author={article.author_name}
        publishedTime={article.created_at}
        modifiedTime={article.updated_at}
        keywords={articleKeywords}
        jsonLd={jsonLd}
      />
      <Header />

      {article.image_url && (
        <div className="w-full aspect-[21/9] max-h-[480px] overflow-hidden bg-muted">
          <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" loading="eager" />
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
            <time dateTime={article.created_at}>{new Date(article.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
            <button onClick={handleShare} className="ml-auto text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Share2 size={13} /> Share
            </button>
          </div>

          <AfuChatAd className="mt-6 mb-6" />

          <div className="prose max-w-none text-foreground/85 leading-[1.85] text-[15px]" dangerouslySetInnerHTML={{ __html: processedContent }} />

          <AfuChatAd className="mt-8" />
        </div>
      </article>

      <PageFooter pageName="Article" />
    </div>
  );
};

export default ArticlePage;
