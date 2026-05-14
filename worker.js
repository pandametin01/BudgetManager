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

    if (url.pathname === "/api/bank/config") {
      return Response.json(
        {
          provider: "gocardless-bank-account-data",
          providerLabel: "GoCardless Bank Account Data",
          country: "IT",
          redirectUri: env.GC_BA_REDIRECT_URI || "",
          ready: Boolean(env.GC_BA_SECRET_ID && env.GC_BA_SECRET_KEY && env.GC_BA_REDIRECT_URI),
          checks: {
            secretId: Boolean(env.GC_BA_SECRET_ID),
            secretKey: Boolean(env.GC_BA_SECRET_KEY),
            redirectUri: Boolean(env.GC_BA_REDIRECT_URI),
          },
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
