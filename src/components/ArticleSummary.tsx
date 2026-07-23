import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

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
  articleId?: string;
  title: string;
  content: string;
  category?: string;
}

const ArticleSummary = ({ articleId, title, content, category }: Props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [showSources, setShowSources] = useState(false);
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) return;
    if (!title || !content) return;
    requestedRef.current = true;

    (async () => {
      try {
        const { data: res, error: err } = await supabase.functions.invoke("summarize-article", {
          body: { articleId, title, content, category },
        });
        if (err) throw err;
        if (res?.error) throw new Error(res.error);
        setData(res);
      } catch (e: any) {
        setError(e?.message || "Could not generate summary");
      } finally {
        setLoading(false);
      }
    })();
  }, [articleId, title, content, category]);

  if (error) return null;

  return (
    <div className="my-6 border border-primary/30 bg-primary/[0.03] rounded-sm overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 px-5 py-3 border-b border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
        aria-expanded={expanded}
      >
        <Sparkles size={14} className="text-primary" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
          AI Summary · Powered by Engagera
        </span>
        {loading && <Loader2 size={12} className="animate-spin text-primary ml-1" />}
        <span className="ml-auto text-primary">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {expanded && (
        <div className="px-5 py-5 space-y-5">
          {loading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 size={13} className="animate-spin text-primary" />
                Reading article and crawling live sources…
              </div>
              <div className="h-3 bg-muted animate-pulse rounded w-full" />
              <div className="h-3 bg-muted animate-pulse rounded w-11/12" />
              <div className="h-3 bg-muted animate-pulse rounded w-4/5" />
            </div>
          )}

          {!loading && data?.tldr && (
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">TL;DR</h4>
              <p className="text-[15px] leading-relaxed text-foreground">{data.tldr}</p>
            </div>
          )}

          {!loading && data?.keyPoints && data.keyPoints.length > 0 && (
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

          {!loading && data?.context && (
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Live Context</h4>
              <p className="text-sm text-foreground/85 leading-relaxed">{data.context}</p>
            </div>
          )}

          {!loading && data?.whyItMatters && (
            <div className="border-l-2 border-primary pl-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Why it matters</h4>
              <p className="text-sm text-foreground/90 leading-relaxed">{data.whyItMatters}</p>
            </div>
          )}

          {!loading && data?.sources && data.sources.length > 0 && (
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
                          <ExternalLink size={9} /> {(() => { try { return new URL(s.url).hostname.replace("www.", ""); } catch { return s.url; } })()}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleSummary;
