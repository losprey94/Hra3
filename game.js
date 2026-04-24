const SAVE_KEY = "window_factory_tycoon_v1";

const RESOURCES = ["cash", "research", "reputation", "parts", "tokens"];

const lineDefs = [
  { id: "cutter", name: "Frame Cutter", baseCost: 50, baseRate: 0.2, icon: "▦", unlockReq: null },
  { id: "furnace", name: "Glass Furnace", baseCost: 300, baseRate: 0.29, icon: "◍", unlockReq: { line: "cutter", level: 9 } },
  { id: "assembler", name: "Assembly Robot", baseCost: 1300, baseRate: 0.39, icon: "◈", unlockReq: { line: "furnace", level: 8 } },
  { id: "qc", name: "Quality Scanner", baseCost: 5600, baseRate: 0.52, icon: "◎", unlockReq: { line: "assembler", level: 7 } },
  { id: "pack", name: "Packaging Bay", baseCost: 26000, baseRate: 0.68, icon: "⬣", unlockReq: { line: "qc", level: 6 } }
];

const lineMilestones = [5, 10, 20, 50];

const divisionDefs = [
  { id: "residential", name: "Residential Unit", reqCash: 900, bonus: 0.06 },
  { id: "commercial", name: "Commercial Unit", reqCash: 8200, bonus: 0.09 },
  { id: "smartglass", name: "SmartGlass Unit", reqCash: 44000, bonus: 0.13 },
  { id: "aeroshield", name: "AeroShield Lab", reqCash: 220000, bonus: 0.18 }
];

const contractTemplates = [
  { id: "starter", name: "Neighborhood Retrofit", baseDuration: 170, baseWindows: 110, minRep: 0, failRep: 2, rewards: { cash: 130, rep: 2, parts: 2 }, fragments: 1 },
  { id: "green", name: "Eco Tower Fitout", baseDuration: 340, baseWindows: 300, minRep: 10, failRep: 3, rewards: { cash: 470, rep: 4, research: 5 }, fragments: 2, special: "research_bonus" },
  { id: "airport", name: "Airport Terminal Rush", baseDuration: 560, baseWindows: 680, minRep: 24, failRep: 4, rewards: { cash: 1250, rep: 7, parts: 9 }, fragments: 3, special: "rush_bonus" },
  { id: "fragile", name: "Fragile Glass Emergency", baseDuration: 430, baseWindows: 540, minRep: 28, failRep: 8, rewards: { cash: 1850, rep: 5, parts: 6 }, fragments: 4, special: "risky_parts" },
  { id: "lux", name: "Luxury Skyline Contract", baseDuration: 980, baseWindows: 1680, minRep: 42, failRep: 6, rewards: { cash: 3850, rep: 11, research: 15, parts: 16 }, fragments: 7, special: "blueprint_fragments_bonus" }
];

const contractTypes = {
  Standard: { durationMul: 1, rewardMul: 1, windowsMul: 1, repBonus: 0, fragmentMul: 1, riskPenaltyChance: 0, reqRepMul: 1 },
  Rush: { durationMul: 0.68, rewardMul: 1.22, windowsMul: 1.1, repBonus: 1, fragmentMul: 0.85, riskPenaltyChance: 0, reqRepMul: 1.2 },
  Premium: { durationMul: 1.35, rewardMul: 1.42, windowsMul: 1.25, repBonus: 2, fragmentMul: 1.65, riskPenaltyChance: 0, reqRepMul: 1.25 },
  Risky: { durationMul: 0.92, rewardMul: 1.5, windowsMul: 1.12, repBonus: 0, fragmentMul: 1.15, riskPenaltyChance: 0.24, reqRepMul: 1.1 }
};

const contractSpecialTypes = {
  VIP: { rewardMul: 1.55, durationMul: 1.2, windowsMul: 1.25, repBonus: 2, fragmentBonus: 2, failRepMul: 1.2, weight: 1.1 },
  Chain: { rewardMul: 1.08, durationMul: 0.88, windowsMul: 0.95, repBonus: 0, fragmentBonus: 1, failRepMul: 0.9, weight: 1.35 },
  Boss: { rewardMul: 2.4, durationMul: 1.55, windowsMul: 1.6, repBonus: 4, fragmentBonus: 4, failRepMul: 1.45, weight: 0.42 }
};

const contractModifiers = [
  { id: "high_margin", text: "+30% reward, +40% duration", apply: (c) => { c.rewardMul *= 1.3; c.durationMul *= 1.4; } },
  { id: "speed_bid", text: "-50% duration, -20% reward", apply: (c) => { c.durationMul *= 0.5; c.rewardMul *= 0.8; } },
  { id: "frag_bonus", text: "+2 fragments", apply: (c) => { c.flatFragments += 2; } },
  { id: "line_req", text: "Requires Assembly Robot Lv 6", apply: (c) => { c.requiredLine = { id: "assembler", level: 6 }; c.rewardMul *= 1.12; } },
  { id: "tight_spec", text: "+20% windows, +15% reward", apply: (c) => { c.windowsMul *= 1.2; c.rewardMul *= 1.15; } },
  { id: "secure_client", text: "-25% fail reputation loss", apply: (c) => { c.failRepMul *= 0.75; } }
];

const chestRarities = ["common", "rare", "epic", "legendary"];

const milestoneDefs = [
  { id: "m_short_1", tier: "Short", label: "Produce 2,500 windows", progress: () => state.windowsMade / 2500, reward: { cash: 320, fragments: 2 } },
  { id: "m_short_2", tier: "Short", label: "Complete 5 contracts", progress: () => state.completedContracts / 5, reward: { research: 8, chest: "common" } },
  { id: "m_mid_1", tier: "Mid", label: "Unlock 2 blueprints", progress: () => state.blueprints.length / 2, reward: { chest: "rare", fragments: 4 } },
  { id: "m_mid_2", tier: "Mid", label: "Earn $50K total", progress: () => state.totalEarned / 50000, reward: { tokens: 1, chest: "epic" } },
  { id: "m_long_1", tier: "Long", label: "Complete 20 contracts", progress: () => state.completedContracts / 20, reward: { tokens: 2, chest: "legendary" } }
];

const skillDefs = [
  { id: "prod_1", name: "Line Tuning", branch: "Production", tier: 1, cost: 1, type: "small", desc: "+4% production speed", effect: () => state.modifiers.prod += 0.04 },
  { id: "prod_2", name: "Cut Precision", branch: "Production", tier: 2, cost: 2, type: "small", prereq: "prod_1", desc: "+4% production speed", effect: () => state.modifiers.prod += 0.04 },
  { id: "prod_3", name: "Furnace Pressure", branch: "Production", tier: 3, cost: 3, type: "medium", prereq: "prod_2", desc: "+10% production speed", effect: () => state.modifiers.prod += 0.1 },
  { id: "prod_4", name: "Output Mix", branch: "Production", tier: 4, cost: 4, type: "notable", prereq: "prod_2", desc: "+10% cash/window", effect: () => state.modifiers.cashBonus += 0.1 },
  { id: "prod_5", name: "Keystone: Overdrive Protocol", branch: "Production", tier: 5, cost: 6, type: "keystone", prereq: "prod_3", desc: "▲ +42% production & stronger line milestones ▼ -28% contract rewards and +12% fail penalty", effect: () => { state.modifiers.prod += 0.42; state.modifiers.lineMilestonePower += 0.2; state.modifiers.contractReward -= 0.28; state.modifiers.contractFailurePenaltyMul += 0.12; } },

  { id: "auto_1", name: "Autoload Arms", branch: "Automation", tier: 1, cost: 1, type: "small", desc: "+5% offline efficiency", effect: () => state.modifiers.offlineEfficiency += 0.05 },
  { id: "auto_2", name: "Sensor Mesh", branch: "Automation", tier: 2, cost: 2, type: "small", prereq: "auto_1", desc: "+4% part recovery chance", effect: () => state.modifiers.partsChance += 0.04 },
  { id: "auto_3", name: "Queued Dispatch", branch: "Automation", tier: 3, cost: 3, type: "medium", prereq: "auto_2", desc: "+12% offline efficiency", effect: () => state.modifiers.offlineEfficiency += 0.12 },
  { id: "auto_4", name: "Maintenance AI", branch: "Automation", tier: 4, cost: 4, type: "notable", prereq: "auto_2", desc: "-10% line costs", effect: () => state.modifiers.costDiscount += 0.1 },
  { id: "auto_5", name: "Keystone: Night Shift Grid", branch: "Automation", tier: 5, cost: 6, type: "keystone", prereq: "auto_3", desc: "▲ +52% offline and -8% contract duration ▼ -18% active production", effect: () => { state.modifiers.offlineEfficiency += 0.52; state.modifiers.contractDurationMul -= 0.08; state.modifiers.activeProductionPenalty += 0.18; } },

  { id: "con_1", name: "Client Briefing", branch: "Contracts", tier: 1, cost: 1, type: "small", desc: "+5% contract rewards", effect: () => state.modifiers.contractReward += 0.05 },
  { id: "con_2", name: "Sales Cadence", branch: "Contracts", tier: 2, cost: 2, type: "small", prereq: "con_1", desc: "+5% contract rewards", effect: () => state.modifiers.contractReward += 0.05 },
  { id: "con_3", name: "Premium Clauses", branch: "Contracts", tier: 3, cost: 3, type: "medium", prereq: "con_2", desc: "+12% premium and +8% VIP contract rewards", effect: () => { state.modifiers.premiumContractReward += 0.12; state.modifiers.vipContractReward += 0.08; } },
  { id: "con_4", name: "Rapid Negotiation", branch: "Contracts", tier: 4, cost: 4, type: "notable", prereq: "con_2", desc: "-10% contract duration", effect: () => state.modifiers.contractDurationMul -= 0.1 },
  { id: "con_5", name: "Keystone: All-In Brokerage", branch: "Contracts", tier: 5, cost: 6, type: "keystone", prereq: "con_3", desc: "▲ +78% contract rewards and chain mastery ▼ +40% duration and -14% production", effect: () => { state.modifiers.contractReward += 0.78; state.modifiers.contractDurationMul += 0.4; state.modifiers.prod -= 0.14; state.flags.chainMastery = true; } },

  { id: "eco_1", name: "Tax Timing", branch: "Economy", tier: 1, cost: 1, type: "small", desc: "+4% cash/window", effect: () => state.modifiers.cashBonus += 0.04 },
  { id: "eco_2", name: "Bulk Negotiation", branch: "Economy", tier: 2, cost: 2, type: "small", prereq: "eco_1", desc: "-4% line costs", effect: () => state.modifiers.costDiscount += 0.04 },
  { id: "eco_3", name: "Capital Rotation", branch: "Economy", tier: 3, cost: 3, type: "medium", prereq: "eco_2", desc: "+10% cash/window", effect: () => state.modifiers.cashBonus += 0.1 },
  { id: "eco_4", name: "Margin Controls", branch: "Economy", tier: 4, cost: 4, type: "notable", prereq: "eco_2", desc: "-10% line costs", effect: () => state.modifiers.costDiscount += 0.1 },
  { id: "eco_5", name: "Keystone: Profit Doctrine", branch: "Economy", tier: 5, cost: 6, type: "keystone", prereq: "eco_3", desc: "▲ +24% cash, -14% costs, resist economy soft cap ▼ -28% fragment gains", effect: () => { state.modifiers.cashBonus += 0.24; state.modifiers.costDiscount += 0.14; state.modifiers.economicPressureResist += 0.18; state.modifiers.fragmentGain -= 0.28; } },

  { id: "qual_1", name: "Optic Calibration", branch: "Quality", tier: 1, cost: 1, type: "small", desc: "+5% reputation gain", effect: () => state.modifiers.reputationGain += 0.05 },
  { id: "qual_2", name: "Defect Catchers", branch: "Quality", tier: 2, cost: 2, type: "small", prereq: "qual_1", desc: "+4% part recovery chance", effect: () => state.modifiers.partsChance += 0.04 },
  { id: "qual_3", name: "Seal Inspection", branch: "Quality", tier: 3, cost: 3, type: "medium", prereq: "qual_2", desc: "-12% contract fail reputation loss", effect: () => state.modifiers.contractFailurePenaltyMul -= 0.12 },
  { id: "qual_4", name: "Premium Standard", branch: "Quality", tier: 4, cost: 4, type: "notable", prereq: "qual_2", desc: "+10% contract rewards", effect: () => state.modifiers.contractReward += 0.1 },
  { id: "qual_5", name: "Keystone: Zero Defect Pledge", branch: "Quality", tier: 5, cost: 6, type: "keystone", prereq: "qual_3", desc: "▲ +22% rep, +12% parts, boss specialist ▼ -18% cash/window", effect: () => { state.modifiers.reputationGain += 0.22; state.modifiers.partsChance += 0.12; state.modifiers.cashBonus -= 0.18; state.flags.bossBreaker = true; } },

  { id: "work_1", name: "Shift Meals", branch: "Workforce", tier: 1, cost: 1, type: "small", desc: "+4% rush power", effect: () => state.modifiers.rushPower += 0.04 },
  { id: "work_2", name: "Safety Program", branch: "Workforce", tier: 2, cost: 2, type: "small", prereq: "work_1", desc: "-5% fail reputation loss", effect: () => state.modifiers.contractFailurePenaltyMul -= 0.05 },
  { id: "work_3", name: "Crew Rhythm", branch: "Workforce", tier: 3, cost: 3, type: "medium", prereq: "work_2", desc: "+10% production speed", effect: () => state.modifiers.prod += 0.1 },
  { id: "work_4", name: "Union Coordination", branch: "Workforce", tier: 4, cost: 4, type: "notable", prereq: "work_2", desc: "+12% rush duration", effect: () => state.modifiers.rushDuration += 1.2 },
  { id: "work_5", name: "Keystone: Human Priority", branch: "Workforce", tier: 5, cost: 6, type: "keystone", prereq: "work_3", desc: "▲ -38% fail loss, +16% rush power, adaptive blueprints ▼ -14% offline gains", effect: () => { state.modifiers.contractFailurePenaltyMul -= 0.38; state.modifiers.rushPower += 0.16; state.modifiers.offlineEfficiency -= 0.14; state.flags.adaptiveBlueprints = true; } }
];

const blueprintDefs = [
  { id: "bp_frame", name: "Reinforced Frame Blueprint", desc: "Common: +4% production and +2% line synergy scaling", rarity: "Common", fragmentCost: 20, effect: () => { state.modifiers.prod += 0.04; state.modifiers.lineSynergy += 0.02; } },
  { id: "bp_glass", name: "Precision Glass Cut Blueprint", desc: "Rare: +4% contract payouts, +8% VIP payouts, small double-reward chance", rarity: "Rare", fragmentCost: 45, effect: () => { state.modifiers.contractReward += 0.04; state.modifiers.vipContractReward += 0.08; state.flags.bpDoubleContractRewardChance = true; } },
  { id: "bp_thermal", name: "Thermal Seal Blueprint", desc: "Rare: +5% offline efficiency, reduced economic pressure, first contract bonus fragments", rarity: "Rare", fragmentCost: 80, effect: () => { state.modifiers.offlineEfficiency += 0.05; state.modifiers.economicPressureResist += 0.06; state.flags.bpFirstContractFragBonus = true; } },
  { id: "bp_assembly", name: "Smart Assembly Blueprint", desc: "Epic: +2% parts/+2% rep and boosts milestone power after tier 3 contracts", rarity: "Epic", fragmentCost: 130, effect: () => { state.modifiers.partsChance += 0.02; state.modifiers.reputationGain += 0.02; if (state.contractTier >= 3) state.modifiers.lineMilestonePower += 0.16; } },
  { id: "bp_finish", name: "Premium Finish Blueprint", desc: "Legendary: adaptive economy boost, first upgrade discount, rush cycle bonus", rarity: "Legendary", fragmentCost: 190, effect: () => { const dynamicCash = Math.min(0.12, state.completedContracts * 0.003); state.modifiers.cashBonus += 0.03 + dynamicCash; state.modifiers.premiumContractReward += 0.03; state.flags.bpFirstUpgradeDiscount = true; state.flags.bpRushPartsBonus = true; } }
];

const modifierPool = [
  { id: "shortage", text: "Glass Shortage: -18% production for 3 minutes", duration: 180, prodMul: 0.82 },
  { id: "energy", text: "Energy Crisis: Rush cooldown +10s for 3 minutes", duration: 180, rushCdAdd: 10 },
  { id: "boom", text: "Construction Boom: +12% cash for 3 minutes", duration: 180, cashMul: 1.12 }
];

