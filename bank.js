const LOGIN_SESSION_KEY = "budget-planner-session-user";
const SUPABASE_CONFIG_ENDPOINT = "/api/config";
const MONTH_NAMES = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

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
  loadRecentTransactions: document.getElementById("loadRecentTransactions"),
  bankConnectionTag: document.getElementById("bankConnectionTag"),
  bankConnectedInstitution: document.getElementById("bankConnectedInstitution"),
  bankConnectedSession: document.getElementById("bankConnectedSession"),
  bankAccountSelect: document.getElementById("bankAccountSelect"),
  bankConnectionMessage: document.getElementById("bankConnectionMessage"),
  bankTransactionsTag: document.getElementById("bankTransactionsTag"),
  bankTransactionsMessage: document.getElementById("bankTransactionsMessage"),
  bankTransactionsList: document.getElementById("bankTransactionsList"),
  loadMissingBankTransactions: document.getElementById("loadMissingBankTransactions"),
  insertMissingBankTransactions: document.getElementById("insertMissingBankTransactions"),
  bankMissingTransactionsMessage: document.getElementById("bankMissingTransactionsMessage"),
  bankMissingTransactionsList: document.getElementById("bankMissingTransactionsList"),
};

let supabaseClient = null;
let supabaseSession = null;
let availableInstitutions = [];
let linkedBankSession = null;
let pendingBankImports = [];

bootstrap();

