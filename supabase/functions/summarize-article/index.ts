import Engagera from "npm:@afuchat1/engagera@0.1.5";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const RATE_WINDOW_SEC = 60;
const RATE_MAX = 15; // per IP per window

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const { articleId, title, content, category } = await req.json();
    if (!title || !content) {
      return new Response(JSON.stringify({ error: "title and content required" }), {
        status: 400, headers: corsHeaders,
      });
    }

    const plain = String(content).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 8000);
    const contentHash = await sha256(`${title}\n${category ?? ""}\n${plain}`);

    // 1. CACHE — return existing summary if content hasn't changed
    if (articleId) {
      const { data: cached } = await supabase
        .from("article_summaries")
        .select("data, content_hash")
        .eq("article_id", articleId)
        .maybeSingle();
      if (cached && cached.content_hash === contentHash) {
        return new Response(JSON.stringify({ ...cached.data, cached: true }), { headers: corsHeaders });
      }
    }

    // 2. RATE LIMIT — per IP, sliding fixed window
    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const windowStart = new Date(Math.floor(Date.now() / (RATE_WINDOW_SEC * 1000)) * RATE_WINDOW_SEC * 1000).toISOString();

    // best-effort cleanup of old windows
    await supabase.from("summary_rate_limits").delete().lt(
      "window_start",
      new Date(Date.now() - RATE_WINDOW_SEC * 1000 * 5).toISOString(),
    );

    const { data: existing } = await supabase
      .from("summary_rate_limits")
      .select("count")
      .eq("ip", ip)
      .eq("window_start", windowStart)
      .maybeSingle();

    const current = existing?.count ?? 0;
    if (current >= RATE_MAX) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
        { status: 429, headers: { ...corsHeaders, "Retry-After": String(RATE_WINDOW_SEC) } },
      );
    }
    await supabase.from("summary_rate_limits").upsert(
      { ip, window_start: windowStart, count: current + 1 },
      { onConflict: "ip,window_start" },
    );

    // 3. GENERATE
    const apiKey = Deno.env.get("ENGAGERA_API_KEY");
    if (!apiKey) throw new Error("ENGAGERA_API_KEY not configured");
    const client = new Engagera({ apiKey });

    const reply = await client.chat.create({
      model: "engagera-pro",
      useAfuBot: true,
      messages: [
        {
          role: "system",
          content:
            "You are an expert news editor for AfuBlog (by AfuChat). Produce a rich, accurate TL;DR of the given article. Use AfuBot to fetch live web context that verifies or adds recent facts to the story. Respond ONLY with valid JSON — no markdown, no code fences. Shape: { \"tldr\": string, \"keyPoints\": string[], \"context\": string, \"whyItMatters\": string }. keyPoints: 3-5 short bullets. tldr: 2-3 sentence executive summary. context: 1-2 sentences of relevant real-world context from live sources. whyItMatters: 1-2 sentence takeaway.",
        },
        { role: "user", content: `Category: ${category ?? "General"}\nTitle: ${title}\n\nArticle:\n${plain}` },
      ],
    });

    let parsed: any;
    const raw = reply.content.trim();
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(match ? match[0] : raw);
    } catch {
      parsed = { tldr: raw, keyPoints: [], context: "", whyItMatters: "" };
    }

    const payload = {
      ...parsed,
      sources: reply.sources ?? [],
      model: reply.model,
    };

    // 4. STORE
    if (articleId) {
      await supabase.from("article_summaries").upsert(
        { article_id: articleId, content_hash: contentHash, data: payload, updated_at: new Date().toISOString() },
        { onConflict: "article_id" },
      );
    }

    return new Response(JSON.stringify({ ...payload, cached: false }), { headers: corsHeaders });
  } catch (e) {
    console.error("summarize-article error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: corsHeaders });
  }
});
