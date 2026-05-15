const STORAGE_KEY = "budget-planner-complete-v9";
const ACCOUNTS_KEY = "budget-planner-accounts-v1";
const LOGIN_SESSION_KEY = "budget-planner-session-user";
const SUPABASE_CONFIG_ENDPOINT = "/api/config";
const SUPABASE_EMAIL_DOMAIN = "budgetplanner.app";
const DEFAULT_ACCOUNT = {
  username: "mattia",
  password: "mattia",
};
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
const FIXED_CATEGORIES = [
  "Macchina",
  "Carburante",
  "Parrucchiere",
  "Bicicletta",
  "Sigarette",
  "Abbigliamento",
];

const REVOLUT_MAY_TIMES = {
  "2026-05-02|35.33|Revolut · Deliveroo": "11:05",
  "2026-05-02|7.8|Revolut · Perrotta Roberto": "16:29",
  "2026-05-02|4|Revolut · Caffe In Di Soukni Ma.": "21:29",
  "2026-05-02|1.5|Revolut · Sunwave Pf Company Snc": "13:11",
  "2026-05-02|14.85|Revolut · Trenitalia": "14:22",
  "2026-05-02|12|Revolut · Eternal City Pub Roma": "18:38",
  "2026-05-03|18|Revolut · Bar Otium": "16:21",
  "2026-05-03|9.3|Revolut · McDonald's": "19:06",
  "2026-05-03|9.29|Revolut · McDonald's": "19:07",
  "2026-05-04|10.9|Revolut · Apple": "09:39",
  "2026-05-04|5.39|Revolut · Apple": "09:55",
  "2026-05-04|11|Revolut · Il Calore Della Tavola": "12:11",
  "2026-05-04|39.55|Revolut · Si Con Te Superme": "18:32",
  "2026-05-05|10.2|Revolut · Sarah Cristiny Almeida": "00:13",
  "2026-05-05|11|Revolut · Il Calore Della Tavola": "13:04",
  "2026-05-05|9.95|Revolut · McDonald's": "20:26",
  "2026-05-05|9.75|Revolut · McDonald's": "20:27",
  "2026-05-06|10|Revolut · iliad": "21:45",
  "2026-05-07|11|Revolut · Il Calore Della Tavola": "12:07",
  "2026-05-08|15|Revolut · Hollywood": "23:33",
  "2026-05-08|11|Revolut · Il Calore Della Tavola": "12:32",
  "2026-05-08|15|Revolut · Ente Di Beneficienza J": "22:33",
  "2026-05-08|11.85|Revolut · McDonald's": "17:18",
  "2026-05-09|14|Revolut · Daniel Cantarini": "18:13",
  "2026-05-09|10|Revolut · Ente Di Beneficienza J": "19:34",
  "2026-05-09|17|Revolut · Cerchio": "18:43",
  "2026-05-09|15|Revolut · Assoc Ente Palio Di": "00:12",
  "2026-05-12|56|Revolut · gekabo.com": "19:59",
  "2026-05-13|6.99|Revolut · Commissione consegna carta": "15:31",
};

const CLEAN_MAY_TRANSACTIONS = [
  { date: "2026-05-02", time: "11:05", type: "expense", category: "Food & Drink", amount: 35.33, note: "Deliveroo" },
  { date: "2026-05-02", time: "16:29", type: "expense", category: "Food & Drink", amount: 7.8, note: "Perrotta Roberto" },
  { date: "2026-05-02", time: "21:29", type: "expense", category: "Food & Drink", amount: 4, note: "Caffe In Di Soukni Ma." },
  { date: "2026-05-02", time: "13:11", type: "expense", category: "Fun", amount: 1.5, note: "Sunwave Pf Company Snc" },
  { date: "2026-05-02", time: "14:22", type: "expense", category: "Trasporti", amount: 14.85, note: "Trenitalia" },
  { date: "2026-05-02", time: "19:12", type: "expense", category: "Trasporti", amount: 14.85, note: "Trenitalia" },
  { date: "2026-05-02", time: "18:38", type: "expense", category: "Food & Drink", amount: 12, note: "Eternal City Pub Roma" },
  { date: "2026-05-03", time: "16:21", type: "expense", category: "Food & Drink", amount: 18, note: "Bar Otium" },
  { date: "2026-05-03", time: "16:38", type: "expense", category: "Food & Drink", amount: 18, note: "Bar Otium" },
  { date: "2026-05-03", time: "19:06", type: "expense", category: "Food & Drink", amount: 9.3, note: "McDonald's" },
  { date: "2026-05-03", time: "19:07", type: "expense", category: "Food & Drink", amount: 9.29, note: "McDonald's" },
  { date: "2026-05-04", time: "09:39", type: "expense", category: "Abbonamenti", amount: 10.9, note: "Apple" },
  { date: "2026-05-04", time: "09:55", type: "expense", category: "Abbonamenti", amount: 5.39, note: "Apple" },
  { date: "2026-05-04", time: "12:11", type: "expense", category: "Food & Drink", amount: 11, note: "Il Calore Della Tavola" },
  { date: "2026-05-04", time: "18:32", type: "expense", category: "Spesa", amount: 39.55, note: "Si Con Te Superme" },
  { date: "2026-05-05", time: "00:13", type: "expense", category: "Bonifici privati", amount: 10.2, note: "Sarah Cristiny Almeida" },
  { date: "2026-05-05", time: "13:04", type: "expense", category: "Food & Drink", amount: 11, note: "Il Calore Della Tavola" },
  { date: "2026-05-05", time: "20:26", type: "expense", category: "Food & Drink", amount: 9.95, note: "McDonald's" },
  { date: "2026-05-05", time: "20:27", type: "expense", category: "Food & Drink", amount: 9.75, note: "McDonald's" },
  { date: "2026-05-06", time: "21:45", type: "expense", category: "Telefono", amount: 10, note: "iliad" },
  { date: "2026-05-07", time: "12:07", type: "expense", category: "Food & Drink", amount: 11, note: "Il Calore Della Tavola" },
  { date: "2026-05-08", time: "23:33", type: "expense", category: "Fun", amount: 15, note: "Hollywood" },
  { date: "2026-05-08", time: "12:32", type: "expense", category: "Food & Drink", amount: 11, note: "Il Calore Della Tavola" },
  { date: "2026-05-08", time: "22:33", type: "expense", category: "Beneficenza", amount: 15, note: "Ente Di Beneficienza J" },
  { date: "2026-05-08", time: "17:18", type: "expense", category: "Food & Drink", amount: 11.85, note: "McDonald's" },
  { date: "2026-05-09", time: "18:13", type: "expense", category: "Food & Drink", amount: 14, note: "Daniel Cantarini" },
  { date: "2026-05-09", time: "19:34", type: "expense", category: "Beneficenza", amount: 10, note: "Ente Di Beneficienza J" },
  { date: "2026-05-09", time: "18:43", type: "expense", category: "Fun", amount: 17, note: "Cerchio" },
  { date: "2026-05-09", time: "00:12", type: "expense", category: "Beneficenza", amount: 15, note: "Assoc Ente Palio Di" },
  { date: "2026-05-12", time: "19:59", type: "expense", category: "Fun", amount: 56, note: "gekabo.com" },
  { date: "2026-05-13", time: "15:31", type: "expense", category: "Abbonamenti", amount: 6.99, note: "Commissione per la consegna della carta" },
];

const emptyStateTemplate = document.getElementById("emptyStateTemplate");

const els = {
  loginScreen: document.getElementById("loginScreen"),
  pageShell: document.getElementById("pageShell"),
  loginForm: document.getElementById("loginForm"),
  loginError: document.getElementById("loginError"),
  registerForm: document.getElementById("registerForm"),
  registerError: document.getElementById("registerError"),
  registerSuccess: document.getElementById("registerSuccess"),
  currentUsername: document.getElementById("currentUsername"),
  selectedMonth: document.getElementById("selectedMonth"),
  kpiGrid: document.getElementById("kpiGrid"),
  runwayEndDate: document.getElementById("runwayEndDate"),
  runwayDailyBudget: document.getElementById("runwayDailyBudget"),
  runwayNoSpendDays: document.getElementById("runwayNoSpendDays"),
  runwayStats: document.getElementById("runwayStats"),
  annualCards: document.getElementById("annualCards"),
  annualYearFilter: document.getElementById("annualYearFilter"),
  budgetCharts: document.getElementById("budgetCharts"),
  chartScopeSelect: document.getElementById("chartScopeSelect"),
  chartYearSelect: document.getElementById("chartYearSelect"),
  chartViewSelect: document.getElementById("chartViewSelect"),
  chartDayPicker: document.getElementById("chartDayPicker"),
  chartPeriodStartPicker: document.getElementById("chartPeriodStartPicker"),
  chartPeriodEndPicker: document.getElementById("chartPeriodEndPicker"),
  incomeList: document.getElementById("incomeList"),
  billList: document.getElementById("billList"),
  categoryList: document.getElementById("categoryList"),
  allMovementsList: document.getElementById("allMovementsList"),
  investmentCards: document.getElementById("investmentCards"),
  investmentStatus: document.getElementById("investmentStatus"),
  investmentTradeForm: document.getElementById("investmentTradeForm"),
  savingGoalsList: document.getElementById("savingGoalsList"),
  debtGoalsList: document.getElementById("debtGoalsList"),
  activeCategoryFilter: document.getElementById("activeCategoryFilter"),
  movementFilterMode: document.getElementById("movementFilterMode"),
  movementFilterStart: document.getElementById("movementFilterStart"),
  movementFilterEnd: document.getElementById("movementFilterEnd"),
  movementFilterType: document.getElementById("movementFilterType"),
  movementFilterCategory: document.getElementById("movementFilterCategory"),
  movementFilterNote: document.getElementById("movementFilterNote"),
  movementFilterMinAmount: document.getElementById("movementFilterMinAmount"),
  movementFilterMaxAmount: document.getElementById("movementFilterMaxAmount"),
  movementSortBy: document.getElementById("movementSortBy"),
  movementFilterTotal: document.getElementById("movementFilterTotal"),
  movementBulkCategory: document.getElementById("movementBulkCategory"),
  movementBulkStatus: document.getElementById("movementBulkStatus"),
  csvImportInput: document.getElementById("csvImportInput"),
  csvImportStatus: document.getElementById("csvImportStatus"),
  sidebarSnapshot: document.getElementById("sidebarSnapshot"),
  incomeCount: document.getElementById("incomeCount"),
  billCount: document.getElementById("billCount"),
  categoryCount: document.getElementById("categoryCount"),
  savingCount: document.getElementById("savingCount"),
  debtCount: document.getElementById("debtCount"),
  transactionCategorySelect: document.getElementById("transactionCategorySelect"),
  profileForm: document.getElementById("profileForm"),
  passwordForm: document.getElementById("passwordForm"),
  passwordStatus: document.getElementById("passwordStatus"),
  backupForm: document.getElementById("backupForm"),
  backupFileInput: document.getElementById("backupFileInput"),
  backupStatus: document.getElementById("backupStatus"),
  incomeForm: document.getElementById("incomeForm"),
  billForm: document.getElementById("billForm"),
  categoryForm: document.getElementById("categoryForm"),
  transactionForm: document.getElementById("transactionForm"),
  savingGoalForm: document.getElementById("savingGoalForm"),
  debtGoalForm: document.getElementById("debtGoalForm"),
};

let state = createDefaultState();
let activeCategoryFilter = "";
let annualYearFilter = String(new Date().getFullYear());
let chartScope = "month";
let chartView = "month";
let chartYearValue = String(new Date().getFullYear());
let chartDayValue = "";
let chartPeriodStartValue = "";
let chartPeriodEndValue = "";
let runwayEndDateValue = "";
let runwayDailyBudgetValue = "";
let runwayNoSpendDaysValue = 0;
let chartZoomRange = null;
let investmentQuotes = {};
let investmentRefreshHandle = null;
let hasPlayedDashboardSlotAnimation = false;
let supabaseClient = null;
let supabaseSession = null;
let remoteSaveHandle = null;
const MOVEMENT_RENDER_BATCH_SIZE = 250;
let movementVisibleLimit = MOVEMENT_RENDER_BATCH_SIZE;
let movementFilter = createDefaultMovementFilter();

bootstrap();

async function bootstrap() {
  initializeAccountsStore();
  await initializeSupabase();
  bindForms();
  bindActions();
  await applyAuthState();
  refreshInvestmentQuotes();
  startInvestmentAutoRefresh();
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

function withIds(items) {
  return items.map((item) => ({ id: crypto.randomUUID(), ...item }));
}

function dedupeBy(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function buildCategoryBudgetsFromTransactions(transactions) {
  const totals = new Map();
  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      totals.set(item.category, (totals.get(item.category) || 0) + Number(item.amount || 0));
    });

  return withIds(
    [...totals.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, total]) => ({
        name,
        budget: Math.ceil((total * 1.12) / 5) * 5,
        isUndefinedBudget: false,
      })),
  );
}

function effectiveCategoryBudget(category, spent = 0) {
  return category.isUndefinedBudget ? spent : Number(category.budget || 0);
}

function createCleanMayTransactions() {
  return withIds(CLEAN_MAY_TRANSACTIONS.map((item) => ({ ...item })));
}

function defaultInvestments() {
  return [
    {
      id: crypto.randomUUID(),
      symbol: "XRP",
      coinId: "ripple",
      quantity: 710,
      invested: 2000,
      currency: "EUR",
    },
  ];
}