async function bootstrap() {
  await initializeSupabase();
  bindEvents();
  updateUsername();
  restoreLinkedBankSession();
  await restoreLinkedBankSessionFromCloud();
  await refreshBankConfig();
  await verifyStoredBankSession();
  await handleAuthCallback();
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
    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      supabaseSession = session || null;
      updateUsername();
      restoreLinkedBankSession();
      await restoreLinkedBankSessionFromCloud();
      await verifyStoredBankSession();
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

function getInstitutionByName(name) {
  return availableInstitutions.find((institution) => String(institution.name || "") === String(name || ""));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getAuthStateStorageKey() {
  const username = getCurrentUsername() || "guest";
  return `budget-bank-auth-state:${username}`;
}

function setPendingAuthState(value) {
  sessionStorage.setItem(getAuthStateStorageKey(), value);
}

function getPendingAuthState() {
  return sessionStorage.getItem(getAuthStateStorageKey()) || "";
}

function clearPendingAuthState() {
  sessionStorage.removeItem(getAuthStateStorageKey());
}

function getLinkedBankSessionStorageKey() {
  const username = getCurrentUsername() || "guest";
  return `budget-bank-session:${username}`;
}

function saveLinkedBankSession(sessionData) {
  linkedBankSession = sessionData;
  localStorage.setItem(getLinkedBankSessionStorageKey(), JSON.stringify(sessionData));
  renderLinkedBankSession();
}

async function persistCurrentBankSession(status = "authorized") {
  if (!linkedBankSession?.sessionId) {
    return;
  }

  try {
    const saved = await saveRemoteBankConnection(linkedBankSession, status);
    if (saved?.id) {
      linkedBankSession.connectionId = saved.id;
      linkedBankSession.status = saved.status || status;
      linkedBankSession.connectedAt = saved.updated_at || linkedBankSession.connectedAt;
      localStorage.setItem(getLinkedBankSessionStorageKey(), JSON.stringify(linkedBankSession));
      renderLinkedBankSession();
    }
  } catch (error) {
    console.warn("Impossibile salvare la connessione bancaria su Supabase.", error);
  }
}

function restoreLinkedBankSession() {
  try {
    const raw = localStorage.getItem(getLinkedBankSessionStorageKey());
    linkedBankSession = raw ? JSON.parse(raw) : null;
  } catch {
    linkedBankSession = null;
  }
  renderLinkedBankSession();
}

function renderLinkedBankSession() {
  const accounts = Array.isArray(linkedBankSession?.accounts) ? linkedBankSession.accounts : [];
  if (!linkedBankSession) {
    els.bankConnectionTag.textContent = "Nessuna";
    els.bankConnectionTag.className = "tag";
    els.bankConnectedInstitution.textContent = "-";
    els.bankConnectedSession.textContent = "-";
    els.bankConnectionMessage.textContent =
      "Dopo il consenso salvero qui la sessione collegata e potrai usare questo blocco per testare le transazioni reali.";
    if (els.bankAccountSelect) {
      els.bankAccountSelect.innerHTML = `<option value="">Nessun account disponibile</option>`;
    }
    return;
  }

  els.bankConnectionTag.textContent = "Collegata";
  els.bankConnectionTag.className = "tag positive";
  els.bankConnectedInstitution.textContent = linkedBankSession.institutionName || "-";
  els.bankConnectedSession.textContent = linkedBankSession.sessionId || "-";
  els.bankConnectionMessage.textContent = `Sessione collegata il ${new Date(linkedBankSession.connectedAt || Date.now()).toLocaleString("it-IT")}.`;

  if (els.bankAccountSelect) {
    if (!accounts.length) {
      els.bankAccountSelect.innerHTML = `<option value="">Nessun account disponibile</option>`;
      return;
    }

    els.bankAccountSelect.innerHTML = accounts
      .map((account, index) => {
        const accountUid = escapeHtml(account.uid || "");
        const label = escapeHtml(describeBankAccount(account, index));
        return `<option value="${accountUid}">${label}</option>`;
      })
      .join("");
  }
}

function describeBankAccount(account, index) {
  const accountId = account?.account_id || {};
  const iban = accountId.iban || accountId.identification || "";
  const genericId = Array.isArray(account?.all_account_ids) && account.all_account_ids.length ? account.all_account_ids[0]?.identification : "";
  return iban || genericId || `Conto ${index + 1}`;
}

function isSupabaseEnabled() {
  return Boolean(supabaseClient && supabaseSession?.user?.id);
}

async function fetchRemotePlannerRow() {
  if (!isSupabaseEnabled()) {
    return null;
  }

  const result = await supabaseClient
    .from("planner_states")
    .select("planner_state, username")
    .eq("user_id", supabaseSession.user.id)
    .maybeSingle();

  if (result.error) {
    throw new Error(result.error.message || "Errore lettura planner state.");
  }

  return result.data || null;
}

async function upsertRemotePlannerState(plannerState) {
  if (!isSupabaseEnabled()) {
    throw new Error("Serve il login Supabase per salvare nel database.");
  }

  const result = await supabaseClient.from("planner_states").upsert(
    {
      user_id: supabaseSession.user.id,
      username: getCurrentUsername(),
      planner_state: plannerState,
    },
    { onConflict: "user_id" },
  );

  if (result.error) {
    throw new Error(result.error.message || "Errore salvataggio planner state.");
  }
}

async function fetchRemoteBankConnection() {
  if (!isSupabaseEnabled()) {
    return null;
  }

  const result = await supabaseClient
    .from("bank_connections")
    .select("*")
    .eq("user_id", supabaseSession.user.id)
    .eq("provider", "enable-banking")
    .order("updated_at", { ascending: false })
    .limit(1);

  if (result.error) {
    throw new Error(result.error.message || "Errore lettura connessione bancaria.");
  }

  return result.data?.[0] || null;
}

async function saveRemoteBankConnection(sessionData, status = "authorized") {
  if (!isSupabaseEnabled() || !sessionData?.sessionId) {
    return null;
  }

  const existing = await fetchRemoteBankConnection();
  const payload = {
    user_id: supabaseSession.user.id,
    provider: "enable-banking",
    aggregator: "enable-banking",
    institution_id: sessionData.institutionId || sessionData.institutionName || null,
    institution_name: sessionData.institutionName || null,
    requisition_id: sessionData.sessionId,
    agreement_id: sessionData.authorizationId || null,
    account_ids: sessionData.accounts || [],
    status,
    last_synced_at: sessionData.lastSyncedAt || null,
  };

  const query = existing
    ? supabaseClient.from("bank_connections").update(payload).eq("id", existing.id).eq("user_id", supabaseSession.user.id).select("*").single()
    : supabaseClient.from("bank_connections").insert(payload).select("*").single();

  const result = await query;
  if (result.error) {
    throw new Error(result.error.message || "Errore salvataggio connessione bancaria.");
  }

  return result.data || null;
}

async function restoreLinkedBankSessionFromCloud() {
  if (!isSupabaseEnabled()) {
    return;
  }

  try {
    const remoteConnection = await fetchRemoteBankConnection();
    if (!remoteConnection?.requisition_id) {
      return;
    }

    linkedBankSession = {
      sessionId: remoteConnection.requisition_id,
      institutionName: remoteConnection.institution_name || "Istituto collegato",
      institutionId: remoteConnection.institution_id || remoteConnection.institution_name || "",
      connectedAt: remoteConnection.updated_at || remoteConnection.created_at || new Date().toISOString(),
      accounts: Array.isArray(remoteConnection.account_ids) ? remoteConnection.account_ids : [],
      connectionId: remoteConnection.id,
      status: remoteConnection.status || "",
      lastSyncedAt: remoteConnection.last_synced_at || "",
    };
    localStorage.setItem(getLinkedBankSessionStorageKey(), JSON.stringify(linkedBankSession));
    renderLinkedBankSession();
  } catch (error) {
    console.warn("Impossibile ripristinare la connessione bancaria da Supabase.", error);
  }
}

function renderMissingTransactionsMessage(message, tone = "") {
  if (!els.bankMissingTransactionsMessage) {
    return;
  }
  els.bankMissingTransactionsMessage.textContent = message;
  els.bankMissingTransactionsMessage.className = tone ? `list-meta ${tone}` : "list-meta";
}

function renderMissingTransactionsPreview() {
  if (!els.bankMissingTransactionsList) {
    return;
  }

  if (!pendingBankImports.length) {
    els.bankMissingTransactionsList.innerHTML = `
      <article class="list-item">
        <p class="list-meta">Non ho ancora preparato nessuna anteprima di import.</p>
      </article>
    `;
    return;
  }

  els.bankMissingTransactionsList.innerHTML = pendingBankImports
    .map((item, index) => {
      const amountClass = Number(item.amount || 0) < 0 ? "amount-negative" : "amount-positive";
      return `
        <article class="list-item bank-preview-card" data-preview-index="${index}">
          <div class="bank-preview-header">
            <div>
              <strong>${escapeHtml(item.bankLabel || "Movimento bancario")}</strong>
              <p class="list-meta">${escapeHtml(item.accountLabel || "Conto collegato")}</p>
            </div>
            <label>
              <input type="checkbox" class="bank-preview-include" data-preview-index="${index}" ${item.include ? "checked" : ""} />
              Includi
            </label>
          </div>
          <div class="bank-preview-grid">
            <label>
              Data
              <input type="date" class="bank-preview-date" data-preview-index="${index}" value="${escapeHtml(item.date)}" />
            </label>
            <label>
              Ora
              <input type="time" class="bank-preview-time" data-preview-index="${index}" value="${escapeHtml(item.time || "")}" />
            </label>
            <label>
              Tipo
              <select class="bank-preview-type" data-preview-index="${index}">
                ${renderPreviewTypeOptions(item.type)}
              </select>
            </label>
            <label>
              Categoria
              <input type="text" class="bank-preview-category" data-preview-index="${index}" value="${escapeHtml(item.category || "")}" list="bank-preview-categories" />
            </label>
            <label>
              Importo
              <input type="number" step="0.01" class="bank-preview-amount ${amountClass}" data-preview-index="${index}" value="${escapeHtml(item.amount)}" />
            </label>
            <label>
              Nota
              <input type="text" class="bank-preview-note" data-preview-index="${index}" value="${escapeHtml(item.note || "")}" />
            </label>
          </div>
          <p class="list-meta">ID banca: ${escapeHtml(item.externalTransactionId)}</p>
        </article>
      `;
    })
    .join("");

  if (!document.getElementById("bank-preview-categories")) {
    const dataList = document.createElement("datalist");
    dataList.id = "bank-preview-categories";
    document.body.appendChild(dataList);
  }
}

function renderPreviewTypeOptions(selectedType) {
  const options = [
    { value: "expense", label: "Spesa" },
    { value: "income", label: "Entrata" },
    { value: "saving", label: "Risparmio" },
    { value: "debt", label: "Debito" },
  ];
  return options
    .map((option) => `<option value="${option.value}" ${option.value === selectedType ? "selected" : ""}>${option.label}</option>`)
    .join("");
}

function buildPlannerCategorySuggestions(plannerState) {
  const budgetCategories = (plannerState?.months || []).flatMap((month) => (month.categoryBudgets || []).map((item) => item.name));
  const movementCategories = (plannerState?.months || []).flatMap((month) => (month.transactions || []).map((item) => item.category));
  return [...new Set([...budgetCategories, ...movementCategories].filter(Boolean))].sort((a, b) => a.localeCompare(b, "it"));
}

function refreshCategoryDatalist(categories) {
  let dataList = document.getElementById("bank-preview-categories");
  if (!dataList) {
    dataList = document.createElement("datalist");
    dataList.id = "bank-preview-categories";
    document.body.appendChild(dataList);
  }
  dataList.innerHTML = categories.map((category) => `<option value="${escapeHtml(category)}"></option>`).join("");
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

async function verifyStoredBankSession() {
  if (!linkedBankSession?.sessionId) {
    return;
  }

  try {
    const response = await fetch(`/api/bank/session/status?sessionId=${encodeURIComponent(linkedBankSession.sessionId)}`, {
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error || "Verifica sessione non riuscita");
    }

    linkedBankSession.status = payload.status || linkedBankSession.status || "AUTHORIZED";
    linkedBankSession.institutionName = payload.aspsp?.name || linkedBankSession.institutionName;
    linkedBankSession.institutionId = payload.aspsp?.name || linkedBankSession.institutionId;
    linkedBankSession.accounts = Array.isArray(payload.accounts_data) && payload.accounts_data.length ? payload.accounts_data : linkedBankSession.accounts;
    localStorage.setItem(getLinkedBankSessionStorageKey(), JSON.stringify(linkedBankSession));
    renderLinkedBankSession();

    if (String(payload.status || "").toUpperCase() === "AUTHORIZED") {
      els.bankConnectionTag.textContent = "Collegata";
      els.bankConnectionTag.className = "tag positive";
      els.bankConnectionMessage.textContent = "Sessione bancaria ancora valida: puoi riusarla senza rifare il consenso.";
      await persistCurrentBankSession("authorized");
      return;
    }

    els.bankConnectionTag.textContent = payload.status || "Da rinnovare";
    els.bankConnectionTag.className = "tag negative";
    els.bankConnectionMessage.textContent = `La sessione bancaria risulta ${payload.status || "non valida"}. Potrebbe servire rinnovare il consenso.`;
    await persistCurrentBankSession(String(payload.status || "expired").toLowerCase());
  } catch (error) {
    els.bankConnectionTag.textContent = "Da verificare";
    els.bankConnectionTag.className = "tag";
    els.bankConnectionMessage.textContent = "Ho una sessione salvata, ma non riesco a verificarne lo stato in questo momento.";
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
    availableInstitutions = aspsps;
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
        const encodedName = escapeHtml(institution.name || "");
        return `
          <button type="button" class="list-item bank-institution-button" data-bank-name="${encodedName}">
            <div class="list-item-top">
              <h5>${name}</h5>
              <strong>${country}</strong>
            </div>
            <p class="list-meta">PSU type: ${escapeHtml(psuTypes)}</p>
            <p class="list-meta">Auth methods: ${escapeHtml(authMethods)}</p>
          </button>
        `;
      })
      .join("");
  } catch (error) {
    renderInstitutionMessage(error.message || "Non riesco a caricare gli istituti.");
  }
}

async function startBankAuthorization(bankName) {
  const institution = getInstitutionByName(bankName);
  if (!institution) {
    renderInstitutionMessage("Non riesco a trovare l'istituto selezionato.");
    return;
  }

  try {
    renderInstitutionMessage(`Sto avviando il consenso per ${bankName}...`);
    const preferredMethod =
      Array.isArray(institution.auth_methods) && institution.auth_methods.length
        ? institution.auth_methods.find((method) => method.psu_type === "personal" && !method.hidden_method) ||
          institution.auth_methods.find((method) => !method.hidden_method) ||
          institution.auth_methods[0]
        : null;

    const response = await fetch("/api/bank/auth/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aspsp: {
          name: institution.name,
          country: institution.country || "IT",
        },
        psuType: preferredMethod?.psu_type || (Array.isArray(institution.psu_types) && institution.psu_types.includes("personal") ? "personal" : null),
        authMethod: preferredMethod?.name || null,
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error || "Avvio consenso non riuscito");
    }

    if (payload.state) {
      setPendingAuthState(payload.state);
    }

    if (!payload.url) {
      throw new Error("Enable Banking non ha restituito l'URL di autorizzazione.");
    }

    window.location.href = payload.url;
  } catch (error) {
    renderInstitutionMessage(error.message || "Non riesco ad avviare il consenso.");
  }
}

