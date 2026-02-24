import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import AITools from "@/components/AITools";
import { Plus, Edit, Trash2, Eye, EyeOff, Star, LogOut, ArrowLeft } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Article = Tables<"articles">;

const CATEGORIES = ["General", "Markets", "Technology", "Economy", "Energy", "Policy", "Science", "Automotive", "Real Estate"];

const AdminDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchArticles();
  }, [user]);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("author_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) toast.error(error.message);
    else setArticles(data || []);
    setLoading(false);
  };

  const startNew = () => {
    setIsNew(true);
    setEditingArticle({
      title: "",
      content: "",
      excerpt: "",
      category: "General",
      image_url: "",
      featured: false,
      published: false,
      read_time: "3 min",
    });
  };

  const startEdit = (article: Article) => {
    setIsNew(false);
    setEditingArticle({ ...article });
  };

  const save = async () => {
    if (!editingArticle?.title) {
      toast.error("Title is required");
      return;
    }

    if (isNew) {
      const { error } = await supabase.from("articles").insert({
        title: editingArticle.title!,
        content: editingArticle.content || "",
        excerpt: editingArticle.excerpt || null,
        category: editingArticle.category || "General",
        image_url: editingArticle.image_url || null,
        featured: editingArticle.featured || false,
        published: editingArticle.published || false,
        read_time: editingArticle.read_time || "3 min",
        author_id: user!.id,
        author_name: user!.user_metadata?.display_name || user!.email || "Unknown",
      });
      if (error) { toast.error(error.message); return; }
      toast.success("Article created");
    } else {
      const { error } = await supabase
        .from("articles")
        .update({
          title: editingArticle.title,
          content: editingArticle.content,
          excerpt: editingArticle.excerpt,
          category: editingArticle.category,
          image_url: editingArticle.image_url,
          featured: editingArticle.featured,
          published: editingArticle.published,
          read_time: editingArticle.read_time,
        })
        .eq("id", editingArticle.id!);
      if (error) { toast.error(error.message); return; }
      toast.success("Article updated");
    }

    setEditingArticle(null);
    fetchArticles();
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Article deleted");
      fetchArticles();
    }
  };

  const togglePublish = async (article: Article) => {
    const { error } = await supabase
      .from("articles")
      .update({ published: !article.published })
      .eq("id", article.id);
    if (error) toast.error(error.message);
    else fetchArticles();
  };

  const toggleFeatured = async (article: Article) => {
    const { error } = await supabase
      .from("articles")
      .update({ featured: !article.featured })
      .eq("id", article.id);
    if (error) toast.error(error.message);
    else fetchArticles();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  // Editor view
  if (editingArticle) {
    return (
      <div className="min-h-screen">
        <div className="container max-w-4xl py-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setEditingArticle(null)} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
              <ArrowLeft size={14} /> Back to list
            </button>
            <div className="flex gap-2">
              <button onClick={save} className="bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity">
                {isNew ? "Create" : "Update"}
              </button>
            </div>
          </div>

          {/* AI Tools */}
          <div className="mb-6">
            <AITools
              currentContent={editingArticle.content}
              currentTitle={editingArticle.title}
              onGenerated={(data) => {
                setEditingArticle((prev) => ({
                  ...prev,
                  ...(data.title && { title: data.title }),
                  ...(data.content && { content: data.content }),
                  ...(data.excerpt && { excerpt: data.excerpt }),
                  ...(data.category && { category: data.category }),
                  ...(data.readTime && { read_time: data.readTime }),
                }));
              }}
            />
          </div>

          {/* Title */}
          <input
            type="text"
            value={editingArticle.title || ""}
            onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
            placeholder="Article title"
            className="w-full bg-transparent text-foreground font-heading text-3xl font-bold outline-none mb-4 placeholder:text-muted-foreground"
          />

          {/* Meta fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Category</label>
              <select
                value={editingArticle.category || "General"}
                onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                className="w-full bg-secondary text-foreground px-3 py-2 text-sm outline-none"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Read time</label>
              <input
                type="text"
                value={editingArticle.read_time || ""}
                onChange={(e) => setEditingArticle({ ...editingArticle, read_time: e.target.value })}
                className="w-full bg-secondary text-foreground px-3 py-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Image URL</label>
              <input
                type="url"
                value={editingArticle.image_url || ""}
                onChange={(e) => setEditingArticle({ ...editingArticle, image_url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-secondary text-foreground px-3 py-2 text-sm outline-none"
              />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingArticle.published || false}
                  onChange={(e) => setEditingArticle({ ...editingArticle, published: e.target.checked })}
                  className="accent-primary"
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingArticle.featured || false}
                  onChange={(e) => setEditingArticle({ ...editingArticle, featured: e.target.checked })}
                  className="accent-primary"
                />
                Featured
              </label>
            </div>
          </div>

          {/* Excerpt */}
          <div className="mb-4">
            <label className="block text-xs text-muted-foreground mb-1">Excerpt</label>
            <textarea
              value={editingArticle.excerpt || ""}
              onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
              rows={2}
              placeholder="Short summary..."
              className="w-full bg-secondary text-foreground px-3 py-2 text-sm outline-none resize-none"
            />
          </div>

          {/* Rich text editor */}
          <RichTextEditor
            content={editingArticle.content || ""}
            onChange={(html) => setEditingArticle({ ...editingArticle, content: html })}
          />
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="min-h-screen">
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary no-underline">← Back to site</Link>
            <h1 className="font-heading text-2xl font-bold mt-1">Content Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={startNew} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity">
              <Plus size={14} /> New Article
            </button>
            <button onClick={() => { signOut(); navigate("/"); }} className="text-muted-foreground hover:text-foreground transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {articles.length === 0 ? (
          <p className="text-muted-foreground text-sm mt-10 text-center">
            No articles yet. Click "New Article" to create your first one.
          </p>
        ) : (
          <div className="space-y-0">
            {articles.map((article, i) => (
              <div key={article.id}>
                {i > 0 && <div className="h-px bg-muted my-4" />}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs uppercase tracking-widest text-primary">{article.category}</span>
                      {!article.published && (
                        <span className="text-xs text-muted-foreground">Draft</span>
                      )}
                      {article.featured && (
                        <Star size={12} className="text-primary fill-primary" />
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-semibold truncate">{article.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(article.created_at).toLocaleDateString()} · {article.read_time}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => togglePublish(article)} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title={article.published ? "Unpublish" : "Publish"}>
                      {article.published ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => toggleFeatured(article)} className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Toggle featured">
                      <Star size={16} className={article.featured ? "fill-primary text-primary" : ""} />
                    </button>
                    <button onClick={() => startEdit(article)} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Edit">
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
    </div>
  );
};

export default AdminDashboard;