function mergeMonthSeed(existingMonth, importedSeed, replaceExisting = false) {
  const importedIncomes = withIds(importedSeed?.incomes || []);
  const importedTransactions = withIds(importedSeed?.transactions || []);

  const mergedIncomes = replaceExisting
    ? importedIncomes
    : dedupeBy([...existingMonth.incomes, ...importedIncomes], (item) => `${item.name}|${item.actual}|${item.note || ""}`);

  const mergedTransactions = replaceExisting
    ? importedTransactions
    : dedupeBy(
        [...existingMonth.transactions, ...importedTransactions],
        (item) => `${item.date}|${item.time || ""}|${item.type}|${item.category}|${item.amount}|${item.note || ""}`,
      );

  return {
    ...existingMonth,
    incomes: mergedIncomes,
    transactions: mergedTransactions,
    categoryBudgets: buildCategoryBudgetsFromTransactions(mergedTransactions),
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
      selectedMonthKey: `${year}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
    },
    investments: [],
    savingsGoals: [],
    debtGoals: [],
    months: MONTHS.map((_, index) => createDefaultMonth(index, year)),
  };
}

function createDemoState() {
  const seeded = createDefaultState();
  seeded.profile = {
    name: "Mattia",
    currency: "EUR",
    year: 2026,
    startBalance: 2266,
    selectedMonth: 0,
    selectedMonthKey: "2026-01",
  };

  seeded.months[3].year = 2026;
  seeded.months[4].year = 2026;

  seeded.months[3].incomes = withIds([
    { name: "Menerva stipendio", budget: 1635, actual: 1635, note: "martino marzo" },
  ]);

  seeded.months[3].categoryBudgets = withIds([
    { name: "Abbonamenti", budget: 150 },
    { name: "Bonifici privati", budget: 375 },
    { name: "Debiti", budget: 210 },
    { name: "Food & Drink", budget: 180 },
    { name: "Fun", budget: 150 },
    { name: "Spesa", budget: 65 },
    { name: "Telefono", budget: 15 },
    { name: "Viaggi", budget: 15 },
  ]);

  seeded.months[3].transactions = withIds([
    { date: "2026-04-20", type: "expense", category: "Bonifici privati", amount: 250, note: "Papa · Inviato da N26" },
    { date: "2026-04-20", type: "expense", category: "Debiti", amount: 73.34, note: "AGOS-DUCATO S.P.A." },
    { date: "2026-04-20", type: "expense", category: "Debiti", amount: 108, note: "Carta credito" },
    { date: "2026-04-21", type: "expense", category: "Telefono", amount: 10, note: "ILIAD ITALIA" },
    { date: "2026-04-21", type: "expense", category: "Food & Drink", amount: 21.8, note: "DE CANDIA SERGIO" },
    { date: "2026-04-22", type: "expense", category: "Food & Drink", amount: 12, note: "IL CALORE DELLA TAVOLA" },
    { date: "2026-04-23", type: "expense", category: "Abbonamenti", amount: 96.28, note: "OPENAI *CHATGPT SUBSCR" },
    { date: "2026-04-23", type: "expense", category: "Food & Drink", amount: 9, note: "IL CALORE DELLA TAVOLA" },
    { date: "2026-04-23", type: "expense", category: "Bonifici privati", amount: 76, note: "Gaia · Inviato da N26" },
    { date: "2026-04-23", type: "expense", category: "Food & Drink", amount: 5.6, note: "DUCA E NOVELLI SNC" },
    { date: "2026-04-24", type: "expense", category: "Abbonamenti", amount: 4.99, note: "Driffle" },
    { date: "2026-04-25", type: "expense", category: "Food & Drink", amount: 21.8, note: "DE CANDIA SERGIO" },
    { date: "2026-04-25", type: "expense", category: "Spesa", amount: 19.22, note: "SI CON TE - SUPERME" },
    { date: "2026-04-25", type: "expense", category: "Food & Drink", amount: 6.5, note: "LOVE'S DI DUMITRU DANI" },
    { date: "2026-04-25", type: "expense", category: "Abbonamenti", amount: 2.49, note: "Amazon Prime" },
    { date: "2026-04-25", type: "expense", category: "Fun", amount: 15, note: "VIBICI" },
    { date: "2026-04-25", type: "expense", category: "Food & Drink", amount: 7, note: "IL CALORE DELLA TAVOLA" },
    { date: "2026-04-26", type: "expense", category: "Fun", amount: 12, note: "SUNWAVE PF COMPANY SNC" },
    { date: "2026-04-26", type: "expense", category: "Fun", amount: 3.5, note: "SUNWAVE PF COMPANY SNC" },
    { date: "2026-04-26", type: "expense", category: "Spesa", amount: 11.74, note: "LIDL 811" },
    { date: "2026-04-26", type: "expense", category: "Abbonamenti", amount: 6.99, note: "Netflix.com" },
    { date: "2026-04-27", type: "expense", category: "Viaggi", amount: 5.8, note: "DUFRITAL, Hudson Arriv" },
    { date: "2026-04-27", type: "expense", category: "Fun", amount: 52, note: "OSCAR WILDE S.N.C." },
    { date: "2026-04-27", type: "expense", category: "Viaggi", amount: 5.5, note: "DUFRITAL, Hudson Arriv" },
    { date: "2026-04-28", type: "expense", category: "Food & Drink", amount: 8.3, note: "BAR OTIUM" },
    { date: "2026-04-28", type: "expense", category: "Food & Drink", amount: 4.5, note: "BAR OTIUM" },
    { date: "2026-04-28", type: "expense", category: "Food & Drink", amount: 1.5, note: "GRANPANDA" },
    { date: "2026-04-28", type: "expense", category: "Food & Drink", amount: 13.5, note: "BAR OTIUM" },
    { date: "2026-04-28", type: "expense", category: "Food & Drink", amount: 12.1, note: "BAR PAOLONI" },
    { date: "2026-04-28", type: "expense", category: "Food & Drink", amount: 25.25, note: "VECCHIA MALGA - PIZZER" },
    { date: "2026-04-28", type: "expense", category: "Fun", amount: 45, note: "MUSEIKA" },
    { date: "2026-04-28", type: "expense", category: "Spesa", amount: 9.95, note: "GALA" },
    { date: "2026-04-28", type: "expense", category: "Abbonamenti", amount: 13.99, note: "APPLE.COM/BILL" },
    { date: "2026-04-28", type: "expense", category: "Abbonamenti", amount: 2.99, note: "GOOGLE*GOOGLE ONE" },
    { date: "2026-04-29", type: "expense", category: "Spesa", amount: 13.75, note: "MACELLERIA LORETO V. &" },
    { date: "2026-04-29", type: "expense", category: "Food & Drink", amount: 4.04, note: "0750 JESI" },
  ]);

  seeded.months[4].categoryBudgets = withIds([
    { name: "Abbonamenti", budget: 35 },
    { name: "Beneficenza", budget: 30 },
    { name: "Bonifici privati", budget: 10 },
    { name: "Food & Drink", budget: 100 },
    { name: "Fun", budget: 35 },
    { name: "Spesa", budget: 45 },
    { name: "Tabacchi", budget: 10 },
    { name: "Trasporti", budget: 35 },
    { name: "Viaggi", budget: 15 },
  ]);

  seeded.months[4].transactions = withIds([
    { date: "2026-05-01", type: "expense", category: "Food & Drink", amount: 8.1, note: "EASY!" },
    { date: "2026-05-01", type: "expense", category: "Abbonamenti", amount: 13.99, note: "APPLE.COM/BILL" },
    { date: "2026-05-01", type: "expense", category: "Food & Drink", amount: 5.5, note: "BAR ENJOY DI SIGNORELL" },
    { date: "2026-05-01", type: "expense", category: "Bonifici privati", amount: 5, note: "Sarah · Inviato da N26" },
    { date: "2026-05-02", type: "expense", category: "Spesa", amount: 37.9, note: "SI CON TE - SUPERME" },
    { date: "2026-05-02", type: "expense", category: "Fun", amount: 17, note: "SumUp *Abbronzatissim" },
    { date: "2026-05-02", type: "expense", category: "Fun", amount: 11, note: "SumUp *G BEACH SOCIE" },
    { date: "2026-05-02", type: "expense", category: "Abbonamenti", amount: 11.99, note: "SPOTIFY" },
    { date: "2026-05-02", type: "expense", category: "Food & Drink", amount: 12, note: "MARASCA ROSSI (AZ. AGR)" },
    { date: "2026-05-02", type: "expense", category: "Food & Drink", amount: 12, note: "AZIENDA AGRICOLA ROVE." },
    { date: "2026-05-02", type: "expense", category: "Viaggi", amount: 5.4, note: "FALCONARA MARITTIMA HO" },
    { date: "2026-05-02", type: "expense", category: "Food & Drink", amount: 12, note: "AZIENDA AGRICOLA ROVE." },
    { date: "2026-05-02", type: "expense", category: "Food & Drink", amount: 35, note: "BAR TRIESTE" },
    { date: "2026-05-02", type: "expense", category: "Viaggi", amount: 5.4, note: "JESI SS DPR" },
    { date: "2026-05-02", type: "expense", category: "Tabacchi", amount: 5.8, note: "TABACCHERIA LUCARELLI" },
    { date: "2026-05-04", type: "expense", category: "Abbonamenti", amount: 0.89, note: "APPLE.COM/BILL" },
    { date: "2026-05-02", type: "expense", category: "Food & Drink", amount: 35.33, note: "Revolut · Deliveroo" },
    { date: "2026-05-02", type: "expense", category: "Food & Drink", amount: 7.8, note: "Revolut · Perrotta Roberto" },
    { date: "2026-05-02", type: "expense", category: "Food & Drink", amount: 4, note: "Revolut · Caffe In Di Soukni Ma." },
    { date: "2026-05-02", type: "expense", category: "Fun", amount: 1.5, note: "Revolut · Sunwave Pf Company Snc" },
    { date: "2026-05-02", type: "expense", category: "Trasporti", amount: 14.85, note: "Revolut · Trenitalia" },
    { date: "2026-05-02", type: "expense", category: "Trasporti", amount: 14.85, note: "Revolut · Trenitalia" },
    { date: "2026-05-02", type: "expense", category: "Food & Drink", amount: 12, note: "Revolut · Eternal City Pub Roma" },
    { date: "2026-05-03", type: "expense", category: "Food & Drink", amount: 18, note: "Revolut · Bar Otium" },
    { date: "2026-05-03", type: "expense", category: "Food & Drink", amount: 18, note: "Revolut · Bar Otium" },
    { date: "2026-05-03", type: "expense", category: "Food & Drink", amount: 9.3, note: "Revolut · McDonald's" },
    { date: "2026-05-03", type: "expense", category: "Food & Drink", amount: 9.29, note: "Revolut · McDonald's" },
    { date: "2026-05-04", type: "expense", category: "Abbonamenti", amount: 10.9, note: "Revolut · Apple" },
    { date: "2026-05-04", type: "expense", category: "Abbonamenti", amount: 5.39, note: "Revolut · Apple" },
    { date: "2026-05-04", type: "expense", category: "Food & Drink", amount: 11, note: "Revolut · Il Calore Della Tavola" },
    { date: "2026-05-04", type: "expense", category: "Spesa", amount: 39.55, note: "Revolut · Si Con Te Superme" },
    { date: "2026-05-05", type: "expense", category: "Bonifici privati", amount: 10.2, note: "Revolut · Sarah Cristiny Almeida" },
    { date: "2026-05-05", type: "expense", category: "Food & Drink", amount: 11, note: "Revolut · Il Calore Della Tavola" },
    { date: "2026-05-05", type: "expense", category: "Food & Drink", amount: 9.95, note: "Revolut · McDonald's" },
    { date: "2026-05-05", type: "expense", category: "Food & Drink", amount: 9.75, note: "Revolut · McDonald's" },
    { date: "2026-05-06", type: "expense", category: "Telefono", amount: 10, note: "Revolut · iliad" },
    { date: "2026-05-07", type: "expense", category: "Food & Drink", amount: 11, note: "Revolut · Il Calore Della Tavola" },
    { date: "2026-05-08", type: "expense", category: "Fun", amount: 15, note: "Revolut · Hollywood" },
    { date: "2026-05-08", type: "expense", category: "Food & Drink", amount: 11, note: "Revolut · Il Calore Della Tavola" },
    { date: "2026-05-08", type: "expense", category: "Beneficenza", amount: 15, note: "Revolut · Ente Di Beneficienza J" },
    { date: "2026-05-08", type: "expense", category: "Food & Drink", amount: 11.85, note: "Revolut · McDonald's" },
    { date: "2026-05-09", type: "expense", category: "Food & Drink", amount: 14, note: "Revolut · Daniel Cantarini" },
    { date: "2026-05-09", type: "expense", category: "Beneficenza", amount: 10, note: "Revolut · Ente Di Beneficienza J" },
    { date: "2026-05-09", type: "expense", category: "Fun", amount: 17, note: "Revolut · Cerchio" },
    { date: "2026-05-09", type: "expense", category: "Beneficenza", amount: 15, note: "Revolut · Assoc Ente Palio Di" },
    { date: "2026-05-12", type: "expense", category: "Fun", amount: 56, note: "Revolut · gekabo.com" },
    { date: "2026-05-13", type: "expense", category: "Abbonamenti", amount: 6.99, note: "Revolut · Commissione consegna carta" },
  ]);

  if (window.N26_MERGED_SEED) {
    seeded.months[0].year = 2026;
    seeded.months[1].year = 2026;
    seeded.months[2].year = 2026;
    seeded.months[3].year = 2026;

    seeded.months[0] = mergeMonthSeed(seeded.months[0], window.N26_MERGED_SEED["0"], true);
    seeded.months[1] = mergeMonthSeed(seeded.months[1], window.N26_MERGED_SEED["1"], true);
    seeded.months[2] = mergeMonthSeed(seeded.months[2], window.N26_MERGED_SEED["2"], true);
    seeded.months[3] = mergeMonthSeed(seeded.months[3], window.N26_MERGED_SEED["3"], false);

    seeded.months[0].categoryBudgets = [];
    seeded.months[1].categoryBudgets = [];
    seeded.months[2].categoryBudgets = [];
  }

  seeded.savingsGoals = [
    { id: crypto.randomUUID(), name: "Vacanza", target: 1200, start: 180 },
    { id: crypto.randomUUID(), name: "Fondo emergenza", target: 3000, start: 650 },
  ];

  seeded.debtGoals = [
    { id: crypto.randomUUID(), name: "Carta di credito", target: 1400, start: 200 },
    { id: crypto.randomUUID(), name: "Prestito auto", target: 5000, start: 400 },
  ];

  seeded.investments = defaultInvestments();

  return seeded;
}

function normalizeUsername(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizePlannerState(parsed) {
  const base = createDefaultState();
  const source = parsed && typeof parsed === "object" ? parsed : {};
  const normalizedProfile = { ...base.profile, ...(source.profile || {}) };
  const fallbackYear = Number(normalizedProfile.year) || base.profile.year;
  const monthMap = new Map();

  MONTHS.forEach((_, index) => {
    const fallbackMonth = createDefaultMonth(index, fallbackYear);
    monthMap.set(monthKey(fallbackMonth), fallbackMonth);
  });

  if (Array.isArray(source.months)) {
    source.months.forEach((sourceMonth, index) => {
      if (!sourceMonth || typeof sourceMonth !== "object") {
        return;
      }

      const sourceId = Number(sourceMonth.id);
      const monthId = Number.isInteger(sourceId) && sourceId >= 0 && sourceId < MONTHS.length
        ? sourceId
        : index % MONTHS.length;
      const sourceYear = Number(sourceMonth.year);
      const year = Number.isInteger(sourceYear) && sourceYear > 0
        ? sourceYear
        : fallbackYear + Math.floor(index / MONTHS.length);
      const fallbackMonth = createDefaultMonth(monthId, year);
      const normalizedMonth = {
        ...fallbackMonth,
        ...sourceMonth,
        id: monthId,
        year,
        name: sourceMonth.name || fallbackMonth.name,
        incomes: Array.isArray(sourceMonth.incomes) ? sourceMonth.incomes : fallbackMonth.incomes,
        bills: Array.isArray(sourceMonth.bills) ? sourceMonth.bills : fallbackMonth.bills,
        categoryBudgets: Array.isArray(sourceMonth.categoryBudgets) ? sourceMonth.categoryBudgets : fallbackMonth.categoryBudgets,
        transactions: Array.isArray(sourceMonth.transactions) ? sourceMonth.transactions : fallbackMonth.transactions,
      };
      monthMap.set(monthKey(normalizedMonth), normalizedMonth);
    });
  }

  const normalizedMonths = [...monthMap.values()].sort((left, right) => {
    if (left.year !== right.year) {
      return left.year - right.year;
    }
    return left.id - right.id;
  });

  const selectedMonthNumber = Number(normalizedProfile.selectedMonth);
  const selectedMonthKey = String(normalizedProfile.selectedMonthKey || "").trim();
  const selectedMonthByKey = selectedMonthKey
    ? normalizedMonths.findIndex((month) => monthKey(month) === selectedMonthKey)
    : -1;
  const selectedMonthIndex = selectedMonthByKey >= 0
    ? selectedMonthByKey
    : Number.isInteger(selectedMonthNumber)
    && selectedMonthNumber >= 0
    && selectedMonthNumber < normalizedMonths.length
    ? selectedMonthNumber
    : Math.min(base.profile.selectedMonth, normalizedMonths.length - 1);
  normalizedProfile.selectedMonth = selectedMonthIndex;
  normalizedProfile.selectedMonthKey = normalizedMonths[selectedMonthIndex]
    ? monthKey(normalizedMonths[selectedMonthIndex])
    : "";

  return {
    ...base,
    ...source,
    profile: normalizedProfile,
    months: normalizedMonths,
    investments: Array.isArray(source.investments) ? source.investments : base.investments,
    savingsGoals: Array.isArray(source.savingsGoals) ? source.savingsGoals : [],
    debtGoals: Array.isArray(source.debtGoals) ? source.debtGoals : [],
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
      const previousUserId = supabaseSession?.user?.id || "";
      const nextUserId = session?.user?.id || "";
      supabaseSession = session || null;

      if (previousUserId !== nextUserId || document.body.classList.contains("auth-screen")) {
        await applyAuthState();
      }
    });
  } catch (error) {
    console.warn("Supabase non configurato o non raggiungibile, uso fallback locale.", error);
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
  const normalized = migrateState(
    normalizePlannerState(sourceState || createDefaultState()),
    normalizeUsername(fallbackName),
  );
  if (!normalized.profile.name && fallbackName) {
    normalized.profile.name = fallbackName;
  }
  return cloneData(normalized);
}

function getLocalAccountStateByUsername(username) {
  const normalizedUsername = normalizeUsername(username);
  const accounts = getAccounts();
  const account = accounts[normalizedUsername];
  if (account?.state) {
    return buildAccountState(account.state, account.state?.profile?.name || normalizedUsername);
  }

  const legacyState = loadLegacyState();
  if (legacyState && normalizedUsername === DEFAULT_ACCOUNT.username) {
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

function setBackupStatus(message, tone = "") {
  if (!els.backupStatus) {
    return;
  }
  els.backupStatus.textContent = message || "";
  els.backupStatus.className = tone ? `list-meta ${tone}` : "list-meta";
}

function setPasswordStatus(message, tone = "") {
  if (!els.passwordStatus) {
    return;
  }
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
    renderMonthOptions();
    populateForms();
    render();
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

function setCsvImportStatus(message, tone = "") {
  if (!els.csvImportStatus) {
    return;
  }
  els.csvImportStatus.textContent = message || "";
  els.csvImportStatus.className = tone ? `list-meta csv-import-status ${tone}` : "list-meta csv-import-status";
}

function detectCsvDelimiter(text) {
  const source = String(text || "");
  const counts = { ",": 0, ";": 0, "\t": 0 };
  let inQuotes = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const nextChar = source[index + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if ((char === "\n" || char === "\r") && !inQuotes) {
      break;
    }
    if (!inQuotes && Object.prototype.hasOwnProperty.call(counts, char)) {
      counts[char] += 1;
    }
  }

  return Object.entries(counts).sort((left, right) => right[1] - left[1])[0]?.[0] || ",";
}

function parseCsvText(text, delimiter = ",") {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  const source = String(text || "").replace(/^\uFEFF/, "");

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const nextChar = source[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(cell);
      if (row.some((value) => String(value).trim())) {
        rows.push(row);
      }
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  if (row.some((value) => String(value).trim())) {
    rows.push(row);
  }

  return rows;
}

function normalizeCsvHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]/g, "");
}

function parseCsvObjects(text) {
  const rows = parseCsvText(text, detectCsvDelimiter(text));
  if (rows.length < 2) {
    return { headers: [], rows: [] };
  }

  const headers = rows[0].map(normalizeCsvHeader);
  return {
    headers,
    rows: rows.slice(1).map((values) => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = String(values[index] ?? "").trim();
      });
      return item;
    }),
  };
}

function csvValue(row, aliases) {
  for (const alias of aliases) {
    const value = row[normalizeCsvHeader(alias)];
    if (String(value || "").trim()) {
      return String(value).trim();
    }
  }
  return "";
}

function parseCsvAmount(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return NaN;
  }

  let normalized = raw
    .replace(/\s/g, "")
    .replace(/[€$£]/g, "")
    .replace(/^\((.*)\)$/, "-$1");

  const hasComma = normalized.includes(",");
  const hasDot = normalized.includes(".");
  if (hasComma && hasDot) {
    const lastComma = normalized.lastIndexOf(",");
    const lastDot = normalized.lastIndexOf(".");
    normalized = lastComma > lastDot
      ? normalized.replace(/\./g, "").replace(",", ".")
      : normalized.replace(/,/g, "");
  } else if (hasComma) {
    normalized = normalized.replace(",", ".");
  }

  return Number(normalized);
}

function parseCsvDateTime(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return { date: "", time: "" };
  }

  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/);
  if (isoMatch) {
    return {
      date: `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`,
      time: isoMatch[4] ? `${isoMatch[4]}:${isoMatch[5]}` : "",
    };
  }

  const localMatch = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:[ T](\d{1,2}):(\d{2}))?/);
  if (localMatch) {
    return {
      date: `${localMatch[3]}-${String(localMatch[2]).padStart(2, "0")}-${String(localMatch[1]).padStart(2, "0")}`,
      time: localMatch[4] ? `${String(localMatch[4]).padStart(2, "0")}:${localMatch[5]}` : "",
    };
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return { date: "", time: "" };
  }

  return {
    date: toDateInputValue(parsed),
    time: `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`,
  };
}

function detectCsvProvider(headers) {
  const joined = headers.join("|");
  if (joined.includes("booking date") && joined.includes("amount eur")) {
    return "N26";
  }
  if (
    joined.includes("completed date") ||
    joined.includes("started date") ||
    joined.includes("data di completamento") ||
    (joined.includes("descrizione") && joined.includes("importo"))
  ) {
    return "Revolut";
  }
  return "CSV";
}

function uniqueNonEmptyParts(parts) {
  const seen = new Set();
  return parts
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .filter((part) => {
      const key = part.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

function suggestCsvCategory(text) {
  const normalized = lowerText(text);
  const existingCategories = getCategorySuggestions();
  const exactExisting = existingCategories.find((category) => normalized.includes(lowerText(category)));
  if (exactExisting) {
    return exactExisting;
  }

  const rules = [
    { category: "Food & Drink", pattern: /(bar|caffe|caff[eè]|ristor|pizz|deliveroo|glovo|mcdonald|burger|sushi|pub|tavola|food|drink)/i },
    { category: "Spesa", pattern: /(lidl|conad|coop|supermerc|market|gala|si con te|eurospin|alimentari|macelleria)/i },
    { category: "Trasporti", pattern: /(trenitalia|train|bus|taxi|uber|bolt|eni|q8|ip |parking|parcheggio|trasport)/i },
    { category: "Abbonamenti", pattern: /(apple|spotify|netflix|amazon prime|google|openai|chatgpt|subscription|abbon)/i },
    { category: "Telefono", pattern: /(iliad|vodafone|tim|windtre|wind|telefono|mobile)/i },
    { category: "Bonifici privati", pattern: /(moneybeam|bonifico|transfer|sepa|inviato da|sent from)/i },
    { category: "Viaggi", pattern: /(hotel|airbnb|booking|ryanair|easyjet|aeroporto|airport|viaggi)/i },
    { category: "Fun", pattern: /(cinema|pub|game|steam|playstation|xbox|evento|ticket|club|fun)/i },
    { category: "Macchina", pattern: /(auto|macchina|meccanico|officina|gommista|assicurazione auto|bollo auto|revisione)/i },
    { category: "Carburante", pattern: /(carburante|benzina|diesel|gasolio|q8|eni|ip |tamoil|esso|agip|distributore)/i },
    { category: "Parrucchiere", pattern: /(parrucch|barber|barbiere|hair|salone)/i },
    { category: "Bicicletta", pattern: /(bici|bicicletta|bike|cicli|ciclismo|vibici)/i },
    { category: "Sigarette", pattern: /(sigarette|tabacchi|tabaccheria|tobacco|iqos|terea|heets)/i },
    { category: "Abbigliamento", pattern: /(abbigliamento|vestiti|zara|h&m|ovs|nike|adidas|zalando|scarpe|clothing)/i },
  ];
  const match = rules.find((rule) => rule.pattern.test(text));
  return match?.category || "Varie";
}

function normalizeCsvCompareText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function createCsvMovementSignature(item) {
  return [
    item.date,
    item.type,
    Number(item.amount || 0).toFixed(2),
    normalizeCsvCompareText(item.note),
  ].join("|");
}

function collectExistingMovementImportKeys() {
  const signatures = new Set();
  const externalIds = new Set();
  state.months.forEach((month) => {
    (month.transactions || []).forEach((transaction) => {
      signatures.add(createCsvMovementSignature(transaction));
      if (transaction.bankExternalId) {
        externalIds.add(String(transaction.bankExternalId));
      }
    });
  });
  return { signatures, externalIds };
}

function extractCsvMovement(row, provider, rowIndex) {
  const status = csvValue(row, ["State", "Status", "Stato"]);
  if (status && !/^(completed|completato|booked|settled)$/i.test(status)) {
    return null;
  }

  const dateTime = parseCsvDateTime(
    csvValue(row, [
      "Booking Date",
      "Completed Date",
      "Started Date",
      "Data di completamento",
      "Data di inizio",
      "Date",
      "Data",
      "Value Date",
    ]),
  );
  const amountValue = csvValue(row, ["Amount (EUR)", "Amount", "Importo", "Amount EUR"]);
  const signedAmount = parseCsvAmount(amountValue);
  if (!dateTime.date || !Number.isFinite(signedAmount) || signedAmount === 0) {
    return null;
  }

  const partnerName = csvValue(row, ["Partner Name", "Partner", "Description", "Descrizione", "Beneficiary", "Merchant"]);
  const paymentReference = csvValue(row, ["Payment Reference", "Reference", "Notes", "Note"]);
  const rowType = csvValue(row, ["Type", "Tipo", "Transaction Type"]);
  const accountName = csvValue(row, ["Account Name", "Product", "Prodotto", "Account"]);
  const originalCurrency = csvValue(row, ["Original Currency", "Currency", "Valuta"]);
  const noteParts = uniqueNonEmptyParts([provider, partnerName, paymentReference, rowType, accountName]);
  const note = noteParts.join(" - ") || `${provider} - Movimento CSV`;
  const type = signedAmount >= 0 ? "income" : "expense";
  const amount = Number(Math.abs(signedAmount).toFixed(2));
  const externalId = [
    provider,
    dateTime.date,
    signedAmount.toFixed(2),
    normalizeCsvCompareText(note),
    rowIndex,
  ].join("|");

  return {
    id: crypto.randomUUID(),
    date: dateTime.date,
    time: dateTime.time,
    type,
    category: type === "income" ? "Entrate" : suggestCsvCategory(`${partnerName} ${paymentReference} ${rowType}`),
    amount,
    note,
    bankExternalId: externalId,
    bankDirection: signedAmount >= 0 ? "Credito" : "Debito",
    bankTransactionId: "",
    bankEntryReference: paymentReference,
    creditorName: signedAmount < 0 ? partnerName : "",
    debtorName: signedAmount >= 0 ? partnerName : "",
    currency: originalCurrency || state.profile.currency || "EUR",
  };
}

function addCsvMovementToPlanner(movement) {
  const month = ensurePlannerMonthForDate(movement.date);
  if (!month) {
    return false;
  }

  if (movement.type === "expense" && movement.category && !(month.categoryBudgets || []).some((entry) => entry.name === movement.category)) {
    month.categoryBudgets = month.categoryBudgets || [];
    month.categoryBudgets.unshift({
      id: crypto.randomUUID(),
      name: movement.category,
      budget: 0,
      isUndefinedBudget: true,
    });
  }

  month.transactions = month.transactions || [];
  month.transactions.unshift(movement);
  return true;
}

async function importCsvMovements(file) {
  if (!file) {
    return;
  }

  try {
    setCsvImportStatus(`Sto leggendo ${file.name}...`);
    const text = await file.text();
    const parsed = parseCsvObjects(text);
    if (!parsed.rows.length) {
      throw new Error("Il CSV non contiene righe importabili.");
    }

    const provider = detectCsvProvider(parsed.headers);
    const existingImportKeys = collectExistingMovementImportKeys();
    let importedCount = 0;
    let duplicateCount = 0;
    let skippedCount = 0;

    parsed.rows.forEach((row, index) => {
      const movement = extractCsvMovement(row, provider, index + 2);
      if (!movement) {
        skippedCount += 1;
        return;
      }

      const signature = createCsvMovementSignature(movement);
      if (existingImportKeys.externalIds.has(movement.bankExternalId) || existingImportKeys.signatures.has(signature)) {
        duplicateCount += 1;
        return;
      }

      if (addCsvMovementToPlanner(movement)) {
        existingImportKeys.externalIds.add(movement.bankExternalId);
        importedCount += 1;
      } else {
        skippedCount += 1;
      }
    });

    if (!importedCount) {
      setCsvImportStatus(`Nessun nuovo movimento importato da ${provider}. Duplicati: ${duplicateCount}, scartati: ${skippedCount}.`, "negative");
      return;
    }

    saveState();
    renderMonthOptions();
    populateForms();
    render();
    setCsvImportStatus(`Import ${provider} completato: ${importedCount} movimenti inseriti, ${duplicateCount} duplicati ignorati, ${skippedCount} righe scartate.`, "positive");
  } catch (error) {
    console.error("Errore import CSV movimenti", error);
    setCsvImportStatus(error.message || "Import CSV non riuscito.", "negative");
  }
}

function initializeAccountsStore() {
  const accounts = getAccounts();
  const legacyState = loadLegacyState();
  const defaultUsername = DEFAULT_ACCOUNT.username;
  let updated = false;

  if (!accounts[defaultUsername]) {
    accounts[defaultUsername] = {
      password: DEFAULT_ACCOUNT.password,
      state: buildAccountState(legacyState || createDemoState(), "Mattia"),
    };
    updated = true;
  } else {
    if (!accounts[defaultUsername].password) {
      accounts[defaultUsername].password = DEFAULT_ACCOUNT.password;
      updated = true;
    }
    if (!accounts[defaultUsername].state) {
      accounts[defaultUsername].state = buildAccountState(legacyState || createDemoState(), "Mattia");
      updated = true;
    }
  }

  if (updated) {
    saveAccounts(accounts);
  }

  const currentUsername = getCurrentUsername();
  if (currentUsername && !accounts[currentUsername]) {
    sessionStorage.removeItem(LOGIN_SESSION_KEY);
  }
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

async function deleteRemoteBankTransactionLink(transaction) {
  if (!supabaseClient || !supabaseSession?.user?.id || !transaction) {
    return;
  }

  const plannerTransactionId = String(transaction.id || "").trim();
  const externalTransactionId = String(transaction.bankExternalId || "").trim();

  try {
    if (plannerTransactionId) {
      const plannerDeleteResult = await supabaseClient
        .from("bank_transactions")
        .delete()
        .eq("user_id", supabaseSession.user.id)
        .eq("planner_transaction_id", plannerTransactionId);

      if (plannerDeleteResult.error) {
        console.error("Errore cancellazione link banca per planner_transaction_id", plannerDeleteResult.error);
      }
    }

    if (externalTransactionId) {
      const externalDeleteResult = await supabaseClient
        .from("bank_transactions")
        .delete()
        .eq("user_id", supabaseSession.user.id)
        .eq("external_transaction_id", externalTransactionId);

      if (externalDeleteResult.error) {
        console.error("Errore cancellazione link banca per external_transaction_id", externalDeleteResult.error);
      }
    }
  } catch (error) {
    console.error("Errore cancellazione collegamento transazione bancaria", error);
  }
}

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function deleteRemoteBankTransactionLinks(transactions) {
  if (!supabaseClient || !supabaseSession?.user?.id || !transactions?.length) {
    return;
  }

  const plannerTransactionIds = [...new Set(transactions.map((transaction) => String(transaction?.id || "").trim()).filter(Boolean))];
  const externalTransactionIds = [...new Set(transactions.map((transaction) => String(transaction?.bankExternalId || "").trim()).filter(Boolean))];

  try {
    for (const ids of chunkArray(plannerTransactionIds, 500)) {
      const result = await supabaseClient
        .from("bank_transactions")
        .delete()
        .eq("user_id", supabaseSession.user.id)
        .in("planner_transaction_id", ids);

      if (result.error) {
        console.error("Errore cancellazione batch link banca per planner_transaction_id", result.error);
      }
    }

    for (const ids of chunkArray(externalTransactionIds, 500)) {
      const result = await supabaseClient
        .from("bank_transactions")
        .delete()
        .eq("user_id", supabaseSession.user.id)
        .in("external_transaction_id", ids);

      if (result.error) {
        console.error("Errore cancellazione batch link banca per external_transaction_id", result.error);
      }
    }
  } catch (error) {
    console.error("Errore cancellazione batch collegamenti transazioni bancarie", error);
  }
}

async function ensureRemotePlannerState(username) {
  if (!supabaseSession?.user) {
    return buildAccountState(createDefaultState(), username);
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
    try {
      return await ensureRemotePlannerState(usernameFromSupabaseUser(supabaseSession.user) || username);
    } catch (error) {
      console.error("Errore caricamento planner utente da Supabase", error);
      return getLocalAccountStateByUsername(username);
    }
  }

  const normalizedUsername = normalizeUsername(username);
  const account = getAccounts()[normalizedUsername];
  if (!account?.state) {
    return buildAccountState(createDefaultState(), normalizedUsername);
  }

  try {
    return buildAccountState(account.state, account.state?.profile?.name || normalizedUsername);
  } catch (error) {
    console.error("Errore caricamento planner utente", error);
    return buildAccountState(createDefaultState(), normalizedUsername);
  }
}

function hasDefaultXrpPortfolio(investments) {
  return Array.isArray(investments)
    && investments.length === 1
    && String(investments[0]?.coinId || "").toLowerCase() === "ripple"
    && Number(investments[0]?.quantity || 0) === 710
    && Number(investments[0]?.invested || 0) === 2000;
}

function migrateState(currentState, username = "") {
  currentState.appliedMigrations = currentState.appliedMigrations || {};

  if (!currentState.appliedMigrations.debtStartAdjustmentsMay2026) {
    (currentState.debtGoals || []).forEach((goal) => {
      const normalizedName = String(goal.name || "").trim().toLowerCase();

      if (normalizedName.includes("iphone")) {
        goal.start = Number(goal.start || 0) - 288;
      }

      if (normalizedName.includes("agos")) {
        goal.start = Number(goal.start || 0) - 177;
      }
    });

    currentState.appliedMigrations.debtStartAdjustmentsMay2026 = true;
  }

  if (!currentState.appliedMigrations.investmentsScopedByUserMay2026) {
    if (normalizeUsername(username) !== DEFAULT_ACCOUNT.username && hasDefaultXrpPortfolio(currentState.investments)) {
      currentState.investments = [];
    }
    currentState.appliedMigrations.investmentsScopedByUserMay2026 = true;
  }
  return currentState;

  const month = currentState.months.find((item) => item.year === 2026 && item.id === 4);
  if (!month) {
    if (!currentState.investments?.length) {
      currentState.investments = defaultInvestments();
    }
    return currentState;
  }

  month.transactions = createCleanMayTransactions();
  month.categoryBudgets = buildCategoryBudgetsFromTransactions(month.transactions);
  month.incomes = [];
  month.bills = [];
  if (!currentState.investments?.length) {
    currentState.investments = defaultInvestments();
  }
  return currentState;

  month.transactions = month.transactions
    .filter((item) => !(item.type === "expense" && item.amount === 400 && String(item.note || "").includes("Revolut**6966*")))
    .map((item) => {
      const note = String(item.note || "");
      const normalizedKey = `${item.date}|${Number(item.amount)}|${note}`;

      if (REVOLUT_MAY_TIMES[normalizedKey] && !item.time) {
        item.time = REVOLUT_MAY_TIMES[normalizedKey];
      }

      if (note.includes("Commissione consegna carta") && Number(item.amount || 0) === 0) {
        item.amount = 6.99;
        item.time = item.time || REVOLUT_MAY_TIMES["2026-05-13|6.99|Revolut · Commissione consegna carta"];
      }

      return item;
    });

  month.categoryBudgets = month.categoryBudgets.filter((item) => item.name !== "Trasferimenti esterni");

  month.incomes = month.incomes.filter(
    (item) => !(Number(item.actual || item.budget || 0) === 400 && /ricarica|\*3562|revolut/i.test(`${item.name || ""} ${item.note || ""}`)),
  );

  return currentState;
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
    return;
  }

  const accounts = getAccounts();
  const existing = accounts[username] || { password: "", state: null };
  accounts[username] = {
    ...existing,
    state: cloneData(state),
  };
  saveAccounts(accounts);
}

function getSelectedMonth() {
  const selectedMonthKey = String(state?.profile?.selectedMonthKey || "").trim();
  if (selectedMonthKey && Array.isArray(state?.months)) {
    const keyedIndex = state.months.findIndex((month) => monthKey(month) === selectedMonthKey);
    if (keyedIndex >= 0) {
      state.profile.selectedMonth = keyedIndex;
      return state.months[keyedIndex];
    }
  }

  const selectedMonthIndex = Number(state?.profile?.selectedMonth);
  if (Array.isArray(state?.months) && state.months[selectedMonthIndex]) {
    state.profile.selectedMonthKey = monthKey(state.months[selectedMonthIndex]);
    return state.months[selectedMonthIndex];
  }

  const fallbackMonth = Array.isArray(state?.months) && state.months.length
    ? state.months[0]
    : createDefaultMonth(0, new Date().getFullYear());

  if (state?.profile) {
    state.profile.selectedMonth = 0;
    state.profile.selectedMonthKey = monthKey(fallbackMonth);
  }

  return fallbackMonth;
}

function setSelectedMonth(month) {
  if (!month || !Array.isArray(state?.months)) {
    return;
  }

  const index = state.months.findIndex((item) => monthKey(item) === monthKey(month));
  if (index < 0) {
    return;
  }

  state.profile.selectedMonth = index;
  state.profile.selectedMonthKey = monthKey(state.months[index]);
}

function ensurePlannerYearMonths(year) {
  const normalizedYear = Number(year);
  if (!Number.isInteger(normalizedYear) || normalizedYear <= 0) {
    return;
  }

  MONTHS.forEach((_, index) => {
    const exists = state.months.some((month) => Number(month.year) === normalizedYear && Number(month.id) === index);
    if (!exists) {
      state.months.push(createDefaultMonth(index, normalizedYear));
    }
  });

  state.months.sort((left, right) => {
    if (left.year !== right.year) {
      return left.year - right.year;
    }
    return left.id - right.id;
  });
  setSelectedMonth(getSelectedMonth());
}

function ensurePlannerMonthForDate(dateString) {
  const [yearText, monthText] = String(dateString || "").split("-");
  const year = Number(yearText);
  const monthId = Number(monthText) - 1;
  if (!Number.isInteger(year) || !Number.isInteger(monthId) || monthId < 0 || monthId > 11) {
    return null;
  }

  const existing = state.months.find((month) => Number(month.year) === year && Number(month.id) === monthId);
  if (existing) {
    return existing;
  }

  const selectedMonthKey = monthKey(getSelectedMonth());
  const month = createDefaultMonth(monthId, year);
  state.months.push(month);
  state.months.sort((left, right) => {
    if (left.year !== right.year) {
      return left.year - right.year;
    }
    return left.id - right.id;
  });

  const selectedIndex = state.months.findIndex((item) => monthKey(item) === selectedMonthKey);
  if (selectedIndex >= 0) {
    state.profile.selectedMonth = selectedIndex;
    state.profile.selectedMonthKey = selectedMonthKey;
  }

  return month;
}

function monthKey(month) {
  return `${month.year}-${String(month.id + 1).padStart(2, "0")}`;
}

function getChronologicalMonths() {
  return [...state.months].sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }
    return a.id - b.id;
  });
}

function renderMonthOptions() {
  const selectedMonth = getSelectedMonth();
  els.selectedMonth.innerHTML = state.months
    .map((month) => `<option value="${monthKey(month)}">${month.name} ${month.year}</option>`)
    .join("");
  els.selectedMonth.value = monthKey(selectedMonth);
}

function populateForms() {
  if (els.profileForm) {
    els.profileForm.elements.namedItem("name").value = state.profile.name;
    els.profileForm.elements.namedItem("currency").value = state.profile.currency;
    els.profileForm.elements.namedItem("year").value = state.profile.year;
    els.profileForm.elements.namedItem("startBalance").value = state.profile.startBalance;
  }
  if (els.incomeForm) {
    els.incomeForm.elements.namedItem("date").value = getDefaultEntryDate(getSelectedMonth());
    els.incomeForm.elements.namedItem("time").value = "";
  }
  els.transactionForm.elements.namedItem("date").value = new Date().toISOString().slice(0, 10);
  syncTransactionCategoryOptions();
  const availableYears = getAvailableYears();
  els.annualYearFilter.innerHTML = [
    '<option value="all">Tutti gli anni</option>',
    ...availableYears.map((year) => `<option value="${year}">${year}</option>`),
  ].join("");
  const defaultAnnualYear = String(new Date().getFullYear());
  if (annualYearFilter !== "all" && !availableYears.includes(Number(annualYearFilter))) {
    annualYearFilter = availableYears.includes(Number(defaultAnnualYear)) ? defaultAnnualYear : "all";
  }
  els.annualYearFilter.value = availableYears.includes(Number(annualYearFilter)) || annualYearFilter === "all"
    ? annualYearFilter
    : "all";
  els.chartScopeSelect.value = chartScope;
  els.chartYearSelect.innerHTML = availableYears.map((year) => `<option value="${year}">${year}</option>`).join("");
  els.chartYearSelect.value = getResolvedChartYearValue();
  els.chartViewSelect.value = chartView;
  els.chartDayPicker.value = getResolvedChartDayValue();
  const resolvedPeriod = getResolvedChartPeriodValues();
  els.chartPeriodStartPicker.value = resolvedPeriod.start;
  els.chartPeriodEndPicker.value = resolvedPeriod.end;
  const isMonthScope = chartScope === "month";
  const isCustomScope = chartScope === "custom";
  els.chartYearSelect.disabled = chartScope !== "year";
  els.chartViewSelect.disabled = !isMonthScope;
  els.chartDayPicker.disabled = !(isMonthScope && chartView === "day");
  els.chartPeriodStartPicker.disabled = !((isMonthScope && chartView === "period") || isCustomScope);
  els.chartPeriodEndPicker.disabled = !((isMonthScope && chartView === "period") || isCustomScope);
  els.runwayEndDate.value = getResolvedRunwayEndDate();
  els.runwayDailyBudget.value = runwayDailyBudgetValue;
  if (els.runwayNoSpendDays) {
    els.runwayNoSpendDays.value = String(runwayNoSpendDaysValue || 0);
  }
  els.movementFilterMode.value = movementFilter.mode;
  els.movementFilterStart.value = movementFilter.start;
  els.movementFilterEnd.value = movementFilter.end;
  els.movementFilterType.value = movementFilter.type;
  const movementCategories = ["all", ...getCategorySuggestions()];
  els.movementFilterCategory.innerHTML = movementCategories
    .map((category) => `<option value="${escapeAttribute(category)}">${category === "all" ? "Tutte le categorie" : category}</option>`)
    .join("");
  els.movementFilterCategory.value = movementCategories.includes(movementFilter.category) ? movementFilter.category : "all";
  els.movementFilterNote.value = movementFilter.note;
  els.movementFilterMinAmount.value = movementFilter.minAmount;
  els.movementFilterMaxAmount.value = movementFilter.maxAmount;
  els.movementSortBy.value = movementFilter.sortBy;
  els.movementBulkCategory.innerHTML = [
    '<option value="">Seleziona categoria</option>',
    ...getCategorySuggestions().map((category) => `<option value="${escapeAttribute(category)}">${category}</option>`),
  ].join("");
}

function getTransactionCategoryOptions(type) {
  if (type === "saving") {
    return state.savingsGoals.map((goal) => goal.name).filter(Boolean);
  }

  if (type === "debt") {
    return state.debtGoals.map((goal) => goal.name).filter(Boolean);
  }

  return getCategorySuggestions();
}

function getTransactionCategoryPlaceholder(type) {
  if (type === "saving") {
    return state.savingsGoals.length ? "Seleziona goal risparmio" : "Prima crea un goal risparmio";
  }

  if (type === "debt") {
    return state.debtGoals.length ? "Seleziona debito" : "Prima crea un debito";
  }

  return "Seleziona categoria";
}

function syncTransactionCategoryOptions() {
  const selectedType = String(els.transactionForm.elements.namedItem("type")?.value || "expense");
  const previousValue = String(els.transactionCategorySelect.value || "");
  const categoryOptions = getTransactionCategoryOptions(selectedType);
  const placeholder = getTransactionCategoryPlaceholder(selectedType);

  els.transactionCategorySelect.innerHTML = [
    `<option value="">${placeholder}</option>`,
    ...categoryOptions.map((category) => `<option value="${escapeAttribute(category)}">${category}</option>`),
  ].join("");

  if (categoryOptions.includes(previousValue)) {
    els.transactionCategorySelect.value = previousValue;
  } else {
    els.transactionCategorySelect.value = "";
  }
}

function resetMovementVisibleLimit() {
  movementVisibleLimit = MOVEMENT_RENDER_BATCH_SIZE;
}

function createDefaultMovementFilter() {
  const today = toDateInputValue(new Date());
  return {
    mode: "date-range",
    start: today,
    end: today,
    type: "all",
    category: "all",
    note: "",
    minAmount: "",
    maxAmount: "",
    sortBy: "date-desc",
  };
}

function getDefaultEntryDate(month) {
  const today = new Date();
  const isSameMonth = today.getFullYear() === month.year && today.getMonth() === month.id;
  const day = isSameMonth ? today.getDate() : 1;
  return `${month.year}-${String(month.id + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function clearChartZoom() {
  chartZoomRange = null;
}

function getChartZoomForMonth(month) {
  if (!chartZoomRange || chartZoomRange.key !== monthKey(month)) {
    return null;
  }
  return chartZoomRange;
}

function getDefaultChartDayValue(month = getSelectedMonth()) {
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === month.year && today.getMonth() === month.id;
  const day = isCurrentMonth ? today.getDate() : 1;
  return `${month.year}-${String(month.id + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T12:00`;
}

function getResolvedChartDayValue(month = getSelectedMonth()) {
  if (!chartDayValue) {
    chartDayValue = getDefaultChartDayValue(month);
  }

  const prefix = `${month.year}-${String(month.id + 1).padStart(2, "0")}-`;
  if (!chartDayValue.startsWith(prefix)) {
    chartDayValue = getDefaultChartDayValue(month);
  }

  return chartDayValue;
}

function getDefaultChartPeriodValues(month = getSelectedMonth()) {
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === month.year && today.getMonth() === month.id;
  const endDay = isCurrentMonth ? today.getDate() : new Date(month.year, month.id + 1, 0).getDate();
  return {
    start: `${month.year}-${String(month.id + 1).padStart(2, "0")}-01T00:00`,
    end: `${month.year}-${String(month.id + 1).padStart(2, "0")}-${String(endDay).padStart(2, "0")}T23:30`,
  };
}

function getResolvedChartPeriodValues(month = getSelectedMonth()) {
  const defaults = getDefaultChartPeriodValues(month);
  if (chartScope === "custom") {
    if (!chartPeriodStartValue) {
      chartPeriodStartValue = defaults.start;
    }
    if (!chartPeriodEndValue) {
      chartPeriodEndValue = defaults.end;
    }
    if (chartPeriodStartValue > chartPeriodEndValue) {
      chartPeriodEndValue = chartPeriodStartValue;
    }
    return { start: chartPeriodStartValue, end: chartPeriodEndValue };
  }

  const prefix = `${month.year}-${String(month.id + 1).padStart(2, "0")}-`;

  if (!chartPeriodStartValue || !chartPeriodStartValue.startsWith(prefix)) {
    chartPeriodStartValue = defaults.start;
  }
  if (!chartPeriodEndValue || !chartPeriodEndValue.startsWith(prefix)) {
    chartPeriodEndValue = defaults.end;
  }
  if (chartPeriodStartValue > chartPeriodEndValue) {
    chartPeriodEndValue = chartPeriodStartValue;
  }

  return { start: chartPeriodStartValue, end: chartPeriodEndValue };
}

function getDefaultRunwayEndDate() {
  const today = new Date();
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 15);
  return toDateInputValue(end);
}

function getResolvedRunwayEndDate() {
  if (!runwayEndDateValue) {
    runwayEndDateValue = getDefaultRunwayEndDate();
  }
  return runwayEndDateValue;
}

function getDefaultChartYearValue() {
  return String(getSelectedMonth().year || new Date().getFullYear());
}

function getResolvedChartYearValue() {
  const availableYears = getAvailableYears().map(String);
  if (!availableYears.length) {
    return String(new Date().getFullYear());
  }
  if (!availableYears.includes(String(chartYearValue))) {
    chartYearValue = availableYears.includes(getDefaultChartYearValue()) ? getDefaultChartYearValue() : availableYears[0];
  }
  return String(chartYearValue);
}

function bindForms() {
  els.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    (async () => {
      const data = new FormData(event.currentTarget);
      const username = normalizeUsername(data.get("username"));
      const password = String(data.get("password") || "");

      if (isSupabaseEnabled()) {
        const result = await supabaseClient.auth.signInWithPassword({
          email: derivePlannerEmail(username),
          password,
        });

        if (result.error || !result.data.session) {
          els.loginError.textContent = "Credenziali non corrette";
          return;
        }

        supabaseSession = result.data.session;
        setCurrentUsername(username);
        els.loginError.textContent = "";
        els.registerError.textContent = "";
        els.registerSuccess.textContent = "";
        event.currentTarget.reset();
        await applyAuthState();
        return;
      }

      const account = getAccounts()[username];

      if (!account || account.password !== password) {
        els.loginError.textContent = "Credenziali non corrette";
        return;
      }

      setCurrentUsername(username);
      els.loginError.textContent = "";
      els.registerError.textContent = "";
      els.registerSuccess.textContent = "";
      event.currentTarget.reset();
      await applyAuthState();
    })();
  });

  els.registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    (async () => {
      const data = new FormData(event.currentTarget);
      const username = normalizeUsername(data.get("username"));
      const password = String(data.get("password") || "");
      const confirmPassword = String(data.get("confirmPassword") || "");
      const accounts = getAccounts();

      els.registerError.textContent = "";
      els.registerSuccess.textContent = "";

      if (username.length < 3) {
        els.registerError.textContent = "Scegli uno username di almeno 3 caratteri";
        return;
      }

      if (password.length < 3) {
        els.registerError.textContent = "Scegli una password di almeno 3 caratteri";
        return;
      }

      if (password !== confirmPassword) {
        els.registerError.textContent = "Le password non coincidono";
        return;
      }

      if (isSupabaseEnabled()) {
        const result = await supabaseClient.auth.signUp({
          email: derivePlannerEmail(username),
          password,
          options: {
            data: {
              username,
            },
          },
        });

        if (result.error) {
          els.registerError.textContent = result.error.message || "Registrazione non riuscita";
          return;
        }

        if (!result.data.session) {
          const signInResult = await supabaseClient.auth.signInWithPassword({
            email: derivePlannerEmail(username),
            password,
          });

          if (signInResult.error || !signInResult.data.session) {
            els.registerSuccess.textContent = "Utente creato. Prova ora a fare login.";
            event.currentTarget.reset();
            return;
          }

          supabaseSession = signInResult.data.session;
        } else {
          supabaseSession = result.data.session;
        }

        setCurrentUsername(username);
        const freshState = buildAccountState(createDefaultState(), username);
        freshState.profile.name = username.charAt(0).toUpperCase() + username.slice(1);
        saveLocalShadowState(username, freshState);
        els.registerSuccess.textContent = "Utente creato: accesso effettuato";
        els.loginError.textContent = "";
        event.currentTarget.reset();
        await applyAuthState();
        return;
      }

      if (accounts[username]) {
        els.registerError.textContent = "Questo username esiste gia";
        return;
      }

      const freshState = buildAccountState(createDefaultState(), username);
      freshState.profile.name = username.charAt(0).toUpperCase() + username.slice(1);
      accounts[username] = {
        password,
        state: freshState,
      };
      saveAccounts(accounts);
      setCurrentUsername(username);
      els.registerSuccess.textContent = "Utente creato: accesso effettuato";
      els.loginError.textContent = "";
      event.currentTarget.reset();
      await applyAuthState();
    })();
  });

  els.selectedMonth.addEventListener("change", (event) => {
    const selectedMonth = state.months.find((month) => monthKey(month) === event.target.value);
    setSelectedMonth(selectedMonth);
    clearChartZoom();
    chartDayValue = getDefaultChartDayValue(getSelectedMonth());
    const periodDefaults = getDefaultChartPeriodValues(getSelectedMonth());
    chartPeriodStartValue = periodDefaults.start;
    chartPeriodEndValue = periodDefaults.end;
    saveState();
    render();
  });

  els.annualYearFilter.addEventListener("change", (event) => {
    annualYearFilter = event.target.value;
    render();
  });

  els.chartScopeSelect.addEventListener("change", (event) => {
    chartScope = event.target.value || "month";
    clearChartZoom();
    render();
  });

  els.chartYearSelect.addEventListener("change", (event) => {
    chartYearValue = event.target.value || getDefaultChartYearValue();
    clearChartZoom();
    render();
  });

  els.chartViewSelect.addEventListener("change", (event) => {
    chartView = event.target.value;
    clearChartZoom();
    render();
  });

  els.chartDayPicker.addEventListener("change", (event) => {
    chartDayValue = event.target.value || getDefaultChartDayValue();
    clearChartZoom();
    render();
  });

  els.chartPeriodStartPicker.addEventListener("change", (event) => {
    chartPeriodStartValue = event.target.value || getDefaultChartPeriodValues().start;
    clearChartZoom();
    render();
  });

  els.chartPeriodEndPicker.addEventListener("change", (event) => {
    chartPeriodEndValue = event.target.value || getDefaultChartPeriodValues().end;
    clearChartZoom();
    render();
  });

  els.runwayEndDate.addEventListener("change", (event) => {
    runwayEndDateValue = event.target.value || getDefaultRunwayEndDate();
    render();
  });

  els.runwayDailyBudget.addEventListener("input", (event) => {
    runwayDailyBudgetValue = event.target.value;
    render();
  });

  els.runwayNoSpendDays?.addEventListener("input", (event) => {
    const parsed = Number.parseInt(event.target.value || "0", 10);
    runwayNoSpendDaysValue = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    render();
  });

  els.investmentTradeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const coinId = String(data.get("coinId") || "").trim();
    const side = String(data.get("side") || "buy");
    const quantity = Number(data.get("quantity") || 0);
    const total = Number(data.get("total") || 0);

    if (!coinId || quantity <= 0 || total < 0) {
      return;
    }

    const investment = state.investments.find((item) => item.coinId === coinId);
    if (!investment) {
      return;
    }

    if (side === "buy") {
      investment.quantity += quantity;
      investment.invested += total;
    } else {
      investment.quantity = Math.max(0, investment.quantity - quantity);
      const avgCost = investment.quantity + quantity > 0 ? investment.invested / (investment.quantity + quantity) : 0;
      investment.invested = Math.max(0, investment.invested - avgCost * quantity);
    }

    event.currentTarget.reset();
    saveState();
    render();
  });

  els.movementFilterMode.addEventListener("change", (event) => {
    movementFilter.mode = event.target.value;
    resetMovementVisibleLimit();
    render();
  });

  els.movementFilterStart.addEventListener("change", (event) => {
    movementFilter.start = event.target.value;
    resetMovementVisibleLimit();
    render();
  });

  els.movementFilterEnd.addEventListener("change", (event) => {
    movementFilter.end = event.target.value;
    resetMovementVisibleLimit();
    render();
  });

  els.movementFilterType.addEventListener("change", (event) => {
    movementFilter.type = event.target.value || "all";
    resetMovementVisibleLimit();
    render();
  });

  els.movementFilterCategory.addEventListener("change", (event) => {
    movementFilter.category = event.target.value || "all";
    resetMovementVisibleLimit();
    render();
  });

  els.movementFilterNote.addEventListener("input", (event) => {
    movementFilter.note = event.target.value;
    resetMovementVisibleLimit();
    render();
  });

  els.movementFilterMinAmount.addEventListener("input", (event) => {
    movementFilter.minAmount = event.target.value;
    resetMovementVisibleLimit();
    render();
  });

  els.movementFilterMaxAmount.addEventListener("input", (event) => {
    movementFilter.maxAmount = event.target.value;
    resetMovementVisibleLimit();
    render();
  });

  els.movementSortBy.addEventListener("change", (event) => {
    movementFilter.sortBy = event.target.value || "date-desc";
    resetMovementVisibleLimit();
    render();
  });

  els.profileForm?.addEventListener("submit", (event) => {
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
    ensurePlannerYearMonths(year);
    saveState();
    renderMonthOptions();
    render();
  });

  els.passwordForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    (async () => {
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
    })();
  });

  els.backupFileInput?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    await importBackupFile(file);
    event.target.value = "";
  });

  els.csvImportInput?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    await importCsvMovements(file);
    event.target.value = "";
  });

  els.incomeForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    getSelectedMonth().incomes.unshift({
      id: crypto.randomUUID(),
      name: String(data.get("name")).trim(),
      budget: Number(data.get("budget") || 0),
      actual: Number(data.get("actual") || 0),
      date: String(data.get("date") || getDefaultEntryDate(getSelectedMonth())),
      time: String(data.get("time") || "").trim(),
    });
    event.currentTarget.reset();
    els.incomeForm.elements.namedItem("date").value = getDefaultEntryDate(getSelectedMonth());
    els.incomeForm.elements.namedItem("time").value = "";
    saveState();
    render();
  });

  els.billForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    getSelectedMonth().bills.unshift({
      id: crypto.randomUUID(),
      name: String(data.get("name")).trim(),
      dueDay: Number(data.get("dueDay") || 1),
      budget: Number(data.get("budget") || 0),
      actual: Number(data.get("actual") || 0),
    });
    event.currentTarget.reset();
    saveState();
    render();
  });

  els.categoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const categoryName = String(data.get("name")).trim();
    getSelectedMonth().categoryBudgets.unshift({
      id: crypto.randomUUID(),
      name: categoryName,
      budget: Number(data.get("budget") || 0),
      isUndefinedBudget: data.get("isUndefinedBudget") === "on",
    });
    event.currentTarget.reset();
    saveState();
    render();
    els.transactionCategorySelect.value = categoryName;
  });

  els.transactionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const date = String(data.get("date"));
    const targetMonth = ensurePlannerMonthForDate(date) || getSelectedMonth();
    targetMonth.transactions.unshift({
      id: crypto.randomUUID(),
      date,
      time: String(data.get("time") || "").trim(),
      type: String(data.get("type")),
      category: String(data.get("category")).trim(),
      amount: Number(data.get("amount") || 0),
      note: String(data.get("note") || "").trim(),
    });
    event.currentTarget.reset();
    els.transactionForm.elements.namedItem("date").value = new Date().toISOString().slice(0, 10);
    saveState();
    render();
  });

  els.transactionForm.elements.namedItem("type").addEventListener("change", () => {
    syncTransactionCategoryOptions();
  });

  els.savingGoalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    state.savingsGoals.unshift({
      id: crypto.randomUUID(),
      name: String(data.get("name")).trim(),
      target: Number(data.get("target") || 0),
      start: Number(data.get("start") || 0),
    });
    event.currentTarget.reset();
    saveState();
    render();
  });

  els.debtGoalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    state.debtGoals.unshift({
      id: crypto.randomUUID(),
      name: String(data.get("name")).trim(),
      target: Number(data.get("target") || 0),
      start: Number(data.get("start") || 0),
    });
    event.currentTarget.reset();
    saveState();
    render();
  });
}