async function handleAuthCallback() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");
  const returnedState = url.searchParams.get("state");

  if (!code && !error) {
    return;
  }

  if (error) {
    els.bankApiMessage.textContent = errorDescription || `Autorizzazione interrotta: ${error}`;
    clearPendingAuthState();
    url.search = "";
    window.history.replaceState({}, "", url.toString());
    return;
  }

  const expectedState = getPendingAuthState();
  if (expectedState && returnedState && expectedState !== returnedState) {
    els.bankApiMessage.textContent = "Lo stato di sicurezza del callback non coincide. Riprova il collegamento.";
    clearPendingAuthState();
    url.search = "";
    window.history.replaceState({}, "", url.toString());
    return;
  }

  try {
    els.bankApiMessage.textContent = "Sto completando la sessione bancaria dopo il consenso...";
    const response = await fetch("/api/bank/session/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error || "Completamento sessione non riuscito");
    }

    const accounts = Array.isArray(payload.accounts) ? payload.accounts : [];
    const accountCount = accounts.length;
    saveLinkedBankSession({
      sessionId: payload.session_id || "",
      institutionName: payload.aspsp?.name || "Istituto collegato",
      institutionId: payload.aspsp?.name || "",
      connectedAt: new Date().toISOString(),
      accounts,
    });
    await persistCurrentBankSession("authorized");
    els.bankApiTag.textContent = "Collegata";
    els.bankApiTag.className = "tag positive";
    els.bankApiMessage.textContent = `Consenso completato. Sessione creata con ${accountCount} account accessibili.`;
    renderInstitutionMessage(
      accountCount
        ? `Collegamento completato. Ho accesso a ${accountCount} account. Il prossimo step sara salvarli in Supabase e sincronizzare movimenti e saldi.`
        : "Collegamento completato, ma la banca non ha restituito account accessibili in questa fase.",
    );
  } catch (authError) {
    els.bankApiTag.textContent = "Errore";
    els.bankApiTag.className = "tag negative";
    els.bankApiMessage.textContent = authError.message || "Non riesco a completare la sessione bancaria.";
  } finally {
    clearPendingAuthState();
    url.search = "";
    window.history.replaceState({}, "", url.toString());
  }
}

