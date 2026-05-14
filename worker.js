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

    if (url.pathname === "/api/bank/health") {
      try {
        const application = await fetchEnableBankingApplication(env);
        return Response.json(
          {
            ok: true,
            application,
          },
          {
            headers: {
              "Cache-Control": "no-store",
            },
          },
        );
      } catch (error) {
        return Response.json(
          {
            ok: false,
            error: error.message || "Enable Banking verification failed",
          },
          {
            status: 500,
            headers: {
              "Cache-Control": "no-store",
            },
          },
        );
      }
    }

    if (url.pathname === "/api/bank/aspsps") {
      try {
        const search = new URLSearchParams();
        if (url.searchParams.get("country")) {
          search.set("country", url.searchParams.get("country"));
        }
        if (url.searchParams.get("service")) {
          search.set("service", url.searchParams.get("service"));
        }
        if (url.searchParams.get("psu_type")) {
          search.set("psu_type", url.searchParams.get("psu_type"));
        }

        const response = await callEnableBankingApi(env, `/aspsps${search.size ? `?${search.toString()}` : ""}`);
        return Response.json(response, {
          headers: {
            "Cache-Control": "no-store",
          },
        });
      } catch (error) {
        return Response.json(
          {
            error: error.message || "Enable Banking institutions fetch failed",
          },
          {
            status: 500,
            headers: {
              "Cache-Control": "no-store",
            },
          },
        );
      }
    }

    if (url.pathname === "/api/bank/auth/start" && request.method === "POST") {
      try {
        const body = await request.json();
        const redirectUri = env.ENABLE_BANKING_REDIRECT_URI;
        const state = crypto.randomUUID();
        const validUntil = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
        const payload = {
          access: {
            valid_until: validUntil,
          },
          aspsp: {
            name: body?.aspsp?.name,
            country: body?.aspsp?.country || "IT",
          },
          redirect_url: redirectUri,
          state,
          language: "it",
        };

        if (body?.psuType) {
          payload.psu_type = body.psuType;
        }
        if (body?.authMethod) {
          payload.auth_method = body.authMethod;
        }

        const response = await callEnableBankingApi(env, "/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        return Response.json(
          {
            ...response,
            state,
          },
          {
            headers: {
              "Cache-Control": "no-store",
            },
          },
        );
      } catch (error) {
        return Response.json(
          {
            error: error.message || "Enable Banking authorization start failed",
          },
          {
            status: 500,
            headers: {
              "Cache-Control": "no-store",
            },
          },
        );
      }
    }

    if (url.pathname === "/api/bank/session/complete" && request.method === "POST") {
      try {
        const body = await request.json();
        const response = await callEnableBankingApi(env, "/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: body?.code,
          }),
        });

        return Response.json(response, {
          headers: {
            "Cache-Control": "no-store",
          },
        });
      } catch (error) {
        return Response.json(
          {
            error: error.message || "Enable Banking session completion failed",
          },
          {
            status: 500,
            headers: {
              "Cache-Control": "no-store",
            },
          },
        );
      }
    }

    if (url.pathname === "/api/bank/session/status") {
      try {
        const sessionId = url.searchParams.get("sessionId");
        if (!sessionId) {
          throw new Error("Session ID mancante.");
        }

        const response = await callEnableBankingApi(env, `/sessions/${encodeURIComponent(sessionId)}`);
        return Response.json(response, {
          headers: {
            "Cache-Control": "no-store",
          },
        });
      } catch (error) {
        return Response.json(
          {
            error: error.message || "Enable Banking session status failed",
          },
          {
            status: 500,
            headers: {
              "Cache-Control": "no-store",
            },
          },
        );
      }
    }

    if (url.pathname === "/api/bank/transactions/recent" && request.method === "POST") {
      try {
        const body = await request.json();
        const accountUid = body?.accountUid;
        if (!accountUid) {
          throw new Error("Account UID mancante.");
        }

        let dateFrom = String(body?.dateFrom || "").trim();
        let dateTo = String(body?.dateTo || "").trim();
        if (!dateFrom || !dateTo) {
          const days = Number.parseInt(body?.days, 10);
          const safeDays = Number.isFinite(days) && days > 0 ? Math.min(days, 1095) : 5;
          const now = new Date();
          const from = new Date(now.getTime() - safeDays * 24 * 60 * 60 * 1000);
          dateFrom = formatIsoDate(from);
          dateTo = formatIsoDate(now);
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateFrom) || !/^\d{4}-\d{2}-\d{2}$/.test(dateTo)) {
          throw new Error("Intervallo date non valido.");
        }
        if (dateFrom > dateTo) {
          throw new Error("La data iniziale non puo essere successiva alla data finale.");
        }

        const transactions = await fetchAllRecentTransactions(env, accountUid, dateFrom, dateTo);

        return Response.json(
          {
            accountUid,
            dateFrom,
            dateTo,
            transactions,
          },
          {
            headers: {
              "Cache-Control": "no-store",
            },
          },
        );
      } catch (error) {
        return Response.json(
          {
            error: error.message || "Enable Banking recent transactions failed",
          },
          {
            status: 500,
            headers: {
              "Cache-Control": "no-store",
            },
          },
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};

async function fetchEnableBankingApplication(env) {
  return callEnableBankingApi(env, "/application");
}

async function fetchAllRecentTransactions(env, accountUid, dateFrom, dateTo) {
  const transactions = [];
  let continuationKey = "";
  let remainingPages = 12;

  while (remainingPages > 0) {
    const params = new URLSearchParams({
      date_from: dateFrom,
      date_to: dateTo,
    });
    if (continuationKey) {
      params.set("continuation_key", continuationKey);
    }

    const response = await callEnableBankingApi(env, `/accounts/${encodeURIComponent(accountUid)}/transactions?${params.toString()}`);
    const batch = extractTransactions(response);
    transactions.push(...batch);

    continuationKey = response?.continuation_key || response?.continuationKey || "";
    if (!continuationKey) {
      break;
    }

    await delay(250);
    remainingPages -= 1;
  }

  return transactions;
}

function extractTransactions(response) {
  if (Array.isArray(response?.transactions)) {
    return response.transactions;
  }
  if (Array.isArray(response?._embedded?.transactions)) {
    return response._embedded.transactions;
  }
  return [];
}

async function callEnableBankingApi(env, path, init = {}) {
  validateEnableBankingEnv(env);

  const jwt = await buildEnableBankingJwt(env);
  const response = await fetch(`https://api.enablebanking.com${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
      ...(init.headers || {}),
    },
  });

  const bodyText = await response.text();
  let body;
  try {
    body = bodyText ? JSON.parse(bodyText) : {};
  } catch {
    body = { raw: bodyText };
  }

  if (!response.ok) {
    if (response.status === 429) {
      const retryAfter = Number.parseInt(response.headers.get("Retry-After") || "", 10);
      const retryHint = Number.isFinite(retryAfter) && retryAfter > 0
        ? ` Riprova tra circa ${retryAfter} secondi.`
        : "";
      throw new Error(`Enable Banking sta limitando temporaneamente le richieste.${retryHint} Se serve, riduci il periodo e riprova.`);
    }

    const message =
      body?.message ||
      body?.error_description ||
      body?.detail ||
      body?.raw ||
      `Enable Banking request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body;
}

function validateEnableBankingEnv(env) {
  if (!env.ENABLE_BANKING_APP_ID || !env.ENABLE_BANKING_PRIVATE_KEY || !env.ENABLE_BANKING_REDIRECT_URI) {
    throw new Error("Mancano una o piu variabili Enable Banking nel Worker.");
  }
}

async function buildEnableBankingJwt(env) {
  const key = await importEnableBankingPrivateKey(env.ENABLE_BANKING_PRIVATE_KEY);
  const now = Math.floor(Date.now() / 1000);
  const header = {
    typ: "JWT",
    alg: "RS256",
    kid: env.ENABLE_BANKING_APP_ID,
  };
  const payload = {
    iss: "enablebanking.com",
    aud: "api.enablebanking.com",
    iat: now,
    exp: now + 300,
  };

  const encodedHeader = base64UrlEncodeJson(header);
  const encodedPayload = base64UrlEncodeJson(payload);
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signatureBuffer = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    key,
    new TextEncoder().encode(signingInput),
  );
  const encodedSignature = base64UrlEncodeBytes(new Uint8Array(signatureBuffer));
  return `${signingInput}.${encodedSignature}`;
}

async function importEnableBankingPrivateKey(privateKeyPem) {
  const normalizedPem = String(privateKeyPem || "").replace(/\\n/g, "\n").trim();
  const keyContents = normalizedPem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s+/g, "");

  if (!keyContents) {
    throw new Error("Private key Enable Banking non valida.");
  }

  const binary = Uint8Array.from(atob(keyContents), (char) => char.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    binary.buffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );
}

function base64UrlEncodeJson(value) {
  return base64UrlEncodeBytes(new TextEncoder().encode(JSON.stringify(value)));
}

function base64UrlEncodeBytes(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function formatIsoDate(value) {
  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const day = String(value.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