const defaultState = () => ({
  resources: { cash: 60, research: 0, reputation: 0, parts: 0, tokens: 0 },
  lines: Object.fromEntries(lineDefs.map((l) => [l.id, { level: l.id === "cutter" ? 1 : 0 }])),
  divisions: Object.fromEntries(divisionDefs.map((d) => [d.id, false])),
  contract: null,
  contractBoard: [],
  contractRefreshAt: 0,
  contractContext: { rushUsed: false },
  contractTier: 1,
  contractXp: 0,
  contractChainDepth: 0,
  contractBossWins: 0,
  completedContracts: 0,
  chests: { common: 0, rare: 0, epic: 0, legendary: 0 },
  claimedMilestones: [],
  pendingClaims: [],
  activeBoosts: [],
  skills: [],
  skillPoints: 1,
  skillXp: 0,
  skillLevel: 1,
  nextSkillWindowMilestone: 4000,
  blueprints: [],
  blueprintFragments: 0,
  modifiers: {
    prod: 0,
    rushPower: 0.28,
    rushDuration: 0,
    partsChance: 0,
    quality: 0,
    reputationGain: 0,
    contractReward: 0,
    costDiscount: 0,
    cashBonus: 0,
    premiumContractReward: 0,
    vipContractReward: 0,
    offlineEfficiency: 0,
    activeProductionPenalty: 0,
    contractDurationMul: 1,
    fragmentGain: 1,
    rareFragmentChance: 0,
    researchGain: 0,
    contractFailurePenaltyMul: 1,
    lineMilestonePower: 0,
    lineSynergy: 0,
    economicPressureResist: 0
  },
  flags: {
    continuousCasting: false,
    darkShift: false,
    unionMomentum: false,
    zeroDefect: false,
    priorityPipeline: false,
    ventureCapital: false,
    smartTint: false,
    chainMastery: false,
    bossBreaker: false,
    adaptiveBlueprints: false,
    bpFirstContractFragBonus: false,
    bpRushPartsBonus: false,
    bpFirstUpgradeDiscount: false,
    bpDoubleContractRewardChance: false
  },
  runState: {
    firstContractBonusPending: true,
    firstUpgradeDiscountPending: true,
    rushOrdersUsed: 0
  },
  rush: { activeUntil: 0, cooldownUntil: 0 },
  windowsMade: 0,
  totalEarned: 0,
  activeModifier: null,
  modifierUntil: 0,
  lastTick: Date.now(),
  savedAt: Date.now(),
  playtime: 0,
  modernizationCount: 0,
  advancedTech: { points: 0, unlocked: false },
  metaUpgrades: {
    startCash: 0,
    startupMomentum: 0,
    lineCalibration: 0,
    costEngineering: 0,
    contractNegotiation: 0,
    rareContractSignal: 0,
    fragmentMagnet: 0,
    fragmentRefining: 0,
    offlineLogistics: 0,
    offlineCap: 0,
    autoClaim: 0,
    strategyProd: 0,
    strategyContracts: 0,
    strategyBlueprints: 0
  },
  settings: {
    showFloatingNumbers: true,
    autoBoost: false,
    compactUi: false,
    animations: true,
    reducedMotion: false,
    glowIntensity: "medium",
    soundEnabled: false,
    soundVolume: 60,
    lowPerf: false,
    fpsFriendly: false,
    numberFormat: "short",
    confirmMajorActions: true,
    haptics: false
  }
});

let state = loadState();
let tickerFrame = 0;
let goalReadyLastTick = false;
let hudCache = { resources: "", rps: "", wps: "", goal: "", cash: "" };
let activeModal = "";
let fpsFrameSkip = 0;
let drawerOpen = false;
let uiRefreshTimer = 0;
let lastGameLoopErrorAt = 0;
let lastStateValidationAt = 0;
const repairWarningState = { lastAt: 0, count: 0 };

const el = {
  resourceStrip: document.getElementById("resourceStrip"),
  lineList: document.getElementById("lineList"),
  divisionList: document.getElementById("divisionList"),
  contractList: document.getElementById("contractList"),
  activeContract: document.getElementById("activeContract"),
  contractRefreshBtn: document.getElementById("contractRefreshBtn"),
  contractRefreshStatus: document.getElementById("contractRefreshStatus"),
  skillBranches: document.getElementById("skillBranches"),
  blueprintList: document.getElementById("blueprintList"),
  openChestBtn: document.getElementById("openChestBtn"),
  claimAllBtn: document.getElementById("claimAllBtn"),
  chestCountLabel: document.getElementById("chestCountLabel"),
  activeBoostList: document.getElementById("activeBoostList"),
  milestoneList: document.getElementById("milestoneList"),
  claimList: document.getElementById("claimList"),
  rushBtn: document.getElementById("rushBtn"),
  rushStatus: document.getElementById("rushStatus"),
  missionProgress: document.getElementById("missionProgress"),
  missionHint: document.getElementById("missionHint"),
  rpsLabel: document.getElementById("rpsLabel"),
  wpsLabel: document.getElementById("wpsLabel"),
  cashFocus: document.getElementById("cashFocus"),
  goalLabel: document.getElementById("goalLabel"),
  recommendedText: document.getElementById("recommendedText"),
  recommendedBtn: document.getElementById("recommendedBtn"),
  lastSavedLabel: document.getElementById("lastSavedLabel"),
  incomeTicker: document.getElementById("incomeTicker"),
  factoryView: document.getElementById("factoryView"),
  energyWave: document.getElementById("energyWave"),
  factoryGrid: document.getElementById("factoryGrid"),
  fxLayer: document.getElementById("fxLayer"),
  toastLayer: document.getElementById("toastLayer"),
  sideMenu: document.getElementById("sideMenu"),
  closeMenuBtn: document.getElementById("closeMenuBtn"),
  drawerOverlay: document.getElementById("drawerOverlay"),
  modalLayer: document.getElementById("modalLayer"),
  modifierBanner: document.getElementById("modifierBanner")
};

let lineBuyMode = "1";

validateGameState("startup");
validateConfig();
bootstrapFactoryVisual();
bindEvents();
recalculateProgressionEffects();
applyOfflineEarnings();
applySettingsToUI();
renderAll();
setInterval(gameTick, 250);
setInterval(autoSave, 10000);

function safeNumber(value, context = "unknown", details = null) {
  const n = Number(value);
  if (Number.isFinite(n)) return n;
  console.warn(`[safeNumber] Invalid numeric value in ${context}. Fallback to 0.`, { value, details });
  return 0;
}

function safeDiv(numerator, denominator, context = "divide") {
  const num = safeNumber(numerator, `${context}:numerator`);
  const den = safeNumber(denominator, `${context}:denominator`);
  if (den === 0) {
    console.warn(`[safeDiv] Division by zero in ${context}. Fallback to 0.`, { numerator, denominator });
    return 0;
  }
  return num / den;
}

function warnRepair(issue, details = null) {
  const now = Date.now();
  if (now - repairWarningState.lastAt < 2000 && repairWarningState.count > 8) return;
  if (now - repairWarningState.lastAt >= 2000) repairWarningState.count = 0;
  repairWarningState.lastAt = now;
  repairWarningState.count += 1;
  console.warn(`[state-repair] ${issue}`, details || "");
}

function finiteOrDefault(value, fallback, label) {
  const n = Number(value);
  if (Number.isFinite(n)) return n;
  warnRepair(`Invalid number repaired: ${label}`, { value, fallback });
  return fallback;
}

function clampNonNegative(value, fallback, label) {
  const n = finiteOrDefault(value, fallback, label);
  if (n < 0) {
    warnRepair(`Negative value clamped: ${label}`, { value: n });
    return 0;
  }
  return n;
}

function validateGameState(reason = "runtime") {
  const defaults = defaultState();
  if (!state || typeof state !== "object") {
    warnRepair(`State object missing (${reason}), restoring defaults.`);
    state = defaults;
    return;
  }

  state.resources = { ...defaults.resources, ...(state.resources || {}) };
  Object.keys(defaults.resources).forEach((key) => {
    state.resources[key] = clampNonNegative(state.resources[key], defaults.resources[key], `resources.${key}`);
  });

  state.lines = { ...defaults.lines, ...(state.lines || {}) };
  lineDefs.forEach((line) => {
    const raw = state.lines[line.id]?.level;
    const fixed = Math.floor(clampNonNegative(raw, defaults.lines[line.id].level, `lines.${line.id}.level`));
    state.lines[line.id] = { level: fixed };
  });
  if (state.lines.cutter.level < 1) {
    warnRepair("Cutter level repaired to minimum 1.");
    state.lines.cutter.level = 1;
  }

  state.divisions = { ...defaults.divisions, ...(state.divisions || {}) };
  divisionDefs.forEach((d) => {
    state.divisions[d.id] = !!state.divisions[d.id];
  });

  state.modifiers = { ...defaults.modifiers, ...(state.modifiers || {}) };
  Object.keys(defaults.modifiers).forEach((key) => {
    state.modifiers[key] = finiteOrDefault(state.modifiers[key], defaults.modifiers[key], `modifiers.${key}`);
  });

  state.flags = { ...defaults.flags, ...(state.flags || {}) };
  Object.keys(defaults.flags).forEach((k) => {
    state.flags[k] = !!state.flags[k];
  });

  state.metaUpgrades = { ...defaults.metaUpgrades, ...(state.metaUpgrades || {}) };
  Object.keys(defaults.metaUpgrades).forEach((k) => {
    state.metaUpgrades[k] = Math.floor(clampNonNegative(state.metaUpgrades[k], defaults.metaUpgrades[k], `metaUpgrades.${k}`));
  });

  state.rush = { ...defaults.rush, ...(state.rush || {}) };
  state.rush.activeUntil = clampNonNegative(state.rush.activeUntil, defaults.rush.activeUntil, "rush.activeUntil");
  state.rush.cooldownUntil = clampNonNegative(state.rush.cooldownUntil, defaults.rush.cooldownUntil, "rush.cooldownUntil");
  state.runState = { ...defaults.runState, ...(state.runState || {}) };
  state.runState.firstContractBonusPending = !!state.runState.firstContractBonusPending;
  state.runState.firstUpgradeDiscountPending = !!state.runState.firstUpgradeDiscountPending;
  state.runState.rushOrdersUsed = Math.floor(clampNonNegative(state.runState.rushOrdersUsed, 0, "runState.rushOrdersUsed"));

  state.contractTier = Math.max(1, Math.floor(clampNonNegative(state.contractTier, 1, "contractTier")));
  state.contractXp = clampNonNegative(state.contractXp, 0, "contractXp");
  state.completedContracts = Math.floor(clampNonNegative(state.completedContracts, 0, "completedContracts"));
  state.contractChainDepth = Math.floor(clampNonNegative(state.contractChainDepth, 0, "contractChainDepth"));
  state.contractBossWins = Math.floor(clampNonNegative(state.contractBossWins, 0, "contractBossWins"));

  state.skillPoints = Math.floor(clampNonNegative(state.skillPoints, defaults.skillPoints, "skillPoints"));
  state.skillXp = clampNonNegative(state.skillXp, defaults.skillXp, "skillXp");
  state.skillLevel = Math.max(1, Math.floor(clampNonNegative(state.skillLevel, defaults.skillLevel, "skillLevel")));
  state.nextSkillWindowMilestone = Math.max(4000, clampNonNegative(state.nextSkillWindowMilestone, defaults.nextSkillWindowMilestone, "nextSkillWindowMilestone"));
  state.blueprintFragments = Math.floor(clampNonNegative(state.blueprintFragments, defaults.blueprintFragments, "blueprintFragments"));
  state.windowsMade = clampNonNegative(state.windowsMade, defaults.windowsMade, "windowsMade");
  state.totalEarned = clampNonNegative(state.totalEarned, defaults.totalEarned, "totalEarned");
  state.playtime = clampNonNegative(state.playtime, defaults.playtime, "playtime");
  state.modernizationCount = Math.floor(clampNonNegative(state.modernizationCount, defaults.modernizationCount, "modernizationCount"));

  state.chests = { ...defaults.chests, ...(state.chests || {}) };
  chestRarities.forEach((r) => {
    state.chests[r] = Math.floor(clampNonNegative(state.chests[r], 0, `chests.${r}`));
  });

  if (!Array.isArray(state.activeBoosts)) state.activeBoosts = [];
  state.activeBoosts = state.activeBoosts
    .filter((b) => b && typeof b === "object")
    .map((b) => ({
      kind: typeof b.kind === "string" ? b.kind : "prod",
      value: finiteOrDefault(b.value, 0, "activeBoost.value"),
      until: clampNonNegative(b.until, Date.now(), "activeBoost.until")
    }))
    .filter((b) => b.until > Date.now() - 60000);

  if (!Array.isArray(state.pendingClaims)) state.pendingClaims = [];
  if (!Array.isArray(state.claimedMilestones)) state.claimedMilestones = [];
  if (!Array.isArray(state.skills)) state.skills = [];
  if (!Array.isArray(state.blueprints)) state.blueprints = [];
  if (!Array.isArray(state.contractBoard)) state.contractBoard = [];

  state.skills = state.skills.filter((id) => skillDefs.some((s) => s.id === id));
  state.blueprints = state.blueprints.filter((id) => blueprintDefs.some((bp) => bp.id === id));

  state.contractBoard = state.contractBoard
    .filter((c) => c && typeof c === "object")
    .map((c) => ({
      ...c,
      duration: Math.max(1, Math.floor(clampNonNegative(c.duration, 1, "contractBoard.duration"))),
      windows: Math.max(1, Math.floor(clampNonNegative(c.windows, 1, "contractBoard.windows"))),
      minRep: clampNonNegative(c.minRep, 0, "contractBoard.minRep"),
      failRep: clampNonNegative(c.failRep, 1, "contractBoard.failRep"),
      tierRequired: Math.max(1, Math.floor(clampNonNegative(c.tierRequired || 1, 1, "contractBoard.tierRequired"))),
      rewards: {
        cash: clampNonNegative(c.rewards?.cash, 0, "contractBoard.rewards.cash"),
        rep: clampNonNegative(c.rewards?.rep, 0, "contractBoard.rewards.rep"),
        research: clampNonNegative(c.rewards?.research, 0, "contractBoard.rewards.research"),
        parts: clampNonNegative(c.rewards?.parts, 0, "contractBoard.rewards.parts")
      }
    }));

  if (state.contract && typeof state.contract === "object") {
    state.contract.targetWindows = Math.max(1, Math.floor(clampNonNegative(state.contract.targetWindows || state.contract.windows, 1, "contract.targetWindows")));
    state.contract.progress = Math.min(state.contract.targetWindows, clampNonNegative(state.contract.progress, 0, "contract.progress"));
    state.contract.remaining = clampNonNegative(state.contract.remaining, 0, "contract.remaining");
    state.contract.fragmentReward = clampNonNegative(state.contract.fragmentReward || 0, 0, "contract.fragmentReward");
    state.contract.rewardPack = {
      cash: clampNonNegative(state.contract.rewardPack?.cash, 0, "contract.rewardPack.cash"),
      rep: clampNonNegative(state.contract.rewardPack?.rep, 0, "contract.rewardPack.rep"),
      research: clampNonNegative(state.contract.rewardPack?.research, 0, "contract.rewardPack.research"),
      parts: clampNonNegative(state.contract.rewardPack?.parts, 0, "contract.rewardPack.parts")
    };
    if (state.contract.remaining <= 0 || state.contract.progress >= state.contract.targetWindows) {
      state.contract.status = "completed";
      state.contract.remaining = 0;
      state.contract.progress = state.contract.targetWindows;
    } else {
      state.contract.status = "active";
    }
  } else {
    state.contract = null;
  }
}

function validateConfig() {
  const unique = (arr, label) => {
    const ids = arr.map((x) => x.id);
    if (new Set(ids).size !== ids.length) {
      console.warn(`Duplicate ${label} IDs detected.`);
    }
  };
  unique(lineDefs, "line");
  unique(divisionDefs, "division");
  unique(contractTemplates, "contract");
  unique(skillDefs, "skill");
  unique(blueprintDefs, "blueprint");

  lineDefs.forEach((line) => {
    if (line.unlockReq && !lineDefs.find((x) => x.id === line.unlockReq.line)) {
      console.warn(`Invalid unlock requirement on line: ${line.id}`);
      line.unlockReq = null;
    }
  });
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
      tabBtn.classList.add("active");
      const target = tabBtn.dataset.tab;
      document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
      const screen = document.getElementById(`screen-${target}`);
      if (screen) screen.classList.add("active");
    });
  });

  document.getElementById("rushBtn")?.addEventListener("click", activateRush);
  document.getElementById("menuButton")?.addEventListener("click", toggleDrawer);
  el.closeMenuBtn?.addEventListener("click", () => setDrawerOpen(false));
  el.drawerOverlay?.addEventListener("click", () => setDrawerOpen(false));
  el.drawerOverlay?.addEventListener("touchstart", () => setDrawerOpen(false), { passive: true });

  document.getElementById("researchBtn")?.addEventListener("click", convertResearch);
  document.getElementById("prestigeBtn")?.addEventListener("click", openModernizationHub);
  document.getElementById("settingsBtn")?.addEventListener("click", openSettingsPanel);
  document.getElementById("statsBtn")?.addEventListener("click", showStats);
  document.getElementById("saveBtn")?.addEventListener("click", () => {
    autoSave();
    toast("Game saved.");
  });
  document.getElementById("resetBtn")?.addEventListener("click", hardReset);
  el.openChestBtn?.addEventListener("click", openChestPanel);
  el.claimAllBtn?.addEventListener("click", claimAllRewards);
  el.recommendedBtn?.addEventListener("click", triggerRecommendedAction);
  document.querySelectorAll("[data-bulk]").forEach((btn) => {
    btn.addEventListener("click", () => {
      lineBuyMode = btn.dataset.bulk;
      document.querySelectorAll("[data-bulk]").forEach((b) => b.classList.toggle("active", b === btn));
      renderFactory();
    });
  });

  el.modalLayer?.addEventListener("click", (e) => {
    if (e.target === el.modalLayer) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawerOpen) setDrawerOpen(false);
    if (e.key === "Escape" && !el.modalLayer.classList.contains("hidden")) closeModal();
  });
}