function normalizeTransactionAmount(transaction) {
  const amountSource =
    transaction?.transaction_amount ||
    transaction?.proprietary_bank_transaction_code?.transaction_amount ||
    transaction?.amount ||
    transaction?.balance_after_transaction?.balance_amount;
  const amount = Number.parseFloat(amountSource?.amount ?? amountSource?.value ?? "0");
  const currency = amountSource?.currency || "EUR";
  const indicator = String(transaction?.credit_debit_indicator || transaction?.direction || "").toUpperCase();
  return {
    amount: indicator === "DBIT" ? -Math.abs(amount) : indicator === "CRDT" ? Math.abs(amount) : amount,
    currency,
  };
}

function normalizeTransactionDate(transaction) {
  const dateFields = [
    transaction?.booking_date_time,
    transaction?.value_date_time,
    transaction?.status_update_date_time,
    transaction?.transaction_date_time,
    transaction?.booking_date,
    transaction?.value_date,
    transaction?.transaction_date,
  ];
  return dateFields.find((value) => String(value || "").trim()) || "";
}

function extractTransactionDateParts(transaction) {
  const rawValue = String(normalizeTransactionDate(transaction) || "").trim();
  if (!rawValue) {
    return { date: "", time: "" };
  }

  const directDateMatch = rawValue.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/);
  if (directDateMatch) {
    return { date: directDateMatch[1], time: directDateMatch[2] };
  }

  const onlyDateMatch = rawValue.match(/^(\d{4}-\d{2}-\d{2})$/);
  if (onlyDateMatch) {
    return { date: onlyDateMatch[1], time: extractFallbackTime(transaction) };
  }

  const parsedDate = new Date(rawValue);
  if (!Number.isNaN(parsedDate.getTime())) {
    return {
      date: `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`,
      time: `${String(parsedDate.getHours()).padStart(2, "0")}:${String(parsedDate.getMinutes()).padStart(2, "0")}`,
    };
  }

  return { date: rawValue.slice(0, 10), time: extractFallbackTime(transaction) };
}

