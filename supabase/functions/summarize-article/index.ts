import Engagera from "npm:@afuchat1/engagera@0.1.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("ENGAGERA_API_KEY");
    if (!apiKey) throw new Error("ENGAGERA_API_KEY not configured");

    const { title, content, category } = await req.json();
    if (!title || !content) {
      return new Response(JSON.stringify({ error: "title and content required" }), {
        status: 400, headers: corsHeaders,
      });
    }

    const plain = String(content).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 8000);

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
        {
          role: "user",
          content: `Category: ${category ?? "General"}\nTitle: ${title}\n\nArticle:\n${plain}`,
        },
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

    return new Response(
      JSON.stringify({
        ...parsed,
        sources: reply.sources ?? [],
        model: reply.model,
      }),
      { headers: corsHeaders },
    );
  } catch (e) {
    console.error("summarize-article error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: corsHeaders });
  }
});
