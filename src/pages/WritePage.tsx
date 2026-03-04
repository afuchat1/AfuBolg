import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import AITools from "@/components/AITools";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import { ArrowLeft, Send, Save } from "lucide-react";
import CoverImageUpload from "@/components/CoverImageUpload";

const WritePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [article, setArticle] = useState({
    title: "",
    content: "",
    excerpt: "",
    read_time: "3 min",
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const wordCount = article.content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    const mins = Math.max(1, Math.ceil(wordCount / 200));
    setArticle(prev => ({ ...prev, read_time: `${mins} min` }));
  }, [wordCount]);

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
    if (!article.title) { toast.error("Add a title first"); return; }
    setSaving(true);
    autoExcerpt();

    if (draftId) {
      const { error } = await supabase.from("articles").update({
        title: article.title, content: article.content,
        excerpt: article.excerpt, read_time: article.read_time,
        image_url: imageUrl,
      }).eq("id", draftId);
      if (error) toast.error(error.message);
      else toast.success("Draft saved");
    } else {
      const { data, error } = await supabase.from("articles").insert({
        title: article.title, content: article.content,
        excerpt: article.excerpt || null, read_time: article.read_time,
        image_url: imageUrl,
        author_id: user!.id,
        author_name: user!.user_metadata?.display_name || user!.email || "Anonymous",
        published: false, featured: false, category: "General",
      } as any).select("id").single();
      if (error) toast.error(error.message);
      else { setDraftId(data.id); toast.success("Draft created"); }
    }
    setSaving(false);
  };

  const publish = async () => {
    if (!article.title || !article.content) { toast.error("Title and content are required"); return; }
    setSaving(true);
    autoExcerpt();

    if (draftId) {
      const { error } = await supabase.from("articles").update({
        title: article.title, content: article.content,
        excerpt: article.excerpt, read_time: article.read_time, published: true,
        image_url: imageUrl,
      }).eq("id", draftId);
      if (error) toast.error(error.message);
      else { toast.success("Published!"); navigate("/dashboard"); }
    } else {
      const { error } = await supabase.from("articles").insert({
        title: article.title, content: article.content,
        excerpt: article.excerpt || null, read_time: article.read_time,
        image_url: imageUrl,
        author_id: user!.id,
        author_name: user!.user_metadata?.display_name || user!.email || "Anonymous",
        published: true, featured: false, category: "General",
      } as any);
      if (error) toast.error(error.message);
      else { toast.success("Published!"); navigate("/dashboard"); }
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
      <div className="flex-1 px-6 sm:px-12 lg:px-20 py-6">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground hidden sm:inline">{wordCount} words · {article.read_time} read</span>
            <button onClick={saveDraft} disabled={saving} className="flex items-center gap-1.5 border border-border text-foreground px-4 py-1.5 text-xs font-medium hover:bg-secondary transition-colors disabled:opacity-50">
              <Save size={12} /> Save Draft
            </button>
            <button onClick={publish} disabled={saving} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              <Send size={12} /> Publish
            </button>
          </div>
        </div>

        <div className="mb-6">
          <AITools currentContent={article.content} currentTitle={article.title} onGenerated={(data) => {
            setArticle(prev => ({ ...prev, ...(data.title && { title: data.title }), ...(data.content && { content: data.content }), ...(data.excerpt && { excerpt: data.excerpt }), ...(data.readTime && { read_time: data.readTime }) }));
          }} />
        </div>

        <div className="max-w-3xl mx-auto">
          <input type="text" value={article.title} onChange={(e) => setArticle({ ...article, title: e.target.value })} placeholder="Article title..." className="w-full bg-transparent text-foreground font-heading text-2xl sm:text-4xl font-bold outline-none mb-4 placeholder:text-muted-foreground/30" />
          <textarea value={article.excerpt} onChange={(e) => setArticle({ ...article, excerpt: e.target.value })} rows={2} placeholder="Short summary (auto-generated if left empty)..." className="w-full bg-transparent text-muted-foreground text-sm outline-none resize-none mb-6 placeholder:text-muted-foreground/30 border-b border-border pb-4" />
          <RichTextEditor content={article.content} onChange={(html) => setArticle({ ...article, content: html })} onAutoSave={draftId ? saveDraft : undefined} wordCount={wordCount} />
        </div>
      </div>
      <PageFooter pageName="Write" relatedLinks={[{ label: "Dashboard", href: "/dashboard" }, { label: "Home", href: "/" }]} />
    </div>
  );
};

export default WritePage;