function extractFallbackTime(transaction) {
  const timeCandidates = [
    transaction?.booking_time,
    transaction?.value_time,
    transaction?.transaction_time,
    transaction?.status_update_time,
  ];
  const explicitTime = timeCandidates.find((value) => String(value || "").trim());
  if (explicitTime) {
    return String(explicitTime).trim().slice(0, 5);
  }
  return "";
}

function isTechnicalIdentifier(value) {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return true;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(normalized);
}

function firstUsefulTransactionText(...values) {
  for (const value of values.flat()) {
    const normalized = String(value || "").trim();
    if (!normalized || isTechnicalIdentifier(normalized)) {
      continue;
    }
    return normalized;
  }
  return "";
}

function normalizeTransactionLabel(transaction) {
  const remittance = transaction?.remittance_information;
  const remittanceText = Array.isArray(remittance?.unstructured)
    ? remittance.unstructured.join(" ")
    : remittance?.unstructured || remittance?.reference || "";
  return (
    firstUsefulTransactionText(
      transaction?.merchant_name,
      transaction?.creditor_name,
      transaction?.debtor_name,
      transaction?.counterparty_name,
      transaction?.ultimate_creditor,
      transaction?.ultimate_debtor,
      remittanceText,
      transaction?.transaction_information,
      transaction?.additional_information,
      transaction?.proprietary_bank_transaction_code?.description,
      transaction?.proprietary_bank_transaction_code?.code,
      transaction?.end_to_end_identification,
      transaction?.entry_reference,
      transaction?.transaction_id,
    ) || "Movimento bancario"
  );
}

function createBankExternalTransactionId(accountUid, transaction) {
  return (
    transaction?.entry_reference ||
    transaction?.transaction_id ||
    [
      accountUid,
      normalizeTransactionDate(transaction),
      normalizeTransactionLabel(transaction),
      Number(normalizeTransactionAmount(transaction).amount || 0).toFixed(2),
    ].join("|")
  );
}

function createPlannerDuplicateSignature(entry) {
  return [
    entry.date || "",
    Number(entry.amount || 0).toFixed(2),
    String(entry.note || "").trim().toLowerCase(),
  ].join("|");
}