function setSidebarOpen(open) {
  if (!els.pageShell) {
    return;
  }

  els.pageShell.classList.toggle("sidebar-open", Boolean(open));
  const toggle = els.pageShell.querySelector("[data-action='toggle-sidebar']");
  if (toggle) {
    toggle.setAttribute("aria-expanded", String(Boolean(open)));
    toggle.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
  }
}

function bindActions() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setSidebarOpen(false);
    }
  });

  document.body.addEventListener("click", (event) => {
    if (event.target.closest(".sidebar-nav a")) {
      setSidebarOpen(false);
      return;
    }

    const action = event.target.closest("[data-action]")?.dataset.action;
    if (!action) {
      return;
    }

    const run = async () => {

      if (action === "seed-sample") {
        seedSampleData();
        return;
      }

      if (action === "reset-storage") {
        state = buildAccountState(createDefaultState(), getCurrentUsername());
        activeCategoryFilter = "";
        clearChartZoom();
        movementFilter = createDefaultMovementFilter();
        saveState();
        renderMonthOptions();
        populateForms();
        render();
        return;
      }

    if (action === "clear-category-filter") {
      activeCategoryFilter = "";
      render();
      return;
    }

    if (action === "jump-category-form") {
      document.getElementById("categoryForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
      els.categoryForm.elements.namedItem("name")?.focus();
      return;
    }

    if (action === "reset-chart-zoom") {
      clearChartZoom();
      render();
      return;
    }

    if (action === "toggle-sidebar") {
      setSidebarOpen(!els.pageShell.classList.contains("sidebar-open"));
      return;
    }

    if (action === "close-sidebar") {
      setSidebarOpen(false);
      return;
    }

    if (action === "export-backup") {
      downloadBackupFile();
      return;
    }

    if (action === "import-backup") {
      els.backupFileInput?.click();
      return;
    }

    if (action === "import-csv-movements") {
      els.csvImportInput?.click();
      return;
    }

    if (action === "push-supabase") {
      pushCurrentStateToSupabase();
      return;
    }

    if (action === "bulk-delete-filtered-movements") {
      await deleteFilteredMovements();
      return;
    }

    if (action === "bulk-update-filtered-category") {
      updateFilteredMovementCategories();
      return;
    }

    if (action === "show-more-filtered-movements") {
      movementVisibleLimit += MOVEMENT_RENDER_BATCH_SIZE;
      render();
      return;
    }

    if (action === "refresh-investments") {
      refreshInvestmentQuotes();
      return;
    }

    if (action === "toggle-panel") {
      const panelId = event.target.closest("[data-panel-id]")?.dataset.panelId;
      if (!panelId) {
        return;
      }

      const panel = document.getElementById(panelId);
      const toggleButton = event.target.closest("[data-panel-id]");
      if (!panel || !toggleButton) {
        return;
      }

      const collapsed = panel.classList.toggle("panel-collapsed");
      toggleButton.setAttribute("aria-expanded", String(!collapsed));
      return;
    }

    if (action === "logout") {
      (async () => {
        sessionStorage.removeItem(LOGIN_SESSION_KEY);
        if (isSupabaseEnabled()) {
          try {
            await supabaseClient.auth.signOut();
          } catch (error) {
            console.error("Errore logout Supabase", error);
          }
          supabaseSession = null;
        }
        els.loginError.textContent = "";
        els.registerError.textContent = "";
        els.registerSuccess.textContent = "";
        await applyAuthState();
      })();
      return;
    }

    const filterCategory = event.target.closest("[data-category-filter]")?.dataset.categoryFilter;
    if (filterCategory) {
      activeCategoryFilter = filterCategory;
      render();
      document.getElementById("movement-archive")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const id = event.target.closest("[data-id]")?.dataset.id;
    if (!id) {
      return;
    }

    if (action === "delete-income") {
      getSelectedMonth().incomes = getSelectedMonth().incomes.filter((item) => item.id !== id);
    }

    if (action === "delete-bill") {
      getSelectedMonth().bills = getSelectedMonth().bills.filter((item) => item.id !== id);
    }

    if (action === "delete-category") {
      getSelectedMonth().categoryBudgets = getSelectedMonth().categoryBudgets.filter((item) => item.id !== id);
    }

      if (action === "delete-transaction") {
        const transactionToDelete = findTransactionById(id);
        await deleteRemoteBankTransactionLink(transactionToDelete);
        state.months.forEach((month) => {
          month.transactions = month.transactions.filter((item) => item.id !== id);
        });
      }

    if (action === "delete-saving-goal") {
      state.savingsGoals = state.savingsGoals.filter((item) => item.id !== id);
    }

    if (action === "delete-debt-goal") {
      state.debtGoals = state.debtGoals.filter((item) => item.id !== id);
    }

      saveState();
      render();
    };

    run().catch((error) => {
      console.error("Errore gestione azione UI", error);
    });
  });
}

function isAuthenticated() {
  if (isSupabaseEnabled()) {
    return Boolean(supabaseSession?.user);
  }
  const username = getCurrentUsername();
  return Boolean(username && getAccounts()[username]);
}

async function applyAuthState() {
  const authenticated = isAuthenticated();
  els.pageShell.classList.toggle("hidden-shell", !authenticated);
  els.loginScreen.classList.toggle("hidden-login", authenticated);
  els.pageShell.hidden = !authenticated;
  els.loginScreen.hidden = authenticated;
  els.pageShell.style.display = authenticated ? "grid" : "none";
  els.loginScreen.style.display = authenticated ? "none" : "grid";
  document.body.classList.toggle("auth-screen", !authenticated);

  if (!authenticated) {
    state = createDefaultState();
    hasPlayedDashboardSlotAnimation = false;
    activeCategoryFilter = "";
    setSidebarOpen(false);
    clearChartZoom();
    movementFilter = createDefaultMovementFilter();
    if (els.currentUsername) {
      els.currentUsername.textContent = "";
    }
    els.loginForm.reset();
    els.registerForm.reset();
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return;
  }

  state = await loadState();
  activeCategoryFilter = "";
  clearChartZoom();
  movementFilter = createDefaultMovementFilter();
  if (els.currentUsername) {
    els.currentUsername.textContent = getCurrentUsername();
  }
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  renderMonthOptions();
  populateForms();
  render();
}

function seedSampleData() {
  const seeded = migrateState(createDemoState());

  state = seeded;
  clearChartZoom();
  saveState();
  renderMonthOptions();
  populateForms();
  render();
}

function calculateMonthStats(month, carryoverActual = 0, carryoverBudget = 0, openingBalance = 0) {
  const incomeBudget = sum(month.incomes, "budget");
  const incomeActual = sum(month.incomes, "actual") + transactionTotal(month.transactions, "income");
  const billsBudget = sum(month.bills, "budget");
  const billsActual = sum(month.bills, "actual");
  const reservedCategoryRemaining = month.categoryBudgets.reduce((acc, category) => {
    const spent = month.transactions
      .filter((item) => item.type === "expense" && lowerText(item.category) === lowerText(category.name))
      .reduce((total, item) => total + item.amount, 0);
    return acc + Math.max(0, effectiveCategoryBudget(category, spent) - spent);
  }, 0);
  const expensesBudget = month.categoryBudgets.reduce((acc, category) => {
    const spent = month.transactions
      .filter((item) => item.type === "expense" && lowerText(item.category) === lowerText(category.name))
      .reduce((total, item) => total + item.amount, 0);
    return acc + effectiveCategoryBudget(category, spent);
  }, 0);
  const expensesActual = transactionTotal(month.transactions, "expense");
  const savingsActual = transactionTotal(month.transactions, "saving");
  const debtActual = transactionTotal(month.transactions, "debt");
  const reservedBillsRemaining = Math.max(0, billsBudget - billsActual);
  const reservedPlannedRemaining = reservedCategoryRemaining + reservedBillsRemaining;
  const plannedOut = billsBudget + expensesBudget;
  const actualOut = billsActual + expensesActual + savingsActual + debtActual;
  const availableBudget = openingBalance + carryoverBudget + incomeBudget;
  const availableActual = openingBalance + carryoverActual + incomeActual;
  const monthTotalBudget = carryoverBudget + incomeBudget;
  const monthTotalActual = carryoverActual + incomeActual;
  const leftBudget = carryoverBudget + incomeBudget - plannedOut;
  const leftActual = carryoverActual + incomeActual - actualOut;
  const freeToSpendActual = availableActual - actualOut - reservedPlannedRemaining;
  const totalAfterBudget = availableBudget - plannedOut;
  const totalAfterActual = availableActual - actualOut;
  const carryoverNextBudget = Math.max(0, leftBudget);
  const carryoverNextActual = Math.max(0, leftActual);

  return {
    openingBalance,
    carryoverActual,
    carryoverBudget,
    availableActual,
    availableBudget,
    monthTotalActual,
    monthTotalBudget,
    incomeBudget,
    incomeActual,
    billsBudget,
    billsActual,
    expensesBudget,
    expensesActual,
    savingsActual,
    debtActual,
    reservedCategoryRemaining,
    reservedBillsRemaining,
    reservedPlannedRemaining,
    plannedOut,
    actualOut,
    leftBudget,
    leftActual,
    freeToSpendActual,
    totalAfterBudget,
    totalAfterActual,
    carryoverNextBudget,
    carryoverNextActual,
  };
}

function buildMonthStatsMap() {
  const chronologicalMonths = getChronologicalMonths();
  const statsMap = new Map();
  let carryoverActual = 0;
  let carryoverBudget = 0;

  chronologicalMonths.forEach((month, index) => {
    const openingBalance = index === 0 ? state.profile.startBalance : 0;
    const stats = calculateMonthStats(month, carryoverActual, carryoverBudget, openingBalance);
    statsMap.set(monthKey(month), stats);

    carryoverActual = stats.carryoverNextActual;
    carryoverBudget = stats.carryoverNextBudget;
  });

  return statsMap;
}

function render() {
  renderMonthOptions();
  populateForms();

  const selectedMonth = getSelectedMonth();
  const statsMap = buildMonthStatsMap();
  const stats = statsMap.get(monthKey(selectedMonth));
  const annualStats = state.months.map((month) => ({
    month,
    stats: statsMap.get(monthKey(month)),
  }));

  renderSectionSafely("indicatori principali", els.kpiGrid, () => renderKpis(stats));
  renderSectionSafely("statistiche utili", els.runwayStats, () => renderRunwayStats(stats));
  renderSectionSafely("snapshot laterale", els.sidebarSnapshot, () => renderSidebar(annualStats));
  renderSectionSafely("panoramica annuale", els.annualCards, () => renderAnnualCards(annualStats));
  renderSectionSafely("grafici", els.budgetCharts, () => renderBudgetCharts(selectedMonth, stats));
  renderSectionSafely("categorie del mese", els.categoryList, () => renderCategoryList(selectedMonth, stats));
  renderSectionSafely("archivio movimenti", els.allMovementsList, () => renderAllMovements());
  renderSectionSafely("investimenti", els.investmentCards, () => renderInvestments());
  renderSectionSafely("obiettivi", null, () => renderGoals(), [els.savingGoalsList, els.debtGoalsList]);
  playDashboardSlotAnimation();
}

function renderSectionSafely(sectionName, target, renderFn, extraTargets = []) {
  try {
    renderFn();
  } catch (error) {
    console.error(`Errore render sezione: ${sectionName}`, error);
    const message = `
      <div class="empty-state">
        <p class="eyebrow">Errore sezione</p>
        <h4>${escapeHtml(sectionName)}</h4>
        <p class="list-meta">${escapeHtml(error?.message || "Errore sconosciuto")}</p>
      </div>
    `;

    if (target) {
      target.innerHTML = message;
    }

    extraTargets.forEach((node) => {
      if (node) {
        node.innerHTML = message;
      }
    });
  }
}

function playDashboardSlotAnimation() {
  if (hasPlayedDashboardSlotAnimation || !isAuthenticated()) {
    return;
  }

  const targets = [
    ...document.querySelectorAll("#kpiGrid strong, #sidebarSnapshot strong"),
  ].filter((element) => /\d/.test(element.textContent || ""));

  if (!targets.length) {
    return;
  }

  hasPlayedDashboardSlotAnimation = true;
  requestAnimationFrame(() => {
    targets.forEach((element, index) => {
      animateSlotNumber(element, index * 70);
    });
  });
}

function animateSlotNumber(element, delay = 0) {
  const finalText = element.textContent;
  if (!/\d/.test(finalText)) {
    return;
  }

  window.setTimeout(() => {
    const duration = 2800;
    const start = performance.now();
    element.classList.add("slot-animating");

    const frame = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      element.textContent = buildOdometerFrame(finalText, progress);

      if (progress < 1) {
        requestAnimationFrame(frame);
        return;
      }

      element.textContent = finalText;
      element.classList.remove("slot-animating");
    };

    requestAnimationFrame(frame);
  }, delay);
}

