import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Content-Type": "application/xml",
  "Cache-Control": "public, max-age=3600",
};

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const baseUrl = "https://stark-news-flow.lovable.app";

  const { data: articles } = await supabase
    .from("articles")
    .select("slug, updated_at, author_name")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: "/about", priority: "0.7", changefreq: "monthly" },
    { loc: "/contact", priority: "0.5", changefreq: "monthly" },
    { loc: "/archive", priority: "0.8", changefreq: "daily" },
    { loc: "/search", priority: "0.6", changefreq: "weekly" },
    { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
    { loc: "/terms", priority: "0.3", changefreq: "yearly" },
  ];

  // Get unique authors for writer pages
  const authors = [...new Set((articles || []).map((a) => a.author_name))];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const page of staticPages) {
    xml += `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  for (const article of articles || []) {
    xml += `  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <lastmod>${new Date(article.updated_at).toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
  }

  for (const author of authors) {
    const slug = author.toLowerCase().replace(/\s+/g, "-");
    xml += `  <url>
    <loc>${baseUrl}/writer/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  return new Response(xml, { headers: corsHeaders });
});