function suggestCategoryFromTransaction(label, plannerCategories = []) {
  const normalized = String(label || "").toLowerCase();
  const staticRules = [
    { pattern: /(deliveroo|mcdonald|mcdonald|bar |caffe|ristor|pub|tavola|eat|restaurant)/i, category: "Food & Drink" },
    { pattern: /(apple|spotify|netflix|iliad|vodafone|tim|prime|youtube)/i, category: "Abbonamenti" },
    { pattern: /(trenitalia|taxi|uber|bus|metro|train|autostrade)/i, category: "Trasporti" },
    { pattern: /(super|market|spesa|conad|coop|esselunga|lidl|carrefour)/i, category: "Spesa" },
    { pattern: /(charity|benefic|donaz|palio)/i, category: "Beneficenza" },
    { pattern: /(revolut|bonifico|transfer|friend|private)/i, category: "Bonifici privati" },
  ];

  const existingMatch = plannerCategories.find((category) => normalized.includes(String(category).toLowerCase()));
  if (existingMatch) {
    return existingMatch;
  }

  const ruleMatch = staticRules.find((rule) => rule.pattern.test(normalized));
  if (ruleMatch) {
    return plannerCategories.find((category) => String(category).toLowerCase() === ruleMatch.category.toLowerCase()) || ruleMatch.category;
  }

  return plannerCategories[0] || "Varie";
}

function ensurePlannerMonth(plannerState, dateString) {
  const [yearText, monthText] = String(dateString || "").split("-");
  const year = Number(yearText);
  const monthId = Number(monthText) - 1;
  let month = (plannerState.months || []).find((entry) => Number(entry.year) === year && Number(entry.id) === monthId);
  if (month) {
    return month;
  }

  month = {
    id: monthId,
    name: MONTH_NAMES[monthId] || `Mese ${monthId + 1}`,
    year,
    incomes: [],
    bills: [],
    categoryBudgets: [],
    transactions: [],
  };
  plannerState.months.push(month);
  plannerState.months.sort((left, right) => {
    if (left.year !== right.year) {
      return left.year - right.year;
    }
    return left.id - right.id;
  });
  return month;
}

async function loadMissingBankTransactionsPreview() {
  if (!linkedBankSession?.sessionId) {
    renderMissingTransactionsMessage("Prima completa o ripristina una connessione bancaria valida.", "negative");
    return;
  }

  const accountUid = els.bankAccountSelect?.value || linkedBankSession?.accounts?.[0]?.uid || "";
  if (!accountUid) {
    renderMissingTransactionsMessage("Seleziona un conto collegato prima di generare l'anteprima.", "negative");
    return;
  }

  if (!isSupabaseEnabled()) {
    renderMissingTransactionsMessage("Per l'import guidato serve il login con Supabase sul sito online.", "negative");
    return;
  }

  try {
    renderMissingTransactionsMessage("Sto confrontando le transazioni bancarie con quelle gia presenti nel planner...");
    const [plannerRow, importedRowsResult, bankResponse] = await Promise.all([
      fetchRemotePlannerRow(),
      supabaseClient
        .from("bank_transactions")
        .select("external_transaction_id")
        .eq("user_id", supabaseSession.user.id),
      fetch("/api/bank/transactions/recent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountUid,
          days: 30,
        }),
      }),
    ]);

    if (importedRowsResult.error) {
      throw new Error(importedRowsResult.error.message || "Errore lettura transazioni gia importate.");
    }

    const bankPayload = await bankResponse.json();
    if (!bankResponse.ok) {
      throw new Error(bankPayload?.error || "Errore lettura transazioni dalla banca.");
    }

    const plannerState = plannerRow?.planner_state || { months: [] };
    const plannerCategories = buildPlannerCategorySuggestions(plannerState);
    refreshCategoryDatalist(plannerCategories);
    const importedExternalIds = new Set((importedRowsResult.data || []).map((row) => row.external_transaction_id));
    const plannerDuplicates = new Set(
      (plannerState.months || [])
        .flatMap((month) => (month.transactions || []).map((item) => createPlannerDuplicateSignature(item))),
    );

    const bankTransactions = Array.isArray(bankPayload.transactions) ? bankPayload.transactions : [];
    pendingBankImports = bankTransactions
      .map((transaction) => {
        const amountInfo = normalizeTransactionAmount(transaction);
        const { date: datePart, time: timePart } = extractTransactionDateParts(transaction);
        const note = normalizeTransactionLabel(transaction);
        const type = amountInfo.amount >= 0 ? "income" : "expense";
        const category = type === "income" ? "Entrate" : suggestCategoryFromTransaction(note, plannerCategories);
        const normalizedAmount = Number(Math.abs(amountInfo.amount).toFixed(2));
        const preview = {
          include: true,
          accountUid,
          externalTransactionId: createBankExternalTransactionId(accountUid, transaction),
          bankLabel: note,
          accountLabel: describeBankAccount(
            (linkedBankSession.accounts || []).find((account) => account.uid === accountUid) || {},
            0,
          ),
          date: datePart,
          time: timePart,
          type,
          category,
          amount: normalizedAmount,
          note,
          currency: amountInfo.currency,
          rawPayload: transaction,
        };
        preview.duplicateSignature = createPlannerDuplicateSignature(preview);
        return preview;
      })
      .filter((preview) => preview.date)
      .filter((preview) => !importedExternalIds.has(preview.externalTransactionId))
      .filter((preview) => !plannerDuplicates.has(preview.duplicateSignature));

    renderMissingTransactionsPreview();
    renderMissingTransactionsMessage(
      pendingBankImports.length
        ? `Ho trovato ${pendingBankImports.length} transazioni mancanti negli ultimi 30 giorni. Puoi correggerle prima di inserirle.`
        : "Non ho trovato transazioni mancanti da importare negli ultimi 30 giorni.",
      pendingBankImports.length ? "positive" : "",
    );
  } catch (error) {
    pendingBankImports = [];
    renderMissingTransactionsPreview();
    renderMissingTransactionsMessage(error.message || "Non riesco a preparare l'anteprima di import.", "negative");
  }
}