function buildOdometerFrame(finalText, progress) {
  const eased = 1 - Math.pow(1 - progress, 1.75);
  let digitIndex = 0;

  return [...finalText].map((char) => {
    if (!/\d/.test(char)) {
      return char;
    }

    const targetDigit = Number(char);
    const offset = digitIndex * 0.045;
    const localProgress = Math.max(0, Math.min(1, (eased - offset) / Math.max(0.28, 1 - offset)));
    const rotations = 8 - Math.min(4, digitIndex);
    const rollingValue = Math.round(localProgress * (rotations * 10 + targetDigit));
    digitIndex += 1;

    if (localProgress >= 1) {
      return String(targetDigit);
    }

    return String(rollingValue % 10);
  }).join("");
}

function renderKpis(stats) {
  const items = [
    { label: "Saldo disponibile", value: money(stats.leftActual), note: `left budget ${money(stats.leftBudget)}` },
    { label: "Disponibile libero", value: money(stats.freeToSpendActual), note: `accantonati ${money(stats.reservedPlannedRemaining)} - cassa reale ${money(stats.availableActual)}` },
    { label: "Rimanenze precedenti", value: money(stats.carryoverActual), note: `budget ${money(stats.carryoverBudget)}` },
    { label: "Entrate actual", value: money(stats.incomeActual), note: `budget ${money(stats.incomeBudget)}` },
    { label: "Entrate totali", value: money(stats.monthTotalActual), note: `budget ${money(stats.monthTotalBudget)}` },
    { label: "Uscite actual", value: money(stats.actualOut), note: `pianificate ${money(stats.plannedOut)}` },
    { label: "Savings + debt", value: money(stats.savingsActual + stats.debtActual), note: "progressi su obiettivi" },
  ];

  els.kpiGrid.innerHTML = items
    .map(
      (item) => `
        <article class="kpi-card">
          <p class="eyebrow">${item.label}</p>
          <strong>${item.value}</strong>
          <p class="list-meta">${item.note}</p>
        </article>
      `,
    )
    .join("");
}

