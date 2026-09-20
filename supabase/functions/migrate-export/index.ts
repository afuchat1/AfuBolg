// TEMPORARY: exports auth data for a one-off migration. Delete after use.
import postgres from "https://deno.land/x/postgresjs@v3.4.4/mod.js";

const TOKEN = "mig_7f3a9c21b8e54d06af2c1e9d4b6075aa";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (url.searchParams.get("token") !== TOKEN) {
    return new Response("forbidden", { status: 403 });
  }

  const sql = postgres(Deno.env.get("SUPABASE_DB_URL")!, { prepare: false });
  try {
    const users = await sql`select * from auth.users order by created_at`;
    const identities = await sql`select * from auth.identities`;
    return new Response(JSON.stringify({ users, identities }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  } finally {
    await sql.end();
  }
});