async function insertMissingBankTransactions() {
  const selected = pendingBankImports.filter((item) => item.include);
  if (!selected.length) {
    renderMissingTransactionsMessage("Seleziona almeno una transazione da inserire.", "negative");
    return;
  }

  if (!isSupabaseEnabled()) {
    renderMissingTransactionsMessage("Serve il login Supabase per scrivere nel database del sito.", "negative");
    return;
  }

  try {
    renderMissingTransactionsMessage("Sto inserendo le transazioni selezionate nel planner e nel database...");
    let connection = await fetchRemoteBankConnection();
    if (!connection) {
      connection = await saveRemoteBankConnection(linkedBankSession, "authorized");
    }
    if (!connection?.id) {
      throw new Error("Non ho trovato una connessione bancaria salvata su Supabase.");
    }

    const plannerRow = await fetchRemotePlannerRow();
    const plannerState = structuredClone(plannerRow?.planner_state || { months: [], investments: [], savingsGoals: [], debtGoals: [], profile: {} });
    plannerState.months = plannerState.months || [];

    const insertedRows = [];
    selected.forEach((item) => {
      const month = ensurePlannerMonth(plannerState, item.date);
      if (item.type === "expense" && item.category && !(month.categoryBudgets || []).some((entry) => entry.name === item.category)) {
        month.categoryBudgets = month.categoryBudgets || [];
        month.categoryBudgets.unshift({
          id: crypto.randomUUID(),
          name: item.category,
          budget: 0,
          isUndefinedBudget: true,
        });
      }

      month.transactions = month.transactions || [];
      const plannerTransactionId = crypto.randomUUID();
      month.transactions.unshift({
        id: plannerTransactionId,
        date: item.date,
        time: item.time || "",
        type: item.type,
        category: item.category || (item.type === "income" ? "Entrate" : "Varie"),
        amount: Number(item.amount || 0),
        note: item.note || item.bankLabel || "Movimento bancario",
      });

      insertedRows.push({
        user_id: supabaseSession.user.id,
        bank_connection_id: connection.id,
        external_transaction_id: item.externalTransactionId,
        booking_date: item.date,
        booking_datetime: item.time ? `${item.date}T${item.time}:00` : null,
        amount: item.type === "income" ? Number(item.amount || 0) : -Math.abs(Number(item.amount || 0)),
        currency: item.currency || "EUR",
        direction: item.type === "income" ? "credit" : "debit",
        description: item.note || item.bankLabel || "Movimento bancario",
        merchant_name: item.bankLabel || null,
        planner_transaction_id: plannerTransactionId,
        planner_category: item.category || null,
        raw_payload: item.rawPayload || {},
      });
    });

    await upsertRemotePlannerState(plannerState);

    const insertResult = await supabaseClient.from("bank_transactions").upsert(insertedRows, {
      onConflict: "user_id,external_transaction_id",
    });
    if (insertResult.error) {
      throw new Error(insertResult.error.message || "Errore salvataggio transazioni bancarie.");
    }

    linkedBankSession.lastSyncedAt = new Date().toISOString();
    await persistCurrentBankSession("authorized");
    pendingBankImports = [];
    renderMissingTransactionsPreview();
    renderMissingTransactionsMessage(`Ho inserito ${selected.length} transazioni mancanti nel database del sito.`, "positive");
  } catch (error) {
    renderMissingTransactionsMessage(error.message || "Non riesco a inserire le transazioni selezionate.", "negative");
  }
}

