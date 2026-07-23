import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface Source {
  url: string;
  title: string;
  image?: string;
  snippet?: string;
}

interface SummaryData {
  tldr?: string;
  keyPoints?: string[];
  context?: string;
  whyItMatters?: string;
  sources?: Source[];
}

interface Props {
  title: string;
  content: string;
  category?: string;
}

const ArticleSummary = ({ title, content, category }: Props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SummaryData | null>(null);
  const [showSources, setShowSources] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("summarize-article", {
        body: { title, content, category },
      });
      if (error) throw error;
      if (res?.error) throw new Error(res.error);
      setData(res);
    } catch (err: any) {
      toast.error(err.message || "Could not generate summary");
    } finally {
      setLoading(false);
    }
  };

  if (!data && !loading) {
    return (
      <div className="my-8 border border-primary/30 bg-primary/[0.03] px-5 py-6 rounded-sm">
        <div className="flex items-start gap-4 flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-sm">
              <Sparkles size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-foreground">AI Summary by Engagera</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Get a live, source-backed TL;DR of this article — enriched with real-time web context.
              </p>
            </div>
          </div>
          <button
            onClick={generate}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity rounded-sm"
          >
            <Sparkles size={13} /> Summarize
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-8 border border-primary/30 bg-primary/[0.03] px-5 py-6 rounded-sm">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 size={18} className="animate-spin text-primary" />
          <span>Engagera is reading the article and crawling live sources…</span>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-muted animate-pulse rounded w-full" />
          <div className="h-3 bg-muted animate-pulse rounded w-11/12" />
          <div className="h-3 bg-muted animate-pulse rounded w-4/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 border border-primary/30 bg-primary/[0.03] rounded-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-primary/20 bg-primary/5">
        <Sparkles size={14} className="text-primary" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
          AI Summary · Powered by Engagera
        </span>
      </div>
      <div className="px-5 py-5 space-y-5">
        {data?.tldr && (
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">TL;DR</h4>
            <p className="text-[15px] leading-relaxed text-foreground">{data.tldr}</p>
          </div>
        )}

        {data?.keyPoints && data.keyPoints.length > 0 && (
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Key Points</h4>
            <ul className="space-y-1.5">
              {data.keyPoints.map((kp, i) => (
                <li key={i} className="text-sm text-foreground/85 leading-relaxed flex gap-2">
                  <span className="text-primary font-bold shrink-0">›</span>
                  <span>{kp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data?.context && (
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Live Context</h4>
            <p className="text-sm text-foreground/85 leading-relaxed">{data.context}</p>
          </div>
        )}

        {data?.whyItMatters && (
          <div className="border-l-2 border-primary pl-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Why it matters</h4>
            <p className="text-sm text-foreground/90 leading-relaxed">{data.whyItMatters}</p>
          </div>
        )}

        {data?.sources && data.sources.length > 0 && (
          <div className="pt-3 border-t border-primary/15">
            <button
              onClick={() => setShowSources((s) => !s)}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Live Sources ({data.sources.length})
              {showSources ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {showSources && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.sources.slice(0, 6).map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-3 p-2 border border-muted hover:border-primary/40 transition-colors rounded-sm"
                  >
                    {s.image && (
                      <img
                        src={s.image}
                        alt=""
                        className="w-14 h-14 object-cover rounded-sm shrink-0 bg-muted"
                        loading="lazy"
                        onError={(e) => ((e.currentTarget.style.display = "none"))}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground group-hover:text-primary line-clamp-2 leading-snug">
                        {s.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                        <ExternalLink size={9} /> {new URL(s.url).hostname.replace("www.", "")}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleSummary;
