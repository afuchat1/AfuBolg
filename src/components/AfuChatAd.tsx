import { useEffect, useState } from "react";

type AdFormat =
  | "banner_300x250"
  | "banner_728x90"
  | "banner_320x50"
  | "banner_320x100"
  | "native"
  | "interstitial";
type AdVariant =
  | "inline"
  | "in-feed"
  | "sidebar"
  | "leaderboard"
  | "sticky-bottom"
  | "native"
  | "interstitial";

interface AfuChatAdProps {
  className?: string;
  variant?: AdVariant;
  label?: string;
  /** For interstitial: unique key so it only shows once per session per key */
  sessionKey?: string;
  /** For interstitial: delay before showing (ms) */
  delayMs?: number;
}

const SIZES: Record<AdFormat, { w: number; h: number }> = {
  banner_300x250: { w: 300, h: 250 },
  banner_728x90: { w: 728, h: 90 },
  banner_320x50: { w: 320, h: 50 },
  banner_320x100: { w: 320, h: 100 },
  native: { w: 600, h: 400 },
  interstitial: { w: 400, h: 600 },
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
  mediaHtml: string;
  brandIcon: string;
  feedback: { label: string; url: string; group: "stop" | "report" | "other" }[];
}

const parseAd = (raw: string): ParsedAd | null => {
  if (!raw || raw.includes("No ads available")) return null;
  const doc = new DOMParser().parseFromString(raw, "text/html");
  // Extract the network's branding + moderation controls before dropping the header.
  const brandIcon =
    doc.querySelector(".ac-btn img")?.getAttribute("src") ||
    "https://zuekwzcnknkczelivurf.supabase.co/storage/v1/object/public/campaign-media/brand%2Fafuchat-icon.png";
  const feedback: ParsedAd["feedback"] = [];
  doc.querySelectorAll(".ac-menu [onclick]").forEach((el) => {
    const m = (el.getAttribute("onclick") || "").match(/fetch\('([^']*ad-feedback[^']*)'/);
    if (!m) return;
    const label = (el.textContent || "").replace(/[⊘⚑›]/g, "").trim();
    const group = /stop_showing/.test(m[1]) ? "stop" : /report/.test(m[1]) ? "report" : "other";
    feedback.push({ label, url: m[1], group });
  });
  doc.querySelectorAll(".ac-header, .ac-menu, .ac-pubid").forEach((el) => el.remove());
  const root: ParentNode = doc.querySelector(".ac-body") || doc;
  const anchor =
    (root.querySelector("a.banner-ad, a[href*='track-click']") as HTMLAnchorElement | null) ||
    (Array.from(root.querySelectorAll("a")).find(
      (a) => !/ads\.afuchat\.com/i.test(a.getAttribute("href") || "")
    ) as HTMLAnchorElement | undefined) ||
    null;
  const img = (root.querySelector("img.creative") || root.querySelector("img")) as HTMLImageElement | null;
  const headline = root.querySelector(".overlay h3, h3")?.textContent?.trim() || "";
  const description = root.querySelector(".overlay p, p")?.textContent?.trim() || "";
  const clickUrl = anchor?.getAttribute("href") || "#";
  const srcAttr = img?.getAttribute("src") || "";

  let mediaHtml = "";
  const ytId = extractYouTubeId(srcAttr);
  if (ytId) {
    const thumb = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
    mediaHtml = `<img src="${thumb}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block">`;
  } else if (srcAttr) {
    mediaHtml = `<img src="${srcAttr}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block">`;
  }

  if (!mediaHtml && !headline) return null;

  const wrapped = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:transparent}*{box-sizing:border-box}</style></head><body>${mediaHtml}</body></html>`;

  return { headline, description, clickUrl, mediaHtml: wrapped, brandIcon, feedback };
};

const useAd = (format: AdFormat, enabled = true) => {
  const [ad, setAd] = useState<ParsedAd | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    fetch(adUrl(format))
      .then((r) => r.text())
      .then((t) => {
        if (cancelled) return;
        const parsed = parseAd(t);
        setAd(parsed);
        if (!parsed) setFailed(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [format, enabled]);
  return { ad, failed };
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

const AdMenu = ({ ad, onDone }: { ad: ParsedAd; onDone: (msg: string) => void }) => {
  const [open, setOpen] = useState(false);
  const send = (f: ParsedAd["feedback"][number]) => {
    fetch(f.url, { method: "POST", keepalive: true }).catch(() => {});
    setOpen(false);
    onDone(f.group === "stop" ? "Thanks — we'll show fewer ads like this." : "Report received. Thank you.");
  };
  const stop = ad.feedback.filter((f) => f.group === "stop");
  const reports = ad.feedback.filter((f) => f.group !== "stop");
  return (
    <div className="relative normal-case tracking-normal">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((o) => !o); }}
        aria-label="Ad settings"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
      >
        <img src={ad.brandIcon} alt="" width={14} height={14} className="rounded-sm" />
        AfuChat <span className="text-[9px]">▾</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-6 z-30 w-60 bg-popover text-popover-foreground shadow-lg rounded-md p-1.5 text-sm">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Ad settings</div>
          {stop.map((f) => (
            <button key={f.url} role="menuitem" onClick={() => send(f)} className="w-full text-left px-2.5 py-2 rounded hover:bg-muted">⊘ {f.label}</button>
          ))}
          {reports.length > 0 && (
            <>
              <div className="px-2.5 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">⚑ Report ad</div>
              {reports.map((f) => (
                <button key={f.url} role="menuitem" onClick={() => send(f)} className="w-full text-left px-2.5 py-2 pl-6 rounded hover:bg-muted">{f.label}</button>
              ))}
            </>
          )}
          <div className="mt-1 px-2.5 pt-2 text-[10px] text-muted-foreground">Ads by AfuChat</div>
        </div>
      )}
    </div>
  );
};

const SponsorLabel = ({ children = "Sponsored", ad, onDone }: { children?: React.ReactNode; ad: ParsedAd; onDone: (m: string) => void }) => (
  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-2 px-1">
    <span>{children}</span>
    <AdMenu ad={ad} onDone={onDone} />
  </div>
);

const Thanks = ({ msg }: { msg: string }) => (
  <div className="my-6 py-8 text-center text-sm text-muted-foreground bg-muted/40">{msg}</div>
);

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

const AfuChatAd = ({
  className = "",
  variant = "inline",
  label,
  sessionKey = "default",
  delayMs = 1500,
}: AfuChatAdProps) => {
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const [dismissed, setDismissed] = useState(false);
  const [thanks, setThanks] = useState<string | null>(null);
  const [interstitialOpen, setInterstitialOpen] = useState(false);

  // Interstitial: gate by sessionStorage + delay
  useEffect(() => {
    if (variant !== "interstitial") return;
    const storageKey = `afuchat-interstitial-${sessionKey}`;
    if (sessionStorage.getItem(storageKey)) return;
    const t = setTimeout(() => {
      setInterstitialOpen(true);
      sessionStorage.setItem(storageKey, "1");
    }, delayMs);
    return () => clearTimeout(t);
  }, [variant, sessionKey, delayMs]);

  const format: AdFormat =
    variant === "sticky-bottom"
      ? "banner_320x100"
      : variant === "leaderboard" && !isNarrow
      ? "banner_728x90"
      : variant === "native"
      ? "native"
      : variant === "interstitial"
      ? "interstitial"
      : "banner_300x250";

  const enabled = variant !== "interstitial" || interstitialOpen;
  const { ad, failed } = useAd(format, enabled);

  // Hide entirely when the network has no ad to serve
  if (failed) return null;

  if (!ad) {
    if (variant === "interstitial" || variant === "sticky-bottom") return null;
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

  if (thanks && variant !== "interstitial" && variant !== "sticky-bottom") return <Thanks msg={thanks} />;
  const done = (m: string) => { if (variant === "interstitial" || variant === "sticky-bottom") setDismissed(true); else setThanks(m); };

  // Interstitial: full-screen modal overlay, dismissible
  if (variant === "interstitial") {
    if (!interstitialOpen || dismissed) return null;
    return (
      <div
        role="dialog"
        aria-label="Advertisement"
        className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <div className="w-full max-w-sm bg-card">
          <div className="flex items-center justify-between px-3 py-2 border-b border-muted">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {label || "Advertisement"}
            </span>
            <AdMenu ad={ad} onDone={done} />
            <button
              onClick={() => setDismissed(true)}
              aria-label="Close ad"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground px-2"
            >
              Close ✕
            </button>
          </div>
          <ArticleAdCard ad={ad} format={format} />
        </div>
      </div>
    );
  }

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
            <div className="w-24 shrink-0">
              <AdMedia format={format} html={ad.mediaHtml} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                Ad
              </div>
              <div className="text-xs font-bold text-foreground truncate">
                {ad.headline || "Sponsored"}
              </div>
              {ad.description && (
                <div className="text-[11px] text-muted-foreground truncate">
                  {ad.description}
                </div>
              )}
            </div>
          </a>
          <AdMenu ad={ad} onDone={done} />
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

  if (variant === "leaderboard") {
    return (
      <div className={`w-full my-6 ${className}`}>
        <SponsorLabel ad={ad} onDone={done}>{label || "Advertisement"}</SponsorLabel>
        <ArticleAdCard ad={ad} format={format} compact={!isNarrow} />
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <aside className={`w-full max-w-[324px] ${className}`}>
        <SponsorLabel ad={ad} onDone={done}>{label || "Sponsored"}</SponsorLabel>
        <ArticleAdCard ad={ad} format={format} />
      </aside>
    );
  }

  if (variant === "in-feed" || variant === "native") {
    return (
      <article className={`block my-8 max-w-2xl mx-auto ${className}`}>
        <SponsorLabel ad={ad} onDone={done}>{label || "Advertisement"}</SponsorLabel>
        <ArticleAdCard ad={ad} format={format} />
      </article>
    );
  }

  return (
    <div className={`w-full my-6 max-w-md mx-auto ${className}`}>
      <SponsorLabel ad={ad} onDone={done}>{label || "Advertisement"}</SponsorLabel>
      <ArticleAdCard ad={ad} format={format} />
    </div>
  );
};

export default AfuChatAd;