function renderRecentTransactions(transactions) {
  if (!els.bankTransactionsList) {
    return;
  }

  if (!transactions.length) {
    els.bankTransactionsList.innerHTML = `
      <article class="list-item">
        <p class="list-meta">Nessuna transazione trovata negli ultimi 5 giorni per il conto selezionato.</p>
      </article>
    `;
    return;
  }

  els.bankTransactionsList.innerHTML = transactions
    .map((transaction) => {
      const amount = normalizeTransactionAmount(transaction);
      const signedAmount = Number.isFinite(amount.amount) ? amount.amount : 0;
      const amountClass = signedAmount < 0 ? "amount-negative" : "amount-positive";
      const amountText = `${signedAmount < 0 ? "-" : "+"}${Math.abs(signedAmount).toFixed(2)} ${escapeHtml(amount.currency)}`;
      const dateText = normalizeTransactionDate(transaction);
      const title = normalizeTransactionLabel(transaction);
      const status = escapeHtml(transaction?.status || "BOOK");
      return `
        <article class="list-item">
          <div class="list-item-top">
            <h5>${escapeHtml(title)}</h5>
            <strong class="${amountClass}">${amountText}</strong>
          </div>
          <p class="list-meta">${escapeHtml(dateText || "Data non disponibile")}</p>
          <p class="list-meta">Status: ${status}</p>
        </article>
      `;
    })
    .join("");
}

async function loadRecentTransactions() {
  if (!linkedBankSession?.sessionId) {
    els.bankTransactionsTag.textContent = "Nessuna sessione";
    els.bankTransactionsTag.className = "tag negative";
    els.bankTransactionsMessage.textContent = "Prima completa il consenso della banca, poi potro leggere i movimenti.";
    return;
  }

  const accountUid = els.bankAccountSelect?.value || linkedBankSession?.accounts?.[0]?.uid || "";
  if (!accountUid) {
    els.bankTransactionsTag.textContent = "Nessun conto";
    els.bankTransactionsTag.className = "tag negative";
    els.bankTransactionsMessage.textContent = "Non ho un account selezionato da interrogare.";
    return;
  }

  try {
    els.bankTransactionsTag.textContent = "Caricamento...";
    els.bankTransactionsTag.className = "tag";
    els.bankTransactionsMessage.textContent = "Sto leggendo le transazioni degli ultimi 5 giorni dal conto collegato.";
    const response = await fetch("/api/bank/transactions/recent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: linkedBankSession.sessionId,
        accountUid,
        days: 5,
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error || "Test transazioni non riuscito");
    }

    const transactions = Array.isArray(payload.transactions) ? payload.transactions : [];
    renderRecentTransactions(transactions);
    els.bankTransactionsTag.textContent = "Ok";
    els.bankTransactionsTag.className = "tag positive";
    els.bankTransactionsMessage.textContent = `Ho trovato ${transactions.length} movimenti negli ultimi 5 giorni sul conto selezionato.`;
  } catch (error) {
    els.bankTransactionsTag.textContent = "Errore";
    els.bankTransactionsTag.className = "tag negative";
    els.bankTransactionsMessage.textContent = error.message || "Non riesco a leggere le transazioni recenti.";
    renderRecentTransactions([]);
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

  els.loadRecentTransactions?.addEventListener("click", () => {
    loadRecentTransactions();
  });

  els.loadMissingBankTransactions?.addEventListener("click", () => {
    loadMissingBankTransactionsPreview();
  });

  els.insertMissingBankTransactions?.addEventListener("click", () => {
    insertMissingBankTransactions();
  });

  els.bankInstitutionsList?.addEventListener("click", (event) => {
    const trigger = event.target.closest(".bank-institution-button");
    if (!trigger) {
      return;
    }

    startBankAuthorization(trigger.dataset.bankName || "");
  });

  els.bankMissingTransactionsList?.addEventListener("input", (event) => {
    const index = Number(event.target.dataset.previewIndex);
    if (!Number.isInteger(index) || !pendingBankImports[index]) {
      return;
    }

    const item = pendingBankImports[index];
    if (event.target.classList.contains("bank-preview-date")) {
      item.date = event.target.value;
      return;
    }
    if (event.target.classList.contains("bank-preview-time")) {
      item.time = event.target.value;
      return;
    }
    if (event.target.classList.contains("bank-preview-type")) {
      item.type = event.target.value;
      return;
    }
    if (event.target.classList.contains("bank-preview-category")) {
      item.category = event.target.value.trim();
      return;
    }
    if (event.target.classList.contains("bank-preview-amount")) {
      item.amount = Number(event.target.value || 0);
      return;
    }
    if (event.target.classList.contains("bank-preview-note")) {
      item.note = event.target.value.trim();
    }
  });

  els.bankMissingTransactionsList?.addEventListener("change", (event) => {
    const index = Number(event.target.dataset.previewIndex);
    if (!Number.isInteger(index) || !pendingBankImports[index]) {
      return;
    }

    if (event.target.classList.contains("bank-preview-include")) {
      pendingBankImports[index].include = event.target.checked;
      return;
    }

    if (event.target.classList.contains("bank-preview-type")) {
      if (event.target.value === "income" && !pendingBankImports[index].category) {
        pendingBankImports[index].category = "Entrate";
        renderMissingTransactionsPreview();
      }
    }
  });

  els.logoutButton?.addEventListener("click", async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    sessionStorage.removeItem(LOGIN_SESSION_KEY);
    window.location.href = "./index.html";
  });
}
