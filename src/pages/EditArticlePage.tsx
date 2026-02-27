import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import AITools from "@/components/AITools";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import { ArrowLeft, Save, Send } from "lucide-react";

const EditArticlePage = () => {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState({
    title: "",
    content: "",
    excerpt: "",
    image_url: "",
    read_time: "3 min",
    published: false,
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && id) fetchArticle();
  }, [user, id]);

  const fetchArticle = async () => {
    const { data, error } = await supabase.from("articles").select("*").eq("id", id!).maybeSingle();
    if (error || !data) {
      toast.error("Article not found or access denied");
      navigate("/dashboard");
      return;
    }
    setArticle({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || "",
      image_url: data.image_url || "",
      read_time: data.read_time || "3 min",
      published: data.published,
    });
    setLoading(false);
  };

  const wordCount = article.content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    const mins = Math.max(1, Math.ceil(wordCount / 200));
    setArticle(prev => ({ ...prev, read_time: `${mins} min` }));
  }, [wordCount]);

  const save = async (pub?: boolean) => {
    if (!article.title) { toast.error("Title required"); return; }
    setSaving(true);

    const updates: any = {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || null,
      image_url: article.image_url || null,
      read_time: article.read_time,
    };
    if (pub !== undefined) updates.published = pub;

    const { error } = await supabase.from("articles").update(updates).eq("id", id!);
    if (error) toast.error(error.message);
    else {
      toast.success(pub ? "Published!" : "Saved");
      if (pub) navigate("/dashboard");
    }
    setSaving(false);
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
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">{wordCount} words</span>
            <button onClick={() => save()} disabled={saving} className="flex items-center gap-1.5 bg-secondary text-foreground px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50">
              <Save size={14} />
              Save
            </button>
            {!article.published && (
              <button onClick={() => save(true)} disabled={saving} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                <Send size={14} />
                Publish
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <AITools
            currentContent={article.content}
            currentTitle={article.title}
            onGenerated={(data) => {
              setArticle(prev => ({
                ...prev,
                ...(data.title && { title: data.title }),
                ...(data.content && { content: data.content }),
                ...(data.excerpt && { excerpt: data.excerpt }),
                ...(data.readTime && { read_time: data.readTime }),
              }));
            }}
          />
        </div>

        <input
          type="text"
          value={article.title}
          onChange={(e) => setArticle({ ...article, title: e.target.value })}
          placeholder="Article title..."
          className="w-full bg-transparent text-foreground font-heading text-2xl sm:text-4xl font-bold outline-none mb-4 placeholder:text-muted-foreground/40"
        />

        <div className="mb-4">
          <input
            type="url"
            value={article.image_url}
            onChange={(e) => setArticle({ ...article, image_url: e.target.value })}
            placeholder="Cover image URL (optional)"
            className="w-full bg-secondary text-foreground px-3 py-2 text-sm outline-none rounded placeholder:text-muted-foreground/50"
          />
          {article.image_url && (
            <img src={article.image_url} alt="Cover" className="mt-2 w-full max-h-48 object-cover rounded" />
          )}
        </div>

        <div className="mb-4">
          <textarea
            value={article.excerpt}
            onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
            rows={2}
            placeholder="Short summary..."
            className="w-full bg-secondary text-foreground px-3 py-2 text-sm outline-none resize-none rounded placeholder:text-muted-foreground/50"
          />
        </div>

        <RichTextEditor
          content={article.content}
          onChange={(html) => setArticle({ ...article, content: html })}
          onAutoSave={() => save()}
          wordCount={wordCount}
        />
      </div>
      <PageFooter pageName="Edit Article" relatedLinks={[{ label: "Dashboard", href: "/dashboard" }, { label: "Home", href: "/" }]} />
    </div>
  );
};

export default EditArticlePage;
