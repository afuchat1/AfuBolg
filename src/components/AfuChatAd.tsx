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

const extractYouTubeId = (url: string): string | null => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0] || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] || null;
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] || null;
      return u.searchParams.get("v");
    }
  } catch {
    /* noop */
  }
  return null;
};

// The ad server occasionally puts a YouTube URL inside <img src>. Detect that
// and swap it for a real YouTube embed so the creative actually plays.
const transformAdHtml = (raw: string): string => {
  let transformed = raw.replace(
    /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi,
    (match, src: string) => {
      const id = extractYouTubeId(src);
      if (!id) return match;
      const embed = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3`;
      return `<iframe src="${embed}" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;pointer-events:none;object-fit:cover"></iframe>`;
    }
  );

  // Strip the text overlay (headline + body) baked into the creative — keep media only.
  transformed = transformed.replace(/<div\b[^>]*class=["'][^"']*\boverlay\b[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "");

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base target="_blank"><style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:transparent;font-family:system-ui,sans-serif}*{box-sizing:border-box}img,video{max-width:100%;max-height:100%;width:100%;height:100%;object-fit:cover;display:block;border:0}a{display:block;width:100%;height:100%}.overlay{display:none!important}</style></head><body>${transformed}</body></html>`;
};

const useAdHtml = (format: AdFormat) => {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(adUrl(format))
      .then((r) => r.text())
      .then((t) => {
        if (cancelled) return;
        setHtml(transformAdHtml(t));
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
