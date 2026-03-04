import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import AITools from "@/components/AITools";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import CoverImageUpload from "@/components/CoverImageUpload";
import { ArrowLeft, Save, Send } from "lucide-react";

const EditArticlePage = () => {
  const { user, loading: authLoading } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [articleId, setArticleId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [article, setArticle] = useState({
    title: "",
    content: "",
    excerpt: "",
    read_time: "3 min",
    published: false,
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && slug) fetchArticle();
  }, [user, slug]);

  const fetchArticle = async () => {
    const { data, error } = await supabase.from("articles").select("*").eq("slug", slug!).maybeSingle();
    if (error || !data) {
      toast.error("Article not found");
      navigate("/dashboard");
      return;
    }
    setArticleId(data.id);
    setImageUrl(data.image_url || null);
    setArticle({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || "",
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
    if (!article.title || !articleId) { toast.error("Title required"); return; }
    setSaving(true);
    const updates: any = {
      title: article.title, content: article.content,
      excerpt: article.excerpt || null, read_time: article.read_time,
      image_url: imageUrl,
    };
    if (pub !== undefined) updates.published = pub;
    const { error } = await supabase.from("articles").update(updates).eq("id", articleId);
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
      <div className="flex-1 px-6 sm:px-12 lg:px-20 py-6">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground hidden sm:inline">{wordCount} words</span>
            <button onClick={() => save()} disabled={saving} className="flex items-center gap-1.5 border border-border text-foreground px-4 py-1.5 text-xs font-medium hover:bg-secondary transition-colors disabled:opacity-50">
              <Save size={12} /> Save
            </button>
            {!article.published && (
              <button onClick={() => save(true)} disabled={saving} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                <Send size={12} /> Publish
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <AITools currentContent={article.content} currentTitle={article.title} onGenerated={(data) => {
            setArticle(prev => ({ ...prev, ...(data.title && { title: data.title }), ...(data.content && { content: data.content }), ...(data.excerpt && { excerpt: data.excerpt }), ...(data.readTime && { read_time: data.readTime }) }));
          }} />
        </div>

        <div className="max-w-3xl mx-auto">
          <CoverImageUpload imageUrl={imageUrl} userId={user!.id} onImageChange={setImageUrl} />
          <input type="text" value={article.title} onChange={(e) => setArticle({ ...article, title: e.target.value })} placeholder="Article title..." className="w-full bg-transparent text-foreground font-heading text-2xl sm:text-4xl font-bold outline-none mb-4 placeholder:text-muted-foreground/30" />
          <textarea value={article.excerpt} onChange={(e) => setArticle({ ...article, excerpt: e.target.value })} rows={2} placeholder="Short summary..." className="w-full bg-transparent text-muted-foreground text-sm outline-none resize-none mb-6 placeholder:text-muted-foreground/30 border-b border-border pb-4" />
          <RichTextEditor content={article.content} onChange={(html) => setArticle({ ...article, content: html })} onAutoSave={() => save()} wordCount={wordCount} />
        </div>
      </div>
      <PageFooter pageName="Edit Article" relatedLinks={[{ label: "Dashboard", href: "/dashboard" }, { label: "Home", href: "/" }]} />
    </div>
  );
};

export default EditArticlePage;
