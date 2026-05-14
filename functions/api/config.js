export async function onRequestGet(context) {
  const payload = {
    supabaseUrl: context.env.SUPABASE_URL || "",
    supabaseAnonKey: context.env.SUPABASE_ANON_KEY || "",
  };

  return Response.json(payload, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
