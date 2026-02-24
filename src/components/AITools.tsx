import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Wand2, Type } from "lucide-react";

interface AIToolsProps {
  onGenerated: (data: { title?: string; content?: string; excerpt?: string; category?: string; readTime?: string }) => void;
  currentContent?: string;
  currentTitle?: string;
}

const AITools = ({ onGenerated, currentContent, currentTitle }: AIToolsProps) => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const callAI = async (action: string) => {
    setLoading(action);
    try {
      const { data, error } = await supabase.functions.invoke("ai-content", {
        body: { action, topic, content: currentContent, title: currentTitle },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      if (action === "generate") {
        onGenerated({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          category: data.category,
          readTime: data.readTime,
        });
        toast.success("Article generated!");
      } else if (action === "improve") {
        onGenerated({ content: data.content, excerpt: data.excerpt });
        toast.success(data.changes || "Content improved!");
      } else if (action === "headline") {
        if (data.headlines?.length) {
          const chosen = data.headlines[0];
          onGenerated({ title: chosen });
          toast.success(`Suggested: ${data.headlines.join(" | ")}`);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "AI request failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium uppercase tracking-widest text-primary flex items-center gap-2">
        <Sparkles size={14} /> AI Tools
      </h3>
      <div className="space-y-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic to generate an article..."
          className="w-full bg-secondary text-foreground px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => callAI("generate")}
            disabled={!topic || !!loading}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-3 py-2 text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Sparkles size={14} />
            {loading === "generate" ? "Generating..." : "Generate Article"}
          </button>
          <button
            onClick={() => callAI("improve")}
            disabled={!currentContent || !!loading}
            className="flex-1 flex items-center justify-center gap-2 bg-secondary text-foreground px-3 py-2 text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Wand2 size={14} />
            {loading === "improve" ? "Improving..." : "Improve Content"}
          </button>
          <button
            onClick={() => callAI("headline")}
            disabled={(!topic && !currentContent) || !!loading}
            className="flex-1 flex items-center justify-center gap-2 bg-secondary text-foreground px-3 py-2 text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Type size={14} />
            {loading === "headline" ? "Thinking..." : "Suggest Headlines"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITools;