function toggleDrawer() {
  setDrawerOpen(!drawerOpen);
}

function setDrawerOpen(open) {
  drawerOpen = !!open;
  if (el.sideMenu) {
    el.sideMenu.classList.toggle("open", drawerOpen);
    el.sideMenu.setAttribute("aria-hidden", drawerOpen ? "false" : "true");
  }
  document.getElementById("menuButton")?.setAttribute("aria-expanded", drawerOpen ? "true" : "false");
  el.drawerOverlay?.classList.toggle("open", drawerOpen);
  document.body.classList.toggle("drawer-open", drawerOpen);
}

function gameTick() {
  const now = Date.now();
  if (state.settings.fpsFriendly) {
    fpsFrameSkip = (fpsFrameSkip + 1) % 2;
    if (fpsFrameSkip === 1) return;
  }
  try {
    if (now - lastStateValidationAt > 1500) {
      validateGameState("tick");
      lastStateValidationAt = now;
    }
    const dt = Math.max(0, Math.min(safeNumber((now - state.lastTick) / 1000, "gameTick:dt"), 2.5));
    state.lastTick = now;
    state.playtime += dt;

    const windowsPerSec = Math.max(0, safeNumber(calcWindowsPerSec(), "gameTick:windowsPerSec"));
    const made = Math.max(0, safeNumber(windowsPerSec * dt, "gameTick:made", { windowsPerSec, dt }));
    state.windowsMade += made;
    while (state.windowsMade >= state.nextSkillWindowMilestone) {
      grantSkillXp(1, "production milestone");
      state.nextSkillWindowMilestone += 4000;
    }

    const cashPerW = Math.max(0, safeNumber(cashPerWindow(), "gameTick:cashPerWindow"));
    const cashGain = Math.max(0, safeNumber(made * cashPerW, "gameTick:cashGain", { made, cashPerW }));
    state.resources.cash = Math.max(0, safeNumber(state.resources.cash + cashGain, "gameTick:cashTotal"));
    state.totalEarned = Math.max(0, safeNumber(state.totalEarned + cashGain, "gameTick:totalEarned"));

    if (Math.random() < (0.03 + safeNumber(state.modifiers.partsChance, "gameTick:partsChance")) * dt) {
      state.resources.parts = Math.max(0, safeNumber(state.resources.parts + 1, "gameTick:parts"));
      if (Math.random() < 0.12) toast("Industrial part recovered.");
    }

    state.resources.reputation = Math.max(0, safeNumber(state.resources.reputation + made * 0.0009 * (1 + safeNumber(state.modifiers.reputationGain, "gameTick:repGain")), "gameTick:reputation"));

    tickContract(dt, made);
    tickModifier(now);

    if (now > state.rush.activeUntil && now < state.rush.cooldownUntil) {
      const rem = Math.ceil((state.rush.cooldownUntil - now) / 1000);
      el.rushBtn.disabled = true;
      el.rushBtn.classList.remove("ready");
      el.rushBtn.classList.remove("ready-pulse");
      el.rushBtn.textContent = `Recharging (${rem}s)`;
      el.rushStatus.textContent = `Rush cooldown: ${rem}s`;
    } else if (now <= state.rush.activeUntil) {
      const rem = Math.ceil((state.rush.activeUntil - now) / 1000);
      el.rushBtn.disabled = true;
      el.rushBtn.classList.remove("ready");
      el.rushBtn.classList.remove("ready-pulse");
      el.rushBtn.textContent = `Boosting (${rem}s)`;
      el.rushStatus.textContent = `Rush active (${rem}s).`;
    } else {
      el.rushBtn.disabled = false;
      el.rushBtn.classList.add("ready");
      el.rushBtn.classList.add("ready-pulse");
      el.rushBtn.textContent = "Boost Production";
      const dur = Math.round((5000 + state.modifiers.rushDuration * 1000) / 1000);
      el.rushStatus.textContent = `${dur}s overclock • 32s cooldown`;
    }

    if (state.settings.autoBoost && now >= state.rush.cooldownUntil && now > state.rush.activeUntil) {
      activateRush();
    }

    el.factoryView?.classList.toggle("boosted", now <= state.rush.activeUntil);

    tickerFrame += dt;
    const perfPenalty = state.settings.lowPerf ? 1.35 : 1;
    const flowInterval = (now <= state.rush.activeUntil ? 0.55 : 1) * perfPenalty;
    if (tickerFrame > flowInterval) {
      if (state.settings.animations) animateFlow();
      if (el.incomeTicker) el.incomeTicker.textContent = `+$${fmt(safeDiv(cashGain, dt, "gameTick:incomeTicker"))}/s`;
      if (cashGain > 0.01) spawnMoneyPop(safeDiv(cashGain, dt, "gameTick:moneyPop"), now <= state.rush.activeUntil);
      tickerFrame = 0;
    }

    maybeSpawnModifier(now);
    maybeSpawnClaimEvent(dt);
    renderHUD();
    refreshDynamicViews(dt);
  } catch (error) {
    if (now - lastGameLoopErrorAt > 3000) {
      console.error("[gameTick] Recovered from loop error.", error);
      lastGameLoopErrorAt = now;
    }
    state.lastTick = now;
  }
}

function maybeSpawnClaimEvent(dt) {
  if (state.pendingClaims.some((c) => c.kind === "event")) return;
  if (Math.random() > 0.0012 * dt) return;
  const event = Math.random() < 0.5
    ? { title: "Supplier Windfall", desc: "Claim a quick cash injection.", reward: { cash: 600 } }
    : { title: "Overclock Window", desc: "Claim a 25s production surge.", reward: { boost: { kind: "prod", value: 0.25, duration: 25000 } } };
  state.pendingClaims.push({ id: `ev_${Date.now()}`, kind: "event", ...event });
  toast(`Event ready: ${event.title}`);
}

function refreshDynamicViews(dt) {
  uiRefreshTimer += dt;
  if (uiRefreshTimer < 0.4) return;
  uiRefreshTimer = 0;

  const activeScreen = document.querySelector(".screen.active")?.id || "";
  if (activeScreen === "screen-factory") {
    renderFactory();
    renderDivisions();
  }
  if (activeScreen === "screen-home") {
    renderRewardHub();
  }
  if (activeScreen === "screen-contracts" || state.contract) {
    renderContracts();
  }
  if (activeScreen === "screen-skills") {
    renderSkills();
  }
  if (activeScreen === "screen-blueprints") {
    renderBlueprints();
  }
  if (activeModal === "modernizationHub") {
    updateModernizationHubLive();
  }
}

function getLineMilestoneMultiplier(level) {
  if (level <= 0) return 1;
  let mul = 1;
  lineMilestones.forEach((step, idx) => {
    if (level >= step) mul *= 1 + (0.08 + idx * 0.04) + state.modifiers.lineMilestonePower;
  });
  return mul;
}

function lineMilestonesReached(level) {
  return lineMilestones.filter((step) => level >= step).length;
}

function calcLineSynergyBonus() {
  let pairs = 0;
  let bridgeBonus = 0;
  for (let i = 0; i < lineDefs.length - 1; i += 1) {
    const leftLevel = state.lines[lineDefs[i].id].level;
    const rightLevel = state.lines[lineDefs[i + 1].id].level;
    if (leftLevel > 0 && rightLevel > 0) {
      pairs += 1;
      bridgeBonus += Math.min(leftLevel, rightLevel) * 0.004;
    }
  }
  const base = pairs * 0.03 + bridgeBonus;
  return Math.max(0, base * (1 + state.modifiers.lineSynergy));
}

function economicPressureFactor() {
  const earnedPressure = Math.max(0, Math.log10(1 + state.totalEarned / 180000) * 0.1);
  const levelPressure = Math.max(0, (lineDefs.reduce((sum, line) => sum + state.lines[line.id].level, 0) - 40) * 0.0022);
  const resistRaw = Number(state.modifiers.economicPressureResist) + Number(state.metaUpgrades.strategyBlueprints) * 0.01;
  const resist = Math.min(0.32, Number.isFinite(resistRaw) ? resistRaw : 0);
  return Math.max(0.72, 1 - Math.max(0, earnedPressure + levelPressure - resist));
}

function getMetaSpecialization() {
  const scores = {
    Production: Number(state.metaUpgrades.strategyProd || 0) + Number(state.metaUpgrades.lineCalibration || 0) * 0.4,
    Contracts: Number(state.metaUpgrades.strategyContracts || 0) + Number(state.metaUpgrades.contractNegotiation || 0) * 0.4,
    Blueprints: Number(state.metaUpgrades.strategyBlueprints || 0) + Number(state.metaUpgrades.fragmentMagnet || 0) * 0.4
  };
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : "Balanced";
}

function calcWindowsPerSec() {
  let wps = 0;
  lineDefs.forEach((line) => {
    const lv = state.lines[line.id].level;
    if (lv > 0) {
      const localBoost = 1 + Math.sqrt(lv) * 0.03;
      const milestoneMul = getLineMilestoneMultiplier(lv);
      wps += safeNumber(line.baseRate * lv * localBoost * milestoneMul, `calcWindowsPerSec:${line.id}`);
    }
  });

  const divBoost = 1 + divisionDefs.filter((d) => state.divisions[d.id]).reduce((a, d) => a + d.bonus, 0);
  const skillBoost = 1 + state.modifiers.prod;
  const tokenBoost = 1 + state.resources.tokens * 0.018;
  const rushBoost = Date.now() < state.rush.activeUntil ? 1.55 + state.modifiers.rushPower : 1;
  const startupBoost = 1 + state.metaUpgrades.startupMomentum * (state.totalEarned < 20000 ? 0.018 : 0.01);
  const calibrationBoost = 1 + state.metaUpgrades.lineCalibration * 0.015;
  const activePenalty = 1 - Math.min(0.4, state.modifiers.activeProductionPenalty);

  let modifierMul = 1;
  if (state.activeModifier && state.activeModifier.prodMul) modifierMul *= state.activeModifier.prodMul;

  if (state.flags.continuousCasting) wps *= 1.12;
  if (state.flags.zeroDefect) wps *= 0.95;
  const synergyBoost = 1 + calcLineSynergyBonus();
  const specialization = getMetaSpecialization();
  const specializationBoost = specialization === "Production" ? 1.09 : 1;
  const tempProdBoost = 1 + getActiveBoostValue("prod");
  const total = wps * divBoost * skillBoost * tokenBoost * rushBoost * modifierMul * startupBoost * calibrationBoost * activePenalty * synergyBoost * specializationBoost * tempProdBoost;
  return Math.max(0, safeNumber(total, "calcWindowsPerSec:total", {
    wps, divBoost, skillBoost, tokenBoost, rushBoost, modifierMul, startupBoost, calibrationBoost, activePenalty, synergyBoost, specializationBoost, tempProdBoost
  }));
}

function cashPerWindow() {
  let v = 2.7 * (1 + state.modifiers.cashBonus + getActiveBoostValue("cash"));
  if (state.flags.ventureCapital && state.resources.cash < 1200) v *= 1.08;
  if (state.flags.priorityPipeline) v *= 0.94;
  if (state.activeModifier && state.activeModifier.cashMul) v *= state.activeModifier.cashMul;
  const specialization = getMetaSpecialization();
  if (specialization === "Contracts") v *= 0.95;
  if (specialization === "Blueprints") v *= 1.03;
  return Math.max(0, safeNumber(v * economicPressureFactor(), "cashPerWindow:total", { base: v }));
}

function getActiveBoostValue(kind) {
  const now = Date.now();
  state.activeBoosts = state.activeBoosts.filter((b) => b.until > now);
  return safeNumber(state.activeBoosts.filter((b) => b.kind === kind).reduce((sum, b) => sum + safeNumber(b.value, "getActiveBoostValue:value", b), 0), "getActiveBoostValue:sum");
}

function lineUpgradeCost(line) {
  const lv = state.lines[line.id].level;
  let discount = 1 - Math.min(0.18, state.modifiers.costDiscount);
  discount *= 1 - Math.min(0.2, state.metaUpgrades.costEngineering * 0.01);
  if (state.flags.bpFirstUpgradeDiscount && state.runState.firstUpgradeDiscountPending) discount *= 0.82;
  if (state.flags.unionMomentum) discount *= 1.04;
  return Math.ceil(line.baseCost * Math.pow(1.47, lv) * discount);
}

function lineUpgradeCostAtLevel(line, level) {
  let discount = 1 - Math.min(0.18, state.modifiers.costDiscount);
  discount *= 1 - Math.min(0.2, state.metaUpgrades.costEngineering * 0.01);
  if (state.flags.bpFirstUpgradeDiscount && state.runState.firstUpgradeDiscountPending) discount *= 0.82;
  if (state.flags.unionMomentum) discount *= 1.04;
  return Math.ceil(line.baseCost * Math.pow(1.47, level) * discount);
}

function calcBulkLinePurchase(line, mode = "1") {
  const current = state.lines[line.id].level;
  let qty = 0;
  let totalCost = 0;
  const cash = state.resources.cash;
  const cap = mode === "max" ? 999 : Number(mode);
  for (let i = 0; i < cap; i += 1) {
    const c = lineUpgradeCostAtLevel(line, current + i);
    if (totalCost + c > cash) break;
    totalCost += c;
    qty += 1;
  }
  return { qty, totalCost };
}

function isLineUnlocked(line) {
  if (!line.unlockReq) return true;
  return state.lines[line.unlockReq.line].level >= line.unlockReq.level;
}

function secondsToAfford(cost) {
  if (state.resources.cash >= cost) return 0;
  const rps = Math.max(0, safeNumber(calcWindowsPerSec() * cashPerWindow(), "secondsToAfford:rps", { cost }));
  if (rps <= 0.01) return Infinity;
  return Math.ceil(safeDiv(cost - state.resources.cash, rps, "secondsToAfford:eta"));
}

function timeToAffordLabel(seconds) {
  if (seconds === 0) return "Affordable now";
  if (seconds === Infinity) return "Build income first";
  if (seconds < 60) return `~${seconds}s to afford`;
  if (seconds < 3600) return `~${Math.ceil(seconds / 60)}m to afford`;
  return "~1h+ to afford";
}

function buyLine(lineId, qtyRequest = 1) {
  const def = lineDefs.find((x) => x.id === lineId);
  if (!def) return;
  if (!isLineUnlocked(def)) return;
  const mode = qtyRequest === "mode" ? lineBuyMode : `${qtyRequest}`;
  const plan = calcBulkLinePurchase(def, mode);
  if (plan.qty <= 0 || plan.totalCost <= 0) return;
  if (mode === "max" && plan.qty >= 20 && state.settings.confirmMajorActions) {
    if (!confirm(`Buy Max for ${def.name}? (${plan.qty} upgrades)`)) return;
  }
  const startLv = state.lines[lineId].level;
  state.resources.cash -= plan.totalCost;
  state.lines[lineId].level += plan.qty;
  if (state.flags.bpFirstUpgradeDiscount && state.runState.firstUpgradeDiscountPending) {
    state.runState.firstUpgradeDiscountPending = false;
    showRewardPopup("Blueprint bonus: first upgrade discount used");
  }
  for (const step of lineMilestones) {
    if (startLv < step && state.lines[lineId].level >= step) {
      const milestoneReward = 3 + lineMilestones.indexOf(step) * 2;
      state.resources.research += milestoneReward;
      state.resources.reputation += 0.8 + lineMilestones.indexOf(step) * 0.7;
      showRewardPopup(`${def.name} milestone Lv ${step}`);
      toast(`${def.name} milestone Lv ${step}! +${milestoneReward} research.`);
      if (step >= 20) state.resources.parts += 2 + lineMilestones.indexOf(step);
    }
  }
  flashMachine(lineId);
  toast(`${def.name} upgraded +${plan.qty} to Lv ${state.lines[lineId].level}`);
  validateGameState("buyLine");
  renderAll();
}

function unlockDivision(id) {
  const div = divisionDefs.find((d) => d.id === id);
  if (!div) return;
  if (state.divisions[id] || state.resources.cash < div.reqCash) return;
  state.resources.cash -= div.reqCash;
  state.divisions[id] = true;
  toast(`${div.name} division online.`);
  validateGameState("unlockDivision");
  renderAll();
}

