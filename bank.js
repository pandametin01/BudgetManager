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
  loadRecentTransactions: document.getElementById("loadRecentTransactions"),
  bankConnectionTag: document.getElementById("bankConnectionTag"),
  bankConnectedInstitution: document.getElementById("bankConnectedInstitution"),
  bankConnectedSession: document.getElementById("bankConnectedSession"),
  bankAccountSelect: document.getElementById("bankAccountSelect"),
  bankConnectionMessage: document.getElementById("bankConnectionMessage"),
  bankTransactionsTag: document.getElementById("bankTransactionsTag"),
  bankTransactionsMessage: document.getElementById("bankTransactionsMessage"),
  bankTransactionsList: document.getElementById("bankTransactionsList"),
};

let supabaseClient = null;
let supabaseSession = null;
let availableInstitutions = [];
let linkedBankSession = null;

bootstrap();

async function bootstrap() {
  await initializeSupabase();
  bindEvents();
  updateUsername();
  restoreLinkedBankSession();
  await refreshBankConfig();
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
      connectedAt: new Date().toISOString(),
      accounts,
    });
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
  return (
    transaction?.booking_date_time ||
    transaction?.value_date_time ||
    transaction?.booking_date ||
    transaction?.value_date ||
    transaction?.status_update_date_time ||
    ""
  );
}

function normalizeTransactionLabel(transaction) {
  const remittance = transaction?.remittance_information;
  const remittanceText = Array.isArray(remittance?.unstructured)
    ? remittance.unstructured.join(" ")
    : remittance?.unstructured || remittance?.reference || "";
  return (
    transaction?.creditor_name ||
    transaction?.debtor_name ||
    transaction?.merchant_name ||
    remittanceText ||
    transaction?.entry_reference ||
    transaction?.transaction_id ||
    "Movimento bancario"
  );
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

  els.bankInstitutionsList?.addEventListener("click", (event) => {
    const trigger = event.target.closest(".bank-institution-button");
    if (!trigger) {
      return;
    }

    startBankAuthorization(trigger.dataset.bankName || "");
  });

  els.logoutButton?.addEventListener("click", async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    sessionStorage.removeItem(LOGIN_SESSION_KEY);
    window.location.href = "./index.html";
  });
}