function renderRunwayStats(stats) {
  const available = Math.max(0, Number(stats.freeToSpendActual || 0));
  const endDateValue = getResolvedRunwayEndDate();
  const endDate = new Date(`${endDateValue}T23:59:59`);
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const noSpendDays = Math.max(0, Number(runwayNoSpendDaysValue || 0));
  const projectedStartDate = new Date(startDate);
  projectedStartDate.setDate(projectedStartDate.getDate() + noSpendDays);
  const projectedTodayValue = toDateInputValue(projectedStartDate);
  const diffMs = endDate.getTime() - projectedStartDate.getTime();
  const totalDays = diffMs >= 0 ? Math.floor(diffMs / 86400000) + 1 : 0;
  const weekendDays = countWeekendDays(projectedStartDate, endDate);
  const weekendWindows = countWeekendWindows(projectedStartDate, endDate);
  const dailySpend = totalDays > 0 ? available / totalDays : 0;
  const weekendSpend = weekendDays > 0 ? available / weekendDays : 0;
  const weekendBudget = weekendWindows > 0 ? available / weekendWindows : 0;
  const configuredDailyBudget = Number(runwayDailyBudgetValue);
  const hasConfiguredDailyBudget = runwayDailyBudgetValue !== "" && !Number.isNaN(configuredDailyBudget) && configuredDailyBudget > 0;
  const effectiveDailyBudget = hasConfiguredDailyBudget ? Math.min(configuredDailyBudget, dailySpend) : dailySpend;
  const todaySpent = allMovementEntries()
    .filter((item) => item.type === "expense" && item.date === projectedTodayValue)
    .reduce((total, item) => total + Number(item.amount || 0), 0);
  const todayRemaining = Math.max(0, effectiveDailyBudget - todaySpent);
  const todayOverspend = Math.max(0, todaySpent - effectiveDailyBudget);
  const recoveryDays = effectiveDailyBudget > 0 && todayOverspend > 0 ? Math.ceil(todayOverspend / effectiveDailyBudget) : 0;
  const recoveryTomorrowBudget = Math.max(0, effectiveDailyBudget - todayOverspend);
  const relevantWeekend = getRelevantWeekendRange(projectedStartDate, endDate, projectedStartDate);
  const todayDay = projectedStartDate.getDay();
  const isTodayWeekend = todayDay === 5 || todayDay === 6 || todayDay === 0;
  const weekendSpentCurrent = relevantWeekend
    ? allMovementEntries()
        .filter((item) => item.type === "expense" && item.date >= relevantWeekend.start && item.date <= relevantWeekend.end)
        .reduce((total, item) => total + Number(item.amount || 0), 0)
    : 0;
  const weekendDaySpentCurrent = relevantWeekend && isTodayWeekend
    ? allMovementEntries()
        .filter((item) => item.type === "expense" && item.date === projectedTodayValue)
        .reduce((total, item) => total + Number(item.amount || 0), 0)
    : 0;
  const weekendRemaining = Math.max(0, weekendBudget - weekendSpentCurrent);
  const weekendOverspend = Math.max(0, weekendSpentCurrent - weekendBudget);
  const weekendDayRemaining = Math.max(0, weekendSpend - weekendDaySpentCurrent);
  const weekendDayOverspend = Math.max(0, weekendDaySpentCurrent - weekendSpend);
  const recoveryNote = recoveryDays > 0
    ? todayOverspend < effectiveDailyBudget
      ? `oppure domani spendi ${money(recoveryTomorrowBudget)} per rientrare subito nel limite giornaliero`
      : `non devi spendere per ${recoveryDays} giorni per rientrare nel budget giornaliero`
    : "nessuno sforamento sul giorno corrente";
  const weekendDayNote = weekendDays > 0
    ? isTodayWeekend
      ? weekendDayOverspend > 0
        ? `oggi hai sforato il budget weekend giornaliero di ${money(weekendDayOverspend)}`
        : `oggi nel budget weekend giornaliero restano ${money(weekendDayRemaining)} dopo aver speso ${money(weekendDaySpentCurrent)}`
      : `su ciascun giorno weekend puoi usare ${money(weekendSpend)}`
    : "nessun giorno weekend nel periodo";
  const weekendNote = weekendWindows > 0
    ? relevantWeekend
      ? weekendOverspend > 0
        ? `questo weekend hai sforato di ${money(weekendOverspend)} · ${weekendWindows} weekend nel periodo`
        : `questo weekend restano ${money(weekendRemaining)} dopo aver speso ${money(weekendSpentCurrent)}`
      : `${weekendWindows} weekend nel periodo · puoi usare ${money(weekendBudget)} per ciascun fine settimana`
    : "nessun weekend nel periodo";

  const items = [
    {
      label: "Soldi disponibili ora",
      value: money(available),
      note: "usa il totale disponibile del mese attivo",
    },
    {
      label: "Budget massimo al giorno",
      value: totalDays > 0 ? money(dailySpend) : "--",
      note: totalDays > 0
        ? `${totalDays} giorni dalla data proiettata${noSpendDays > 0 ? ` · proiezione avanti di ${noSpendDays} giorni` : ""}`
        : "scegli una data finale valida",
    },
    {
      label: "Limite giornaliero attivo",
      value: totalDays > 0 ? money(effectiveDailyBudget) : "--",
      note: hasConfiguredDailyBudget
        ? `fissato ${money(configuredDailyBudget)} - sostenibile max ${money(dailySpend)}`
        : "automatico dal disponibile libero",
    },
    {
      label: "Puoi spendere oggi",
      value: totalDays > 0 ? money(todayRemaining) : "--",
      note: noSpendDays > 0
        ? `nella data proiettata (${formatDate(projectedTodayValue)}) risultano spesi ${money(todaySpent)}`
        : `spesi oggi ${money(todaySpent)} sul limite giornaliero`,
    },
    {
      label: "Recupero sforamento",
      value: recoveryDays > 0 ? `${recoveryDays} giorni` : "In linea",
      note: recoveryNote,
    },
    {
      label: "Budget singolo giorno weekend",
      value: weekendDays > 0 ? money(weekendSpend) : "--",
      note: weekendDayNote,
    },
    {
      label: "Budget del fine settimana",
      value: weekendWindows > 0 ? money(weekendBudget) : "--",
      note: weekendNote,
    },
  ];

  els.runwayStats.innerHTML = items
    .map(
      (item) => `
        <article class="kpi-card">
          <p class="eyebrow">${item.label}</p>
          <strong>${item.value}</strong>
          <p class="list-meta">${item.note}</p>
        </article>
      `,
    )
    .join("");
}

function renderSidebar(annualStats) {
  const totals = annualStats.reduce(
    (acc, entry) => {
      acc.income += entry.stats.incomeActual;
      acc.out += entry.stats.actualOut;
      acc.savings += entry.stats.savingsActual;
      return acc;
    },
    { income: 0, out: 0, savings: 0 },
  );

  const activeMonth = getSelectedMonth();
  els.sidebarSnapshot.innerHTML = `
    <div class="mini-stat">
      <span class="label-small">Mese attivo</span>
      <strong>${activeMonth.name} ${activeMonth.year}</strong>
    </div>
    <div class="mini-stat">
      <span class="label-small">Rimanenze mese</span>
      <strong>${money(annualStats.find((entry) => monthKey(entry.month) === monthKey(activeMonth))?.stats.carryoverActual || 0)}</strong>
    </div>
    <div class="mini-stat">
      <span class="label-small">Entrate anno</span>
      <strong>${money(totals.income)}</strong>
    </div>
    <div class="mini-stat">
      <span class="label-small">Uscite anno</span>
      <strong>${money(totals.out)}</strong>
    </div>
    <div class="mini-stat">
      <span class="label-small">Risparmi anno</span>
      <strong>${money(totals.savings)}</strong>
    </div>
  `;
}

function renderAnnualCards(annualStats) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIndex = today.getMonth();
  const filteredStats = annualStats
    .filter(({ month }) => {
      if (annualYearFilter !== "all" && String(month.year) !== String(annualYearFilter)) {
        return false;
      }

      if (month.year === currentYear && month.id > currentMonthIndex) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (a.month.year !== b.month.year) {
        return a.month.year - b.month.year;
      }
      return a.month.id - b.month.id;
    });

  els.annualCards.innerHTML = filteredStats
    .map(({ month, stats }, index) => {
      const progress = stats.incomeActual > 0 ? Math.min(100, (stats.actualOut / stats.incomeActual) * 100) : 0;
      const leftoverClass = stats.leftActual >= 0 ? "positive" : "negative";

      return `
        <article class="month-card">
          <h4>${month.name} ${month.year}</h4>
          <div class="mini-grid">
            <div>
              <span class="list-meta">Rimanenze prec.</span>
              <strong>${money(stats.carryoverActual)}</strong>
            </div>
            <div>
              <span class="list-meta">Entrate</span>
              <strong>${money(stats.incomeActual)}</strong>
            </div>
            <div>
              <span class="list-meta">Uscite</span>
              <strong>${money(stats.actualOut)}</strong>
            </div>
          </div>
          <div class="month-bar"><span style="width:${progress}%"></span></div>
          <div class="mini-grid">
            <div>
              <span class="list-meta">Budget spese</span>
              <strong>${money(stats.expensesBudget + stats.billsBudget)}</strong>
            </div>
            <div>
              <span class="list-meta">Left</span>
              <strong class="${leftoverClass}">${money(stats.leftActual)}</strong>
            </div>
          </div>
          <div class="hero-actions">
            <button class="secondary" onclick="selectMonth('${monthKey(month)}')">Apri mese</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderBudgetCharts(month, stats) {
  if (chartScope === "year") {
    renderRangeBudgetChart(buildYearChartContext(Number(getResolvedChartYearValue())));
    return;
  }

  if (chartScope === "custom") {
    renderRangeBudgetChart(buildCustomChartContext());
    return;
  }

  const carryoverStart = Number(stats?.carryoverActual || 0);
  const monthEvents = buildMonthlyChartEvents(month, carryoverStart);
  const expenses = month.transactions
    .filter((item) => item.type === "expense")
    .sort((a, b) => {
      const aKey = `${a.date} ${a.time || "00:00"}`;
      const bKey = `${b.date} ${b.time || "00:00"}`;
      return aKey.localeCompare(bKey);
    });

  if (!monthEvents.length && carryoverStart === 0) {
    els.budgetCharts.innerHTML = emptyStateTemplate.innerHTML;
    return;
  }

  const chartModel = {
    name: "Andamento netto",
    startValue: carryoverStart,
    currentNet: monthEvents[monthEvents.length - 1]?.valueAfter ?? carryoverStart,
    totalIncome: monthEvents.filter((item) => item.amount > 0).reduce((acc, item) => acc + item.amount, 0),
    totalOut: monthEvents.filter((item) => item.amount < 0).reduce((acc, item) => acc + Math.abs(item.amount), 0),
    dots: monthEvents,
    minValue: Math.min(0, carryoverStart, ...monthEvents.map((item) => item.valueAfter)),
  };
  const categoryBreakdown = buildCategoryBreakdown(expenses);
  const zoomRange = getChartZoomForMonth(month) || getBaseChartRange(month);

  els.budgetCharts.innerHTML = `
    <article class="chart-card">
      <div class="chart-top">
        <h4>Andamento netto</h4>
        <strong>${money(chartModel.currentNet)}</strong>
      </div>
      <p class="chart-meta">Parte dalla rimanenza del mese scorso, sale con le entrate e scende con uscite, bills, risparmi e debiti.</p>
      ${renderCartesianChart(chartModel, month, zoomRange)}
      <p class="chart-focus-note">
        ${chartView === "day"
          ? `Vista giornaliera: ${formatChartDayHeader(getResolvedChartDayValue(month))}. Lo zoom arriva fino a intervalli di 30 minuti.`
          : chartView === "period"
            ? `Vista periodo: ${formatDateTimeValue(getResolvedChartPeriodValues(month).start)} - ${formatDateTimeValue(getResolvedChartPeriodValues(month).end)}.`
          : `Vista mensile: ${month.name} ${month.year}, fino a ${formatPositionLabel(zoomRange.endPosition, false)}.`}
      </p>
      <div class="chart-stats">
        <p>Base iniziale: <strong>${money(chartModel.startValue)}</strong></p>
        <p>Entrate: <strong>${money(chartModel.totalIncome)}</strong></p>
        <p>Uscite: <strong>${money(chartModel.totalOut)}</strong></p>
        <p>Netto: <strong>${money(chartModel.currentNet)}</strong></p>
      </div>
    </article>
    ${renderCategoryPieCard(categoryBreakdown, `Spese per categoria · ${month.name} ${month.year}`)}
  `;

  bindChartInteractions(month);
  bindPieInteractions();
}

function buildMonthlyChartEvents(month, initialValue = 0) {
  const incomeEvents = (month.incomes || [])
    .filter((item) => Number(item.actual || 0) !== 0)
    .map((item, incomeIndex) => ({
      date: item.date || getDefaultEntryDate(month),
      time: item.time || `08:${String(incomeIndex).padStart(2, "0")}`,
      amount: Number(item.actual || 0),
      direction: "income",
      type: "income",
      category: "Entrate",
      note: item.name || "Entrata",
      label: `${month.name} ${month.year} - Entrata ${item.name || "senza nome"} - ${money(Number(item.actual || 0))}`,
    }));

  const billEvents = (month.bills || [])
    .filter((item) => Number(item.actual || 0) !== 0)
    .map((item, billIndex) => ({
      date: `${month.year}-${String(month.id + 1).padStart(2, "0")}-${String(Math.max(1, Number(item.dueDay || 1))).padStart(2, "0")}`,
      time: `07:${String(billIndex).padStart(2, "0")}`,
      amount: -Math.abs(Number(item.actual || 0)),
      direction: "expense",
      type: "bill",
      category: "Bills",
      note: item.name || "Bill",
      label: `${month.name} ${month.year} - Bill ${item.name || "senza nome"} - ${money(Math.abs(Number(item.actual || 0)))}`,
    }));

  const transactionEvents = (month.transactions || []).map((item) => {
    const isPositive = item.type === "income";
    const amount = isPositive ? Math.abs(Number(item.amount || 0)) : -Math.abs(Number(item.amount || 0));
    return {
      date: item.date,
      time: item.time || "12:00",
      amount,
      direction: isPositive ? "income" : "expense",
      type: item.type,
      category: item.category,
      note: item.note || "Movimento",
      label: `${formatDateTime(item)} - ${typeLabel(item.type)} - ${item.category} - ${item.note || "Movimento"} - ${money(Math.abs(Number(item.amount || 0)))}`,
    };
  });

  const allEvents = [...incomeEvents, ...billEvents, ...transactionEvents].sort((a, b) => {
    const aKey = `${a.date} ${a.time || "00:00"}`;
    const bKey = `${b.date} ${b.time || "00:00"}`;
    return aKey.localeCompare(bKey);
  });

  let runningNet = Number(initialValue || 0);
  return allEvents.map((event) => {
    runningNet += event.amount;
    const day = new Date(event.date).getDate();
    return {
      ...event,
      day,
      timePosition: getTimePosition(day, event.time || ""),
      valueAfter: runningNet,
    };
  });
}

function buildYearChartContext(year) {
  const today = new Date();
  const isCurrentYear = today.getFullYear() === year;
  const start = `${year}-01-01T00:00`;
  const end = isCurrentYear
    ? `${toDateInputValue(today)}T23:30`
    : `${year}-12-31T23:30`;
  return buildRangeChartContext(start, end, `Anno ${year}`, "Base grafico: somma dei budget dei mesi inclusi nell'anno.");
}

function buildCustomChartContext() {
  const selected = getResolvedChartPeriodValues(getSelectedMonth());
  return buildRangeChartContext(
    selected.start,
    selected.end,
    "Periodo personalizzato",
    "Base grafico: somma dei budget dei mesi toccati dal periodo selezionato.",
  );
}

function buildRangeChartContext(startValue, endValue, title, budgetNote) {
  const startDate = new Date(startValue);
  const endDate = new Date(endValue);
  const safeEndDate = endDate >= startDate ? endDate : startDate;
  const startMs = startDate.getTime();
  const endMs = safeEndDate.getTime();
  const chronologicalMonths = getChronologicalMonths();
  const expenses = state.months
    .flatMap((month) => month.transactions)
    .filter((item) => item.type === "expense")
    .filter((item) => {
      const value = new Date(`${item.date}T${item.time || "00:00"}`).getTime();
      return value >= startMs && value <= endMs;
    })
    .sort((a, b) => {
      const aKey = `${a.date} ${a.time || "00:00"}`;
      const bKey = `${b.date} ${b.time || "00:00"}`;
      return aKey.localeCompare(bKey);
    });

  const touchedMonths = state.months.filter((month) => {
    const monthStart = new Date(month.year, month.id, 1).getTime();
    const monthEnd = new Date(month.year, month.id + 1, 0, 23, 59, 59).getTime();
    return monthEnd >= startMs && monthStart <= endMs;
  });

  const totalSpent = expenses.reduce((acc, item) => acc + item.amount, 0);
  const totalBudgetFromCategories = touchedMonths.reduce((acc, monthEntry) => {
    return acc + monthEntry.categoryBudgets.reduce((monthAcc, item) => {
      const spent = monthEntry.transactions
        .filter((tx) => tx.type === "expense" && lowerText(tx.category) === lowerText(item.name))
        .reduce((sumSpent, tx) => sumSpent + tx.amount, 0);
      return monthAcc + effectiveCategoryBudget(item, spent);
    }, 0);
  }, 0);
  const visualBudget = totalBudgetFromCategories > 0 ? totalBudgetFromCategories : Math.ceil((totalSpent * 1.12) / 10) * 10 || totalSpent;
  const allEvents = chronologicalMonths.flatMap((monthEntry) => {
    const plannedIncomeEvents = (monthEntry.incomes || [])
      .filter((item) => Number(item.actual || 0) !== 0)
      .map((item, incomeIndex) => ({
        timestamp: new Date(`${item.date || getDefaultEntryDate(monthEntry)}T${item.time || `08:${String(incomeIndex).padStart(2, "0")}`}`).getTime(),
        amount: Number(item.actual || 0),
        direction: "income",
        label: `${monthEntry.name} ${monthEntry.year} - Entrata ${item.name || "senza nome"} - ${money(Number(item.actual || 0))}`,
      }));
    const billEvents = (monthEntry.bills || [])
      .filter((item) => Number(item.actual || 0) !== 0)
      .map((item, billIndex) => ({
        timestamp: new Date(monthEntry.year, monthEntry.id, Math.max(1, Number(item.dueDay || 1)), 7, billIndex, 0).getTime(),
        amount: -Math.abs(Number(item.actual || 0)),
        direction: "expense",
        label: `${monthEntry.name} ${monthEntry.year} - Bill ${item.name || "senza nome"} - ${money(Math.abs(Number(item.actual || 0)))}`,
      }));
    const transactionEvents = (monthEntry.transactions || []).map((item, transactionIndex) => {
      const isPositive = item.type === "income";
      const amount = isPositive ? Math.abs(Number(item.amount || 0)) : -Math.abs(Number(item.amount || 0));
      const timestamp = new Date(`${item.date}T${item.time || "12:00"}`).getTime() + transactionIndex;
      return {
        timestamp,
        amount,
        direction: isPositive ? "income" : "expense",
        label: `${formatDateTime(item)} - ${typeLabel(item.type)} - ${item.category} - ${item.note || "Movimento"} - ${money(Math.abs(Number(item.amount || 0)))}`,
      };
    });

    return [...plannedIncomeEvents, ...billEvents, ...transactionEvents];
  }).sort((a, b) => {
    if (a.timestamp !== b.timestamp) {
      return a.timestamp - b.timestamp;
    }
    return b.amount - a.amount;
  });

  let runningBalance = 0;
  const dots = [];
  let totalIncome = 0;
  let totalOut = 0;

  allEvents.forEach((event) => {
    if (event.timestamp < startMs || event.timestamp > endMs) {
      return;
    }

    runningBalance += event.amount;
    if (event.amount >= 0) {
      totalIncome += event.amount;
    } else {
      totalOut += Math.abs(event.amount);
    }
    dots.push({
      timestamp: event.timestamp,
      label: event.label,
      balanceAfter: runningBalance,
      direction: event.direction,
      amount: event.amount,
    });
  });

  return {
    title,
    budgetNote,
    startDate,
    endDate: safeEndDate,
    startBalance: 0,
    visualBudget,
    totalSpent,
    totalIncome,
    totalOut,
    remaining: runningBalance,
    isEstimatedBudget: totalBudgetFromCategories <= 0,
    categoryBreakdown: buildCategoryBreakdown(expenses),
    dots,
  };
}

function renderRangeBudgetChart(context) {
  if (!context.dots.length) {
    els.budgetCharts.innerHTML = emptyStateTemplate.innerHTML;
    return;
  }

  const width = 1100;
  const height = 420;
  const padding = { top: 24, right: 28, bottom: 54, left: 72 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const startMs = context.startDate.getTime();
  const endMs = context.endDate.getTime();
  const spanMs = Math.max(1, endMs - startMs);
  const balanceValues = [context.startBalance, ...context.dots.map((dot) => dot.balanceAfter)];
  const maxY = Math.max(...balanceValues, 1);
  const minY = Math.min(...balanceValues, 0);
  const xForMs = (value) => padding.left + ((value - startMs) / spanMs) * chartWidth;
  const yForValue = (value) => {
    const span = Math.max(1, maxY - minY);
    return padding.top + (1 - ((value - minY) / span)) * chartHeight;
  };
  const points = [
    { timestamp: startMs, remaining: context.startBalance, label: `Inizio periodo - ${money(context.startBalance)}` },
    ...context.dots.map((dot) => ({
      timestamp: dot.timestamp,
      remaining: dot.balanceAfter,
      label: dot.label,
    })),
    { timestamp: endMs, remaining: context.dots[context.dots.length - 1].balanceAfter, label: `Fine periodo - ${money(context.remaining)}` },
  ];
  const linePoints = points.map((point) => `${xForMs(point.timestamp)},${yForValue(point.remaining)}`).join(" ");
  const areaPoints = [
    `${xForMs(points[0].timestamp)},${yForValue(minY)}`,
    ...points.map((point) => `${xForMs(point.timestamp)},${yForValue(point.remaining)}`),
    `${xForMs(points[points.length - 1].timestamp)},${yForValue(minY)}`,
  ].join(" ");
  const yTicks = [minY, minY + ((maxY - minY) / 2), maxY];
  const xTicks = buildRangeChartTicks(context.startDate, context.endDate);

  els.budgetCharts.innerHTML = `
    <article class="chart-card">
      <div class="chart-top">
        <h4>${context.title}</h4>
        <strong>${money(context.remaining)}</strong>
      </div>
      <p class="chart-meta">Grafico netto del periodo: parte da zero, sale con le entrate e scende con uscite, bills, risparmi e debiti.</p>
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafico ${escapeAttribute(context.title)}">
        ${yTicks
          .map((tick) => {
            const y = yForValue(tick);
            return `
              <line class="chart-grid-line" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}"></line>
              <text class="chart-value-label" x="${padding.left - 8}" y="${y + 4}" text-anchor="end">${shortMoney(tick)}</text>
            `;
          })
          .join("")}
        <line class="chart-axis" x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartHeight}"></line>
        <line class="chart-axis" x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${width - padding.right}" y2="${padding.top + chartHeight}"></line>
        <polygon class="chart-area" points="${areaPoints}"></polygon>
        <polyline class="chart-line" points="${linePoints}"></polyline>
        ${context.dots
          .map(
            (dot) => `
              <circle class="chart-point ${dot.direction === "income" ? "income-point" : "movement-point"}" cx="${xForMs(dot.timestamp)}" cy="${yForValue(dot.balanceAfter)}" r="4.5">
                <title>${escapeAttribute(`${dot.label} · saldo dopo movimento ${money(dot.balanceAfter)}`)}</title>
              </circle>
            `,
          )
          .join("")}
        ${xTicks
          .map(
            (tick) => `
              <text class="chart-day-label" x="${xForMs(tick.timestamp)}" y="${height - 10}" text-anchor="middle">${tick.label}</text>
            `,
          )
          .join("")}
        <text class="chart-axis-label" x="${width / 2}" y="${height - 2}" text-anchor="middle">Giorni del periodo</text>
        <text class="chart-axis-label" x="14" y="${height / 2}" text-anchor="middle" transform="rotate(-90 14 ${height / 2})">Saldo disponibile</text>
      </svg>
      <p class="chart-focus-note">
        Vista periodo: ${formatDateTimeValue(toDateTimeLocal(context.startDate))} - ${formatDateTimeValue(toDateTimeLocal(context.endDate))}.
      </p>
      <div class="chart-stats">
        <p>Entrate: <strong>${money(context.totalIncome)}</strong></p>
        <p>Uscite: <strong>${money(context.totalOut)}</strong></p>
        <p>Netto periodo: <strong>${money(context.remaining)}</strong></p>
      </div>
    </article>
    ${renderCategoryPieCard(context.categoryBreakdown, `Spese per categoria · ${context.title}`)}
  `;

  bindChartHoverCard();
  bindPieInteractions();
}

function buildCategoryBreakdown(expenses) {
  const totals = new Map();
  expenses.forEach((item) => {
    const key = String(item.category || "Senza categoria").trim() || "Senza categoria";
    const current = totals.get(key) || { total: 0, transactions: [] };
    current.total += Number(item.amount || 0);
    current.transactions.push(item);
    totals.set(key, current);
  });

  const grandTotal = [...totals.values()].reduce((acc, value) => acc + value.total, 0);
  return [...totals.entries()]
    .map(([name, entry]) => ({
      name,
      total: entry.total,
      ratio: grandTotal > 0 ? entry.total / grandTotal : 0,
      transactions: [...entry.transactions].sort((a, b) => {
        const aKey = `${a.date} ${a.time || "00:00"}`;
        const bKey = `${b.date} ${b.time || "00:00"}`;
        return aKey.localeCompare(bKey);
      }),
    }))
    .sort((a, b) => b.total - a.total);
}

function renderCategoryPieCard(items, title) {
  if (!items.length) {
    return "";
  }

  const keyedItems = items.map((item, index) => ({ ...item, key: `pie-${index}` }));
  const pie = renderCategoryPieChart(keyedItems);
  return `
    <article class="chart-card pie-card">
      <div class="chart-top">
        <h4>${title}</h4>
        <strong>${money(keyedItems.reduce((acc, item) => acc + item.total, 0))}</strong>
      </div>
      <p class="chart-meta">Passa sulle fette per vedere categoria, importo e peso sul totale.</p>
      <div class="pie-layout">
        ${pie}
      </div>
      <div class="pie-legend pie-legend-horizontal">
        ${keyedItems
          .map(
            (item, index) => `
              <button class="pie-legend-row pie-legend-button pie-legend-chip" type="button" data-pie-legend-key="${item.key}">
                <span class="pie-swatch" style="background:${getPieColor(index)}"></span>
                <div>
                  <strong>${item.name}</strong>
                  <p>${money(item.total)} · ${(item.ratio * 100).toFixed(1)}%</p>
                </div>
              </button>
            `,
          )
          .join("")}
      </div>
      <div class="pie-hover-card" data-pie-tooltip hidden></div>
      <script type="application/json" class="pie-data-json">${escapeHtml(JSON.stringify(keyedItems.map((item) => ({
        key: item.key,
        name: item.name,
        total: item.total,
        ratio: item.ratio,
        transactions: item.transactions,
      }))))}</script>
    </article>
  `;
}

function renderCategoryPieChart(items) {
  const size = 320;
  const radius = 110;
  const center = size / 2;
  let angle = 0;

  const slices = items
    .map((item, index) => {
      const startAngle = angle;
      const sliceAngle = Math.max(0, item.ratio * Math.PI * 2);
      const endAngle = startAngle + sliceAngle;
      const path = describePieSlice(center, center, radius, startAngle, endAngle);
      angle = endAngle;
      return `
        <path class="pie-slice${index === 0 ? " active" : ""}" d="${path}" fill="${getPieColor(index)}" data-pie-key="${item.key}" data-pie-category="${escapeAttribute(item.name)}">
          <title>${escapeAttribute(`${item.name} · ${money(item.total)} · ${(item.ratio * 100).toFixed(1)}%`)}</title>
        </path>
      `;
    })
    .join("");

  return `
    <svg class="pie-chart-svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Grafico a torta spese per categoria">
      ${slices}
      <circle class="pie-hole" cx="${center}" cy="${center}" r="44"></circle>
      <text class="pie-center-label" x="${center}" y="${center - 4}" text-anchor="middle">Categorie</text>
      <text class="pie-center-sub" x="${center}" y="${center + 16}" text-anchor="middle">${items.length}</text>
    </svg>
  `;
}

function getPieColor(index) {
  const palette = ["#d66b3d", "#5bb59e", "#2f4858", "#f0b44c", "#c16e70", "#7b8cde", "#6f9d4d", "#d98fb3", "#7f6d5f", "#3ba0c9"];
  return palette[index % palette.length];
}

function polarToCartesian(centerX, centerY, radius, angleInRadians) {
  const adjustedAngle = angleInRadians - (Math.PI / 2);
  return {
    x: centerX + radius * Math.cos(adjustedAngle),
    y: centerY + radius * Math.sin(adjustedAngle),
  };
}

function describePieSlice(centerX, centerY, radius, startAngle, endAngle) {
  const boundedEndAngle = Math.min(endAngle, startAngle + (Math.PI * 2) - 0.0001);
  const start = polarToCartesian(centerX, centerY, radius, startAngle);
  const end = polarToCartesian(centerX, centerY, radius, boundedEndAngle);
  const largeArcFlag = boundedEndAngle - startAngle > Math.PI ? 1 : 0;
  return [
    `M ${centerX} ${centerY}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function getCategoryInsight(item) {
  const dayTotals = new Map();
  item.transactions.forEach((transaction) => {
    dayTotals.set(transaction.date, (dayTotals.get(transaction.date) || 0) + Number(transaction.amount || 0));
  });
  const biggestDayEntry = [...dayTotals.entries()].sort((a, b) => b[1] - a[1])[0] || [item.transactions[0]?.date || "", 0];
  const biggestTransaction = [...item.transactions].sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))[0];

  return {
    name: item.name,
    total: item.total,
    ratio: item.ratio,
    biggestDayDate: biggestDayEntry[0],
    biggestDayTotal: biggestDayEntry[1],
    biggestTransaction,
  };
}