function activateRush() {
  const now = Date.now();
  if (now < state.rush.cooldownUntil) return;
  const duration = 5000 + state.modifiers.rushDuration * 1000;
  const cdPenalty = state.activeModifier?.rushCdAdd ? state.activeModifier.rushCdAdd * 1000 : 0;
  state.rush.activeUntil = now + duration;
  const darkShiftPenalty = state.flags.darkShift ? 3000 : 0;
  state.rush.cooldownUntil = now + 32000 + cdPenalty + darkShiftPenalty;
  state.runState.rushOrdersUsed += 1;
  if (state.flags.bpRushPartsBonus && state.runState.rushOrdersUsed % 10 === 0) {
    state.resources.parts += 5;
    showRewardPopup("Blueprint cycle bonus: +5 parts");
  }
  if (state.contract) state.contractContext.rushUsed = true;
  el.rushBtn?.classList.add("boost-fire");
  if (el.energyWave) {
    el.energyWave.classList.remove("fire");
    void el.energyWave.offsetWidth;
    el.energyWave.classList.add("fire");
    setTimeout(() => el.energyWave.classList.remove("fire"), 800);
  }
  setTimeout(() => el.rushBtn?.classList.remove("boost-fire"), 360);
  if (state.flags.smartTint) state.resources.research += 1;
  toast("Rush Order accepted! Lines overclocked.");
}

function generateContractOffer() {
  const template = contractTemplates[Math.floor(Math.random() * contractTemplates.length)];
  const typeNames = Object.keys(contractTypes);
  const type = typeNames[Math.floor(Math.random() * typeNames.length)];
  const typeCfg = contractTypes[type];
  const modPack = {
    durationMul: typeCfg.durationMul,
    rewardMul: typeCfg.rewardMul,
    windowsMul: typeCfg.windowsMul,
    fragmentMul: typeCfg.fragmentMul,
    reqRepMul: typeCfg.reqRepMul,
    failRepMul: 1,
    flatFragments: 0,
    requiredLine: null
  };
  const mods = [...contractModifiers].sort(() => Math.random() - 0.5).slice(0, Math.random() < 0.45 ? 2 : 1);
  mods.forEach((m) => m.apply(modPack));
  const tierBoost = Math.floor(state.completedContracts / 3) + (state.contractTier - 1);
  const specialType = rollSpecialContractType();
  const specialCfg = specialType ? contractSpecialTypes[specialType] : null;
  const windowsMul = modPack.windowsMul * (specialCfg?.windowsMul || 1);
  const durationMul = modPack.durationMul * (specialCfg?.durationMul || 1);
  const windows = Math.ceil(template.baseWindows * (1 + tierBoost * 0.22) * windowsMul);
  const duration = Math.ceil(template.baseDuration * durationMul);
  const rewards = {
    cash: Math.ceil(template.rewards.cash * (1 + tierBoost * 0.06) * modPack.rewardMul * (specialCfg?.rewardMul || 1)),
    rep: Math.ceil((template.rewards.rep || 0) + typeCfg.repBonus + (specialCfg?.repBonus || 0)),
    research: Math.ceil((template.rewards.research || 0) * modPack.rewardMul * (specialCfg?.rewardMul || 1)),
    parts: Math.ceil((template.rewards.parts || 0) * modPack.rewardMul * (specialCfg?.rewardMul || 1))
  };
  const fragments = Math.max(0, Math.round((template.fragments || 0) * modPack.fragmentMul) + modPack.flatFragments + (specialCfg?.fragmentBonus || 0));
  const tierRequired = specialType === "Boss" ? Math.max(2, state.contractTier) : Math.max(1, state.contractTier - 1);
  const limited = Math.random() < 0.16 + Math.min(0.12, state.contractTier * 0.015);
  const expiresAt = limited ? Date.now() + (35000 + Math.random() * 35000) : 0;
  const valueScore = rewards.cash + fragments * 120 + rewards.research * 60;
  const rarityTier = valueScore > 9000 ? "S" : valueScore > 5000 ? "A" : valueScore > 2400 ? "B" : "C";
  return {
    id: `offer_${Date.now()}_${Math.floor(Math.random() * 99999)}`,
    templateId: template.id,
    name: template.name,
    type,
    duration,
    windows,
    minRep: Math.ceil(template.minRep * modPack.reqRepMul * (specialType === "VIP" ? 1.2 : 1)),
    failRep: Math.max(1, Math.round((template.failRep || 2.5) * modPack.failRepMul * (specialCfg?.failRepMul || 1))),
    rewards,
    fragmentReward: fragments,
    specialType,
    tierRequired,
    limited,
    expiresAt,
    rarityTier,
    special: template.special || null,
    modifiers: mods.map((m) => m.text),
    requiredLine: modPack.requiredLine,
    riskPenaltyChance: typeCfg.riskPenaltyChance + (specialType === "Boss" ? 0.04 : 0)
  };
}

function rollSpecialContractType() {
  if (state.contractTier < 2) return null;
  const specialization = getMetaSpecialization();
  const contractBias = (specialization === "Contracts" ? 0.08 : 0) + (state.metaUpgrades.strategyContracts || 0) * 0.015;
  const chainBias = state.flags.chainMastery ? 0.09 : 0;
  const bossBias = state.flags.bossBreaker ? 0.06 : 0;
  const roll = Math.random();
  if (state.contractTier >= 3 && roll < 0.1 + contractBias + bossBias * 0.4) return "Boss";
  if (roll < 0.24 + contractBias + chainBias) return "Chain";
  if (roll < 0.4 + contractBias * 0.5) return "VIP";
  return null;
}

function ensureContractBoard() {
  const now = Date.now();
  state.contractBoard = state.contractBoard.filter((c) => !c.limited || c.expiresAt > now);
  if (state.contractBoard.length >= 4) return;
  while (state.contractBoard.length < 4) {
    state.contractBoard.push(generateContractOffer());
  }
}

function refreshContractBoard(force = false) {
  const now = Date.now();
  if (!force && now < state.contractRefreshAt) return false;
  state.contractBoard = [];
  ensureContractBoard();
  state.contractRefreshAt = now + 45000;
  return true;
}

function startContract(id) {
  if (state.contract) return;
  const c = state.contractBoard.find((x) => x.id === id);
  if (!c) return;
  if (state.resources.reputation < c.minRep) return;
  if ((c.tierRequired || 1) > state.contractTier) return;
  if (c.requiredLine && state.lines[c.requiredLine.id].level < c.requiredLine.level) return;
  state.contract = {
    ...c,
    targetWindows: c.windows,
    rewardPack: c.rewards,
    fragmentReward: c.fragmentReward || 0,
    remaining: Math.ceil(c.duration * state.modifiers.contractDurationMul),
    progress: 0,
    status: "active",
    rewardGranted: false
  };
  state.contractBoard = state.contractBoard.filter((x) => x.id !== id);
  ensureContractBoard();
  state.contractContext.rushUsed = false;
  state.contractChainDepth = c.specialType === "Chain" ? state.contractChainDepth + 1 : 0;
  toast(`Contract started: ${c.name} (${c.specialType ? `${c.specialType} • ` : ""}${c.type})`);
  renderAll();
}

function tickContract(dt, windowsMade) {
  if (!state.contract) return;
  if (state.contract.status !== "active") return;
  state.contract.remaining = Math.max(0, state.contract.remaining - dt);
  state.contract.progress = Math.min(state.contract.targetWindows, state.contract.progress + windowsMade);

  if (state.contract.progress >= state.contract.targetWindows) {
    markContractCompleted();
    return;
  }

  if (state.contract.remaining <= 0) {
    failContract();
  }
}

function markContractCompleted() {
  const c = state.contract;
  if (!c || c.status !== "active") return;
  c.status = "completed";
  c.remaining = 0;
  c.progress = c.targetWindows;
  toast(`Contract complete: ${c.name}. Claim reward.`);
  renderContracts();
  if (state.metaUpgrades.autoClaim > 0) {
    claimContractReward();
  }
}

function failContract() {
  if (!state.contract || state.contract.status !== "active") return;
  toast("Contract failed. Client unhappy.");
  const failLoss = (state.contract.failRep || 2.5) * Math.max(0.2, state.modifiers.contractFailurePenaltyMul);
  state.resources.reputation = Math.max(0, state.resources.reputation - failLoss);
  state.contract = null;
  state.contractContext.rushUsed = false;
  renderAll();
}

function claimContractReward() {
  const c = state.contract;
  if (!c || c.status !== "completed" || c.rewardGranted) return;
  c.rewardGranted = true;
  const mastery = state.metaUpgrades.contractNegotiation * 0.03;
  let mult = 1 + Math.min(0.32, state.modifiers.contractReward) + mastery;
  if (c.type === "Premium") mult += state.modifiers.premiumContractReward;
  if (c.specialType === "VIP") mult += state.modifiers.vipContractReward;
  if (c.specialType === "Boss" && state.flags.bossBreaker) mult += 0.15;
  if (c.specialType === "Chain" && state.flags.chainMastery) mult += Math.min(0.22, state.contractChainDepth * 0.04);
  if (c.type === "Risky" && Math.random() < (c.riskPenaltyChance || 0)) {
    mult *= 0.72;
    toast("Risk event: payout reduced.");
  }
  if (state.flags.continuousCasting) mult *= 0.9;
  if (state.flags.priorityPipeline) mult *= 1.06;
  if (state.flags.bpDoubleContractRewardChance && Math.random() < 0.06) {
    mult *= 2;
    showRewardPopup("Blueprint proc: Double contract payout!");
  }
  state.resources.cash += (c.rewardPack.cash || 0) * mult;
  state.resources.parts += Math.round((c.rewardPack.parts || 0) * mult);
  state.resources.research += Math.round((c.rewardPack.research || 0) * mult * (1 + state.modifiers.researchGain));
  state.resources.reputation += (c.rewardPack.rep || 0) * (1 + state.modifiers.reputationGain);

  if (state.flags.priorityPipeline && Math.random() < 0.1) state.resources.parts += 2;
  applyContractSpecial(c, mult);

  const intelligenceBonus = state.metaUpgrades.fragmentMagnet * 0.05;
  const refinementBonus = state.metaUpgrades.fragmentRefining * 0.03;
  const fragmentMul = Math.max(0.2, state.modifiers.fragmentGain);
  let fragGain = Math.max(0, Math.round((c.fragmentReward || 0) * (1 + intelligenceBonus + refinementBonus) * fragmentMul));
  if (c.specialType === "VIP") fragGain += 1;
  if (c.specialType === "Boss") fragGain += 2;
  if (state.flags.adaptiveBlueprints && c.specialType) fragGain += 1;
  if (state.flags.bpFirstContractFragBonus && state.runState.firstContractBonusPending) {
    fragGain += 3;
    state.runState.firstContractBonusPending = false;
    showRewardPopup("Blueprint bonus: first contract fragments +3");
  }
  if (Math.random() < state.metaUpgrades.rareContractSignal * 0.012 + state.modifiers.rareFragmentChance) fragGain += 1;
  state.blueprintFragments += fragGain;
  unlockBlueprintsFromFragments();
  grantSkillXp(1 + (c.type === "Premium" ? 1 : 0), "contract completion");

  state.completedContracts += 1;
  gainContractXp(c);
  maybeAwardChest(c);
  showRewardPopup(`Claimed +$${fmt((c.rewardPack.cash || 0) * mult)} • +${fragGain} fragments`);
  toast(`Reward claimed: ${c.name}${fragGain ? ` (+${fragGain} fragments)` : ""}`);
  state.contract = null;
  state.contractContext.rushUsed = false;
  validateGameState("claimContractReward");
  renderAll();
}

function gainContractXp(contract) {
  let xp = 1;
  if (contract.specialType === "VIP") xp += 1;
  if (contract.specialType === "Chain") xp += 1;
  if (contract.specialType === "Boss") xp += 3;
  if (contract.type === "Premium") xp += 1;
  state.contractXp += xp;
  const needed = 5 + state.contractTier * 3;
  if (state.contractXp >= needed && state.contractTier < 8) {
    state.contractXp -= needed;
    state.contractTier += 1;
    toast(`Contract tier up! Now tier ${state.contractTier}.`);
    refreshContractBoard(true);
  }
}

function maybeAwardChest(contract) {
  const roll = Math.random();
  let rarity = null;
  if (contract.specialType === "Boss") rarity = roll < 0.25 ? "legendary" : "epic";
  else if (contract.specialType === "VIP" && roll < 0.52) rarity = roll < 0.12 ? "legendary" : "epic";
  else if (contract.specialType === "Chain" && roll < 0.35) rarity = roll < 0.06 ? "epic" : "rare";
  if (!rarity && contract.type === "Premium" && roll < 0.42) rarity = roll < 0.08 ? "legendary" : "epic";
  else if (!rarity && contract.type === "Risky" && roll < 0.28) rarity = roll < 0.07 ? "epic" : "rare";
  else if (!rarity && contract.type === "Rush" && roll < 0.2) rarity = "rare";
  else if (!rarity && roll < 0.14) rarity = "common";
  if (!rarity) return;
  state.chests[rarity] = (state.chests[rarity] || 0) + 1;
  toast(`${rarity[0].toUpperCase()}${rarity.slice(1)} chest acquired.`);
}

function openChestPanel() {
  const available = chestRarities.filter((r) => (state.chests[r] || 0) > 0);
  if (!available.length) {
    toast("No chests available.");
    return;
  }
  const buttons = available.map((r) => `<button class="action-btn" data-open-chest="${r}">Open ${r[0].toUpperCase()}${r.slice(1)} (${state.chests[r]})</button>`).join("");
  openModal(`<h3>Chest Vault</h3><p>Open a chest to reveal instant rewards and temporary boosts.</p>${buttons}`);
  document.querySelectorAll("[data-open-chest]").forEach((btn) => {
    btn.addEventListener("click", () => openChest(btn.dataset.openChest));
  });
}

function openChest(rarity) {
  if (!state.chests[rarity]) return;
  state.chests[rarity] -= 1;
  const rewardText = [];
  const power = { common: 1, rare: 1.45, epic: 2.1, legendary: 3.2 }[rarity] || 1;
  const cash = Math.round((180 + Math.random() * 260) * power);
  state.resources.cash += cash;
  rewardText.push(`+$${fmt(cash)}`);
  if (Math.random() < 0.65) {
    const frags = Math.max(1, Math.round((1 + Math.random() * 2) * power * 0.7));
    state.blueprintFragments += frags;
    rewardText.push(`+${frags} fragments`);
  }
  if (Math.random() < 0.45) {
    const boost = { kind: "prod", value: 0.22 * power * 0.4, until: Date.now() + 30000 };
    state.activeBoosts.push(boost);
    rewardText.push("30s production surge");
  }
  showRewardPopup(`Chest opened: ${rewardText.join(" • ")}`);
  toast(`Chest rewards: ${rewardText.join(", ")}`);
  closeModal();
  renderAll();
}

function applyContractSpecial(contract, mult) {
  if (contract?.special) {
    if (contract.special === "research_bonus") {
      state.resources.research += 1 + Math.floor(mult);
    }
    if (contract.special === "rush_bonus" && state.contractContext.rushUsed) {
      state.resources.cash += contract.rewards.cash * 0.15;
      state.resources.parts += 2;
      toast("Rush synergy bonus awarded.");
    }
    if (contract.special === "risky_parts" && Math.random() < 0.45) {
      state.resources.parts += 4;
    }
    if (contract.special === "blueprint_fragments_bonus") {
      const bonus = Math.max(1, Math.round(2 * mult));
      state.blueprintFragments += bonus;
      toast(`Premium blueprint cache: +${bonus} fragments.`);
    }
  }
  if (contract.specialType === "Chain") {
    const chainBonus = Math.min(3, state.contractChainDepth);
    state.resources.research += chainBonus;
  }
  if (contract.specialType === "Boss") {
    state.contractBossWins += 1;
    state.resources.tokens += state.contractBossWins % 2 === 0 ? 1 : 0;
  }
}

function unlockBlueprintsFromFragments() {
  let unlocked = 0;
  const locked = blueprintDefs.filter((bp) => !state.blueprints.includes(bp.id));
  for (const bp of locked) {
    if (state.blueprintFragments < bp.fragmentCost) break;
    state.blueprintFragments -= bp.fragmentCost;
    state.blueprints.push(bp.id);
    unlocked += 1;
    showRewardPopup(`Blueprint unlocked: ${bp.rarity} ${bp.name}`);
    toast(`Blueprint unlocked: ${bp.name}`);
  }
  recalculateProgressionEffects();
  if (unlocked > 0) renderBlueprints();
}

function recalculateProgressionEffects() {
  const baseModifiers = defaultState().modifiers;
  const baseFlags = defaultState().flags;
  state.modifiers = { ...baseModifiers };
  state.flags = { ...baseFlags };
  skillDefs.forEach((skill) => {
    if (state.skills.includes(skill.id)) skill.effect();
  });
  blueprintDefs.forEach((bp) => {
    if (state.blueprints.includes(bp.id)) bp.effect();
  });
  state.modifiers.lineMilestonePower += (state.metaUpgrades.strategyProd || 0) * 0.03;
  state.modifiers.vipContractReward += (state.metaUpgrades.strategyContracts || 0) * 0.015;
  state.modifiers.economicPressureResist += (state.metaUpgrades.strategyBlueprints || 0) * 0.01;
  applyLineMilestoneBonuses();
}

