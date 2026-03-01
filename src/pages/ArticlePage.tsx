import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleEngagement from "@/components/ArticleEngagement";
import articlePlaceholder from "@/assets/article-placeholder.jpg";
import { Calendar, User, Clock, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
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
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 px-6 sm:px-10 lg:px-16 py-20 max-w-4xl mx-auto w-full text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you are looking for does not exist or has been removed.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
            <ChevronLeft size={16} /> Back to Home
          </Link>
        </div>
        <PageFooter pageName="Article" relatedLinks={[{ label: "Home", href: "/" }]} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pb-12 md:pb-20">

        {/* Full Bleed Hero image */}
        <div className="relative w-full aspect-[21/9] max-h-[500px] bg-muted mb-10 md:mb-16">
          <img
            src={article.image_url || articlePlaceholder}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-10 text-sm">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: article.category, href: `/category/${article.category}` },
                { label: article.title },
              ]}
            />
          </div>

          <article>
            {/* Article Header */}
            <div className="mb-10">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-xs font-bold uppercase tracking-widest text-primary mb-6">
                {article.category}
              </span>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-foreground mb-8 text-left">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center justify-start gap-6 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-muted-foreground/80" />
                  <span className="text-foreground">{article.author_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground/80" />
                  <span>{article.read_time} read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-muted-foreground/80" />
                  <time>
                    {new Date(article.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </div>

            <div className="h-px bg-border/40 w-full mb-10" />

            {/* Article Prose */}
            <div
              className="prose prose-lg max-w-none text-muted-foreground leading-relaxed prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-img:rounded-xl mb-16"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Divider below content */}
            <div className="h-px bg-border/40 w-full mb-10" />

            {/* Engagement Section */}
            <div className="pb-8">
              <ArticleEngagement articleId={article.id} articleTitle={article.title} />
            </div>
          </article>
        </div>
      </main>

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
