import { useEffect, useState } from "react";

type AdFormat = "banner_300x250" | "banner_728x90" | "banner_320x50";
type AdVariant = "inline" | "in-feed" | "sidebar" | "leaderboard" | "sticky-bottom";

interface AfuChatAdProps {
  className?: string;
  variant?: AdVariant;
  label?: string;
}

const SIZES: Record<AdFormat, { w: number; h: number }> = {
  banner_300x250: { w: 300, h: 250 },
  banner_728x90: { w: 728, h: 90 },
  banner_320x50: { w: 320, h: 50 },
};

const PUBLISHER = "c94c610f-685e-4834-bb39-be88049814d9";
const SITE = "09b0a2f6-3def-44b4-84e7-37cecfd42477";

const adUrl = (format: AdFormat) =>
  `https://zuekwzcnknkczelivurf.supabase.co/functions/v1/serve-ad?publisher=${PUBLISHER}&site=${SITE}&format=${format}`;

const useAdHtml = (format: AdFormat) => {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(adUrl(format))
      .then((r) => r.text())
      .then((t) => {
        if (cancelled) return;
        // Wrap to ensure media fills frame, autoplay-friendly, no margin
        const wrapped = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:transparent;font-family:system-ui,sans-serif}*{box-sizing:border-box}img,video,iframe{max-width:100%;max-height:100%;width:100%;height:100%;object-fit:cover;display:block;border:0}a{display:block;width:100%;height:100%}</style></head><body>${t}</body></html>`;
        setHtml(wrapped);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [format]);
  return html;
};

const AdFrame = ({ format, html }: { format: AdFormat; html: string }) => {
  const { w, h } = SIZES[format];
  return (
    <div
      className="relative mx-auto"
      style={{ width: "100%", maxWidth: w, aspectRatio: `${w} / ${h}` }}
    >
      <iframe
        srcDoc={html}
        title="Advertisement"
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-forms allow-presentation allow-same-origin"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
          display: "block",
          background: "transparent",
        }}
      />
    </div>
  );
};

const SponsorLabel = ({ children = "Sponsored" }: { children?: React.ReactNode }) => (
  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-2 px-1">
    <span>{children}</span>
    <span className="text-primary/70">Ad · AfuChat</span>
  </div>
);

const AfuChatAd = ({ className = "", variant = "inline", label }: AfuChatAdProps) => {
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const [dismissed, setDismissed] = useState(false);

  // Always pick a format that fits the available column. On mobile, the
  // 728x90 leaderboard does not fit in article column, so use 300x250 instead.
  const format: AdFormat =
    variant === "sticky-bottom"
      ? "banner_320x50"
      : variant === "leaderboard" && !isNarrow
      ? "banner_728x90"
      : "banner_300x250";

  const html = useAdHtml(format);

  if (!html) {
    const { w, h } = SIZES[format];
    return (
      <div className={`my-6 ${className}`}>
        <div
          className="bg-muted/40 mx-auto animate-pulse"
          style={{ width: "100%", maxWidth: w, aspectRatio: `${w} / ${h}` }}
          aria-hidden
        />
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <aside className={`w-full ${className}`}>
        <SponsorLabel>{label || "Sponsored"}</SponsorLabel>
        <AdFrame format={format} html={html} />
      </aside>
    );
  }

  if (variant === "in-feed") {
    return (
      <article className={`block my-8 ${className}`}>
        <SponsorLabel>{label || "Promoted"}</SponsorLabel>
        <AdFrame format={format} html={html} />
      </article>
    );
  }

  if (variant === "leaderboard") {
    return (
      <div className={`w-full my-6 ${className}`}>
        <SponsorLabel>{label || "Advertisement"}</SponsorLabel>
        <AdFrame format={format} html={html} />
      </div>
    );
  }

  if (variant === "sticky-bottom") {
    if (dismissed) return null;
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-muted py-2 px-3 lg:hidden">
        <div className="flex items-center gap-3 max-w-screen-sm mx-auto">
          <div className="flex-1 min-w-0">
            <AdFrame format={format} html={html} />
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss ad"
            className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground px-2 shrink-0"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  // inline
  return (
    <div className={`w-full my-6 ${className}`}>
      <SponsorLabel>{label || "Advertisement"}</SponsorLabel>
      <AdFrame format={format} html={html} />
    </div>
  );
};

export default AfuChatAd;
