import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import SEOHead from "@/components/SEOHead";
import { User } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type DbArticle = Tables<"articles">;

const WriterProfilePage = () => {
  const { name } = useParams();
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [profile, setProfile] = useState<{ display_name: string | null; bio: string; avatar_url: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!name) return;
      const authorName = decodeURIComponent(name).replace(/-/g, " ");

      // Fetch articles by this author
      const { data: arts } = await supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .ilike("author_name", authorName)
        .order("created_at", { ascending: false });

      setArticles(arts || []);

      // Try to find matching profile
      if (arts && arts.length > 0 && arts[0].author_id) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("display_name, bio, avatar_url")
          .eq("user_id", arts[0].author_id)
          .maybeSingle();
        if (prof) setProfile(prof as any);
      }

      setLoading(false);
    };
    fetch();
  }, [name]);

  const displayName = profile?.display_name || decodeURIComponent(name || "").replace(/-/g, " ");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={displayName}
        description={`Articles by ${displayName} on AfuBlog`}
        url={`https://stark-news-flow.lovable.app/writer/${name}`}
        type="profile"
      />
      <Header />

      <div className="flex-1 px-6 sm:px-10 lg:px-16 py-12">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Writers" }, { label: displayName }]} />

          {/* Profile Header */}
          <div className="mt-8 flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-muted-foreground" />
              )}
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">{displayName}</h1>
              {profile?.bio && <p className="mt-2 text-muted-foreground leading-relaxed">{profile.bio}</p>}
              <p className="mt-2 text-sm text-muted-foreground">{articles.length} article{articles.length !== 1 ? "s" : ""} published</p>
            </div>
          </div>

          {/* Articles */}
          <div className="mt-12">
            <h2 className="font-heading text-xl font-bold text-foreground mb-8">Published Articles</h2>
            {articles.length === 0 ? (
              <p className="text-muted-foreground">No published articles yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
            )}
          </div>
        </div>
      </div>

      <PageFooter pageName="Writer" relatedLinks={[{ label: "Home", href: "/" }, { label: "Archive", href: "/archive" }]} />
    </div>
  );
};

export default WriterProfilePage;
