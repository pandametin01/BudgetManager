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
          provider: "enable-banking",
          providerTag: "Enable Banking",
          providerLabel: "Enable Banking",
          environment: "Sandbox",
          country: "IT",
          appId: env.ENABLE_BANKING_APP_ID || "",
          redirectUri: env.ENABLE_BANKING_REDIRECT_URI || "",
          ready: Boolean(env.ENABLE_BANKING_APP_ID && env.ENABLE_BANKING_PRIVATE_KEY && env.ENABLE_BANKING_REDIRECT_URI),
          checks: {
            appId: Boolean(env.ENABLE_BANKING_APP_ID),
            privateKey: Boolean(env.ENABLE_BANKING_PRIVATE_KEY),
            redirectUri: Boolean(env.ENABLE_BANKING_REDIRECT_URI),
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
