import { useEffect, useState, useRef } from "react";

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
      .then((t) => !cancelled && setHtml(t))
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
    <iframe
      srcDoc={html}
      width={w}
      height={h}
      frameBorder={0}
      scrolling="no"
      style={{ border: "none", overflow: "hidden", maxWidth: "100%", display: "block" }}
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      loading="lazy"
      title="Advertisement"
    />
  );
};

const SponsorLabel = ({ children = "Sponsored" }: { children?: React.ReactNode }) => (
  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-2">
    <span>{children}</span>
    <span className="text-primary">AfuChat Ads</span>
  </div>
);

const AfuChatAd = ({ className = "", variant = "inline", label }: AfuChatAdProps) => {
  // Responsive: pick smaller format on narrow screens for leaderboard variant
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Sticky-bottom: dismissible
  const [dismissed, setDismissed] = useState(false);

  // Format per variant
  const format: AdFormat =
    variant === "leaderboard"
      ? isNarrow
        ? "banner_320x50"
        : "banner_728x90"
      : variant === "sticky-bottom"
      ? "banner_320x50"
      : "banner_300x250";

  const html = useAdHtml(format);

  if (!html) {
    // Skeleton placeholder — keeps layout stable
    const { w, h } = SIZES[format];
    return (
      <div className={className}>
        <div
          className="bg-muted/50 mx-auto animate-pulse"
          style={{ width: w, height: h, maxWidth: "100%" }}
          aria-hidden
        />
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <aside className={`w-full ${className}`}>
        <div className="bg-muted/40 p-3 max-w-[324px] mx-auto">
          <SponsorLabel>{label || "Sponsored"}</SponsorLabel>
          <div className="flex justify-center">
            <AdFrame format={format} html={html} />
          </div>
        </div>
      </aside>
    );
  }

  if (variant === "in-feed") {
    // Native-style: blends into article grid
    return (
      <article className={`block ${className}`}>
        <SponsorLabel>{label || "Promoted Story"}</SponsorLabel>
        <div className="bg-muted/30 p-2 flex justify-center">
          <AdFrame format={format} html={html} />
        </div>
      </article>
    );
  }

  if (variant === "leaderboard") {
    return (
      <div className={`w-full ${className}`}>
        <div className="border-t border-b border-muted py-4 px-2 bg-muted/20">
          <SponsorLabel>{label || "Advertisement"}</SponsorLabel>
          <div className="flex justify-center">
            <AdFrame format={format} html={html} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "sticky-bottom") {
    if (dismissed) return null;
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-muted py-2 px-3 lg:hidden">
        <div className="flex items-center justify-between gap-3 max-w-screen-sm mx-auto">
          <div className="flex-1 flex justify-center">
            <AdFrame format={format} html={html} />
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss ad"
            className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground px-2"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  // inline (default)
  return (
    <div className={`w-full ${className}`}>
      <div className="max-w-[324px] mx-auto">
        <SponsorLabel>{label || "Advertisement"}</SponsorLabel>
        <div className="flex justify-center">
          <AdFrame format={format} html={html} />
        </div>
      </div>
    </div>
  );
};

export default AfuChatAd;