function renderCategoryInsight(detail) {
  if (!detail) {
    return "";
  }

  return `
    <p class="eyebrow">Dettaglio categoria</p>
    <h5>${detail.name}</h5>
    <div class="pie-insight-grid">
      <div class="mini-stat">
        <span class="label-small">Totale categoria</span>
        <strong>${money(detail.total)}</strong>
        <p class="list-meta">${(Number(detail.ratio || 0) * 100).toFixed(1)}% del totale</p>
      </div>
      <div class="mini-stat">
        <span class="label-small">Giorno piu pesante</span>
        <strong>${detail.biggestDayDate ? formatDate(detail.biggestDayDate) : "--"}</strong>
        <p class="list-meta">${money(detail.biggestDayTotal)}</p>
      </div>
      <div class="mini-stat">
        <span class="label-small">Spesa singola piu grande</span>
        <strong>${detail.biggestTransaction ? money(detail.biggestTransaction.amount) : "--"}</strong>
        <p class="list-meta">${detail.biggestTransaction ? `${formatDateTime(detail.biggestTransaction)} · ${detail.biggestTransaction.note || "Movimento"}` : "Nessun movimento"}</p>
      </div>
    </div>
  `;
}

function bindPieInteractions() {
  els.budgetCharts.querySelectorAll(".pie-card").forEach((card) => {
    const raw = card.querySelector(".pie-data-json")?.textContent || "[]";
    let items = [];
    try {
      items = JSON.parse(raw);
    } catch (error) {
      console.error("Errore pie data", error);
      return;
    }

    const tooltip = card.querySelector("[data-pie-tooltip]");
    if (!tooltip) {
      return;
    }

    const setActiveCategory = (key) => {
      const selected = items.find((item) => item.key === key) || items[0];
      if (!selected) {
        return;
      }

      card.querySelectorAll(".pie-slice[data-pie-key]").forEach((node) => {
        node.classList.toggle("active", node.dataset.pieKey === selected.key);
      });
      card.querySelectorAll("[data-pie-legend-key]").forEach((node) => {
        node.classList.toggle("active", node.dataset.pieLegendKey === selected.key);
      });
      tooltip.innerHTML = renderCategoryInsight(getCategoryInsight(selected));
    };

    const placeTooltip = (event) => {
      const rect = card.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      const tooltipWidth = 290;
      const tooltipHeight = 210;
      const left = Math.min(Math.max(16, offsetX + 18), Math.max(16, rect.width - tooltipWidth - 16));
      const top = Math.min(Math.max(16, offsetY - 24), Math.max(16, rect.height - tooltipHeight - 16));
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    const placeTooltipFromSlice = (sliceNode) => {
      if (!sliceNode) {
        return;
      }
      const cardRect = card.getBoundingClientRect();
      const sliceRect = sliceNode.getBoundingClientRect();
      const fakeEvent = {
        clientX: sliceRect.left + (sliceRect.width / 2),
        clientY: sliceRect.top + (sliceRect.height / 2),
      };
      if (cardRect.width > 0 && cardRect.height > 0) {
        placeTooltip(fakeEvent);
      }
    };

    const showTooltip = (categoryName, event) => {
      setActiveCategory(categoryName);
      tooltip.hidden = false;
      if (event) {
        placeTooltip(event);
      }
    };

    const hideTooltip = () => {
      tooltip.hidden = true;
      card.querySelectorAll(".pie-slice[data-pie-key]").forEach((node) => {
        node.classList.remove("active");
      });
      card.querySelectorAll("[data-pie-legend-key]").forEach((node) => {
        node.classList.remove("active");
      });
    };

    card.querySelectorAll(".pie-slice[data-pie-key]").forEach((node) => {
      node.addEventListener("mouseenter", (event) => {
        showTooltip(node.dataset.pieKey || "", event);
      });
      node.addEventListener("mousemove", (event) => {
        if (!tooltip.hidden) {
          placeTooltip(event);
        }
      });
      node.addEventListener("mouseleave", hideTooltip);
      node.addEventListener("focus", () => {
        showTooltip(node.dataset.pieKey || "");
      });
      node.addEventListener("blur", hideTooltip);
    });

    card.querySelectorAll("[data-pie-legend-key]").forEach((node) => {
      node.addEventListener("click", () => {
        const key = node.dataset.pieLegendKey || "";
        const sliceNode = [...card.querySelectorAll(".pie-slice[data-pie-key]")].find(
          (slice) => slice.dataset.pieKey === key,
        );
        setActiveCategory(key);
        tooltip.hidden = false;
        placeTooltipFromSlice(sliceNode);
      });
    });
  });
}

function buildRangeChartTicks(startDate, endDate) {
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  const totalDays = Math.max(1, Math.ceil((endMs - startMs) / 86400000));
  const stepDays = totalDays <= 14 ? 1 : totalDays <= 45 ? 3 : totalDays <= 120 ? 7 : 30;
  const ticks = [];
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const last = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  while (cursor <= last) {
    ticks.push({
      timestamp: cursor.getTime(),
      label: totalDays > 120
        ? new Intl.DateTimeFormat("it-IT", { month: "short", year: "2-digit" }).format(cursor)
        : new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit" }).format(cursor),
    });
    cursor.setDate(cursor.getDate() + stepDays);
  }

  if (!ticks.length || ticks[ticks.length - 1].timestamp !== last.getTime()) {
    ticks.push({
      timestamp: last.getTime(),
      label: totalDays > 120
        ? new Intl.DateTimeFormat("it-IT", { month: "short", year: "2-digit" }).format(last)
        : new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit" }).format(last),
    });
  }

  return ticks;
}

function renderCartesianChart(item, month, zoomRange) {
  const width = 1100;
  const height = 420;
  const padding = { top: 24, right: 28, bottom: 54, left: 72 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const daysInMonth = new Date(month.year, month.id + 1, 0).getDate();
  const startDay = zoomRange?.startDay || 1;
  const endDay = zoomRange?.endDay || daysInMonth;
  const startPosition = zoomRange?.startPosition ?? startDay;
  const endPosition = zoomRange?.endPosition ?? (endDay + 0.999);
  const points = buildChartPoints(item, month, zoomRange);
  const visibleDots = item.dots.filter((dot) => dot.timePosition >= startPosition && dot.timePosition <= endPosition);

  const maxY = Math.max(item.budget || 0, item.startValue || 0, ...points.map((point) => point.remaining), 1);
  const minY = Math.min(item.minValue || 0, item.startValue || 0, ...points.map((point) => point.remaining), 0);
  const xForPosition = (position) => padding.left + ((position - startPosition) / Math.max(0.001, endPosition - startPosition)) * chartWidth;
  const yForValue = (value) => {
    const span = Math.max(1, maxY - minY);
    return padding.top + (1 - ((value - minY) / span)) * chartHeight;
  };
  const yForLinePosition = (position) => {
    const beforeIndex = points.findLastIndex((point) => point.position <= position);
    const afterIndex = points.findIndex((point) => point.position >= position);

    if (beforeIndex === -1 && afterIndex === -1) {
      return yForValue(points[0]?.remaining ?? item.startValue ?? item.budget ?? 0);
    }
    if (beforeIndex === -1) {
      return yForValue(points[afterIndex].remaining);
    }
    if (afterIndex === -1) {
      return yForValue(points[beforeIndex].remaining);
    }

    const beforePoint = points[beforeIndex];
    const afterPoint = points[afterIndex];

    if (!beforePoint || !afterPoint || beforePoint.position === afterPoint.position) {
      return yForValue((beforePoint || afterPoint)?.remaining ?? item.startValue ?? item.budget ?? 0);
    }

    const ratio = (position - beforePoint.position) / (afterPoint.position - beforePoint.position);
    const interpolated = beforePoint.remaining + (afterPoint.remaining - beforePoint.remaining) * ratio;
    return yForValue(interpolated);
  };

  const linePoints = points.map((point) => `${xForPosition(point.position)},${yForValue(point.remaining)}`).join(" ");
  const areaPoints = [
    `${xForPosition(points[0].position)},${yForValue(minY)}`,
    ...points.map((point) => `${xForPosition(point.position)},${yForValue(point.remaining)}`),
    `${xForPosition(points[points.length - 1].position)},${yForValue(minY)}`,
  ].join(" ");

  const yTicks = [minY, minY + ((maxY - minY) / 2), maxY];
  const xTicks = buildChartDayTicks(startDay, endDay);
  const movementDotMarkup = renderMovementDotGroups(visibleDots, xForPosition, yForLinePosition);
  const timeTicks = chartView === "day" || chartView === "period" ? buildChartTimeTicks(startPosition, endPosition) : [];

  return `
    <svg
      class="chart-svg"
      viewBox="0 0 ${width} ${height}"
      role="img"
      aria-label="Grafico cartesiano ${escapeAttribute(item.name)}"
      data-month-key="${escapeAttribute(monthKey(month))}"
      data-width="${width}"
      data-height="${height}"
      data-padding-left="${padding.left}"
      data-padding-right="${padding.right}"
      data-padding-top="${padding.top}"
      data-padding-bottom="${padding.bottom}"
      data-days-in-month="${daysInMonth}"
      data-start-day="${startDay}"
      data-end-day="${endDay}"
      data-start-position="${startPosition}"
      data-end-position="${endPosition}"
    >
      ${yTicks
        .map((tick) => {
          const y = yForValue(tick);
          return `
            <line class="chart-grid-line" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}"></line>
            <text class="chart-value-label" x="${padding.left - 8}" y="${y + 4}" text-anchor="end">${shortMoney(tick)}</text>
          `;
        })
        .join("")}
      <line class="chart-axis" x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartHeight}"></line>
      <line class="chart-axis" x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${width - padding.right}" y2="${padding.top + chartHeight}"></line>
      <polygon class="chart-area" points="${areaPoints}"></polygon>
      <polyline class="chart-line" points="${linePoints}"></polyline>
      <rect class="chart-selection" x="${padding.left}" y="${padding.top}" width="0" height="${chartHeight}" style="display:none"></rect>
      ${movementDotMarkup}
      ${chartView === "month"
        ? xTicks
            .map(
              (tick) => `
                <text class="chart-day-label" x="${xForPosition(tick + 0.5)}" y="${height - 10}" text-anchor="middle">${tick}</text>
              `,
            )
            .join("")
        : chartView === "day"
          ? `<text class="chart-day-label" x="${width / 2}" y="${height - 10}" text-anchor="middle">${formatChartDayHeader(getResolvedChartDayValue(month))}</text>`
          : xTicks
              .map(
                (tick) => `
                  <text class="chart-day-label" x="${xForPosition(tick + 0.5)}" y="${height - 10}" text-anchor="middle">${tick}</text>
                `,
              )
              .join("")}
      ${timeTicks
        .map(
          (tick) => `
            <text class="chart-time-label" x="${xForPosition(tick.position)}" y="${height - 28}" text-anchor="middle">${tick.time}</text>
          `,
        )
        .join("")}
      <text class="chart-axis-label" x="${width / 2}" y="${height - 2}" text-anchor="middle">${chartView === "day" ? "Orari del giorno" : chartView === "period" ? "Giorni del periodo" : "Giorni del mese"}</text>
      <text class="chart-axis-label" x="14" y="${height / 2}" text-anchor="middle" transform="rotate(-90 14 ${height / 2})">${item.name === "Andamento netto" ? "Netto disponibile" : "Budget residuo"}</text>
    </svg>
  `;
}

function buildChartPoints(item, month, zoomRange) {
  const daysInMonth = new Date(month.year, month.id + 1, 0).getDate();
  const startDay = zoomRange?.startDay || 1;
  const endDay = zoomRange?.endDay || daysInMonth;
  const startPosition = zoomRange?.startPosition ?? startDay;
  const endPosition = zoomRange?.endPosition ?? (endDay + 0.999);
  const previousDot = [...item.dots].reverse().find((dot) => dot.timePosition < startPosition);
  const baseRemaining = previousDot ? getChartDotValue(previousDot) : (item.startValue ?? item.budget ?? 0);
  const basePoint = { day: startDay, position: startPosition, remaining: baseRemaining, label: `Inizio focus - ${money(baseRemaining)}` };
  const visibleDots = item.dots.filter((dot) => dot.timePosition >= startPosition && dot.timePosition <= endPosition);

  let points = [basePoint];

  if (chartView === "day" || chartView === "period") {
    points = [
      basePoint,
      ...visibleDots.map((dot) => ({
        day: dot.day,
        position: dot.timePosition,
        remaining: getChartDotValue(dot),
        label: dot.label,
      })),
    ];
  }

  if (chartView === "month") {
    points = [
      basePoint,
      ...visibleDots.map((dot) => ({
        day: dot.day,
        position: dot.timePosition,
        remaining: getChartDotValue(dot),
        label: dot.label,
      })),
    ];
  }

  const endRemaining = visibleDots.length ? getChartDotValue(visibleDots[visibleDots.length - 1]) : baseRemaining;
  if (points[points.length - 1]?.position !== endPosition) {
    points.push({ day: endDay, position: endPosition, remaining: endRemaining, label: `Fine focus - ${money(endRemaining)}` });
  }

  return points;
}

function getChartDotValue(dot) {
  if (typeof dot.valueAfter === "number") {
    return dot.valueAfter;
  }
  if (typeof dot.remainingAfter === "number") {
    return dot.remainingAfter;
  }
  return 0;
}

function renderMovementDotGroups(visibleDots, xForPosition, yForPosition) {
  const groups = new Map();

  visibleDots.forEach((dot, index) => {
    const x = xForPosition(dot.timePosition);
    const y = yForPosition(dot.timePosition);
    const normalizedTime = String(dot.time || "").trim().slice(0, 5);
    const groupKey = normalizedTime
      ? `timed-${dot.day}-${normalizedTime}`
      : `untimed-day-${dot.day}`;
    const existing = groups.get(groupKey);

    if (existing) {
      existing.dots.push({ ...dot, x, y });
      return;
    }

    groups.set(groupKey, {
      key: groupKey,
      day: dot.day,
      hasTime: Boolean(normalizedTime),
      dots: [{ ...dot, x, y }],
    });
  });

  return [...groups.values()]
    .map((group) => {
      if (group.dots.length === 1) {
        const dot = group.dots[0];
        return `
          <circle class="chart-point ${dot.direction === "income" ? "income-point" : "movement-point"}" cx="${dot.x}" cy="${dot.y}" r="4.5">
            <title>${escapeAttribute(dot.label)}</title>
          </circle>
        `;
      }

      const anchorX = group.dots.reduce((acc, dot) => acc + dot.x, 0) / group.dots.length;
      const anchorY = group.dots.reduce((acc, dot) => acc + dot.y, 0) / group.dots.length;
      const radius = 18;
      const childrenMarkup = group.dots
        .map((dot, index) => {
          const angle = (-Math.PI / 2) + (index * ((Math.PI * 1.2) / Math.max(1, group.dots.length - 1))) - (Math.PI * 0.6);
          const offsetX = Math.cos(angle) * radius;
          const offsetY = Math.sin(angle) * radius;
          return `
            <g class="cluster-child" transform="translate(${offsetX.toFixed(2)} ${offsetY.toFixed(2)})">
              <circle r="4.5">
                <title>${escapeAttribute(dot.label)}</title>
              </circle>
            </g>
          `;
        })
        .join("");

      const clusterTitle = group.hasTime
        ? `${group.dots.length} movimenti con lo stesso orario`
        : `${group.dots.length} movimenti senza ora nello stesso giorno`;

      return `
        <g class="chart-dot-cluster" tabindex="0" transform="translate(${anchorX} ${anchorY})">
          <title>${escapeAttribute(clusterTitle)}</title>
          <circle class="cluster-core" r="7"></circle>
          <text class="cluster-count" x="0" y="1">${group.dots.length}</text>
          ${childrenMarkup}
        </g>
      `;
    })
    .join("");
}

function getTimePosition(day, time) {
  if (!time) {
    return day + 0.5;
  }

  const [hoursRaw, minutesRaw] = String(time).split(":");
  const hours = Number(hoursRaw || 0);
  const minutes = Number(minutesRaw || 0);
  return day + (hours * 60 + minutes) / 1440;
}

function snapPositionToHalfHour(position) {
  const totalHalfHours = Math.round((position - 1) * 48);
  return 1 + totalHalfHours / 48;
}

function formatPositionLabel(position, includeTime = true) {
  const day = Math.floor(position);
  const fraction = Math.max(0, position - day);
  const totalMinutes = Math.round(fraction * 1440);
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return includeTime
    ? `giorno ${day} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
    : `giorno ${day}`;
}

function buildChartTimeTicks(startPosition, endPosition) {
  const spanDays = Math.max(0.001, endPosition - startPosition);
  const intervalMinutes = getTimeTickIntervalMinutes(spanDays);
  const labelIntervalMinutes = chartView === "day" ? Math.max(60, intervalMinutes) : intervalMinutes;
  const startMinutes = Math.ceil(((startPosition - 1) * 1440) / labelIntervalMinutes) * labelIntervalMinutes;
  const endMinutes = Math.floor(((endPosition - 1) * 1440) / labelIntervalMinutes) * labelIntervalMinutes;
  const ticks = [];

  for (let minutes = startMinutes; minutes <= endMinutes; minutes += labelIntervalMinutes) {
    const absolutePosition = 1 + minutes / 1440;
    ticks.push({
      position: absolutePosition,
      time: formatMinutesAsTime(minutes),
    });
  }

  return ticks;
}

function getTimeTickIntervalMinutes(spanDays) {
  if (spanDays <= 1.5) {
    return 30;
  }
  if (spanDays <= 3) {
    return 60;
  }
  if (spanDays <= 7) {
    return 120;
  }
  if (spanDays <= 14) {
    return 240;
  }
  return 360;
}

function buildChartDayTicks(startDay, endDay) {
  const ticks = [];
  const span = Math.max(0, endDay - startDay);
  const step = span <= 7 ? 1 : span <= 14 ? 2 : 3;
  for (let day = startDay; day <= endDay; day += step) {
    ticks.push(day);
  }
  if (ticks[ticks.length - 1] !== endDay) {
    ticks.push(endDay);
  }
  return ticks;
}

function formatChartDayHeader(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTimeValue(value) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getBaseChartRange(month) {
  const daysInMonth = new Date(month.year, month.id + 1, 0).getDate();
  if (chartView === "day") {
    const selected = getResolvedChartDayValue(month);
    const date = new Date(selected);
    const day = date.getDate();
    return {
      key: monthKey(month),
      startDay: day,
      endDay: day,
      startPosition: day,
      endPosition: day + 0.999,
    };
  }

  if (chartView === "period") {
    const selected = getResolvedChartPeriodValues(month);
    const startDate = new Date(selected.start);
    const endDate = new Date(selected.end);
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    return {
      key: monthKey(month),
      startDay,
      endDay,
      startPosition: getTimePosition(
        startDay,
        `${String(startDate.getHours()).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}`,
      ),
      endPosition: getTimePosition(
        endDay,
        `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`,
      ),
    };
  }

  const today = new Date();
  const endDay = today.getFullYear() === month.year && today.getMonth() === month.id
    ? today.getDate()
    : daysInMonth;

  return {
    key: monthKey(month),
    startDay: 1,
    endDay,
    startPosition: 1,
    endPosition: endDay + 0.999,
  };
}

function formatMinutesAsTime(totalMinutes) {
  const minutesInDay = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(minutesInDay / 60);
  const minutes = minutesInDay % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function bindChartInteractions(month) {
  const svg = els.budgetCharts.querySelector(".chart-svg");
  if (!svg) {
    return;
  }

  bindChartHoverCard();

  const selection = svg.querySelector(".chart-selection");
  if (!selection) {
    return;
  }

  const width = Number(svg.dataset.width || 0);
  const paddingLeft = Number(svg.dataset.paddingLeft || 0);
  const paddingRight = Number(svg.dataset.paddingRight || 0);
  const paddingTop = Number(svg.dataset.paddingTop || 0);
  const chartHeight = heightFromSvg(svg);
  const daysInMonth = Number(svg.dataset.daysInMonth || 31);
  const visibleStartDay = Number(svg.dataset.startDay || 1);
  const visibleEndDay = Number(svg.dataset.endDay || daysInMonth);
  const visibleStartPosition = Number(svg.dataset.startPosition || visibleStartDay);
  const visibleEndPosition = Number(svg.dataset.endPosition || (visibleEndDay + 0.999));
  const chartRight = width - paddingRight;

  const toSvgX = (clientX) => {
    const rect = svg.getBoundingClientRect();
    const ratio = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
    return ratio * width;
  };

  const toPosition = (svgX) => {
    const clampedX = Math.min(chartRight, Math.max(paddingLeft, svgX));
    const ratio = (clampedX - paddingLeft) / Math.max(1, chartRight - paddingLeft);
    const rawPosition = visibleStartPosition + ratio * Math.max(0.001, visibleEndPosition - visibleStartPosition);
    return snapPositionToHalfHour(rawPosition);
  };

  const paintSelection = (fromX, toX) => {
    const left = Math.min(fromX, toX);
    const right = Math.max(fromX, toX);
    selection.setAttribute("x", String(Math.max(paddingLeft, left)));
    selection.setAttribute("y", String(paddingTop));
    selection.setAttribute("width", String(Math.max(0, Math.min(chartRight, right) - Math.max(paddingLeft, left))));
    selection.setAttribute("height", String(chartHeight - Number(svg.dataset.paddingBottom || 0) - paddingTop));
    selection.style.display = "block";
  };

  svg.addEventListener("mousedown", (event) => {
    if (!event.shiftKey) {
      return;
    }

    event.preventDefault();
    const dragStartX = toSvgX(event.clientX);
    paintSelection(dragStartX, dragStartX);

    const onMove = (moveEvent) => {
      paintSelection(dragStartX, toSvgX(moveEvent.clientX));
    };

    const onUp = (upEvent) => {
      const dragEndX = toSvgX(upEvent.clientX);
      selection.style.display = "none";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);

      if (Math.abs(dragEndX - dragStartX) < 8) {
        return;
      }

      const startPosition = Math.max(1, Math.min(daysInMonth + 0.999, toPosition(Math.min(dragStartX, dragEndX))));
      const endPosition = Math.max(1, Math.min(daysInMonth + 0.999, toPosition(Math.max(dragStartX, dragEndX))));
      chartZoomRange = {
        key: monthKey(month),
        startPosition: Math.min(startPosition, endPosition),
        endPosition: Math.max(startPosition, endPosition),
        startDay: Math.floor(Math.min(startPosition, endPosition)),
        endDay: Math.ceil(Math.max(startPosition, endPosition)),
      };
      render();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  });
}

function heightFromSvg(svg) {
  return Number(svg.dataset.height || 0);
}

function bindChartHoverCard() {
  const card = els.budgetCharts.querySelector(".chart-card");
  const svg = card?.querySelector(".chart-svg");
  if (!card || !svg) {
    return;
  }

  let tooltip = card.querySelector("[data-chart-hover-card]");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "chart-hover-card";
    tooltip.dataset.chartHoverCard = "true";
    tooltip.hidden = true;
    card.appendChild(tooltip);
  }

  svg.querySelectorAll("title").forEach((titleNode) => {
    const parent = titleNode.parentElement;
    if (!parent || parent.dataset.chartTooltipReady === "true") {
      return;
    }
    parent.dataset.chartTooltipText = titleNode.textContent || "";
    parent.dataset.chartTooltipReady = "true";
    titleNode.remove();
  });

  const buildTooltipContent = (rawText) => {
    const text = String(rawText || "").trim();
    if (!text) {
      return "";
    }

    const parts = text.split(" - ").map((item) => item.trim()).filter(Boolean);
    const lastPart = parts[parts.length - 1] || "";
    const looksLikeAmount = /€/.test(lastPart);
    const eyebrow = parts.length > 1 ? parts[0] : "";
    const title = parts.length > 1
      ? parts.slice(1, looksLikeAmount ? -1 : undefined).join(" · ") || parts[0]
      : text;
    const value = looksLikeAmount ? lastPart : "";
    const note = looksLikeAmount ? "" : parts.length > 1 ? parts.slice(1).join(" · ") : "";

    return `
      ${eyebrow ? `<p class="chart-hover-eyebrow">${escapeHtml(eyebrow)}</p>` : ""}
      <h5>${escapeHtml(title)}</h5>
      ${value ? `<strong class="chart-hover-value">${escapeHtml(value)}</strong>` : ""}
      ${note ? `<p class="chart-hover-note">${escapeHtml(note)}</p>` : ""}
    `;
  };

  const placeTooltip = (event) => {
    const rect = card.getBoundingClientRect();
    tooltip.hidden = false;
    const tipRect = tooltip.getBoundingClientRect();
    let left = event.clientX - rect.left + 18;
    let top = event.clientY - rect.top + 18;

    if (left + tipRect.width > rect.width - 12) {
      left = event.clientX - rect.left - tipRect.width - 18;
    }

    if (top + tipRect.height > rect.height - 12) {
      top = rect.height - tipRect.height - 12;
    }

    tooltip.style.left = `${Math.max(12, left)}px`;
    tooltip.style.top = `${Math.max(12, top)}px`;
  };

  svg.onpointermove = (event) => {
    const target = event.target.closest("[data-chart-tooltip-text]");
    if (!target || !svg.contains(target)) {
      tooltip.hidden = true;
      return;
    }

    tooltip.innerHTML = buildTooltipContent(target.dataset.chartTooltipText || "");
    placeTooltip(event);
  };

  svg.onpointerleave = () => {
    tooltip.hidden = true;
  };
}

function renderCategoryList(month) {
  els.categoryCount.textContent = `${month.categoryBudgets.length} voci`;

  if (!month.categoryBudgets.length) {
    els.categoryList.innerHTML = emptyStateTemplate.innerHTML;
    return;
  }

  els.categoryList.innerHTML = month.categoryBudgets
    .map((category) => {
      const spent = month.transactions
        .filter((item) => item.type === "expense" && lowerText(item.category) === lowerText(category.name))
        .reduce((acc, item) => acc + item.amount, 0);
      const currentBudget = effectiveCategoryBudget(category, spent);
      const ratio = currentBudget > 0 ? Math.min(100, (spent / currentBudget) * 100) : 0;

      return `
        <details class="progress-item category-accordion">
          <summary class="category-summary">
            <div class="category-summary-main">
              <div class="category-summary-name">
                <strong>${category.name}</strong>
              </div>
              <div class="progress-track category-summary-track"><span style="width:${ratio}%"></span></div>
            </div>
            <div class="category-summary-values">
              <span>
                <small>Budget</small>
                <strong>${money(currentBudget)}</strong>
              </span>
              <span>
                <small>Speso</small>
                <strong>${money(spent)}</strong>
              </span>
            </div>
          </summary>
          <div class="category-accordion-body">
            <p class="progress-meta">${category.isUndefinedBudget ? "Budget uguale alla spesa reale della categoria" : "Speso rispetto al budget impostato"}</p>
            <div class="category-budget-editor">
              <label>
                Budget categoria
                <input
                  class="category-budget-input"
                  data-id="${category.id}"
                  type="number"
                  step="0.01"
                  min="0"
                  value="${Number(currentBudget || 0)}"
                  ${category.isUndefinedBudget ? "disabled" : ""}
                  aria-label="Budget categoria"
                />
              </label>
              <label>
                Speso
                <input type="text" value="${money(spent)}" aria-label="Speso categoria" disabled />
              </label>
            </div>
            <label class="list-meta checkbox-inline">
              <input
                class="category-undefined-toggle"
                data-id="${category.id}"
                type="checkbox"
                ${category.isUndefinedBudget ? "checked" : ""}
              />
              Budget indefinito
            </label>
            <div class="hero-actions compact">
              <button class="secondary" type="button" data-category-filter="${escapeAttribute(category.name)}">Vedi movimenti</button>
              <button class="secondary" data-action="delete-category" data-id="${category.id}">Elimina</button>
            </div>
          </div>
        </details>
      `;
    })
    .join("");
}

function renderIncomeList(month, stats) {
  const carryoverIncome = Number(stats?.carryoverActual || 0) > 0
    ? {
        id: `carryover-${monthKey(month)}`,
        name: "Rimanenze mese scorso",
        budget: Number(stats.carryoverBudget || 0),
        actual: Number(stats.carryoverActual || 0),
        date: getDefaultEntryDate(month),
        isAutoCarryover: true,
      }
    : null;
  const incomeEntries = carryoverIncome ? [carryoverIncome, ...month.incomes] : [...month.incomes];

  els.incomeCount.textContent = `${incomeEntries.length} entrate`;

  if (!incomeEntries.length) {
    els.incomeList.innerHTML = emptyStateTemplate.innerHTML;
    return;
  }

  els.incomeList.innerHTML = incomeEntries
    .map(
      (item) => `
        <article class="list-item">
          <div class="list-item-top">
            <h5>${item.name}${item.isAutoCarryover ? ' <span class="tag">Auto</span>' : ""}</h5>
            <strong class="amount-positive">${money(item.actual || item.budget)}</strong>
          </div>
          <p class="list-meta">Budget ${money(item.budget)} · Actual ${money(item.actual)}${item.date ? ` · ${formatDate(item.date)}` : ""}${item.time ? ` ${item.time}` : ""}</p>
          ${item.isAutoCarryover
            ? '<p class="list-meta">Voce generata automaticamente dalla rimanenza del mese precedente</p>'
            : `
              <label class="list-meta">
                Data entrata
                <input
                  class="income-date-input"
                  data-id="${item.id}"
                  type="date"
                  value="${escapeAttribute(item.date || getDefaultEntryDate(month))}"
                  aria-label="Data entrata"
                />
              </label>
              <label class="list-meta">
                Ora entrata
                <input
                  class="income-time-input"
                  data-id="${item.id}"
                  type="time"
                  value="${escapeAttribute(item.time || "")}"
                  aria-label="Ora entrata"
                />
              </label>
            `}
          <div class="hero-actions compact">
            ${item.isAutoCarryover ? "" : `<button class="secondary" data-action="delete-income" data-id="${item.id}">Elimina</button>`}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderBillList(month) {
  els.billCount.textContent = `${month.bills.length} bills`;

  if (!month.bills.length) {
    els.billList.innerHTML = emptyStateTemplate.innerHTML;
    return;
  }

  els.billList.innerHTML = month.bills
    .map(
      (item) => `
        <article class="list-item">
          <div class="list-item-top">
            <h5>${item.name}</h5>
            <strong class="amount-negative">${money(item.actual || item.budget)}</strong>
          </div>
          <p class="list-meta">Scadenza giorno ${item.dueDay} · Budget ${money(item.budget)}</p>
          <div class="hero-actions compact">
            <button class="secondary" data-action="delete-bill" data-id="${item.id}">Elimina</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderAllMovements() {
  const all = getFilteredMovementEntries();
  const visible = all.slice(0, movementVisibleLimit);
  const hiddenCount = Math.max(0, all.length - visible.length);
  const totalIncome = all
    .filter((item) => item.type === "income")
    .reduce((acc, item) => acc + Number(item.amount || 0), 0);
  const totalOut = all
    .filter((item) => item.type !== "income")
    .reduce((acc, item) => acc + Number(item.amount || 0), 0);
  const totalNet = totalIncome - totalOut;

  els.activeCategoryFilter.textContent = activeCategoryFilter
    ? `Filtro: ${activeCategoryFilter}`
    : "Filtro: tutte le categorie";
  if (els.movementFilterTotal) {
    els.movementFilterTotal.textContent = all.length
      ? `Totale filtrato: ${money(totalNet)} · Entrate ${money(totalIncome)} · Uscite ${money(totalOut)}`
      : "Totale filtrato: 0 €";
  }
  setMovementBulkStatus(
    all.length
      ? `${all.length} risultati filtrati, ${visible.length} visibili. ${all.filter((item) => item.sourceKind === "transaction").length} modificabili come categoria.`
      : "Nessun risultato filtrato.",
  );

  if (!all.length) {
    els.allMovementsList.innerHTML = emptyStateTemplate.innerHTML;
    return;
  }

  els.allMovementsList.innerHTML = `
    ${visible
      .map((item) => {
        const month = state.months.find((monthEntry) => monthEntry.id === item.monthId && monthEntry.year === item.year);
        const baseCategories = item.sourceKind === "income"
          ? ["Entrate"]
          : getTransactionCategoryOptions(item.type);
        const availableCategories = [...new Set([...baseCategories, item.category].filter(Boolean))];
        const categorySelectOptions = availableCategories
          .map((category) => `<option value="${escapeAttribute(category)}"${category === item.category ? " selected" : ""}>${category}</option>`)
          .join("");
        const deleteAction = item.sourceKind === "income" ? "delete-income" : "delete-transaction";
        return `
          <article class="movement-row">
            <div class="movement-cell">
              <input
                class="movement-date-input"
                data-id="${item.id}"
                data-source-kind="${item.sourceKind}"
                type="date"
                value="${escapeAttribute(item.date)}"
                aria-label="Data movimento"
              />
              <input
                class="movement-time-input"
                data-id="${item.id}"
                data-source-kind="${item.sourceKind}"
                type="time"
                value="${escapeAttribute(item.time || "")}"
                aria-label="Ora movimento"
              />
            </div>
            <div class="movement-cell">
              <select
                class="movement-type-input"
                data-id="${item.id}"
                data-source-kind="${item.sourceKind}"
                aria-label="Tipologia movimento"
                ${item.sourceKind === "income" ? "disabled" : ""}
              >
                <option value="expense"${item.type === "expense" ? " selected" : ""}>Spesa</option>
                <option value="income"${item.type === "income" ? " selected" : ""}>Entrata extra</option>
                <option value="saving"${item.type === "saving" ? " selected" : ""}>Risparmio</option>
                <option value="debt"${item.type === "debt" ? " selected" : ""}>Debito</option>
              </select>
            </div>
            <div class="movement-cell">
              <strong class="${movementAmountClass(item.type)}">${money(item.amount)}</strong>
            </div>
            <div class="movement-cell">
              <select
                class="movement-category-input"
                data-id="${item.id}"
                data-source-kind="${item.sourceKind}"
                aria-label="Categoria movimento"
                ${item.sourceKind === "income" ? "disabled" : ""}
              >
                ${categorySelectOptions}
              </select>
            </div>
            <div class="movement-cell">
              <input
                class="movement-note-input"
                data-id="${item.id}"
                data-source-kind="${item.sourceKind}"
                type="text"
                value="${escapeAttribute(item.note || "")}"
                placeholder="Aggiungi o modifica nota"
                aria-label="Nota movimento"
              />
              ${renderMovementBankMeta(item)}
            </div>
            <div class="movement-actions">
              <button class="secondary" data-action="${deleteAction}" data-id="${item.id}">Elimina</button>
            </div>
          </article>
        `;
      })
      .join("")}
    ${hiddenCount > 0
      ? `
        <article class="list-item movement-load-more">
          <p class="list-meta">Altri ${hiddenCount} movimenti filtrati non renderizzati per mantenere fluida la pagina.</p>
          <button class="secondary" type="button" data-action="show-more-filtered-movements">Mostra altri ${Math.min(MOVEMENT_RENDER_BATCH_SIZE, hiddenCount)}</button>
        </article>
      `
      : ""}
  `;
}

function getFilteredMovementEntries() {
  return allMovementEntries()
    .filter((item) => movementMatchesFilter(item))
    .sort(compareMovements);
}

function setMovementBulkStatus(message, tone = "") {
  if (!els.movementBulkStatus) {
    return;
  }
  els.movementBulkStatus.textContent = message || "";
  els.movementBulkStatus.className = tone ? `list-meta ${tone}` : "list-meta";
}

function ensureCategoryForMovement(month, categoryName) {
  if (!month || !categoryName) {
    return;
  }

  const exists = (month.categoryBudgets || []).some((entry) => lowerText(entry.name) === lowerText(categoryName));
  if (exists) {
    return;
  }

  month.categoryBudgets = month.categoryBudgets || [];
  month.categoryBudgets.unshift({
    id: crypto.randomUUID(),
    name: categoryName,
    budget: 0,
    isUndefinedBudget: true,
  });
}

async function deleteFilteredMovements() {
  const filtered = getFilteredMovementEntries();
  if (!filtered.length) {
    setMovementBulkStatus("Nessun movimento filtrato da eliminare.", "negative");
    return;
  }

  const confirmed = window.confirm(`Confermi l'eliminazione di ${filtered.length} movimenti filtrati? L'azione non si puo annullare.`);
  if (!confirmed) {
    return;
  }

  setMovementBulkStatus(`Eliminazione di ${filtered.length} movimenti in corso...`);
  const filteredIds = new Set(filtered.map((item) => item.id));
  const filteredTransactions = filtered
    .filter((item) => item.sourceKind === "transaction")
    .map((item) => findTransactionById(item.id))
    .filter(Boolean);

  await deleteRemoteBankTransactionLinks(filteredTransactions);

  state.months.forEach((month) => {
    month.transactions = (month.transactions || []).filter((item) => !filteredIds.has(item.id));
    month.incomes = (month.incomes || []).filter((item) => !filteredIds.has(item.id));
  });

  resetMovementVisibleLimit();
  saveState();
  render();
  setMovementBulkStatus(`Eliminati ${filtered.length} movimenti filtrati.`, "positive");
}

function updateFilteredMovementCategories() {
  const categoryName = String(els.movementBulkCategory?.value || "").trim();
  if (!categoryName) {
    setMovementBulkStatus("Seleziona una categoria da applicare ai risultati filtrati.", "negative");
    return;
  }

  const filteredTransactions = getFilteredMovementEntries()
    .filter((item) => item.sourceKind === "transaction")
    .map((item) => findTransactionContextById(item.id))
    .filter(Boolean);

  if (!filteredTransactions.length) {
    setMovementBulkStatus("Nessun movimento filtrato modificabile come categoria.", "negative");
    return;
  }

  filteredTransactions.forEach(({ month, transaction }) => {
    transaction.category = categoryName;
    if (transaction.type === "expense") {
      ensureCategoryForMovement(month, categoryName);
    }
  });

  resetMovementVisibleLimit();
  saveState();
  render();
  if (els.movementBulkCategory) {
    els.movementBulkCategory.value = categoryName;
  }
  setMovementBulkStatus(`Categoria aggiornata per ${filteredTransactions.length} movimenti filtrati.`, "positive");
}

function renderMovementBankMeta(item) {
  const rows = [
    item.creditorName ? `<span><strong>Creditor:</strong> ${escapeHtml(item.creditorName)}</span>` : "",
    item.debtorName ? `<span><strong>Debtor:</strong> ${escapeHtml(item.debtorName)}</span>` : "",
    item.bankEntryReference ? `<span><strong>Entry ref:</strong> ${escapeHtml(item.bankEntryReference)}</span>` : "",
    item.bankTransactionId ? `<span><strong>Transaction ID:</strong> ${escapeHtml(item.bankTransactionId)}</span>` : "",
    item.bankExternalId ? `<span><strong>External ID:</strong> ${escapeHtml(item.bankExternalId)}</span>` : "",
    item.bankDirection ? `<span><strong>Direzione:</strong> ${escapeHtml(item.bankDirection)}</span>` : "",
  ].filter(Boolean);

  if (!rows.length) {
    return "";
  }

  return `<div class="movement-bank-meta">${rows.join("")}</div>`;
}

function movementMatchesFilter(item) {
  if (activeCategoryFilter && lowerText(item.category) !== lowerText(activeCategoryFilter)) {
    return false;
  }

  if (movementFilter.mode === "all") {
  } else if (movementFilter.mode === "selected-month") {
    const selectedMonth = getSelectedMonth();
    const date = new Date(item.date);
    if (!(date.getMonth() === selectedMonth.id && date.getFullYear() === selectedMonth.year)) {
      return false;
    }
  } else if (movementFilter.mode === "date-range") {
    if (!movementFilter.start && !movementFilter.end) {
    } else {
      const value = item.date;
      if (movementFilter.start && value < movementFilter.start) {
        return false;
      }
      if (movementFilter.end && value > movementFilter.end) {
        return false;
      }
    }
  }

  if (movementFilter.type !== "all" && item.type !== movementFilter.type) {
    return false;
  }

  if (movementFilter.category !== "all" && String(item.category || "").toLowerCase() !== String(movementFilter.category || "").toLowerCase()) {
    return false;
  }

  const noteFilter = lowerText(movementFilter.note).trim();
  if (noteFilter) {
    const searchableText = lowerText([
      item.note,
      item.category,
      item.creditorName,
      item.debtorName,
      item.bankEntryReference,
      item.bankTransactionId,
      item.bankExternalId,
      item.bankDirection,
    ].filter(Boolean).join(" "));
    if (!searchableText.includes(noteFilter)) {
      return false;
    }
  }

  const amount = Number(item.amount || 0);
  const minAmount = Number(movementFilter.minAmount);
  const maxAmount = Number(movementFilter.maxAmount);

  if (movementFilter.minAmount !== "" && !Number.isNaN(minAmount) && amount < minAmount) {
    return false;
  }

  if (movementFilter.maxAmount !== "" && !Number.isNaN(maxAmount) && amount > maxAmount) {
    return false;
  }

  return true;
}

function compareMovements(a, b) {
  const sortBy = movementFilter.sortBy || "date-desc";
  const aDateTime = `${a.date}T${a.time || "00:00"}`;
  const bDateTime = `${b.date}T${b.time || "00:00"}`;
  const aAmount = Number(a.amount || 0);
  const bAmount = Number(b.amount || 0);

  if (sortBy === "date-asc") {
    return new Date(aDateTime) - new Date(bDateTime);
  }

  if (sortBy === "amount-desc") {
    if (bAmount !== aAmount) {
      return bAmount - aAmount;
    }
    return new Date(bDateTime) - new Date(aDateTime);
  }

  if (sortBy === "amount-asc") {
    if (aAmount !== bAmount) {
      return aAmount - bAmount;
    }
    return new Date(bDateTime) - new Date(aDateTime);
  }

  if (sortBy === "type-asc") {
    const typeCompare = typeLabel(a.type).localeCompare(typeLabel(b.type), "it");
    if (typeCompare !== 0) {
      return typeCompare;
    }
    return new Date(bDateTime) - new Date(aDateTime);
  }

  if (sortBy === "category-asc") {
    const categoryCompare = String(a.category || "").localeCompare(String(b.category || ""), "it");
    if (categoryCompare !== 0) {
      return categoryCompare;
    }
    return new Date(bDateTime) - new Date(aDateTime);
  }

  return new Date(bDateTime) - new Date(aDateTime);
}

function getGoalProgressStats(type, goalName, startingAmount, targetAmount) {
  const matchingTransactions = allTransactions()
    .filter((item) => item.type === type && String(item.category || "").toLowerCase() === String(goalName || "").toLowerCase())
    .sort((a, b) => new Date(`${a.date}T${a.time || "00:00"}`) - new Date(`${b.date}T${b.time || "00:00"}`));

  const moved = matchingTransactions.reduce((acc, item) => acc + Number(item.amount || 0), 0);
  const progress = Number(startingAmount || 0) + moved;
  const left = Math.max(0, Number(targetAmount || 0) - progress);
  const ratio = Number(targetAmount || 0) > 0 ? Math.min(100, (progress / Number(targetAmount || 0)) * 100) : 0;

  if (!matchingTransactions.length) {
    return {
      moved,
      progress,
      left,
      ratio,
      monthlyAverage: 0,
      transactions: matchingTransactions,
      etaLabel: "Aggiungi i primi versamenti per stimare quando arrivi al target.",
    };
  }

  const firstDate = new Date(`${matchingTransactions[0].date}T00:00`);
  const today = new Date();
  const monthSpan = Math.max(1, ((today.getFullYear() - firstDate.getFullYear()) * 12) + (today.getMonth() - firstDate.getMonth()) + 1);
  const monthlyAverage = moved / monthSpan;

  if (left <= 0) {
    return {
      moved,
      progress,
      left,
      ratio,
      monthlyAverage,
      transactions: matchingTransactions,
      etaLabel: "Obiettivo raggiunto con il ritmo attuale.",
    };
  }

  if (monthlyAverage <= 0) {
    return {
      moved,
      progress,
      left,
      ratio,
      monthlyAverage,
      transactions: matchingTransactions,
      etaLabel: "Media mensile ancora insufficiente per stimare una data.",
    };
  }

  const estimatedDays = (left / monthlyAverage) * 30.4375;
  const estimatedDate = new Date(today.getTime() + (estimatedDays * 86400000));

  return {
    moved,
    progress,
    left,
    ratio,
    monthlyAverage,
    transactions: matchingTransactions,
    etaLabel: `Di questo passo arrivi circa il ${formatDate(estimatedDate.toISOString().slice(0, 10))}.`,
  };
}

function buildGoalChartPoints(startValue, transactions) {
  const points = [{ label: "Base iniziale", value: Number(startValue || 0) }];
  let running = Number(startValue || 0);

  transactions.forEach((item) => {
    running += Number(item.amount || 0);
    points.push({
      label: `${formatDateTime(item)} · ${money(Number(item.amount || 0))}`,
      value: running,
    });
  });

  return points;
}

function renderGoalProgressChart(goalName, startValue, transactions, targetValue, kind) {
  const points = buildGoalChartPoints(startValue, transactions || []);
  const width = 360;
  const height = 126;
  const padding = { top: 16, right: 12, bottom: 24, left: 12 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxY = Math.max(Number(targetValue || 0), ...points.map((point) => point.value), 1);
  const minY = Math.min(0, ...points.map((point) => point.value));
  const spanY = Math.max(1, maxY - minY);
  const xForIndex = (index) => padding.left + ((points.length === 1 ? 0 : index / (points.length - 1)) * chartWidth);
  const yForValue = (value) => padding.top + (1 - ((value - minY) / spanY)) * chartHeight;
  const linePoints = points.map((point, index) => `${xForIndex(index)},${yForValue(point.value)}`).join(" ");
  const areaPoints = [
    `${xForIndex(0)},${yForValue(minY)}`,
    ...points.map((point, index) => `${xForIndex(index)},${yForValue(point.value)}`),
    `${xForIndex(points.length - 1)},${yForValue(minY)}`,
  ].join(" ");
  const targetY = yForValue(Number(targetValue || 0));
  const chartClass = kind === "debt" ? "goal-chart goal-chart-debt" : "goal-chart goal-chart-saving";

  return `
    <div class="${chartClass}">
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafico ${escapeAttribute(goalName)}">
        <line class="goal-chart-target" x1="${padding.left}" y1="${targetY}" x2="${width - padding.right}" y2="${targetY}"></line>
        <polygon class="goal-chart-area" points="${areaPoints}"></polygon>
        <polyline class="goal-chart-line" points="${linePoints}"></polyline>
        ${points
          .map((point, index) => `
            <circle class="goal-chart-point" cx="${xForIndex(index)}" cy="${yForValue(point.value)}" r="4">
              <title>${escapeAttribute(`${point.label} · totale ${money(point.value)}`)}</title>
            </circle>
          `)
          .join("")}
      </svg>
      <div class="goal-chart-meta">
        <span>Base ${money(startValue)}</span>
        <span>Target ${money(targetValue)}</span>
      </div>
    </div>
  `;
}

function movementAmountClass(type) {
  if (type === "income" || type === "saving") {
    return "amount-positive";
  }
  return "amount-negative";
}

function renderGoals() {
  const savingGoals = state.savingsGoals.map((goal) => {
    const stats = getGoalProgressStats("saving", goal.name, goal.start, goal.target);
    return { ...goal, saved: stats.progress, left: stats.left, ratio: stats.ratio, monthlyAverage: stats.monthlyAverage, etaLabel: stats.etaLabel, transactions: stats.transactions };
  });

  const debtGoals = state.debtGoals.map((goal) => {
    const stats = getGoalProgressStats("debt", goal.name, goal.start, goal.target);
    return { ...goal, paid: stats.progress, left: stats.left, ratio: stats.ratio, monthlyAverage: stats.monthlyAverage, etaLabel: stats.etaLabel, transactions: stats.transactions };
  });

  els.savingCount.textContent = `${savingGoals.length} goals`;
  els.debtCount.textContent = `${debtGoals.length} debiti`;

  els.savingGoalsList.innerHTML = savingGoals.length
    ? savingGoals
        .map(
          (goal) => `
            <article class="progress-item">
              <div class="progress-top">
                <h5>${goal.name}</h5>
                <strong>${money(goal.saved)} / ${money(goal.target)}</strong>
              </div>
              <p class="progress-meta">Ti restano ${money(goal.left)} da mettere da parte</p>
              <p class="progress-meta">Media al mese: ${money(goal.monthlyAverage)}. ${goal.etaLabel}</p>
              <div class="progress-track"><span style="width:${goal.ratio}%"></span></div>
              ${renderGoalProgressChart(goal.name, goal.start, goal.transactions, goal.target, "saving")}
              <div class="hero-actions compact">
                <button class="secondary" data-action="delete-saving-goal" data-id="${goal.id}">Elimina</button>
              </div>
            </article>
          `,
        )
        .join("")
    : emptyStateTemplate.innerHTML;

  els.debtGoalsList.innerHTML = debtGoals.length
    ? debtGoals
        .map(
          (goal) => `
            <article class="progress-item">
              <div class="progress-top">
                <h5>${goal.name}</h5>
                <strong>${money(goal.paid)} / ${money(goal.target)}</strong>
              </div>
              <p class="progress-meta">Ti restano ${money(goal.left)} da ripagare</p>
              <p class="progress-meta">Media al mese: ${money(goal.monthlyAverage)}. ${goal.etaLabel}</p>
              <div class="progress-track"><span style="width:${goal.ratio}%"></span></div>
              ${renderGoalProgressChart(goal.name, goal.start, goal.transactions, goal.target, "debt")}
              <div class="hero-actions compact">
                <button class="secondary" data-action="delete-debt-goal" data-id="${goal.id}">Elimina</button>
              </div>
            </article>
          `,
        )
        .join("")
    : emptyStateTemplate.innerHTML;
}

function renderInvestments() {
  if (!state.investments?.length) {
    els.investmentCards.innerHTML = emptyStateTemplate.innerHTML;
    els.investmentStatus.textContent = "Nessun investimento configurato";
    return;
  }

  els.investmentCards.innerHTML = state.investments
    .map((investment) => {
      const quote = investmentQuotes[investment.coinId];
      const livePrice = Number(quote?.eur || 0);
      const currentValue = livePrice > 0 ? investment.quantity * livePrice : 0;
      const pnl = currentValue - Number(investment.invested || 0);
      const pnlRatio = Number(investment.invested || 0) > 0 ? (pnl / investment.invested) * 100 : 0;
      const avgBuyPrice = investment.quantity > 0 ? investment.invested / investment.quantity : 0;
      const pnlClass = pnl >= 0 ? "positive" : "negative";
      const updateLabel = quote?.last_updated_at
        ? `Ultimo aggiornamento ${formatTimestamp(quote.last_updated_at)}`
        : "In attesa del prezzo live";

      return `
        <article class="investment-card">
          <div class="investment-head">
            <div>
              <span class="investment-symbol">${investment.symbol}</span>
              <h4>${investment.quantity} ${investment.symbol}</h4>
              <p class="list-meta">${updateLabel}</p>
            </div>
            <div>
              <strong>${livePrice > 0 ? money(currentValue) : "--"}</strong>
              <p class="list-meta">Valore attuale</p>
            </div>
          </div>
          <div class="investment-metrics">
            <p>Capitale investito</p>
            <strong>${money(investment.invested)}</strong>
          </div>
          <div class="investment-metrics">
            <p>Prezzo medio di carico</p>
            <strong>${money(avgBuyPrice)}</strong>
          </div>
          <div class="investment-metrics">
            <p>Prezzo live XRP</p>
            <strong>${livePrice > 0 ? money(livePrice) : "--"}</strong>
          </div>
          <div class="investment-actions">
            <p>Profitto / perdita</p>
            <div>
              <strong class="${pnlClass}">${livePrice > 0 ? money(pnl) : "--"}</strong>
              <p class="list-meta ${pnlClass}">${livePrice > 0 ? `${pnlRatio.toFixed(2)}%` : "prezzo non disponibile"}</p>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  els.investmentStatus.textContent = investmentQuotesStatus();
}

async function refreshInvestmentQuotes() {
  if (!state.investments?.length) {
    return;
  }

  const coinIds = [...new Set(state.investments.map((item) => item.coinId).filter(Boolean))];
  els.investmentStatus.textContent = "Aggiornamento prezzi live...";

  try {
    const params = new URLSearchParams({
      ids: coinIds.join(","),
      vs_currencies: "eur",
      include_last_updated_at: "true",
    });
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    investmentQuotes = await response.json();
    renderInvestments();
  } catch (error) {
    console.error("Errore aggiornamento investimenti", error);
    els.investmentStatus.textContent = "Prezzo live non disponibile";
    renderInvestments();
  }
}

function startInvestmentAutoRefresh() {
  if (investmentRefreshHandle) {
    clearInterval(investmentRefreshHandle);
  }

  investmentRefreshHandle = window.setInterval(() => {
    refreshInvestmentQuotes();
  }, 60000);
}

function investmentQuotesStatus() {
  const quote = state.investments
    .map((item) => investmentQuotes[item.coinId])
    .find(Boolean);

  if (!quote?.last_updated_at) {
    return "Prezzo live non disponibile";
  }

  return `Prezzo live aggiornato ${formatTimestamp(quote.last_updated_at)}`;
}

function allTransactions() {
  return state.months.flatMap((month) => month.transactions);
}

function allMovementEntries() {
  return state.months.flatMap((month) => {
    const transactionEntries = month.transactions.map((item) => ({
      ...item,
      sourceKind: "transaction",
      monthId: month.id,
      year: month.year,
    }));
    const incomeEntries = month.incomes.map((item) => ({
      id: item.id,
      date: item.date || getDefaultEntryDate(month),
      time: item.time || "",
      type: "income",
      category: "Entrate",
      amount: Number(item.actual || item.budget || 0),
      note: item.name || "Entrata",
      sourceKind: "income",
      monthId: month.id,
      year: month.year,
    }));
    return [...transactionEntries, ...incomeEntries];
  });
}

function getCategorySuggestions() {
  const fromBudgets = state.months.flatMap((month) => month.categoryBudgets.map((item) => item.name));
  const fromTransactions = allTransactions().map((item) => item.category);
  return [...new Set([...FIXED_CATEGORIES, ...fromBudgets, ...fromTransactions].filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function getAvailableYears() {
  return [...new Set(state.months.map((month) => month.year))].sort((a, b) => a - b);
}

function findTransactionById(id) {
  for (const month of state.months) {
    const transaction = month.transactions.find((item) => item.id === id);
    if (transaction) {
      return transaction;
    }
  }
  return null;
}

function findTransactionContextById(id) {
  for (const month of state.months) {
    const transaction = month.transactions.find((item) => item.id === id);
    if (transaction) {
      return { month, transaction };
    }
  }
  return null;
}

function findCategoryById(id) {
  for (const month of state.months) {
    const category = month.categoryBudgets.find((item) => item.id === id);
    if (category) {
      return category;
    }
  }
  return null;
}

function findIncomeById(id) {
  for (const month of state.months) {
    const income = month.incomes.find((item) => item.id === id);
    if (income) {
      return income;
    }
  }
  return null;
}

function findIncomeContextById(id) {
  for (const month of state.months) {
    const income = month.incomes.find((item) => item.id === id);
    if (income) {
      return { month, income };
    }
  }
  return null;
}

function transactionTotal(transactions, type) {
  return transactions.filter((item) => item.type === type).reduce((acc, item) => acc + item.amount, 0);
}

function sum(items, key) {
  return items.reduce((acc, item) => acc + Number(item[key] || 0), 0);
}

function money(value) {
  const currencyMap = {
    EUR: "EUR",
    USD: "USD",
    GBP: "GBP",
  };
  const currency = currencyMap[state.profile.currency] || "EUR";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function shortMoney(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDateTimeLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function countWeekendDays(startDate, endDate) {
  if (!(startDate instanceof Date) || !(endDate instanceof Date) || Number.isNaN(startDate) || Number.isNaN(endDate)) {
    return 0;
  }
  if (endDate < startDate) {
    return 0;
  }

  let count = 0;
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const last = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  while (cursor <= last) {
    const day = cursor.getDay();
    if (day === 5 || day === 6 || day === 0) {
      count += 1;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return count;
}

function countWeekendWindows(startDate, endDate) {
  if (!(startDate instanceof Date) || !(endDate instanceof Date) || Number.isNaN(startDate) || Number.isNaN(endDate)) {
    return 0;
  }
  if (endDate < startDate) {
    return 0;
  }

  const weekends = new Set();
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const last = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  while (cursor <= last) {
    const day = cursor.getDay();
    if (day === 5 || day === 6 || day === 0) {
      const friday = new Date(cursor);
      if (day === 6) {
        friday.setDate(friday.getDate() - 1);
      } else if (day === 0) {
        friday.setDate(friday.getDate() - 2);
      }
      weekends.add(toDateInputValue(friday));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return weekends.size;
}

function getRelevantWeekendRange(startDate, endDate, referenceDate) {
  if (!(startDate instanceof Date) || !(endDate instanceof Date) || !(referenceDate instanceof Date)) {
    return null;
  }

  const normalizedReference = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const day = normalizedReference.getDay();
  const friday = new Date(normalizedReference);

  if (day === 6) {
    friday.setDate(friday.getDate() - 1);
  } else if (day === 0) {
    friday.setDate(friday.getDate() - 2);
  } else if (day !== 5) {
    friday.setDate(friday.getDate() + ((5 - day + 7) % 7));
  }

  const sunday = new Date(friday);
  sunday.setDate(sunday.getDate() + 2);
  const clampedStart = new Date(Math.max(friday.getTime(), startDate.getTime()));
  const clampedEnd = new Date(Math.min(sunday.getTime(), endDate.getTime()));

  if (clampedStart > clampedEnd) {
    return null;
  }

  return {
    start: toDateInputValue(clampedStart),
    end: toDateInputValue(clampedEnd),
  };
}

function formatDateTime(item) {
  const base = formatDate(item.date);
  return item.time ? `${base} ${item.time}` : base;
}

function formatTimestamp(unixSeconds) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(Number(unixSeconds) * 1000));
}

function typeLabel(type) {
  return {
    expense: "Spesa",
    income: "Entrata extra",
    saving: "Risparmio",
    debt: "Debito",
  }[type];
}

function escapeAttribute(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function lowerText(value) {
  return String(value ?? "").toLowerCase();
}

document.body.addEventListener("change", (event) => {
  const movementTimeInput = event.target.closest(".movement-time-input");
  if (movementTimeInput) {
    const sourceKind = movementTimeInput.dataset.sourceKind || "transaction";
    const target = sourceKind === "income" ? findIncomeById(movementTimeInput.dataset.id) : findTransactionById(movementTimeInput.dataset.id);
    if (!target) {
      return;
    }
    const nextTime = movementTimeInput.value.trim();
    const previousTime = String(target.time || "");
    if (nextTime === previousTime) {
      movementTimeInput.value = previousTime;
      return;
    }

    const confirmed = window.confirm(
      `Confermi il cambio ora del movimento da ${previousTime || "nessuna ora"} a ${nextTime || "nessuna ora"}?`,
    );
    if (!confirmed) {
      movementTimeInput.value = previousTime;
      return;
    }

    target.time = nextTime;
    saveState();
    render();
    return;
  }

  const movementTypeInput = event.target.closest(".movement-type-input");
  if (movementTypeInput) {
    const sourceKind = movementTypeInput.dataset.sourceKind || "transaction";
    if (sourceKind !== "transaction") {
      movementTypeInput.value = "income";
      return;
    }

    const transaction = findTransactionById(movementTypeInput.dataset.id);
    if (!transaction) {
      return;
    }

    transaction.type = movementTypeInput.value;
    saveState();
    render();
    return;
  }

  const movementDateInput = event.target.closest(".movement-date-input");
  if (movementDateInput) {
    const sourceKind = movementDateInput.dataset.sourceKind || "transaction";
    const nextDate = movementDateInput.value;
    const context = sourceKind === "income"
      ? findIncomeContextById(movementDateInput.dataset.id)
      : findTransactionContextById(movementDateInput.dataset.id);
    if (!context) {
      return;
    }
    const targetEntry = sourceKind === "income" ? context.income : context.transaction;
    const previousDate = targetEntry.date;
    if (!nextDate || nextDate === previousDate) {
      movementDateInput.value = previousDate;
      return;
    }

    const confirmed = window.confirm(`Confermi il cambio data del movimento da ${formatDate(previousDate)} a ${formatDate(nextDate)}?`);
    if (!confirmed) {
      movementDateInput.value = previousDate;
      return;
    }

    const targetDate = new Date(`${nextDate}T00:00`);
    const targetMonthIndex = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();
    const targetMonth = state.months.find((month) => month.id === targetMonthIndex && month.year === targetYear);

    targetEntry.date = nextDate;
    if (targetMonth && targetMonth !== context.month) {
      if (sourceKind === "income") {
        context.month.incomes = context.month.incomes.filter((item) => item.id !== targetEntry.id);
        targetMonth.incomes.unshift(targetEntry);
      } else {
        context.month.transactions = context.month.transactions.filter((item) => item.id !== targetEntry.id);
        targetMonth.transactions.unshift(targetEntry);
      }
    }

    saveState();
    render();
    return;
  }

  const categoryUndefinedToggle = event.target.closest(".category-undefined-toggle");
  if (categoryUndefinedToggle) {
    const category = findCategoryById(categoryUndefinedToggle.dataset.id);
    if (!category) {
      return;
    }
    category.isUndefinedBudget = categoryUndefinedToggle.checked;
    saveState();
    render();
    return;
  }

  const categoryBudgetInput = event.target.closest(".category-budget-input");
  if (categoryBudgetInput) {
    const category = findCategoryById(categoryBudgetInput.dataset.id);
    if (!category) {
      return;
    }
    category.budget = Number(categoryBudgetInput.value || 0);
    saveState();
    render();
    return;
  }

  const categoryInput = event.target.closest(".movement-category-input");
  if (categoryInput) {
    const transaction = findTransactionById(categoryInput.dataset.id);
    if (!transaction) {
      return;
    }
    transaction.category = categoryInput.value.trim() || transaction.category;
    saveState();
    render();
    return;
  }

  const noteInput = event.target.closest(".movement-note-input");
  if (noteInput) {
    const sourceKind = noteInput.dataset.sourceKind || "transaction";
    const target = sourceKind === "income" ? findIncomeById(noteInput.dataset.id) : findTransactionById(noteInput.dataset.id);
    if (!target) {
      return;
    }
    if (sourceKind === "income") {
      target.name = noteInput.value.trim();
    } else {
      target.note = noteInput.value.trim();
    }
    saveState();
    render();
    return;
  }

  const incomeDateInput = event.target.closest(".income-date-input");
  if (incomeDateInput) {
    const income = findIncomeById(incomeDateInput.dataset.id);
    if (!income) {
      return;
    }
    income.date = incomeDateInput.value || income.date || "";
    saveState();
    render();
    return;
  }

  const incomeTimeInput = event.target.closest(".income-time-input");
  if (incomeTimeInput) {
    const income = findIncomeById(incomeTimeInput.dataset.id);
    if (!income) {
      return;
    }
    income.time = incomeTimeInput.value.trim();
    saveState();
    render();
  }
});

function selectMonth(identifier) {
  const selectedMonth = typeof identifier === "string"
    ? state.months.find((month) => monthKey(month) === identifier)
    : state.months.find((month) => month.id === Number(identifier) && month.year === getSelectedMonth().year)
      || state.months.find((month) => month.id === Number(identifier));
  setSelectedMonth(selectedMonth);
  clearChartZoom();
  saveState();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.selectMonth = selectMonth;
