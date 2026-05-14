const STORAGE_KEY = "budget-planner-complete-v9";
const ACCOUNTS_KEY = "budget-planner-accounts-v1";
const LOGIN_SESSION_KEY = "budget-planner-session-user";
const SUPABASE_CONFIG_ENDPOINT = "/api/config";
const SUPABASE_EMAIL_DOMAIN = "budgetplanner.app";
const MONTHS = [
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
  profileForm: document.getElementById("profileForm"),
  passwordForm: document.getElementById("passwordForm"),
  passwordStatus: document.getElementById("passwordStatus"),
  backupForm: document.getElementById("backupForm"),
  backupFileInput: document.getElementById("backupFileInput"),
  backupStatus: document.getElementById("backupStatus"),
};

let state = createDefaultState();
let supabaseClient = null;
let supabaseSession = null;
let remoteSaveHandle = null;

bootstrap();

async function bootstrap() {
  await initializeSupabase();
  bindEvents();
  await applyProfileState();
}

function createDefaultMonth(index, year) {
  return {
    id: index,
    name: MONTHS[index],
    year,
    incomes: [],
    bills: [],
    categoryBudgets: [],
    transactions: [],
  };
}

function createDefaultState() {
  const year = new Date().getFullYear();
  return {
    profile: {
      name: "",
      currency: "EUR",
      year,
      startBalance: 0,
      selectedMonth: new Date().getMonth(),
    },
    investments: [],
    savingsGoals: [],
    debtGoals: [],
    months: MONTHS.map((_, index) => createDefaultMonth(index, year)),
  };
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizePlannerState(parsed) {
  const base = createDefaultState();
  const source = parsed && typeof parsed === "object" ? parsed : {};
  return {
    ...base,
    ...source,
    profile: { ...base.profile, ...(source.profile || {}) },
    months: MONTHS.map((_, index) => ({
      ...createDefaultMonth(index, source.profile?.year || base.profile.year),
      ...(source.months?.[index] || {}),
    })),
    investments: source.investments || base.investments,
    savingsGoals: source.savingsGoals || [],
    debtGoals: source.debtGoals || [],
  };
}

function getAccounts() {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.error("Errore caricamento account", error);
    return {};
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
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
      await applyProfileState();
    });
  } catch (error) {
    console.warn("Supabase non configurato o non raggiungibile.", error);
  }
}

function isSupabaseEnabled() {
  return Boolean(supabaseClient);
}

function derivePlannerEmail(username) {
  return `${normalizeUsername(username)}@${SUPABASE_EMAIL_DOMAIN}`;
}

function usernameFromSupabaseUser(user) {
  if (!user) {
    return "";
  }
  const metadataUsername = normalizeUsername(user.user_metadata?.username);
  if (metadataUsername) {
    return metadataUsername;
  }
  const email = String(user.email || "");
  return normalizeUsername(email.split("@")[0]);
}

function getCurrentUsername() {
  if (supabaseSession?.user) {
    return usernameFromSupabaseUser(supabaseSession.user);
  }
  return normalizeUsername(sessionStorage.getItem(LOGIN_SESSION_KEY));
}

function setCurrentUsername(username) {
  sessionStorage.setItem(LOGIN_SESSION_KEY, normalizeUsername(username));
}

function loadLegacyState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return normalizePlannerState(JSON.parse(raw));
  } catch (error) {
    console.error("Errore caricamento planner legacy", error);
    return null;
  }
}

function buildAccountState(sourceState, fallbackName = "") {
  const normalized = normalizePlannerState(sourceState || createDefaultState());
  if (!normalized.profile.name && fallbackName) {
    normalized.profile.name = fallbackName;
  }
  return cloneData(normalized);
}

function getLocalAccountStateByUsername(username) {
  const normalizedUsername = normalizeUsername(username);
  const account = getAccounts()[normalizedUsername];
  if (account?.state) {
    return buildAccountState(account.state, account.state?.profile?.name || normalizedUsername);
  }

  const legacyState = loadLegacyState();
  if (legacyState && normalizedUsername === "mattia") {
    return buildAccountState(legacyState, "Mattia");
  }

  return buildAccountState(createDefaultState(), normalizedUsername);
}

function saveLocalShadowState(username, plannerState) {
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) {
    return;
  }

  const accounts = getAccounts();
  const existing = accounts[normalizedUsername] || { password: "", state: null };
  accounts[normalizedUsername] = {
    ...existing,
    state: cloneData(plannerState),
  };
  saveAccounts(accounts);
}

async function fetchRemotePlannerState(user) {
  if (!supabaseClient || !user?.id) {
    return null;
  }

  const result = await supabaseClient
    .from("planner_states")
    .select("planner_state, username")
    .eq("user_id", user.id)
    .maybeSingle();

  if (result.error) {
    console.error("Errore caricamento stato Supabase", result.error);
    return null;
  }

  return result.data || null;
}

async function upsertRemotePlannerState(username, plannerState) {
  if (!supabaseClient || !supabaseSession?.user?.id) {
    return;
  }

  const payload = {
    user_id: supabaseSession.user.id,
    username: normalizeUsername(username),
    planner_state: cloneData(plannerState),
  };

  const result = await supabaseClient
    .from("planner_states")
    .upsert(payload, { onConflict: "user_id" });

  if (result.error) {
    console.error("Errore salvataggio stato Supabase", result.error);
  }
}