function applyLineMilestoneBonuses() {
  const frameLv = state.lines.cutter.level;
  const forgeLv = state.lines.furnace.level;
  const assemblyLv = state.lines.assembler.level;
  const qcLv = state.lines.qc.level;

  if (frameLv >= 10) state.modifiers.lineSynergy += 0.05;
  if (forgeLv >= 10) state.modifiers.rareFragmentChance += 0.025;
  if (assemblyLv >= 20) state.modifiers.contractDurationMul -= 0.06;
  if (qcLv >= 20) state.modifiers.contractFailurePenaltyMul -= 0.08;
  if (lineDefs.every((l) => state.lines[l.id].level >= 50)) {
    state.modifiers.prod += 0.15;
    state.modifiers.contractReward += 0.08;
  }
}

function skillXpToNext(level) {
  return 16 + level * 9;
}

function grantSkillXp(amount, reason = "progress") {
  if (amount <= 0) return;
  state.skillXp += amount;
  let leveled = 0;
  while (state.skillXp >= skillXpToNext(state.skillLevel)) {
    state.skillXp -= skillXpToNext(state.skillLevel);
    state.skillLevel += 1;
    state.skillPoints += 1;
    leveled += 1;
  }
  if (leveled > 0) toast(`Skill level up (${reason})! +${leveled} point${leveled > 1 ? "s" : ""}.`);
}

function canUnlockSkill(skill) {
  if (!skill) return false;
  if (state.skills.includes(skill.id)) return false;
  if (state.skillPoints < skill.cost) return false;
  if (!skill.prereq) return true;
  return state.skills.includes(skill.prereq);
}

function buySkill(skillId) {
  const skill = skillDefs.find((x) => x.id === skillId);
  if (!canUnlockSkill(skill)) return;
  state.skillPoints -= skill.cost;
  state.skills.push(skillId);
  recalculateProgressionEffects();
  if (skill.type === "keystone") toast(`Keystone selected: ${skill.name}`);
  validateGameState("buySkill");
  renderAll();
}

function respecSkills() {
  if (!state.skills.length) return;
  const tokenCost = 2;
  const cashCost = Math.max(250, state.totalEarned * 0.01);
  if (state.resources.tokens < tokenCost || state.resources.cash < cashCost) {
    toast(`Need ${tokenCost} tokens and $${fmt(cashCost)} to respec.`);
    return;
  }
  const spent = state.skills.reduce((sum, id) => {
    const node = skillDefs.find((s) => s.id === id);
    return sum + (node?.cost || 0);
  }, 0);
  const refund = Math.floor(spent * 0.7);
  state.resources.tokens -= tokenCost;
  state.resources.cash -= cashCost;
  state.skills = [];
  state.skillPoints += refund;
  recalculateProgressionEffects();
  toast(`Skill tree respecced. Refunded ${refund} points.`);
  renderAll();
}

function convertResearch() {
  const spend = Math.min(state.resources.cash, 420);
  if (spend < 90) {
    toast("Need at least $90 cash to run research.");
    return;
  }
  const gain = Math.min(2, Math.floor(spend / 190)) + (state.flags.darkShift ? 1 : 0);
  state.resources.cash -= spend;
  state.resources.research += gain;
  toast(`R&D yielded ${gain} research points.`);
}

function modernizationCost() {
  return 120000 * Math.pow(1.72, state.modernizationCount);
}

function calcRunEfficiency(stats = state) {
  const seconds = Math.max(1, stats.playtime);
  const windowsPerSec = stats.windowsMade / seconds;
  return Math.max(0.65, Math.min(1.75, windowsPerSec / 3.4));
}

function calcModernizationReward(stats = state) {
  const revenueFactor = Math.pow(Math.max(0, stats.totalEarned) / 180000, 0.72) * 4.4;
  const contractFactor = Math.pow(Math.max(0, stats.completedContracts), 0.84) * 0.95;
  const blueprintFactor = Math.pow(Math.max(0, stats.blueprints.length), 1.18) * 2.15;
  const efficiencyFactor = Math.max(0, (calcRunEfficiency(stats) - 0.85) * 3.8);
  const rawScore = revenueFactor + contractFactor + blueprintFactor + efficiencyFactor;
  const playMin = Math.max(0, stats.playtime / 60);
  const shortRunPenalty = playMin < 8 ? 0.28 + (playMin / 8) * 0.72 : 1;
  const longevityBonus = 1 + Math.min(0.38, Math.log1p(playMin) / 11);
  const resetDiminish = 1 / (1 + state.modernizationCount * 0.06);
  const tokenFloat = rawScore * shortRunPenalty * longevityBonus * resetDiminish;
  return Math.max(0, Math.floor(tokenFloat));
}

function calcModernizationAnalysis() {
  const reward = calcModernizationReward();
  const playMin = state.playtime / 60;
  const efficiency = calcRunEfficiency();
  const shortPenalty = playMin < 8 ? 0.28 + (playMin / 8) * 0.72 : 1;
  const longevityBonus = 1 + Math.min(0.38, Math.log1p(Math.max(0, playMin)) / 11);
  const nextTarget = reward + 1;
  const extraRevenue = estimateRevenueForTargetTokens(nextTarget);
  return {
    reward,
    cost: modernizationCost(),
    ready: state.resources.cash >= modernizationCost() && reward > 0,
    efficiency,
    shortPenalty,
    longevityBonus,
    nextTarget,
    extraRevenue
  };
}

function estimateRevenueForTargetTokens(targetTokens) {
  if (targetTokens <= calcModernizationReward()) return 0;
  let add = 0;
  for (let i = 0; i < 70; i += 1) {
    add += 40000 + i * 7000;
    const simulated = { ...state, totalEarned: state.totalEarned + add };
    if (calcModernizationReward(simulated) >= targetTokens) return add;
  }
  return null;
}

function getModernizationUpgradeDefs() {
  return [
    { key: "startCash", category: "Early Game Boost", uiCategory: "Economy", icon: "◈", name: "Kickstart Treasury", desc: "+$55 starting cash per level", baseCost: 1, costMul: 1.45, max: 15, effect: (lv) => `$${fmt(lv * 55)}` },
    { key: "startupMomentum", category: "Early Game Boost", uiCategory: "Production", icon: "⟡", name: "Startup Momentum", desc: "+1.8% early-run production per level", baseCost: 1, costMul: 1.6, max: 12, effect: (lv) => `+${(lv * 1.8).toFixed(1)}% early boost` },
    { key: "lineCalibration", category: "Production Efficiency", uiCategory: "Production", icon: "▣", name: "Line Calibration", desc: "+1.5% production speed per level", baseCost: 2, costMul: 1.58, max: 20, effect: (lv) => `+${(lv * 1.5).toFixed(1)}% speed` },
    { key: "costEngineering", category: "Production Efficiency", uiCategory: "Economy", icon: "◧", name: "Cost Engineering", desc: "-1% line upgrade cost per level", baseCost: 2, costMul: 1.65, max: 20, effect: (lv) => `-${Math.min(20, lv)}% line cost` },
    { key: "contractNegotiation", category: "Contracts", uiCategory: "Contracts", icon: "▤", name: "Negotiation Office", desc: "+3% contract reward multiplier per level", baseCost: 2, costMul: 1.62, max: 15, effect: (lv) => `+${(lv * 3).toFixed(0)}% rewards` },
    { key: "rareContractSignal", category: "Contracts", uiCategory: "Contracts", icon: "◎", name: "Rare Contract Signal", desc: "Small chance for +1 extra fragment on claims", baseCost: 3, costMul: 1.7, max: 12, effect: (lv) => `+${(lv * 1.2).toFixed(1)}% bonus frag chance` },
    { key: "fragmentMagnet", category: "Blueprint System", uiCategory: "Blueprints", icon: "◇", name: "Fragment Magnet", desc: "+5% fragment gains per level", baseCost: 2, costMul: 1.63, max: 18, effect: (lv) => `+${(lv * 5).toFixed(0)}% fragments` },
    { key: "fragmentRefining", category: "Blueprint System", uiCategory: "Blueprints", icon: "⬡", name: "Fragment Refinery", desc: "+3% fragment gains per level", baseCost: 3, costMul: 1.72, max: 15, effect: (lv) => `+${(lv * 3).toFixed(0)}% fragments` },
    { key: "offlineLogistics", category: "Offline Progress", uiCategory: "Offline", icon: "◔", name: "Offline Logistics", desc: "+10% offline earnings per level", baseCost: 2, costMul: 1.58, max: 15, effect: (lv) => `+${(lv * 10).toFixed(0)}% offline` },
    { key: "offlineCap", category: "Offline Progress", uiCategory: "Offline", icon: "◴", name: "Offline Capacity", desc: "+5 min offline cap per level", baseCost: 1, costMul: 1.52, max: 18, effect: (lv) => `+${lv * 5} min cap` },
    { key: "strategyProd", category: "Specialization", uiCategory: "Production", icon: "◫", name: "Production Doctrine", desc: "Increases production specialization score and line milestone power", baseCost: 4, costMul: 1.8, max: 8, effect: (lv) => `Score +${lv} • milestones +${(lv * 3).toFixed(0)}%` },
    { key: "strategyContracts", category: "Specialization", uiCategory: "Contracts", icon: "◍", name: "Broker Doctrine", desc: "Increases contract specialization score and special contract chance", baseCost: 4, costMul: 1.82, max: 8, effect: (lv) => `Score +${lv} • special roll +${(lv * 1.5).toFixed(1)}%` },
    { key: "strategyBlueprints", category: "Specialization", uiCategory: "Blueprints", icon: "◬", name: "Innovation Doctrine", desc: "Increases blueprint specialization score and weakens economy pressure", baseCost: 4, costMul: 1.82, max: 8, effect: (lv) => `Score +${lv} • soft-cap resist +${(lv * 1).toFixed(0)}%` },
    { key: "autoClaim", category: "Quality of Life", uiCategory: "Contracts", icon: "◌", name: "Auto Claim Contracts", desc: "Automatically claims completed contracts", baseCost: 8, costMul: 2.2, max: 1, effect: (lv) => (lv > 0 ? "Enabled" : "Disabled") }
  ];
}

function modernizationUpgradeCost(def) {
  const lvl = state.metaUpgrades[def.key] || 0;
  return Math.ceil(def.baseCost * Math.pow(def.costMul, lvl));
}

function buyModernizationUpgrade(key) {
  const def = getModernizationUpgradeDefs().find((u) => u.key === key);
  if (!def) return;
  const lvl = state.metaUpgrades[key] || 0;
  if (lvl >= def.max) return;
  const cost = modernizationUpgradeCost(def);
  if (state.resources.tokens < cost) return;
  const card = document.querySelector(`[data-upgrade-card="${key}"]`);
  if (card) card.classList.add("invest-pop");
  state.resources.tokens -= cost;
  state.metaUpgrades[key] = lvl + 1;
  toast(`Modernization upgraded: ${def.name}`);
  validateGameState("buyModernizationUpgrade");
  setTimeout(() => openModernizationHub(), 120);
}

function tryModernize() {
  const analysis = calcModernizationAnalysis();
  if (!analysis.ready) {
    toast("Modernization not efficient yet. Push this run further.");
    return;
  }
  openModal(`
    <h3>Confirm Factory Modernization</h3>
    <p>If you reset now, you will earn <strong>${analysis.reward} Modernization Tokens</strong>.</p>
    <p>Run summary: $${fmt(state.totalEarned)} revenue • ${state.completedContracts} contracts • ${state.blueprints.length} blueprints.</p>
    <div class="row"><div class="row-head"><strong>Safety Check</strong><span>Required</span></div><div class="row-meta"><span>Type <strong>RESET</strong> to continue.</span><span></span></div><input id="modernizeConfirmText" class="text-input" placeholder="Type RESET"/></div>
    <button class="action-btn" id="confirmModernize" disabled>Finalize Modernization</button>
    <button class="action-btn" id="cancelModernize">Cancel</button>
  `);
  const confirmInput = document.getElementById("modernizeConfirmText");
  const confirmBtn = document.getElementById("confirmModernize");
  confirmInput?.addEventListener("input", () => {
    confirmBtn.disabled = confirmInput.value.trim().toUpperCase() !== "RESET";
  });
  document.getElementById("confirmModernize")?.addEventListener("click", () => performModernize(analysis.reward));
  document.getElementById("cancelModernize")?.addEventListener("click", openModernizationHub);
}

function performModernize(reward) {
  const summary = {
    revenue: state.totalEarned,
    contracts: state.completedContracts,
    blueprints: state.blueprints.length,
    playtime: state.playtime,
    reward
  };
  state.resources.tokens += reward;
  state.modernizationCount += 1;
  const preservedTokens = state.resources.tokens;
  const preservedMeta = { ...state.metaUpgrades };
  const preservedModernizationCount = state.modernizationCount;
  const preservedAdvancedTech = { ...state.advancedTech };
  state = defaultState();
  state.resources.tokens = preservedTokens;
  state.metaUpgrades = preservedMeta;
  state.modernizationCount = preservedModernizationCount;
  state.advancedTech = preservedAdvancedTech;
  state.resources.cash += state.metaUpgrades.startCash * 55;
  state.skillPoints += Math.floor(reward / 4);
  validateGameState("performModernize");
  triggerModernizationEffect();
  openModernizationSummary(summary);
  renderAll();
}

function triggerModernizationEffect() {
  document.body.classList.add("modernize-flash");
  showRewardPopup("MODERNIZED");
  setTimeout(() => document.body.classList.remove("modernize-flash"), 650);
}

function openModernizationSummary(summary) {
  activeModal = "modernizationSummary";
  openModal(`
    <h3>Modernization Complete</h3>
    <p>+<strong>${summary.reward}</strong> tokens secured for future runs.</p>
    <div class="list">
      <div class="row"><div class="row-head"><strong>Run Revenue</strong><span>$${fmt(summary.revenue)}</span></div></div>
      <div class="row"><div class="row-head"><strong>Contracts Completed</strong><span>${summary.contracts}</span></div></div>
      <div class="row"><div class="row-head"><strong>Blueprints Unlocked</strong><span>${summary.blueprints}</span></div></div>
      <div class="row"><div class="row-head"><strong>Run Time</strong><span>${fmt(summary.playtime / 60)} min</span></div></div>
    </div>
    <button class="action-btn" id="closeModernizeSummary">Start New Run</button>
  `);
  document.getElementById("closeModernizeSummary")?.addEventListener("click", closeModal);
}

function openModernizationHub() {
  activeModal = "modernizationHub";
  setDrawerOpen(false);
  const analysis = calcModernizationAnalysis();
  const defs = getModernizationUpgradeDefs();
  const currentFilter = state.modernizationFilter || "All";
  const tabs = ["All", "Production", "Contracts", "Blueprints", "Economy", "Offline"];
  const tabHtml = tabs.map((tab) => `<button class="mod-tab ${tab === currentFilter ? "active" : ""}" data-mod-filter="${tab}">${tab}</button>`).join("");
  const filtered = defs.filter((u) => currentFilter === "All" || u.uiCategory === currentFilter);
  const byCategory = filtered.reduce((acc, u) => {
    if (!acc[u.category]) acc[u.category] = [];
    acc[u.category].push(u);
    return acc;
  }, {});
  const categoryHtml = Object.entries(byCategory).map(([category, upgrades]) => {
    const rows = upgrades.map((u) => {
      const lvl = state.metaUpgrades[u.key] || 0;
      const maxed = lvl >= u.max;
      const cost = modernizationUpgradeCost(u);
      const affordable = state.resources.tokens >= cost;
      const disabled = maxed || !affordable ? "disabled" : "";
      const missing = Math.max(0, cost - state.resources.tokens);
      const progressPct = Math.round((lvl / u.max) * 100);
      const currentEffect = u.effect ? u.effect(lvl) : `Lv ${lvl}`;
      const nextEffect = u.effect ? u.effect(Math.min(u.max, lvl + 1)) : `Lv ${lvl + 1}`;
      return `<div class="mod-card ${affordable && !maxed ? "affordable" : ""}" data-upgrade-card="${u.key}">
        <div class="mod-card-head"><span class="mod-icon">${u.icon || "◍"}</span><div><strong>${u.name}</strong><small>${u.category}</small></div><span>Lv ${lvl}/${u.max}</span></div>
        <p>${u.desc}</p>
        <div class="row-meta"><span>Current: ${currentEffect}</span><span>${maxed ? "MAXED" : `Next: ${nextEffect}`}</span></div>
        <div class="mod-progress"><span style="width:${progressPct}%"></span></div>
        <div class="row-meta"><span>${maxed ? "No further cost" : `Cost ${cost} TK`}</span><span>${maxed ? "Completed" : (affordable ? "Affordable now" : `Need ${missing} more`)}</span></div>
        ${maxed ? "" : `<button class="action-btn" data-meta="${u.key}" ${disabled}>Invest</button>`}
      </div>`;
    }).join("");
    return `<div class="mod-group"><h4>${category}</h4><div class="list">${rows}</div></div>`;
  }).join("");

  const efficiencyLabel = analysis.shortPenalty < 0.95 ? "Too Early" : (analysis.reward >= 4 ? "Efficient" : "Building");
  const nextHint = analysis.extraRevenue == null ? "Long push needed for next token." : `Need about +$${fmt(analysis.extraRevenue)} more revenue for ${analysis.nextTarget} tokens.`;
  const investedTotal = defs.reduce((sum, u) => sum + (state.metaUpgrades[u.key] || 0), 0);
  const specialization = getMetaSpecialization();

  openModal(`
    <div class="modernization-shell">
    <div class="modernization-header">
      <h3>Factory Modernization</h3>
      <p>Permanent upgrades that shape every future run.</p>
      <div class="modernization-stats"><span>TK Tokens <strong id="modTokens">${fmt(state.resources.tokens)}</strong></span><span>Invested <strong>${investedTotal}</strong></span><span>Path <strong>${specialization}</strong></span><span>Tier 2 ATP <strong>${fmt(state.advancedTech.points)}</strong></span></div>
    </div>
    <div class="mod-tabs">${tabHtml}</div>
    <div class="row mod-preview">
      <div class="row-head"><strong>Reset Preview</strong><span id="modEfficiency">${efficiencyLabel}</span></div>
      <div class="row-meta"><span>If you reset now:</span><span><strong id="modReward">${analysis.reward}</strong> tokens</span></div>
      <div class="row-meta"><span>Cash requirement</span><span>$<span id="modCost">${fmt(analysis.cost)}</span></span></div>
      <div class="row-meta"><span>Run efficiency</span><span id="modRunEff">${(analysis.efficiency * 100).toFixed(0)}%</span></div>
      <div class="row-meta"><span>Timing hint</span><span id="modNextHint">${nextHint}</span></div>
    </div>
    <hr/>
    ${categoryHtml}
    <button id="modernizeRun" class="action-btn" ${analysis.ready ? "" : "disabled"}>Modernize Run</button>
    <button id="closeModernizeHub" class="action-btn">Close</button>
    </div>
  `);

  document.querySelectorAll("[data-mod-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.modernizationFilter = btn.dataset.modFilter;
      openModernizationHub();
    });
  });
  document.querySelectorAll("[data-meta]").forEach((btn) => {
    btn.addEventListener("click", () => buyModernizationUpgrade(btn.dataset.meta));
  });
  document.getElementById("modernizeRun")?.addEventListener("click", tryModernize);
  document.getElementById("closeModernizeHub")?.addEventListener("click", closeModal);
}

