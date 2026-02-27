import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import AITools from "@/components/AITools";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import { ArrowLeft, Send, Save, Eye } from "lucide-react";

const WritePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [article, setArticle] = useState({
    title: "",
    content: "",
    excerpt: "",
    image_url: "",
    read_time: "3 min",
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  // Auto-calculate word count
  const wordCount = article.content
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  // Auto-calculate read time
  useEffect(() => {
    const mins = Math.max(1, Math.ceil(wordCount / 200));
    setArticle(prev => ({ ...prev, read_time: `${mins} min` }));
  }, [wordCount]);

  // Auto-generate excerpt from content
  const autoExcerpt = useCallback(() => {
    if (!article.excerpt && article.content) {
      const text = article.content.replace(/<[^>]*>/g, "").trim();
      if (text.length > 20) {
        const excerpt = text.slice(0, 160).trim() + (text.length > 160 ? "..." : "");
        setArticle(prev => ({ ...prev, excerpt }));
      }
    }
  }, [article.content, article.excerpt]);

  const saveDraft = async () => {
    if (!article.title) {
      toast.error("Add a title first");
      return;
    }
    setSaving(true);
    autoExcerpt();

    if (draftId) {
      const { error } = await supabase.from("articles").update({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        image_url: article.image_url || null,
        read_time: article.read_time,
      }).eq("id", draftId);
      if (error) toast.error(error.message);
      else toast.success("Draft saved");
    } else {
      const { data, error } = await supabase.from("articles").insert({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt || null,
        image_url: article.image_url || null,
        read_time: article.read_time,
        author_id: user!.id,
        author_name: user!.user_metadata?.display_name || user!.email || "Anonymous",
        published: false,
        featured: false,
        category: "General",
      }).select("id").single();
      if (error) toast.error(error.message);
      else {
        setDraftId(data.id);
        toast.success("Draft created");
      }
    }
    setSaving(false);
  };

  const publish = async () => {
    if (!article.title || !article.content) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    autoExcerpt();

    if (draftId) {
      const { error } = await supabase.from("articles").update({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        image_url: article.image_url || null,
        read_time: article.read_time,
        published: true,
      }).eq("id", draftId);
      if (error) toast.error(error.message);
      else {
        toast.success("Published!");
        navigate("/dashboard");
      }
    } else {
      const { error } = await supabase.from("articles").insert({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt || null,
        image_url: article.image_url || null,
        read_time: article.read_time,
        author_id: user!.id,
        author_name: user!.user_metadata?.display_name || user!.email || "Anonymous",
        published: true,
        featured: false,
        category: "General",
      });
      if (error) toast.error(error.message);
      else {
        toast.success("Published!");
        navigate("/dashboard");
      }
    }
    setSaving(false);
  };

  if (authLoading) {
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
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {wordCount} words · {article.read_time} read
            </span>
            <button
              onClick={saveDraft}
              disabled={saving}
              className="flex items-center gap-1.5 bg-secondary text-foreground px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              <Save size={14} />
              <span className="hidden sm:inline">Save Draft</span>
              <span className="sm:hidden">Save</span>
            </button>
            <button
              onClick={publish}
              disabled={saving}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send size={14} />
              Publish
            </button>
          </div>
        </div>

        {/* AI Tools */}
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

        {/* Title */}
        <input
          type="text"
          value={article.title}
          onChange={(e) => setArticle({ ...article, title: e.target.value })}
          placeholder="Your article title..."
          className="w-full bg-transparent text-foreground font-heading text-2xl sm:text-4xl font-bold outline-none mb-4 placeholder:text-muted-foreground/40"
        />

        {/* Cover image */}
        <div className="mb-4">
          <input
            type="url"
            value={article.image_url}
            onChange={(e) => setArticle({ ...article, image_url: e.target.value })}
            placeholder="Cover image URL (optional)"
            className="w-full bg-secondary text-foreground px-3 py-2 text-sm outline-none rounded placeholder:text-muted-foreground/50"
          />
          {article.image_url && (
            <img src={article.image_url} alt="Cover preview" className="mt-2 w-full max-h-48 object-cover rounded" />
          )}
        </div>

        {/* Excerpt */}
        <div className="mb-4">
          <textarea
            value={article.excerpt}
            onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
            rows={2}
            placeholder="Short summary (auto-generated if left empty)..."
            className="w-full bg-secondary text-foreground px-3 py-2 text-sm outline-none resize-none rounded placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Editor */}
        <RichTextEditor
          content={article.content}
          onChange={(html) => setArticle({ ...article, content: html })}
          onAutoSave={draftId ? saveDraft : undefined}
          wordCount={wordCount}
        />
      </div>
      <PageFooter pageName="Write" relatedLinks={[{ label: "Dashboard", href: "/dashboard" }, { label: "Home", href: "/" }]} />
    </div>
  );
};

export default WritePage;
