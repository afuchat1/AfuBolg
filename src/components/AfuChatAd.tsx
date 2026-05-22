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

interface ParsedAd {
  headline: string;
  description: string;
  clickUrl: string;
  mediaHtml: string; // HTML to render inside the iframe (image or YouTube embed)
}

const parseAd = (raw: string): ParsedAd | null => {
  const doc = new DOMParser().parseFromString(raw, "text/html");
  const anchor = doc.querySelector("a.banner-ad") as HTMLAnchorElement | null;
  const img = doc.querySelector("img") as HTMLImageElement | null;
  const headline = doc.querySelector(".overlay h3")?.textContent?.trim() || "";
  const description = doc.querySelector(".overlay p")?.textContent?.trim() || "";
  const clickUrl = anchor?.getAttribute("href") || "#";
  const srcAttr = img?.getAttribute("src") || "";

  let mediaHtml = "";
  const ytId = extractYouTubeId(srcAttr);
  if (ytId) {
    const embed = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3`;
    mediaHtml = `<iframe src="${embed}" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;pointer-events:none"></iframe>`;
  } else if (srcAttr) {
    mediaHtml = `<img src="${srcAttr}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block">`;
  }

  if (!mediaHtml && !headline) return null;

  const wrapped = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:transparent}*{box-sizing:border-box}</style></head><body>${mediaHtml}</body></html>`;

  return { headline, description, clickUrl, mediaHtml: wrapped };
};

const useAd = (format: AdFormat) => {
  const [ad, setAd] = useState<ParsedAd | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(adUrl(format))
      .then((r) => r.text())
      .then((t) => {
        if (cancelled) return;
        setAd(parseAd(t));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [format]);
  return ad;
};

const AdMedia = ({ format, html }: { format: AdFormat; html: string }) => {
  const { w, h } = SIZES[format];
  return (
    <div
      className="relative w-full bg-muted overflow-hidden"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <iframe
        srcDoc={html}
        title="Advertisement"
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-same-origin"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
          display: "block",
          background: "transparent",
          pointerEvents: "none",
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

/**
 * Article-style ad layout: media on top, headline + description below
 * as proper article copy. The whole card is a click target.
 */
const ArticleAdCard = ({
  ad,
  format,
  compact = false,
}: {
  ad: ParsedAd;
  format: AdFormat;
  compact?: boolean;
}) => (
  <a
    href={ad.clickUrl}
    target="_blank"
    rel="noopener sponsored"
    className="group block bg-card text-card-foreground overflow-hidden no-underline"
  >
    <AdMedia format={format} html={ad.mediaHtml} />
    {(ad.headline || ad.description) && (
      <div className={compact ? "pt-3" : "pt-4"}>
        {ad.headline && (
          <h3 className="font-heading text-base sm:text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
            {ad.headline}
          </h3>
        )}
        {ad.description && !compact && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {ad.description}
          </p>
        )}
        <div className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-primary/80">
          Read more →
        </div>
      </div>
    )}
  </a>
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

  const format: AdFormat =
    variant === "sticky-bottom"
      ? "banner_320x50"
      : variant === "leaderboard" && !isNarrow
      ? "banner_728x90"
      : "banner_300x250";

  const ad = useAd(format);

  if (!ad) {
    const { w, h } = SIZES[format];
    return (
      <div className={`my-6 ${className}`}>
        <div
          className="bg-muted/40 w-full animate-pulse"
          style={{ aspectRatio: `${w} / ${h}` }}
          aria-hidden
        />
      </div>
    );
  }

  // Sticky-bottom: keep it minimal — media + headline only
  if (variant === "sticky-bottom") {
    if (dismissed) return null;
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-muted py-2 px-3 lg:hidden">
        <div className="flex items-center gap-3 max-w-screen-sm mx-auto">
          <a
            href={ad.clickUrl}
            target="_blank"
            rel="noopener sponsored"
            className="flex items-center gap-3 flex-1 min-w-0 no-underline"
          >
            <div className="w-20 shrink-0">
              <AdMedia format={format} html={ad.mediaHtml} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                Ad · AfuChat
              </div>
              <div className="text-xs font-bold text-foreground truncate">
                {ad.headline || "Sponsored"}
              </div>
            </div>
          </a>
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

  // Leaderboard variant: media-prominent, single-line caption
  if (variant === "leaderboard") {
    return (
      <div className={`w-full my-6 ${className}`}>
        <SponsorLabel>{label || "Advertisement"}</SponsorLabel>
        <ArticleAdCard ad={ad} format={format} compact={!isNarrow} />
      </div>
    );
  }

  // Sidebar: stacked article card, narrow column
  if (variant === "sidebar") {
    return (
      <aside className={`w-full max-w-[324px] ${className}`}>
        <SponsorLabel>{label || "Sponsored"}</SponsorLabel>
        <ArticleAdCard ad={ad} format={format} />
      </aside>
    );
  }

  // In-feed: blends into article grid — full article-style card
  if (variant === "in-feed") {
    return (
      <article className={`block my-8 max-w-2xl mx-auto ${className}`}>
        <SponsorLabel>{label || "Promoted Story"}</SponsorLabel>
        <ArticleAdCard ad={ad} format={format} />
      </article>
    );
  }

  // inline (default)
  return (
    <div className={`w-full my-6 max-w-md mx-auto ${className}`}>
      <SponsorLabel>{label || "Advertisement"}</SponsorLabel>
      <ArticleAdCard ad={ad} format={format} />
    </div>
  );
};

export default AfuChatAd;
