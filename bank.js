const LOGIN_SESSION_KEY = "budget-planner-session-user";
const SUPABASE_CONFIG_ENDPOINT = "/api/config";

const els = {
  currentUsername: document.getElementById("currentUsername"),
  logoutButton: document.getElementById("logoutButton"),
  refreshBankStatus: document.getElementById("refreshBankStatus"),
  bankProviderTag: document.getElementById("bankProviderTag"),
  bankProviderLabel: document.getElementById("bankProviderLabel"),
  bankEnvironment: document.getElementById("bankEnvironment"),
  bankCountry: document.getElementById("bankCountry"),
  bankReadyTag: document.getElementById("bankReadyTag"),
  bankCheckAppId: document.getElementById("bankCheckAppId"),
  bankCheckPrivateKey: document.getElementById("bankCheckPrivateKey"),
  bankCheckRedirect: document.getElementById("bankCheckRedirect"),
  bankRedirectValue: document.getElementById("bankRedirectValue"),
  bankStatusMessage: document.getElementById("bankStatusMessage"),
};

let supabaseClient = null;
let supabaseSession = null;

bootstrap();

async function bootstrap() {
  await initializeSupabase();
  bindEvents();
  updateUsername();
  await refreshBankConfig();
}

async function initializeSupabase() {
  if (!window.supabase?.createClient) {
    return;
  }

  try {
    const response = await fetch(SUPABASE_CONFIG_ENDPOINT, { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const config = await response.json();
    if (!config?.supabaseUrl || !config?.supabaseAnonKey) {
      return;
    }

    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    const sessionResult = await supabaseClient.auth.getSession();
    supabaseSession = sessionResult.data.session || null;
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      supabaseSession = session || null;
      updateUsername();
    });
  } catch (error) {
    console.warn("Supabase non disponibile nella pagina banca.", error);
  }
}

function getCurrentUsername() {
  if (supabaseSession?.user?.user_metadata?.username) {
    return String(supabaseSession.user.user_metadata.username).trim().toLowerCase();
  }
  if (supabaseSession?.user?.email) {
    return String(supabaseSession.user.email).split("@")[0].trim().toLowerCase();
  }
  return String(sessionStorage.getItem(LOGIN_SESSION_KEY) || "").trim().toLowerCase();
}

function updateUsername() {
  if (els.currentUsername) {
    els.currentUsername.textContent = getCurrentUsername() || "utente";
  }
}

function setCheck(node, ready) {
  node.textContent = ready ? "Ok" : "Manca";
  node.className = ready ? "positive" : "negative";
}

async function refreshBankConfig() {
  try {
    const response = await fetch("/api/bank/config", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Configurazione banca non disponibile");
    }

    const config = await response.json();
    els.bankProviderTag.textContent = config.providerTag || "Enable Banking";
    els.bankProviderLabel.textContent = config.providerLabel || "Enable Banking";
    els.bankEnvironment.textContent = config.environment || "Sandbox";
    els.bankCountry.textContent = config.country || "IT";
    setCheck(els.bankCheckAppId, Boolean(config.checks?.appId));
    setCheck(els.bankCheckPrivateKey, Boolean(config.checks?.privateKey));
    setCheck(els.bankCheckRedirect, Boolean(config.checks?.redirectUri));
    els.bankRedirectValue.textContent = config.redirectUri || "Non impostata";

    if (config.ready) {
      els.bankReadyTag.textContent = "Pronta";
      els.bankReadyTag.className = "tag positive";
      els.bankStatusMessage.textContent =
        "Configurazione base pronta. Il prossimo step e costruire l'endpoint che firma il JWT e apre il consenso verso la banca.";
      return;
    }

    els.bankReadyTag.textContent = "Da configurare";
    els.bankReadyTag.className = "tag negative";
    els.bankStatusMessage.textContent = "Mancano ancora una o piu variabili Cloudflare del provider open banking.";
  } catch (error) {
    els.bankReadyTag.textContent = "Errore";
    els.bankReadyTag.className = "tag negative";
    els.bankStatusMessage.textContent = "Non riesco a leggere la configurazione banca dal Worker.";
  }
}

function bindEvents() {
  els.refreshBankStatus?.addEventListener("click", () => {
    refreshBankConfig();
  });

  els.logoutButton?.addEventListener("click", async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    sessionStorage.removeItem(LOGIN_SESSION_KEY);
    window.location.href = "./index.html";
  });
}