async function ensureRemotePlannerState(username) {
  if (!supabaseSession?.user) {
    return getLocalAccountStateByUsername(username);
  }

  const remoteRow = await fetchRemotePlannerState(supabaseSession.user);
  if (remoteRow?.planner_state) {
    return buildAccountState(remoteRow.planner_state, remoteRow.username || username);
  }

  const fallbackState = getLocalAccountStateByUsername(username);
  await upsertRemotePlannerState(username, fallbackState);
  return fallbackState;
}

async function loadState(username = getCurrentUsername()) {
  if (isSupabaseEnabled() && supabaseSession?.user) {
    return ensureRemotePlannerState(usernameFromSupabaseUser(supabaseSession.user) || username);
  }

  return getLocalAccountStateByUsername(username);
}

function saveState() {
  const username = getCurrentUsername();
  if (!username) {
    return;
  }

  saveLocalShadowState(username, state);

  if (isSupabaseEnabled() && supabaseSession?.user) {
    if (remoteSaveHandle) {
      clearTimeout(remoteSaveHandle);
    }
    remoteSaveHandle = window.setTimeout(() => {
      upsertRemotePlannerState(username, state);
    }, 250);
  }
}

function setBackupStatus(message, tone = "") {
  els.backupStatus.textContent = message || "";
  els.backupStatus.className = tone ? `list-meta ${tone}` : "list-meta";
}

function setPasswordStatus(message, tone = "") {
  els.passwordStatus.textContent = message || "";
  els.passwordStatus.className = tone ? `list-meta ${tone}` : "list-meta";
}

function createBackupPayload() {
  return {
    exportedAt: new Date().toISOString(),
    username: getCurrentUsername(),
    plannerState: cloneData(state),
  };
}

function downloadBackupFile() {
  const payload = createBackupPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 19).replaceAll(":", "-");
  link.href = url;
  link.download = `budget-planner-backup-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setBackupStatus("Backup JSON esportato.", "positive");
}

async function importBackupFile(file) {
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const incomingState = parsed?.plannerState || parsed?.state || parsed;
    state = buildAccountState(incomingState, getCurrentUsername());
    saveState();
    populateForms();
    setBackupStatus("Backup importato correttamente.", "positive");
  } catch (error) {
    console.error("Errore import backup", error);
    setBackupStatus("Importazione fallita. Controlla il file JSON.", "negative");
  }
}

async function pushCurrentStateToSupabase() {
  if (!isSupabaseEnabled() || !supabaseSession?.user) {
    setBackupStatus("Fai login sul sito online con Supabase prima di caricare i dati.", "negative");
    return;
  }

  await upsertRemotePlannerState(getCurrentUsername(), state);
  setBackupStatus("Stato attuale caricato su Supabase.", "positive");
}

function populateForms() {
  els.profileForm.elements.namedItem("name").value = state.profile.name;
  els.profileForm.elements.namedItem("currency").value = state.profile.currency;
  els.profileForm.elements.namedItem("year").value = state.profile.year;
  els.profileForm.elements.namedItem("startBalance").value = state.profile.startBalance;
  els.currentUsername.textContent = getCurrentUsername() || "utente";
}

function bindEvents() {
  els.profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const year = Number(data.get("year")) || state.profile.year;
    state.profile = {
      ...state.profile,
      name: String(data.get("name") || "").trim(),
      currency: String(data.get("currency") || "EUR").trim().toUpperCase(),
      year,
      startBalance: Number(data.get("startBalance") || 0),
    };
    state.months = state.months.map((month, index) => ({ ...month, year, id: index }));
    saveState();
    setBackupStatus("Profilo aggiornato.", "positive");
  });

  els.passwordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newPassword = String(data.get("newPassword") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");
    const username = getCurrentUsername();

    setPasswordStatus("");

    if (newPassword.length < 3) {
      setPasswordStatus("Scegli una password di almeno 3 caratteri.", "negative");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus("Le password non coincidono.", "negative");
      return;
    }

    if (isSupabaseEnabled() && supabaseSession?.user) {
      const result = await supabaseClient.auth.updateUser({ password: newPassword });
      if (result.error) {
        setPasswordStatus(result.error.message || "Aggiornamento password non riuscito.", "negative");
        return;
      }
    }

    const accounts = getAccounts();
    if (accounts[username]) {
      accounts[username].password = newPassword;
      saveAccounts(accounts);
    }

    setPasswordStatus("Password aggiornata correttamente.", "positive");
    event.currentTarget.reset();
  });

  els.backupFileInput.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    await importBackupFile(file);
    event.target.value = "";
  });

  els.backupForm.addEventListener("click", async (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (!action) {
      return;
    }

    if (action === "export-backup") {
      downloadBackupFile();
      return;
    }

    if (action === "import-backup") {
      els.backupFileInput.click();
      return;
    }

    if (action === "push-supabase") {
      await pushCurrentStateToSupabase();
    }
  });

  els.logoutButton.addEventListener("click", async () => {
    if (isSupabaseEnabled()) {
      await supabaseClient.auth.signOut();
      supabaseSession = null;
    }
    sessionStorage.removeItem(LOGIN_SESSION_KEY);
    window.location.href = "./index.html";
  });
}

async function applyProfileState() {
  const username = getCurrentUsername();
  const authenticated = Boolean(username);

  if (!authenticated) {
    window.location.href = "./index.html";
    return;
  }

  state = await loadState(username);
  setCurrentUsername(username);
  populateForms();
}
