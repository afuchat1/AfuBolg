import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, content, topic, title } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "generate") {
      systemPrompt = `You are an expert journalist and content writer. You write professional, engaging news articles. 
Write in a clear, authoritative style suitable for a professional news publication. 
Include factual-sounding details, quotes, and data points to make articles compelling.
Return the article as clean HTML with proper paragraphs, headings (h2, h3), blockquotes, and emphasis.
Also generate a short excerpt (1-2 sentences) and suggest a category and estimated read time.
Format your response as JSON: { "title": "...", "content": "<p>...</p>", "excerpt": "...", "category": "...", "readTime": "X min" }`;
      userPrompt = `Write a comprehensive news article about: ${topic}`;
    } else if (action === "improve") {
      systemPrompt = `You are an expert editor and SEO specialist. You improve articles for readability, engagement, SEO, and professional quality.
Maintain the original voice but enhance clarity, structure, and impact.
Return improved content as clean HTML.
Also provide a brief summary of changes made.
Format your response as JSON: { "content": "<p>...</p>", "excerpt": "...", "changes": "..." }`;
      userPrompt = `Improve this article titled "${title}":\n\n${content}`;
    } else if (action === "headline") {
      systemPrompt = `You are a headline writing expert. Generate 5 compelling, click-worthy headlines for news articles.
Format as JSON: { "headlines": ["...", "...", "...", "...", "..."] }`;
      userPrompt = `Generate headlines for an article about: ${topic || content}`;
    } else {
      throw new Error("Invalid action");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content || "";

    // Try to parse JSON from the response
    let parsed;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[1].trim() : aiContent);
    } catch {
      parsed = { content: aiContent, changes: "AI response processed" };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-content error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