function updateModernizationHubLive() {
  const analysis = calcModernizationAnalysis();
  const tokensEl = document.getElementById("modTokens");
  const rewardEl = document.getElementById("modReward");
  const costEl = document.getElementById("modCost");
  const runBtn = document.getElementById("modernizeRun");
  const effEl = document.getElementById("modRunEff");
  const hintEl = document.getElementById("modNextHint");
  const statusEl = document.getElementById("modEfficiency");
  if (!tokensEl || !rewardEl || !costEl || !runBtn || !effEl || !hintEl || !statusEl) return;
  tokensEl.textContent = fmt(state.resources.tokens);
  rewardEl.textContent = `${analysis.reward}`;
  costEl.textContent = fmt(analysis.cost);
  effEl.textContent = `${(analysis.efficiency * 100).toFixed(0)}%`;
  statusEl.textContent = analysis.shortPenalty < 0.95 ? "Too Early" : (analysis.reward >= 4 ? "Efficient" : "Building");
  hintEl.textContent = analysis.extraRevenue == null ? "Long push needed for next token." : `Need about +$${fmt(analysis.extraRevenue)} more revenue for ${analysis.nextTarget} tokens.`;
  runBtn.disabled = !analysis.ready;
}

function hardReset() {
  setDrawerOpen(false);
  openModal(`<h3>Hard Reset</h3><p>This wipes everything, including tokens.</p><button id="confirmReset" class="action-btn">Reset Save</button>`);
  document.getElementById("confirmReset").addEventListener("click", () => {
    localStorage.removeItem(SAVE_KEY);
    state = defaultState();
    closeModal();
    renderAll();
  });
}

function maybeSpawnModifier(now) {
  if (state.activeModifier || Math.random() > 0.0015) return;
  const m = modifierPool[Math.floor(Math.random() * modifierPool.length)];
  state.activeModifier = m;
  state.modifierUntil = now + m.duration * 1000;
  toast(`World event: ${m.text}`);
  renderHUD();
}

function tickModifier(now) {
  if (!state.activeModifier) return;
  if (now >= state.modifierUntil) {
    toast("Global modifier ended.");
    state.activeModifier = null;
    state.modifierUntil = 0;
    renderHUD();
  }
}

function showStats() {
  activeModal = "stats";
  setDrawerOpen(false);
  openModal(`
    <h3>Factory Stats</h3>
    <p>Total Earned: $${fmt(state.totalEarned)}</p>
    <p>Windows Manufactured: ${fmt(state.windowsMade)}</p>
    <p>Completed Contracts: ${state.completedContracts}</p>
    <p>Modernizations: ${state.modernizationCount}</p>
    <p>Playtime: ${fmt(state.playtime / 60)} min</p>
    <button id="closeStats" class="action-btn">Close</button>
  `);
  document.getElementById("closeStats").addEventListener("click", closeModal);
}

function renderAll() {
  renderHUD();
  renderFactory();
  renderDivisions();
  renderContracts();
  renderSkills();
  renderBlueprints();
  renderRewardHub();
}

function renderRewardHub() {
  if (!el.openChestBtn || !el.chestCountLabel || !el.activeBoostList || !el.milestoneList || !el.claimList) return;
  const totalChests = chestRarities.reduce((sum, r) => sum + (state.chests[r] || 0), 0);
  const readyClaims = state.pendingClaims.length + milestoneDefs.filter((m) => !state.claimedMilestones.includes(m.id) && m.progress() >= 1).length;
  el.chestCountLabel.textContent = totalChests ? `${totalChests} chest${totalChests > 1 ? "s" : ""}${readyClaims ? ` • ${readyClaims} ready` : ""}` : (readyClaims ? `${readyClaims} rewards ready` : "No chests");
  el.openChestBtn.disabled = totalChests === 0;
  el.openChestBtn.classList.toggle("ready-pulse", totalChests > 0);
  if (el.claimAllBtn) {
    el.claimAllBtn.disabled = readyClaims === 0;
    el.claimAllBtn.classList.toggle("ready-pulse", readyClaims > 0);
  }

  const now = Date.now();
  const boosts = (state.activeBoosts || [])
    .filter((b) => b.until > now)
    .sort((a, b) => a.until - b.until);
  el.activeBoostList.innerHTML = boosts.length
    ? boosts.map((b) => `<div class="row">
      <div class="row-head"><strong>${boostLabel(b.kind)}</strong><span>${Math.max(0, Math.ceil((b.value || 0) * 100))}%</span></div>
      <div class="row-meta"><span>Temporary bonus active</span><span>${formatCountdown(b.until - now)}</span></div>
    </div>`).join("")
    : `<div class="row"><div class="row-head"><strong>Active Boosts</strong><span>None</span></div><div class="row-meta"><span>Open chests or claim events to gain temporary boosts.</span><span></span></div></div>`;

  const milestones = milestoneDefs.map((m) => {
    const p = Math.min(1, m.progress());
    const complete = p >= 1;
    const claimed = state.claimedMilestones.includes(m.id);
    return { ...m, p, complete, claimed };
  });
  el.milestoneList.innerHTML = milestones.map((m) => {
    const rewardText = Object.entries(m.reward).map(([k, v]) => `${k}:${typeof v === "number" ? fmt(v) : v}`).join(" • ");
    const near = !m.complete && m.p >= 0.8;
    return `<div class="row ${m.complete && !m.claimed ? "affordable ready-pulse" : ""} ${near ? "near-ready" : ""}">
      <div class="row-head"><strong>${m.tier}: ${m.label}</strong><span>${Math.floor(m.p * 100)}%</span></div>
      <div class="mod-progress"><span style="width:${Math.floor(m.p * 100)}%"></span></div>
      <div class="row-meta"><span>${rewardText}</span><span>${m.claimed ? "Claimed" : (m.complete ? "Ready" : "In progress")}</span></div>
      ${m.complete && !m.claimed ? `<button class="action-btn ready-pulse" data-claim-milestone="${m.id}">Claim</button>` : ""}
    </div>`;
  }).join("");

  el.claimList.innerHTML = state.pendingClaims.map((c) => `<div class="row affordable ready-pulse"><div class="row-head"><strong>${c.title}</strong><span>Claimable</span></div><div class="row-meta"><span>${c.desc}</span><span></span></div><button class="action-btn claim-btn ready-pulse" data-claim-pending="${c.id}">Claim Reward</button></div>`).join("");
  el.milestoneList.querySelectorAll("[data-claim-milestone]").forEach((btn) => btn.addEventListener("click", () => claimMilestone(btn.dataset.claimMilestone)));
  el.claimList.querySelectorAll("[data-claim-pending]").forEach((btn) => btn.addEventListener("click", () => claimPending(btn.dataset.claimPending)));
}

function boostLabel(kind) {
  if (kind === "prod") return "Production Boost";
  if (kind === "cash") return "Cash Boost";
  return "General Boost";
}

