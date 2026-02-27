import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import { Plus, Edit, Trash2, Eye, EyeOff, Star, LogOut, Shield, PenSquare, BarChart3 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Article = Tables<"articles">;

const DashboardPage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchArticles();
      checkAdmin();
    }
  }, [user]);

  const checkAdmin = async () => {
    if (!user) return;
    const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    setIsAdmin(!!data);
  };

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setArticles(data || []);
    setLoading(false);
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Delete this article permanently?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      fetchArticles();
    }
  };

  const togglePublish = async (article: Article) => {
    const { error } = await supabase.from("articles").update({ published: !article.published }).eq("id", article.id);
    if (error) toast.error(error.message);
    else fetchArticles();
  };

  const toggleFeatured = async (article: Article) => {
    const { error } = await supabase.from("articles").update({ featured: !article.featured }).eq("id", article.id);
    if (error) toast.error(error.message);
    else fetchArticles();
  };

  const filteredArticles = articles.filter(a => {
    if (filter === "published") return a.published;
    if (filter === "drafts") return !a.published;
    return true;
  });

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.published).length,
    drafts: articles.filter(a => !a.published).length,
    featured: articles.filter(a => a.featured).length,
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-4 sm:py-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-secondary p-3 rounded">
            <div className="text-2xl font-bold font-heading">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Articles</div>
          </div>
          <div className="bg-secondary p-3 rounded">
            <div className="text-2xl font-bold font-heading text-primary">{stats.published}</div>
            <div className="text-xs text-muted-foreground">Published</div>
          </div>
          <div className="bg-secondary p-3 rounded">
            <div className="text-2xl font-bold font-heading text-muted-foreground">{stats.drafts}</div>
            <div className="text-xs text-muted-foreground">Drafts</div>
          </div>
          <div className="bg-secondary p-3 rounded">
            <div className="text-2xl font-bold font-heading text-primary">{stats.featured}</div>
            <div className="text-xs text-muted-foreground">Featured</div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl sm:text-2xl font-bold">My Articles</h1>
            {isAdmin && (
              <span className="bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium rounded">Admin</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter tabs */}
            <div className="flex bg-secondary rounded overflow-hidden text-xs">
              {(["all", "published", "drafts"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 capitalize transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <Link
              to="/write"
              className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity no-underline"
            >
              <PenSquare size={14} />
              <span className="hidden sm:inline">New Article</span>
              <span className="sm:hidden">New</span>
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors p-1.5" title="Admin Panel">
                <Shield size={18} />
              </Link>
            )}
            <button onClick={() => { signOut(); navigate("/"); }} className="text-muted-foreground hover:text-foreground transition-colors p-1.5" title="Sign out">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Articles list */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <PenSquare size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">
              {filter === "all" ? "No articles yet. Start writing!" : `No ${filter} articles.`}
            </p>
            <Link
              to="/write"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity no-underline"
            >
              <PenSquare size={16} />
              Write Your First Article
            </Link>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredArticles.map((article, i) => (
              <div key={article.id}>
                {i > 0 && <div className="h-px bg-muted my-3 sm:my-4" />}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {!article.published && (
                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Draft</span>
                      )}
                      {article.published && (
                        <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">Live</span>
                      )}
                      {article.featured && (
                        <Star size={12} className="text-primary fill-primary" />
                      )}
                      {isAdmin && article.author_id !== user?.id && (
                        <span className="text-xs text-muted-foreground">by {article.author_name}</span>
                      )}
                    </div>
                    <h3 className="font-heading text-base sm:text-lg font-semibold truncate">
                      <Link to={`/article/${article.id}`} className="text-foreground no-underline hover:text-primary transition-colors">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(article.created_at).toLocaleDateString()} · {article.read_time} · {article.content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length} words
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button onClick={() => togglePublish(article)} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title={article.published ? "Unpublish" : "Publish"}>
                      {article.published ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    {isAdmin && (
                      <button onClick={() => toggleFeatured(article)} className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Toggle featured">
                        <Star size={16} className={article.featured ? "fill-primary text-primary" : ""} />
                      </button>
                    )}
                    <button onClick={() => navigate(`/edit/${article.id}`)} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => deleteArticle(article.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <PageFooter
        pageName="Dashboard"
        relatedLinks={[
          { label: "Home", href: "/" },
          { label: "Write", href: "/write" },
          ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : []),
        ]}
      />
    </div>
  );
};

export default DashboardPage;
