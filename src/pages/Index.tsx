import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import PageFooter from "@/components/PageFooter";
import SEOHead from "@/components/SEOHead";
import AfuChatAd from "@/components/AfuChatAd";
import type { Tables } from "@/integrations/supabase/types";

type DbArticle = Tables<"articles">;

const BASE_URL = "https://stark-news-flow.lovable.app";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AfuBlog",
    "alternateName": "AfuChat Blog",
    "url": BASE_URL,
    "description": "The official blog for AfuChat — AI chatbot platform. Read the latest on artificial intelligence, machine learning, chatbot development, and tech innovation.",
    "publisher": {
      "@type": "Organization",
      "name": "AfuChat",
      "url": "https://afuchat.com",
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/favicon.png` },
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": { "@type": "EntryPoint", "urlTemplate": `${BASE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Home"
        description="AfuBlog — The official blog for AfuChat.com. Read the latest articles on AI, chatbots, machine learning, natural language processing, and tech innovation from AfuChat experts."
        url={BASE_URL}
        keywords="AfuChat blog, AI news, chatbot updates, artificial intelligence articles, machine learning insights, NLP, tech blog, AI platform news"
        jsonLd={jsonLd}
      />
      <Header />

      <main className="flex-1 px-6 sm:px-10 lg:px-16 py-10">
        <AfuChatAd className="mb-8" />
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {articles.map((a) => (
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
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">No articles published yet.</p>
          </div>
        )}
        <AfuChatAd className="mt-8" />
      </main>

      <PageFooter pageName="Home" />
    </div>
  );
};

export default Index;