function formatCountdown(msLeft) {
  const totalSeconds = Math.max(0, Math.ceil(msLeft / 1000));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function claimMilestone(id) {
  if (state.claimedMilestones.includes(id)) return;
  const m = milestoneDefs.find((x) => x.id === id);
  if (!m || m.progress() < 1) return;
  state.claimedMilestones.push(id);
  applyRewardPayload(m.reward);
  showRewardPopup(`Milestone complete: ${m.label}`);
  renderAll();
}

function claimPending(id) {
  const claim = state.pendingClaims.find((x) => x.id === id);
  if (!claim) return;
  applyRewardPayload(claim.reward);
  state.pendingClaims = state.pendingClaims.filter((x) => x.id !== id);
  showRewardPopup(`Claimed: ${claim.title}`);
  renderAll();
}

function claimAllRewards() {
  let claimed = 0;
  let totalCash = 0;
  state.pendingClaims.slice().forEach((c) => {
    totalCash += c.reward?.cash || 0;
    applyRewardPayload(c.reward);
    claimed += 1;
  });
  state.pendingClaims = [];
  milestoneDefs.forEach((m) => {
    if (!state.claimedMilestones.includes(m.id) && m.progress() >= 1) {
      state.claimedMilestones.push(m.id);
      totalCash += m.reward?.cash || 0;
      applyRewardPayload(m.reward);
      claimed += 1;
    }
  });
  if (!claimed) {
    toast("No rewards ready to claim.");
    return;
  }
  showRewardPopup(`Claimed ${claimed} rewards`);
  toast(`Claimed ${claimed} rewards${totalCash ? ` (+$${fmt(totalCash)})` : ""}.`);
  renderAll();
}

function applyRewardPayload(reward = {}) {
  if (reward.cash) state.resources.cash += reward.cash;
  if (reward.research) state.resources.research += reward.research;
  if (reward.tokens) state.resources.tokens += reward.tokens;
  if (reward.fragments) state.blueprintFragments += reward.fragments;
  if (reward.chest) state.chests[reward.chest] = (state.chests[reward.chest] || 0) + 1;
  if (reward.boost) {
    state.activeBoosts.push({
      kind: reward.boost.kind,
      value: reward.boost.value,
      until: Date.now() + reward.boost.duration
    });
  }
}

function renderHUD() {
  const labels = {
    cash: { icon: "◈", name: "Cash" },
    research: { icon: "▣", name: "Research" },
    reputation: { icon: "✦", name: "Reputation" },
    parts: { icon: "⬢", name: "Parts" },
    tokens: { icon: "◉", name: "Tokens" }
  };
  const getRateInfo = (key) => {
    if (key === "cash") {
      const v = Math.max(0, safeNumber(calcWindowsPerSec() * cashPerWindow(), "hud:cashRate"));
      return { text: `+${fmt(v)}/s`, active: v > 0.001 };
    }
    if (key === "research") return { text: "from contracts", active: false };
    if (key === "reputation") {
      const v = Math.max(0, safeNumber(calcWindowsPerSec() * 0.0009 * (1 + state.modifiers.reputationGain), "hud:repRate"));
      return { text: `+${fmt(v)}/s`, active: v > 0.0001 };
    }
    if (key === "parts") {
      const perSec = Math.max(0, safeNumber(0.03 + state.modifiers.partsChance, "hud:partsRate"));
      const perMin = perSec * 60;
      return { text: perMin > 0.02 ? `+${fmt(perMin)}/min` : "from contracts", active: perMin > 0.02 };
    }
    return { text: "prestige only", active: false };
  };
  const resourceMarkup = RESOURCES.map((k) => {
    const display = `${k === "cash" ? "$" : ""}${fmt(state.resources[k] || 0)}`;
    const rate = getRateInfo(k);
    return `<div class="res-pill"><div class="k"><span class="res-ico">${labels[k].icon}</span>${labels[k].name}</div><div class="v">${display}</div><div class="rate ${rate.active ? "rate-pos" : ""}">${rate.text}</div></div>`;
  }).join("");
  if (resourceMarkup !== hudCache.resources && el.resourceStrip) {
    el.resourceStrip.innerHTML = resourceMarkup;
    hudCache.resources = resourceMarkup;
  }

  const liveWps = Math.max(0, safeNumber(calcWindowsPerSec(), "renderHUD:liveWps"));
  const liveRps = Math.max(0, safeNumber(liveWps * cashPerWindow(), "renderHUD:liveRps", { liveWps }));
  const currentRps = `$${fmt(liveRps)}`;
  const currentWps = fmt(liveWps);
  const currentCash = `$${fmt(state.resources.cash || 0)}`;
  if (el.rpsLabel && currentRps !== hudCache.rps) {
    el.rpsLabel.textContent = currentRps;
    hudCache.rps = currentRps;
  }
  if (el.wpsLabel && currentWps !== hudCache.wps) {
    el.wpsLabel.textContent = currentWps;
    hudCache.wps = currentWps;
  }
  if (el.cashFocus && currentCash !== hudCache.cash) {
    el.cashFocus.textContent = currentCash;
    hudCache.cash = currentCash;
  }

  const goalTarget = lineDefs
    .map((line) => ({ line, cost: lineUpgradeCost(line), unlocked: isLineUnlocked(line) }))
    .sort((a, b) => {
      if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
      return a.cost - b.cost;
    })[0];
  const eta = secondsToAfford(goalTarget.cost);
  const etaLabel = timeToAffordLabel(eta);
  const milestone = getMilestoneGoal();
  const goalText = `Goal: ${goalTarget.line.name} $${fmt(goalTarget.cost)} (${etaLabel}) • ${milestone}`;
  if (el.goalLabel && goalText !== hudCache.goal) {
    el.goalLabel.textContent = goalText;
    hudCache.goal = goalText;
  }
  const goalReady = eta === 0;
  el.goalLabel?.classList.toggle("ready", goalReady);
  if (el.missionProgress) {
    const pct = Math.max(2, Math.min(100, Math.round((state.resources.cash / Math.max(1, goalTarget.cost)) * 100)));
    el.missionProgress.style.width = `${pct}%`;
  }
  if (el.missionHint) {
    const hint = goalReady ? "Goal ready" : (eta < 90 ? "Close to next upgrade" : "Build income");
    el.missionHint.textContent = hint;
  }
  if (goalReady && !goalReadyLastTick) {
    toast("Goal ready: next upgrade is affordable.");
  }
  goalReadyLastTick = goalReady;

  if (state.activeModifier) {
    const sec = Math.max(0, Math.ceil((state.modifierUntil - Date.now()) / 1000));
    if (el.modifierBanner) {
      el.modifierBanner.style.display = "block";
      el.modifierBanner.textContent = `${state.activeModifier.text} (${sec}s)`;
    }
  } else {
    if (el.modifierBanner) el.modifierBanner.style.display = "none";
  }

  const rec = getRecommendedAction();
  if (el.recommendedText) el.recommendedText.textContent = `${rec.label} — ${rec.reason}`;
  if (el.recommendedBtn) el.recommendedBtn.textContent = rec.label.length > 24 ? "Do Recommended Action" : rec.label;
  if (el.lastSavedLabel) {
    const sec = Math.max(0, Math.floor((Date.now() - (state.savedAt || Date.now())) / 1000));
    el.lastSavedLabel.textContent = `Last saved: ${sec < 60 ? `${sec}s ago` : `${Math.floor(sec / 60)}m ago`}`;
  }

  updateTabBadges();
  updateMachineActivity();
}

function updateTabBadges() {
  const rewardsReady = state.pendingClaims.length + milestoneDefs.filter((m) => !state.claimedMilestones.includes(m.id) && m.progress() >= 1).length;
  const skillsReady = Math.max(0, Math.floor(state.skillPoints));
  const contractReady = state.contract?.status === "completed" ? 1 : 0;
  const map = { home: rewardsReady, skills: skillsReady, contracts: contractReady };
  document.querySelectorAll(".bottom-nav .tab").forEach((tab) => {
    const key = tab.dataset.tab;
    const value = map[key] || 0;
    if (value > 0) {
      tab.setAttribute("data-badge", value > 99 ? "99+" : `${value}`);
      tab.classList.add("has-badge");
    } else {
      tab.removeAttribute("data-badge");
      tab.classList.remove("has-badge");
    }
  });
}

function getRecommendedAction() {
  if (state.contract?.status === "completed") {
    return { label: "Claim completed contract", reason: "Reward is ready now.", run: () => claimContractReward() };
  }
  const readyMilestone = milestoneDefs.find((m) => !state.claimedMilestones.includes(m.id) && m.progress() >= 1);
  if (readyMilestone) return { label: "Claim milestone reward", reason: readyMilestone.label, run: () => claimMilestone(readyMilestone.id) };
  if (state.pendingClaims.length) return { label: "Claim pending rewards", reason: `${state.pendingClaims.length} rewards ready`, run: claimAllRewards };
  if (state.skillPoints > 0) return { label: "Spend skill points", reason: `${state.skillPoints} SP available`, run: () => setActiveTab("skills") };
  if (!state.contract) {
    const best = state.contractBoard
      .filter((c) => state.resources.reputation >= c.minRep && (!c.requiredLine || state.lines[c.requiredLine.id].level >= c.requiredLine.level))
      .sort((a, b) => (b.rewards.cash / b.duration) - (a.rewards.cash / a.duration))[0];
    if (best) return { label: `Start ${best.specialType || best.type} contract`, reason: "Best cash efficiency", run: () => startContract(best.id) };
  }
  const bestLine = lineDefs
    .filter((line) => isLineUnlocked(line))
    .map((line) => ({ line, bulk: calcBulkLinePurchase(line, lineBuyMode), score: (line.baseRate || 0.01) / Math.max(1, calcBulkLinePurchase(line, lineBuyMode).totalCost || lineUpgradeCost(line)) }))
    .filter((x) => x.bulk.qty > 0)
    .sort((a, b) => b.score - a.score)[0];
  if (bestLine) return { label: `Upgrade ${bestLine.line.name}`, reason: "Best income impact now", run: () => buyLine(bestLine.line.id, "mode") };
  const analysis = calcModernizationAnalysis();
  if (analysis.ready) return { label: "Modernize run", reason: `${analysis.reward} tokens ready`, run: () => openModernizationHub() };
  if (Date.now() >= state.rush.cooldownUntil && Date.now() > state.rush.activeUntil) return { label: "Activate Boost", reason: "Push toward next unlock", run: activateRush };
  return { label: "Improve production", reason: "Increase cash/sec for faster progress", run: () => setActiveTab("factory") };
}

function triggerRecommendedAction() {
  getRecommendedAction().run?.();
}

function setActiveTab(tab) {
  const btn = document.querySelector(`.tab[data-tab="${tab}"]`);
  btn?.click();
}

function getMilestoneGoal() {
  if (state.windowsMade < 1000) return "Mid: 1K windows";
  if (state.completedContracts < 10) return `Mid: ${10 - state.completedContracts} contracts to milestone`;
  if (state.contractTier < 3) return `Contracts: reach tier ${3}`;
  if (state.modernizationCount < 3) return `Long: ${3 - state.modernizationCount} modernizations`;
  return `Long: collect all blueprints • ${getMetaSpecialization()} path`;
}

function renderFactory() {
  const synergyPct = Math.round(calcLineSynergyBonus() * 100);
  el.lineList.innerHTML = lineDefs.map((line) => {
    const lv = state.lines[line.id].level;
    const singleCost = lineUpgradeCost(line);
    const bulk = calcBulkLinePurchase(line, lineBuyMode);
    const cost = bulk.totalCost || singleCost;
    const active = lv > 0;
    const unlocked = isLineUnlocked(line);
    const eta = secondsToAfford(cost);
    const affordText = state.resources.cash >= cost ? "Ready" : timeToAffordLabel(eta).replace(" to afford", "");
    const reqText = unlocked || !line.unlockReq ? "" : `Needs ${lineDefs.find((x) => x.id === line.unlockReq.line).name} Lv ${line.unlockReq.level}`;
    const affordable = unlocked && bulk.qty > 0;
    const milestoneCount = lineMilestonesReached(lv);
    const milestoneLabel = milestoneCount ? `${milestoneCount}/${lineMilestones.length} milestones` : "No milestone";
    const modeLabel = lineBuyMode === "max" ? `Buy Max (${bulk.qty})` : `Buy ${bulk.qty || lineBuyMode}`;
    return `<div class="row ${affordable ? "affordable" : ""}"><div class="row-head"><strong>${line.icon} ${line.name}</strong><span>Lv ${lv}</span></div><div class="row-meta"><span>${active ? `${fmt(line.baseRate * lv * (1 + Math.sqrt(lv) * 0.03))} w/s raw` : "Locked"}</span><span>Cost $${fmt(cost)}</span></div><div class="row-meta"><span>${reqText || "Unlocked"}</span><span>${bulk.qty > 0 ? affordText : "Requires more income"}</span></div><div class="row-meta"><span>${milestoneLabel}</span><span>Plant synergy +${synergyPct}%</span></div><button class="action-btn" data-line="${line.id}" ${(!unlocked || !affordable) ? "disabled" : ""}>${modeLabel}</button></div>`;
  }).join("");

  el.lineList.querySelectorAll("button[data-line]").forEach((btn) => btn.addEventListener("click", () => buyLine(btn.dataset.line, "mode")));
}

function renderDivisions() {
  el.divisionList.innerHTML = divisionDefs.map((d) => {
    const own = state.divisions[d.id];
    return `<div class="row"><div class="row-head"><strong>${d.name}</strong><span>${own ? "Online" : "Offline"}</span></div><div class="row-meta"><span>Global +${Math.round(d.bonus * 100)}% windows</span><span>Unlock $${fmt(d.reqCash)}</span></div>${own ? "" : `<button class="action-btn" data-div="${d.id}">Unlock Division</button>`}</div>`;
  }).join("");

  el.divisionList.querySelectorAll("button[data-div]").forEach((btn) => btn.addEventListener("click", () => unlockDivision(btn.dataset.div)));
}

function renderContracts() {
  ensureContractBoard();
  if (state.contract) {
    const c = state.contract;
    const pct = Math.min(100, (c.progress / c.targetWindows) * 100);
    const statusLabel = c.status === "completed" ? "Completed" : "Active";
    const timerLabel = c.status === "completed" ? "Timer stopped" : `${Math.ceil(c.remaining)}s`;
    el.activeContract.innerHTML = `
      <div class="row contract-card state-${c.status} ${pct >= 85 ? "best-option" : ""}">
        <div class="row-head"><strong>${c.name}</strong><span>${c.specialType ? `${c.specialType} • ` : ""}${statusLabel}</span></div>
        <div class="row-meta"><span>Progress ${fmt(c.progress)} / ${c.targetWindows} windows</span><span>${pct.toFixed(0)}%</span></div>
        <div class="mod-progress"><span style="width:${pct.toFixed(0)}%"></span></div>
        <div class="row-meta"><span>${timerLabel}</span><span>Fragments +${c.fragmentReward || 0}</span></div>
        ${c.status === "completed" ? `<button class="action-btn claim-btn" data-claim-contract="active">Claim Reward</button>` : ""}
      </div>`;
  } else {
    el.activeContract.innerHTML = `<div class="row"><div class="row-head"><strong>No active contract</strong><span>Idle</span></div><div class="row-meta"><span>Select one below.</span><span></span></div></div>`;
  }

  const best = state.contractBoard.reduce((pick, c) => {
    const value = c.rewards.cash / Math.max(1, c.duration);
    return (!pick || value > pick.value) ? { id: c.id, value } : pick;
  }, null);
  el.contractList.innerHTML = state.contractBoard.map((c) => {
    const lock = state.resources.reputation < c.minRep;
    const tierLock = (c.tierRequired || 1) > state.contractTier;
    const lineLock = c.requiredLine && state.lines[c.requiredLine.id].level < c.requiredLine.level;
    const statusText = tierLock ? `Tier ${c.tierRequired}` : (lock ? "Rep locked" : (lineLock ? "Line locked" : "Ready"));
    const special = c.modifiers?.length ? c.modifiers.join(" • ") : "No modifiers";
    const typeClass = `type-${c.type.toLowerCase()}`;
    const specialBadge = c.specialType ? `<span>${c.specialType}</span>` : `<span>${c.type}</span>`;
    const limitedLeft = c.limited ? Math.max(0, Math.ceil((c.expiresAt - Date.now()) / 1000)) : null;
    const nearExpiry = c.limited && limitedLeft <= 15;
    return `<div class="row contract-card state-available ${typeClass} ${best?.id === c.id ? "best-option" : ""}">
      <div class="row-head"><strong>${c.name}</strong>${specialBadge}</div>
      <div class="row-meta"><span>Value Tier ${c.rarityTier || "C"}</span><span>${c.limited ? `<span class="${nearExpiry ? "ready-pulse" : ""}">Limited ${limitedLeft}s</span>` : "Standard window"}</span></div>
      <div class="row-meta"><span>Need ${c.windows} windows in ${c.duration}s</span><span>Rep ${c.minRep.toFixed(0)}</span></div>
      <div class="row-meta"><span>Reward: $${fmt(c.rewards.cash)} + extras</span><span>Fragments +${c.fragmentReward || 0}</span></div>
      <div class="row-meta"><span>${special}</span><span>${statusText} • Fail -${c.failRep} rep</span></div>
      ${c.requiredLine ? `<div class="row-meta"><span>Requires ${lineDefs.find((l) => l.id === c.requiredLine.id)?.name || "Line"} Lv ${c.requiredLine.level}</span><span></span></div>` : ""}
      <div class="row-meta"><span>Tier ${c.tierRequired || 1} contract</span><span>${c.type}</span></div>
      ${(!lock && !tierLock && !lineLock && !state.contract) ? `<button class="action-btn ${nearExpiry ? "ready-pulse" : ""}" data-contract="${c.id}">Start</button>` : ""}
    </div>`;
  }).join("");

  const refreshReady = Date.now() >= state.contractRefreshAt;
  if (el.contractRefreshBtn) el.contractRefreshBtn.disabled = !!state.contract || !refreshReady;
  if (el.contractRefreshStatus) {
    const sec = Math.max(0, Math.ceil((state.contractRefreshAt - Date.now()) / 1000));
    const needed = 5 + state.contractTier * 3;
    el.contractRefreshStatus.textContent = refreshReady
      ? `Tier ${state.contractTier} ready • XP ${state.contractXp}/${needed}.`
      : `Tier ${state.contractTier} • new offers in ${sec}s • XP ${state.contractXp}/${needed}`;
  }

  el.contractList.querySelectorAll("button[data-contract]").forEach((btn) => btn.addEventListener("click", () => startContract(btn.dataset.contract)));
  el.activeContract.querySelector("[data-claim-contract]")?.addEventListener("click", claimContractReward);
  if (el.contractRefreshBtn) {
    el.contractRefreshBtn.onclick = () => {
      if (refreshContractBoard()) renderContracts();
    };
  }
}

function renderSkills() {
  const grouped = [...new Set(skillDefs.map((s) => s.branch))];
  const xpNeed = skillXpToNext(state.skillLevel);
  const header = `<div class="row"><div class="row-head"><strong>Skill Points</strong><span>${state.skillPoints}</span></div><div class="row-meta"><span>Level ${state.skillLevel}</span><span>${fmt(state.skillXp)} / ${xpNeed} XP</span></div><div class="row-meta"><span>Build Identity</span><span>${getBuildIdentity()}</span></div><button class="action-btn" id="respecSkillsBtn">Respec Tree (2 TK + 1% run cash)</button></div>`;
  const body = grouped.map((b) => {
    const branchSkills = skillDefs.filter((s) => s.branch === b);
    const owned = branchSkills.filter((s) => state.skills.includes(s.id)).length;
    return `<div class="branch"><div class="row-head"><strong>${b}</strong><span>${owned}/${branchSkills.length}</span></div><div class="nodes">${branchSkills.map((s) => {
      const ownedNode = state.skills.includes(s.id);
      const canBuy = canUnlockSkill(s);
      const prereqLabel = s.prereq && !ownedNode ? `Req: ${skillDefs.find((x) => x.id === s.prereq)?.name || "Node"}` : s.desc;
      return `<button class="node ${s.type || ""} ${ownedNode ? "owned" : ""} ${(!ownedNode && canBuy) ? "affordable" : ""}" data-skill="${s.id}" ${ownedNode || !canBuy ? "disabled" : ""}>${s.type === "keystone" ? `<span class="node-tag">Keystone</span>` : ""}<span class="node-title">${s.name}</span><span class="node-cost">${ownedNode ? "Selected" : `${s.cost} SP`}</span><span class="node-desc">${prereqLabel}</span></button>`;
    }).join("")}</div></div>`;
  }).join("");
  el.skillBranches.innerHTML = `${header}${body}`;

  el.skillBranches.querySelectorAll("button[data-skill]").forEach((btn) => btn.addEventListener("click", () => buySkill(btn.dataset.skill)));
  document.getElementById("respecSkillsBtn")?.addEventListener("click", respecSkills);
}

function getBuildIdentity() {
  const branchSpend = {};
  state.skills.forEach((id) => {
    const node = skillDefs.find((s) => s.id === id);
    if (!node) return;
    branchSpend[node.branch] = (branchSpend[node.branch] || 0) + (node.cost || 0);
  });
  const top = Object.entries(branchSpend).sort((a, b) => b[1] - a[1])[0];
  if (!top) return "Balanced Starter";
  const map = {
    Production: "Production Build",
    Contracts: "Contract Specialist",
    Automation: "Offline Automation",
    Economy: "Profit Operator",
    Quality: "Reliability Focus",
    Workforce: "Rush Commander"
  };
  return map[top[0]] || `${top[0]} Focus`;
}

function renderBlueprints() {
  const nextBp = blueprintDefs.find((bp) => !state.blueprints.includes(bp.id));
  const progressPct = nextBp ? Math.min(100, Math.floor((state.blueprintFragments / nextBp.fragmentCost) * 100)) : 100;
  const fragmentHeader = `<div class="row"><div class="row-head"><strong>Blueprint Fragments</strong><span>${fmt(state.blueprintFragments)}</span></div><div class="row-meta"><span>Earned mainly from contracts. Unlocks trigger automatically.</span><span>${state.blueprints.length}/${blueprintDefs.length} unlocked</span></div><div class="mod-progress"><span style="width:${progressPct}%"></span></div><div class="row-meta"><span>${nextBp ? `Next: ${nextBp.name}` : "All blueprints unlocked"}</span><span>${progressPct}%</span></div></div>`;
  const cards = blueprintDefs.map((bp) => {
    const unlocked = state.blueprints.includes(bp.id);
    const remain = Math.max(0, bp.fragmentCost - state.blueprintFragments);
    return `<div class="row blueprint-card ${unlocked ? "unlocked" : "locked"} rarity-${bp.rarity.toLowerCase()}"><div class="row-head"><strong>${bp.name}</strong><span>${bp.rarity}</span></div><div class="row-meta"><span>${bp.desc}</span><span>${unlocked ? "Unlocked" : `${remain} fragments needed`}</span></div><div class="row-meta"><span>Cost ${bp.fragmentCost} fragments</span><span>${unlocked ? "Applied" : "Locked"}</span></div></div>`;
  }).join("");
  el.blueprintList.innerHTML = `${fragmentHeader}${cards}`;
}

function bootstrapFactoryVisual() {
  const machinePos = {
    cutter: { x: 16, y: 134, stage: "Frame Cut", icon: "▦" },
    furnace: { x: 150, y: 48, stage: "Glass Forge", icon: "◍" },
    assembler: { x: 150, y: 140, stage: "Panel Fit", icon: "◈" },
    qc: { x: 286, y: 48, stage: "QC Scan", icon: "◎" },
    pack: { x: 286, y: 140, stage: "Pack Out", icon: "⬣" }
  };

  const lanes = [{ y: 102, text: "Production grid" }];

  const belts = [
    { x: 104, y: 168, w: 52 },
    { x: 240, y: 168, w: 52 },
    { x: 104, y: 82, w: 52 },
    { x: 240, y: 82, w: 52 }
  ];

  lanes.forEach((lane) => {
    const line = document.createElement("div");
    line.className = "line-separator";
    line.style.top = `${lane.y}px`;
    line.innerHTML = `<span>${lane.text}</span>`;
    el.factoryGrid.appendChild(line);
  });

  Object.entries(machinePos).forEach(([id, p]) => {
    const m = document.createElement("div");
    m.className = "machine";
    m.id = `machine-${id}`;
    m.style.left = `${p.x}px`;
    m.style.top = `${p.y}px`;
    m.innerHTML = `
      <span class="lamp"></span>
      <span class="machine-icon">${p.icon}</span>
      <span class="machine-title">${p.stage}</span>
      <span class="machine-meta">Lv <b data-machine-lv="${id}">0</b> • <b data-machine-out="${id}">0.00</b> w/s</span>
      <span class="machine-meter"><i data-machine-meter="${id}" style="width:4%"></i></span>
    `;
    el.factoryGrid.appendChild(m);
  });

  belts.forEach((b) => {
    const belt = document.createElement("div");
    belt.className = "belt";
    belt.style.left = `${b.x}px`;
    belt.style.top = `${b.y}px`;
    belt.style.width = `${b.w}px`;
    el.factoryGrid.appendChild(belt);
  });
}

function animateFlow() {
  if (!state.settings.animations) return;
  const activeLines = lineDefs.filter((l) => state.lines[l.id].level > 0).length;
  if (!activeLines) return;
  const links = [
    { from: { x: 70, y: 162 }, to: { x: 104, y: 88 }, type: "frame-part" },
    { from: { x: 158, y: 88 }, to: { x: 190, y: 162 }, type: "glass-part" },
    { from: { x: 246, y: 162 }, to: { x: 282, y: 88 }, type: "window-assembly" },
    { from: { x: 338, y: 88 }, to: { x: 372, y: 162 }, type: "finished-window" }
  ];

  links.slice(0, Math.min(4, activeLines)).forEach((path) => {
    const item = document.createElement("div");
    item.className = `item ${path.type}`;
    item.style.left = `${path.from.x}px`;
    item.style.top = `${path.from.y}px`;
    el.factoryGrid.appendChild(item);
    item.animate(
      [
        { transform: "translate(0,0) scale(0.94)", opacity: 0 },
        { transform: "translate(0,0) scale(1)", opacity: 1, offset: 0.1 },
        { transform: `translate(${path.to.x - path.from.x}px, ${path.to.y - path.from.y}px) scale(1)`, opacity: 1, offset: 0.85 },
        { transform: `translate(${path.to.x - path.from.x}px, ${path.to.y - path.from.y}px) scale(0.96)`, opacity: 0 }
      ],
      { duration: state.settings.reducedMotion ? 620 : 980, easing: "linear" }
    );
    setTimeout(() => {
      item.remove();
      if (!state.settings.lowPerf) spawnCompletionBurst(path.to.x, path.to.y);
      if (!state.settings.lowPerf) spawnTickPop(path.to.x + 8, path.to.y - 6);
    }, 1000);
  });
}

function flashMachine(lineId) {
  const m = document.getElementById(`machine-${lineId}`);
  if (!m) return;
  m.classList.add("busy");
  m.classList.add("upgraded");
  showRewardPopup("Upgrade Installed");
  setTimeout(() => m.classList.remove("upgraded"), 520);
  setTimeout(() => m.classList.remove("busy"), 400);
}

function updateMachineActivity() {
  lineDefs.forEach((line) => {
    const node = document.getElementById(`machine-${line.id}`);
    if (!node) return;
    const lv = state.lines[line.id].level;
    const output = lv > 0 ? line.baseRate * lv * (1 + Math.sqrt(lv) * 0.03) : 0;
    const meter = node.querySelector(`[data-machine-meter="${line.id}"]`);
    const lvEl = node.querySelector(`[data-machine-lv="${line.id}"]`);
    const outEl = node.querySelector(`[data-machine-out="${line.id}"]`);
    if (lvEl) lvEl.textContent = `${lv}`;
    if (outEl) outEl.textContent = fmt(output);
    if (meter) meter.style.width = `${Math.max(4, Math.min(100, lv * 3 + (lv > 0 ? 12 : 0)))}%`;
    if (lv > 0) {
      node.classList.add("active");
    } else {
      node.classList.remove("active");
    }
  });
}

function spawnMoneyPop(amountPerSec, boosted = false) {
  if (!el.fxLayer) return;
  if (!state.settings.showFloatingNumbers) return;
  if (!state.settings.animations) return;
  const pop = document.createElement("div");
  pop.className = `money-pop ${boosted ? "boost" : ""}`;
  pop.textContent = `+$${fmt(amountPerSec)}/s`;
  el.fxLayer.appendChild(pop);
  setTimeout(() => pop.remove(), 760);
}

function spawnCompletionBurst(x, y) {
  if (!el.fxLayer) return;
  if (!state.settings.animations) return;
  const burst = document.createElement("div");
  burst.className = "completion-burst";
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;
  el.fxLayer.appendChild(burst);
  setTimeout(() => burst.remove(), 460);
}

function spawnTickPop(x, y) {
  if (!el.fxLayer) return;
  if (!state.settings.animations) return;
  const tick = document.createElement("div");
  tick.className = "tick-pop";
  tick.textContent = "✓";
  tick.style.left = `${x}px`;
  tick.style.top = `${y}px`;
  el.fxLayer.appendChild(tick);
  setTimeout(() => tick.remove(), 620);
}

function showRewardPopup(text) {
  if (!el.fxLayer) return;
  if (!state.settings.animations) return;
  const pop = document.createElement("div");
  pop.className = "reward-pop";
  pop.textContent = text;
  el.fxLayer.appendChild(pop);
  setTimeout(() => pop.remove(), 1200);
}

function applyOfflineEarnings() {
  const now = Date.now();
  const lastSeen = state.savedAt || now;
  const offlineSec = Math.floor((now - lastSeen) / 1000);
  if (offlineSec < 30) {
    state.savedAt = now;
    return;
  }

  const capBonusMinutes = state.metaUpgrades.offlineCap * 5;
  const cappedSec = Math.min((20 + capBonusMinutes) * 60, offlineSec);
  const offlineRate = calcWindowsPerSec() * cashPerWindow();
  const offlineBoost = 1 + state.metaUpgrades.offlineLogistics * 0.1 + state.modifiers.offlineEfficiency + (state.flags.darkShift ? 0.2 : 0);
  const offlineGain = offlineRate * cappedSec * 0.2 * offlineBoost;
  if (offlineGain > 0) {
    state.resources.cash += offlineGain;
    state.totalEarned += offlineGain;
    toast(`Offline production: +$${fmt(offlineGain)} (${Math.floor(cappedSec / 60)}m capped).`);
  }
  state.savedAt = now;
}

function openSettingsPanel() {
  activeModal = "settings";
  setDrawerOpen(false);
  const s = state.settings;
  openModal(`
    <div class="settings-head"><h3>Settings</h3><button id="settingsClose" class="menu-btn">✕</button></div>
    <div class="list settings-list">
      <div class="row"><strong>Gameplay</strong>
        ${settingToggle("showFloatingNumbers", "Floating numbers", s.showFloatingNumbers)}
        ${settingToggle("autoBoost", "Auto-trigger boost", s.autoBoost)}
        ${settingToggle("compactUi", "Compact UI mode", s.compactUi)}
        ${settingToggle("confirmMajorActions", "Confirm major actions", s.confirmMajorActions)}
        ${settingToggle("haptics", "Haptics", s.haptics)}
      </div>
      <div class="row"><strong>Visual</strong>
        ${settingToggle("animations", "Animations", s.animations)}
        ${settingToggle("reducedMotion", "Reduced motion", s.reducedMotion)}
        <label class="setting-row">Glow intensity <select data-setting-select=\"glowIntensity\"><option ${s.glowIntensity === "low" ? "selected" : ""}>low</option><option ${s.glowIntensity === "medium" ? "selected" : ""}>medium</option><option ${s.glowIntensity === "high" ? "selected" : ""}>high</option></select></label>
      </div>
      <div class="row"><strong>Audio</strong>
        ${settingToggle("soundEnabled", "Master sound", s.soundEnabled)}
        <label class="setting-row">Volume <input data-setting-range=\"soundVolume\" type=\"range\" min=\"0\" max=\"100\" value=\"${s.soundVolume}\"/></label>
      </div>
      <div class="row"><strong>Performance</strong>
        ${settingToggle("lowPerf", "Low performance mode", s.lowPerf)}
        ${settingToggle("fpsFriendly", "FPS-friendly mode", s.fpsFriendly)}
        <label class="setting-row">Number format <select data-setting-select=\"numberFormat\"><option value="short" ${s.numberFormat === "short" ? "selected" : ""}>short</option><option value="detailed" ${s.numberFormat === "detailed" ? "selected" : ""}>detailed</option></select></label>
      </div>
      <div class="row"><strong>Data</strong>
        <button class="action-btn" data-data-action="export">Export Save</button>
        <button class="action-btn" data-data-action="import">Import Save</button>
        <button class="action-btn" data-data-action="reset">Reset Progress</button>
      </div>
    </div>
  `);

  document.getElementById("settingsClose")?.addEventListener("click", closeModal);
  document.querySelectorAll("[data-setting]").forEach((elNode) => {
    elNode.addEventListener("change", () => {
      updateSetting(elNode.dataset.setting, elNode.checked);
    });
  });
  document.querySelectorAll("[data-setting-select]").forEach((elNode) => {
    elNode.addEventListener("change", () => updateSetting(elNode.dataset.settingSelect, elNode.value));
  });
  document.querySelectorAll("[data-setting-range]").forEach((elNode) => {
    elNode.addEventListener("input", () => updateSetting(elNode.dataset.settingRange, Number(elNode.value)));
  });
  document.querySelectorAll("[data-data-action]").forEach((btn) => {
    btn.addEventListener("click", () => handleDataAction(btn.dataset.dataAction));
  });
}

function settingToggle(key, label, checked) {
  return `<label class="setting-row"><span>${label}</span><input data-setting="${key}" type="checkbox" ${checked ? "checked" : ""}/></label>`;
}

function updateSetting(key, value) {
  if (!(key in state.settings)) return;
  state.settings[key] = value;
  applySettingsToUI();
  autoSave();
}

function applySettingsToUI() {
  document.body.classList.toggle("compact-ui", !!state.settings.compactUi);
  document.body.classList.toggle("animations-off", !state.settings.animations);
  document.body.classList.toggle("reduced-motion", !!state.settings.reducedMotion);
  const glow = { low: "0.7", medium: "1", high: "1.25" }[state.settings.glowIntensity] || "1";
  document.documentElement.style.setProperty("--glow-mul", glow);
}

function handleDataAction(action) {
  if (action === "export") {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
    navigator.clipboard?.writeText(payload).then(() => toast("Save copied to clipboard.")).catch(() => {
      openModal(`<h3>Copy Save</h3><textarea style="width:100%;height:120px;">${payload}</textarea><button class="action-btn" id="closeExport">Close</button>`);
      document.getElementById("closeExport")?.addEventListener("click", openSettingsPanel);
    });
  }
  if (action === "import") {
    openModal(`<h3>Import Save</h3><textarea id="importBox" style="width:100%;height:120px;" placeholder="Paste save data"></textarea><button id="confirmImport" class="action-btn">Import</button><button id="cancelImport" class="action-btn">Cancel</button>`);
    document.getElementById("cancelImport")?.addEventListener("click", openSettingsPanel);
    document.getElementById("confirmImport")?.addEventListener("click", () => {
      try {
        const raw = document.getElementById("importBox").value.trim();
        const parsed = JSON.parse(decodeURIComponent(escape(atob(raw))));
        state = normalizeState({ ...defaultState(), ...parsed, lastTick: Date.now() });
        validateGameState("importSave");
        recalculateProgressionEffects();
        applySettingsToUI();
        closeModal();
        renderAll();
        toast("Save imported.");
      } catch {
        toast("Invalid save data.");
      }
    });
  }
  if (action === "reset") {
    openModal(`<h3>Confirm Reset</h3><p>This will erase all progress.</p><button id="confirmDataReset" class="action-btn">Reset Everything</button><button id="cancelDataReset" class="action-btn">Cancel</button>`);
    document.getElementById("cancelDataReset")?.addEventListener("click", openSettingsPanel);
    document.getElementById("confirmDataReset")?.addEventListener("click", () => {
      localStorage.removeItem(SAVE_KEY);
      state = defaultState();
      applySettingsToUI();
      closeModal();
      renderAll();
      toast("Progress reset.");
    });
  }
}

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  el.toastLayer.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

function openModal(html) {
  el.modalLayer.innerHTML = `<div class="modal"><button class="modal-close" id="modalCloseBtn" aria-label="Close panel">✕</button>${html}</div>`;
  el.modalLayer.classList.remove("hidden");
  document.getElementById("modalCloseBtn")?.addEventListener("click", closeModal);
}

function closeModal() {
  activeModal = "";
  el.modalLayer.classList.add("hidden");
  el.modalLayer.innerHTML = "";
}

function autoSave() {
  try {
    validateGameState("autosave");
    state.savedAt = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("[autoSave] Failed to persist state safely.", error);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return normalizeState({
      ...defaultState(),
      ...parsed,
      lastTick: Date.now()
    });
  } catch {
    warnRepair("Corrupted save detected. Recovered with defaults.");
    const fallback = defaultState();
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(fallback));
    } catch {
      // ignore storage write failures
    }
    return fallback;
  }
}

