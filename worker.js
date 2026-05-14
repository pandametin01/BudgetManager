export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/config") {
      return Response.json(
        {
          supabaseUrl: env.SUPABASE_URL || "",
          supabaseAnonKey: env.SUPABASE_ANON_KEY || "",
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    return env.ASSETS.fetch(request);
  },
};
