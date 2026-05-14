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
  verifyBankApi: document.getElementById("verifyBankApi"),
  bankApiTag: document.getElementById("bankApiTag"),
  bankApiName: document.getElementById("bankApiName"),
  bankApiKid: document.getElementById("bankApiKid"),
  bankApiActive: document.getElementById("bankApiActive"),
  bankApiEnvironment: document.getElementById("bankApiEnvironment"),
  bankApiServices: document.getElementById("bankApiServices"),
  bankApiRedirects: document.getElementById("bankApiRedirects"),
  bankApiMessage: document.getElementById("bankApiMessage"),
  loadBankInstitutions: document.getElementById("loadBankInstitutions"),
  bankInstitutionsList: document.getElementById("bankInstitutionsList"),
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

function renderInstitutionMessage(message) {
  if (!els.bankInstitutionsList) {
    return;
  }

  els.bankInstitutionsList.innerHTML = `
    <article class="list-item">
      <p class="list-meta">${escapeHtml(message)}</p>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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

async function verifyBankApiAccess() {
  try {
    els.bankApiTag.textContent = "Verifica...";
    els.bankApiTag.className = "tag";
    els.bankApiMessage.textContent = "Sto contattando Enable Banking con il JWT firmato dal Worker.";

    const response = await fetch("/api/bank/health", { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error || "Verifica API non riuscita");
    }

    const application = payload.application || {};
    els.bankApiTag.textContent = "Connessa";
    els.bankApiTag.className = "tag positive";
    els.bankApiName.textContent = application.name || "-";
    els.bankApiKid.textContent = application.kid || "-";
    els.bankApiEnvironment.textContent = application.environment || "-";
    els.bankApiServices.textContent = Array.isArray(application.services) && application.services.length ? application.services.join(", ") : "-";
    els.bankApiRedirects.textContent =
      Array.isArray(application.redirect_urls) && application.redirect_urls.length ? application.redirect_urls.join(" · ") : "-";
    els.bankApiActive.textContent = application.active ? "Si" : "No";
    els.bankApiActive.className = application.active ? "positive" : "negative";
    els.bankApiMessage.textContent =
      "JWT valido: il Worker riesce a parlare con Enable Banking. Il prossimo passo sara aprire la lista istituti e poi costruire il flusso di consenso.";
  } catch (error) {
    els.bankApiTag.textContent = "Errore";
    els.bankApiTag.className = "tag negative";
    els.bankApiActive.textContent = "Errore";
    els.bankApiActive.className = "negative";
    els.bankApiMessage.textContent = error.message || "Non riesco a verificare l'accesso API.";
  }
}

async function loadBankInstitutions() {
  try {
    renderInstitutionMessage("Sto caricando gli istituti disponibili per il paese IT...");
    const response = await fetch("/api/bank/aspsps?country=IT&service=AIS", { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error || "Caricamento istituti non riuscito");
    }

    const aspsps = Array.isArray(payload.aspsps) ? payload.aspsps : [];
    if (!aspsps.length) {
      renderInstitutionMessage("Nessun istituto trovato per il filtro corrente.");
      return;
    }

    const topInstitutions = aspsps
      .slice()
      .sort((left, right) => {
        const leftScore = /revolut/i.test(left.name || "") ? -1 : 0;
        const rightScore = /revolut/i.test(right.name || "") ? -1 : 0;
        if (leftScore !== rightScore) {
          return leftScore - rightScore;
        }
        return String(left.name || "").localeCompare(String(right.name || ""), "it");
      })
      .slice(0, 12);

    els.bankInstitutionsList.innerHTML = topInstitutions
      .map((institution) => {
        const name = escapeHtml(institution.name || "Istituto");
        const country = escapeHtml(institution.country || "—");
        const psuTypes = Array.isArray(institution.psu_types) && institution.psu_types.length ? institution.psu_types.join(", ") : "n/d";
        const authMethods =
          Array.isArray(institution.auth_methods) && institution.auth_methods.length
            ? institution.auth_methods.map((method) => method.name).filter(Boolean).join(", ")
            : "n/d";
        return `
          <article class="list-item">
            <div class="list-item-top">
              <h5>${name}</h5>
              <strong>${country}</strong>
            </div>
            <p class="list-meta">PSU type: ${escapeHtml(psuTypes)}</p>
            <p class="list-meta">Auth methods: ${escapeHtml(authMethods)}</p>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    renderInstitutionMessage(error.message || "Non riesco a caricare gli istituti.");
  }
}

function bindEvents() {
  els.refreshBankStatus?.addEventListener("click", () => {
    refreshBankConfig();
  });

  els.verifyBankApi?.addEventListener("click", () => {
    verifyBankApiAccess();
  });

  els.loadBankInstitutions?.addEventListener("click", () => {
    loadBankInstitutions();
  });

  els.logoutButton?.addEventListener("click", async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    sessionStorage.removeItem(LOGIN_SESSION_KEY);
    window.location.href = "./index.html";
  });
}