function normalizeState(incoming) {
  const next = incoming;
  const defaults = defaultState();
  next.resources = { ...defaults.resources, ...(next.resources || {}) };
  next.modifiers = { ...defaults.modifiers, ...(next.modifiers || {}) };
  next.flags = { ...defaults.flags, ...(next.flags || {}) };
  next.metaUpgrades = { ...defaults.metaUpgrades, ...(next.metaUpgrades || {}) };
  next.settings = { ...defaults.settings, ...(next.settings || {}) };
  next.rush = { ...defaults.rush, ...(next.rush || {}) };

  Object.keys(next.resources).forEach((key) => {
    const value = Number(next.resources[key]);
    next.resources[key] = Number.isFinite(value) ? value : defaults.resources[key] || 0;
  });
  Object.keys(next.modifiers).forEach((key) => {
    const value = Number(next.modifiers[key]);
    next.modifiers[key] = Number.isFinite(value) ? value : defaults.modifiers[key] || 0;
  });
  Object.keys(next.metaUpgrades).forEach((key) => {
    const value = Number(next.metaUpgrades[key]);
    next.metaUpgrades[key] = Number.isFinite(value) ? value : defaults.metaUpgrades[key] || 0;
  });
  ["activeUntil", "cooldownUntil"].forEach((k) => {
    const value = Number(next.rush[k]);
    next.rush[k] = Number.isFinite(value) ? value : defaults.rush[k];
  });

  if (next.metaUpgrades?.kickstart) next.metaUpgrades.startCash += next.metaUpgrades.kickstart;
  if (next.metaUpgrades?.contractMastery) next.metaUpgrades.contractNegotiation += next.metaUpgrades.contractMastery;
  if (next.metaUpgrades?.offlineLab) next.metaUpgrades.offlineLogistics += next.metaUpgrades.offlineLab;
  if (next.metaUpgrades?.blueprintIntel) next.metaUpgrades.fragmentMagnet += next.metaUpgrades.blueprintIntel;
  next.blueprints = (next.blueprints || []).filter((id) => blueprintDefs.some((bp) => bp.id === id));
  if (!next.chests) next.chests = { common: 0, rare: 0, epic: 0, legendary: 0 };
  if (!Array.isArray(next.claimedMilestones)) next.claimedMilestones = [];
  if (!Array.isArray(next.pendingClaims)) next.pendingClaims = [];
  if (!Array.isArray(next.activeBoosts)) next.activeBoosts = [];
  if (!Array.isArray(next.contractBoard)) next.contractBoard = [];
  if (typeof next.contractRefreshAt !== "number") next.contractRefreshAt = 0;
  if (typeof next.contractTier !== "number") next.contractTier = 1;
  if (typeof next.contractXp !== "number") next.contractXp = 0;
  if (typeof next.contractChainDepth !== "number") next.contractChainDepth = 0;
  if (typeof next.contractBossWins !== "number") next.contractBossWins = 0;
  next.skills = (next.skills || []).filter((id) => skillDefs.some((s) => s.id === id));
  if (typeof next.skillPoints !== "number") next.skillPoints = 1;
  if (typeof next.skillXp !== "number") next.skillXp = 0;
  if (typeof next.skillLevel !== "number") next.skillLevel = 1;
  if (typeof next.nextSkillWindowMilestone !== "number") next.nextSkillWindowMilestone = 4000;
  if (typeof next.blueprintFragments !== "number") next.blueprintFragments = 0;
  if (!next.advancedTech) next.advancedTech = { points: 0, unlocked: false };
  if (next.contract && !next.contract.status) {
    const target = next.contract.targetWindows || next.contract.windows || 1;
    next.contract.targetWindows = target;
    next.contract.rewardPack = next.contract.rewardPack || { ...(next.contract.rewards || {}) };
    next.contract.fragmentReward = next.contract.fragmentReward ?? next.contract.fragments ?? 0;
    next.contract.rewardGranted = !!next.contract.rewardGranted;
    next.contract.status = (next.contract.progress >= target || next.contract.remaining <= 0) ? "completed" : "active";
    if (next.contract.status === "completed") {
      next.contract.progress = target;
      next.contract.remaining = 0;
    }
  }
  return next;
}

function fmt(n) {
  if (!Number.isFinite(n)) return "0";
  if (state?.settings?.numberFormat === "detailed") return n.toLocaleString(undefined, { maximumFractionDigits: n < 100 ? 2 : 1 });
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(n < 10 ? 2 : 1);
}
