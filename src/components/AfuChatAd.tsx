import { useEffect, useState } from "react";

interface AfuChatAdProps {
  className?: string;
  format?: "banner_300x250" | "banner_728x90" | "banner_320x50";
}

const SIZES: Record<NonNullable<AfuChatAdProps["format"]>, { w: number; h: number }> = {
  banner_300x250: { w: 300, h: 250 },
  banner_728x90: { w: 728, h: 90 },
  banner_320x50: { w: 320, h: 50 },
};

const PUBLISHER = "c94c610f-685e-4834-bb39-be88049814d9";
const SITE = "09b0a2f6-3def-44b4-84e7-37cecfd42477";

const AfuChatAd = ({ className = "", format = "banner_300x250" }: AfuChatAdProps) => {
  const { w, h } = SIZES[format];
  const src = `https://zuekwzcnknkczelivurf.supabase.co/functions/v1/serve-ad?publisher=${PUBLISHER}&site=${SITE}&format=${format}`;
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => r.text())
      .then((t) => {
        if (!cancelled) setHtml(t);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!html) return null;

  return (
    <div className={`flex justify-center ${className}`}>
      <iframe
        srcDoc={html}
        width={w}
        height={h}
        frameBorder={0}
        scrolling="no"
        style={{ border: "none", overflow: "hidden", maxWidth: "100%" }}
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        loading="lazy"
        title="Advertisement"
      />
    </div>
  );
};

export default AfuChatAd;
