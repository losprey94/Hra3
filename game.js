const SAVE_KEY = "window_factory_tycoon_v1";

const RESOURCES = ["cash", "research", "reputation", "parts", "tokens"];

const lineDefs = [
  { id: "cutter", name: "Frame Cutter", baseCost: 50, baseRate: 0.2, icon: "🪚", unlockReq: null },
  { id: "furnace", name: "Glass Furnace", baseCost: 300, baseRate: 0.29, icon: "🔥", unlockReq: { line: "cutter", level: 9 } },
  { id: "assembler", name: "Assembly Robot", baseCost: 1300, baseRate: 0.39, icon: "🤖", unlockReq: { line: "furnace", level: 8 } },
  { id: "qc", name: "Quality Scanner", baseCost: 5600, baseRate: 0.52, icon: "🔍", unlockReq: { line: "assembler", level: 7 } },
  { id: "pack", name: "Packaging Bay", baseCost: 26000, baseRate: 0.68, icon: "📦", unlockReq: { line: "qc", level: 6 } }
];

const divisionDefs = [
  { id: "residential", name: "Residential Unit", reqCash: 900, bonus: 0.06 },
  { id: "commercial", name: "Commercial Unit", reqCash: 8200, bonus: 0.09 },
  { id: "smartglass", name: "SmartGlass Unit", reqCash: 44000, bonus: 0.13 },
  { id: "aeroshield", name: "AeroShield Lab", reqCash: 220000, bonus: 0.18 }
];

const contracts = [
  { id: "starter", name: "Neighborhood Retrofit", type: "Standard", duration: 160, windows: 95, minRep: 0, failRep: 2, rewards: { cash: 110, rep: 2, parts: 2 }, fragments: 1 },
  { id: "green", name: "Eco Tower Fitout", type: "Efficiency", duration: 360, windows: 320, minRep: 10, failRep: 3, rewards: { cash: 480, rep: 4, research: 5 }, fragments: 2, special: "research_bonus" },
  { id: "airport", name: "Airport Terminal Rush", type: "Rush", duration: 560, windows: 700, minRep: 24, failRep: 4, rewards: { cash: 1300, rep: 7, parts: 9 }, fragments: 3, special: "rush_bonus" },
  { id: "fragile", name: "Fragile Glass Emergency", type: "Risky", duration: 420, windows: 560, minRep: 28, failRep: 8, rewards: { cash: 1900, rep: 5, parts: 6 }, fragments: 4, special: "risky_parts" },
  { id: "lux", name: "Luxury Skyline Contract", type: "Premium", duration: 1020, windows: 1760, minRep: 42, failRep: 6, rewards: { cash: 3900, rep: 11, research: 15, parts: 16 }, fragments: 7, special: "blueprint_fragments_bonus" }
];

const skillDefs = [
  { id: "prod_1", name: "Line Tuning", branch: "Production", tier: 1, cost: 1, type: "small", desc: "+4% production speed", effect: () => state.modifiers.prod += 0.04 },
  { id: "prod_2", name: "Cut Precision", branch: "Production", tier: 2, cost: 2, type: "small", prereq: "prod_1", desc: "+4% production speed", effect: () => state.modifiers.prod += 0.04 },
  { id: "prod_3", name: "Furnace Pressure", branch: "Production", tier: 3, cost: 3, type: "medium", prereq: "prod_2", desc: "+10% production speed", effect: () => state.modifiers.prod += 0.1 },
  { id: "prod_4", name: "Output Mix", branch: "Production", tier: 4, cost: 4, type: "notable", prereq: "prod_2", desc: "+10% cash/window", effect: () => state.modifiers.cashBonus += 0.1 },
  { id: "prod_5", name: "Keystone: Overdrive Protocol", branch: "Production", tier: 5, cost: 6, type: "keystone", prereq: "prod_3", desc: "▲ +35% production ▼ -25% contract rewards", effect: () => { state.modifiers.prod += 0.35; state.modifiers.contractReward -= 0.25; } },

  { id: "auto_1", name: "Autoload Arms", branch: "Automation", tier: 1, cost: 1, type: "small", desc: "+5% offline efficiency", effect: () => state.modifiers.offlineEfficiency += 0.05 },
  { id: "auto_2", name: "Sensor Mesh", branch: "Automation", tier: 2, cost: 2, type: "small", prereq: "auto_1", desc: "+4% part recovery chance", effect: () => state.modifiers.partsChance += 0.04 },
  { id: "auto_3", name: "Queued Dispatch", branch: "Automation", tier: 3, cost: 3, type: "medium", prereq: "auto_2", desc: "+12% offline efficiency", effect: () => state.modifiers.offlineEfficiency += 0.12 },
  { id: "auto_4", name: "Maintenance AI", branch: "Automation", tier: 4, cost: 4, type: "notable", prereq: "auto_2", desc: "-10% line costs", effect: () => state.modifiers.costDiscount += 0.1 },
  { id: "auto_5", name: "Keystone: Night Shift Grid", branch: "Automation", tier: 5, cost: 6, type: "keystone", prereq: "auto_3", desc: "▲ +45% offline ▼ -15% active production", effect: () => { state.modifiers.offlineEfficiency += 0.45; state.modifiers.activeProductionPenalty += 0.15; } },

  { id: "con_1", name: "Client Briefing", branch: "Contracts", tier: 1, cost: 1, type: "small", desc: "+5% contract rewards", effect: () => state.modifiers.contractReward += 0.05 },
  { id: "con_2", name: "Sales Cadence", branch: "Contracts", tier: 2, cost: 2, type: "small", prereq: "con_1", desc: "+5% contract rewards", effect: () => state.modifiers.contractReward += 0.05 },
  { id: "con_3", name: "Premium Clauses", branch: "Contracts", tier: 3, cost: 3, type: "medium", prereq: "con_2", desc: "+12% premium contract rewards", effect: () => state.modifiers.premiumContractReward += 0.12 },
  { id: "con_4", name: "Rapid Negotiation", branch: "Contracts", tier: 4, cost: 4, type: "notable", prereq: "con_2", desc: "-10% contract duration", effect: () => state.modifiers.contractDurationMul -= 0.1 },
  { id: "con_5", name: "Keystone: All-In Brokerage", branch: "Contracts", tier: 5, cost: 6, type: "keystone", prereq: "con_3", desc: "▲ +70% contract rewards ▼ +35% duration & -12% production", effect: () => { state.modifiers.contractReward += 0.7; state.modifiers.contractDurationMul += 0.35; state.modifiers.prod -= 0.12; } },

  { id: "eco_1", name: "Tax Timing", branch: "Economy", tier: 1, cost: 1, type: "small", desc: "+4% cash/window", effect: () => state.modifiers.cashBonus += 0.04 },
  { id: "eco_2", name: "Bulk Negotiation", branch: "Economy", tier: 2, cost: 2, type: "small", prereq: "eco_1", desc: "-4% line costs", effect: () => state.modifiers.costDiscount += 0.04 },
  { id: "eco_3", name: "Capital Rotation", branch: "Economy", tier: 3, cost: 3, type: "medium", prereq: "eco_2", desc: "+10% cash/window", effect: () => state.modifiers.cashBonus += 0.1 },
  { id: "eco_4", name: "Margin Controls", branch: "Economy", tier: 4, cost: 4, type: "notable", prereq: "eco_2", desc: "-10% line costs", effect: () => state.modifiers.costDiscount += 0.1 },
  { id: "eco_5", name: "Keystone: Profit Doctrine", branch: "Economy", tier: 5, cost: 6, type: "keystone", prereq: "eco_3", desc: "▲ +22% cash & -12% costs ▼ -25% fragment gains", effect: () => { state.modifiers.cashBonus += 0.22; state.modifiers.costDiscount += 0.12; state.modifiers.fragmentGain -= 0.25; } },

  { id: "qual_1", name: "Optic Calibration", branch: "Quality", tier: 1, cost: 1, type: "small", desc: "+5% reputation gain", effect: () => state.modifiers.reputationGain += 0.05 },
  { id: "qual_2", name: "Defect Catchers", branch: "Quality", tier: 2, cost: 2, type: "small", prereq: "qual_1", desc: "+4% part recovery chance", effect: () => state.modifiers.partsChance += 0.04 },
  { id: "qual_3", name: "Seal Inspection", branch: "Quality", tier: 3, cost: 3, type: "medium", prereq: "qual_2", desc: "-12% contract fail reputation loss", effect: () => state.modifiers.contractFailurePenaltyMul -= 0.12 },
  { id: "qual_4", name: "Premium Standard", branch: "Quality", tier: 4, cost: 4, type: "notable", prereq: "qual_2", desc: "+10% contract rewards", effect: () => state.modifiers.contractReward += 0.1 },
  { id: "qual_5", name: "Keystone: Zero Defect Pledge", branch: "Quality", tier: 5, cost: 6, type: "keystone", prereq: "qual_3", desc: "▲ +20% rep & +12% parts ▼ -15% cash/window", effect: () => { state.modifiers.reputationGain += 0.2; state.modifiers.partsChance += 0.12; state.modifiers.cashBonus -= 0.15; } },

  { id: "work_1", name: "Shift Meals", branch: "Workforce", tier: 1, cost: 1, type: "small", desc: "+4% rush power", effect: () => state.modifiers.rushPower += 0.04 },
  { id: "work_2", name: "Safety Program", branch: "Workforce", tier: 2, cost: 2, type: "small", prereq: "work_1", desc: "-5% fail reputation loss", effect: () => state.modifiers.contractFailurePenaltyMul -= 0.05 },
  { id: "work_3", name: "Crew Rhythm", branch: "Workforce", tier: 3, cost: 3, type: "medium", prereq: "work_2", desc: "+10% production speed", effect: () => state.modifiers.prod += 0.1 },
  { id: "work_4", name: "Union Coordination", branch: "Workforce", tier: 4, cost: 4, type: "notable", prereq: "work_2", desc: "+12% rush duration", effect: () => state.modifiers.rushDuration += 1.2 },
  { id: "work_5", name: "Keystone: Human Priority", branch: "Workforce", tier: 5, cost: 6, type: "keystone", prereq: "work_3", desc: "▲ -35% fail loss & +15% rush power ▼ -12% offline gains", effect: () => { state.modifiers.contractFailurePenaltyMul -= 0.35; state.modifiers.rushPower += 0.15; state.modifiers.offlineEfficiency -= 0.12; } }
];

const blueprintDefs = [
  { id: "bp_frame", name: "Reinforced Frame Blueprint", desc: "+4% global production throughput", rarity: "Common", fragmentCost: 20, effect: () => state.modifiers.prod += 0.04 },
  { id: "bp_glass", name: "Precision Glass Cut Blueprint", desc: "+4% contract payouts", rarity: "Rare", fragmentCost: 45, effect: () => state.modifiers.contractReward += 0.04 },
  { id: "bp_thermal", name: "Thermal Seal Blueprint", desc: "+5% offline efficiency", rarity: "Rare", fragmentCost: 80, effect: () => state.modifiers.offlineEfficiency += 0.05 },
  { id: "bp_assembly", name: "Smart Assembly Blueprint", desc: "+2% part recovery and +2% reputation gain", rarity: "Epic", fragmentCost: 130, effect: () => { state.modifiers.partsChance += 0.02; state.modifiers.reputationGain += 0.02; } },
  { id: "bp_finish", name: "Premium Finish Blueprint", desc: "+3% cash per window and +3% premium contract payout", rarity: "Legendary", fragmentCost: 190, effect: () => { state.modifiers.cashBonus += 0.03; state.modifiers.premiumContractReward += 0.03; } }
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
  contractContext: { rushUsed: false },
  completedContracts: 0,
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
    offlineEfficiency: 0,
    activeProductionPenalty: 0,
    contractDurationMul: 1,
    fragmentGain: 1,
    rareFragmentChance: 0,
    researchGain: 0,
    contractFailurePenaltyMul: 1
  },
  flags: {
    continuousCasting: false,
    darkShift: false,
    unionMomentum: false,
    zeroDefect: false,
    priorityPipeline: false,
    ventureCapital: false,
    smartTint: false
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
    autoClaim: 0
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
    fpsFriendly: false
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

const el = {
  resourceStrip: document.getElementById("resourceStrip"),
  lineList: document.getElementById("lineList"),
  divisionList: document.getElementById("divisionList"),
  contractList: document.getElementById("contractList"),
  activeContract: document.getElementById("activeContract"),
  skillBranches: document.getElementById("skillBranches"),
  blueprintList: document.getElementById("blueprintList"),
  rushBtn: document.getElementById("rushBtn"),
  rushStatus: document.getElementById("rushStatus"),
  rpsLabel: document.getElementById("rpsLabel"),
  wpsLabel: document.getElementById("wpsLabel"),
  cashFocus: document.getElementById("cashFocus"),
  goalLabel: document.getElementById("goalLabel"),
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

validateConfig();
bootstrapFactoryVisual();
bindEvents();
recalculateProgressionEffects();
applyOfflineEarnings();
applySettingsToUI();
renderAll();
setInterval(gameTick, 250);
setInterval(autoSave, 10000);

function validateConfig() {
  const unique = (arr, label) => {
    const ids = arr.map((x) => x.id);
    if (new Set(ids).size !== ids.length) {
      console.warn(`Duplicate ${label} IDs detected.`);
    }
  };
  unique(lineDefs, "line");
  unique(divisionDefs, "division");
  unique(contracts, "contract");
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
  const dt = Math.min((now - state.lastTick) / 1000, 2.5);
  state.lastTick = now;
  state.playtime += dt;

  const windowsPerSec = calcWindowsPerSec();
  const made = windowsPerSec * dt;
  state.windowsMade += made;
  while (state.windowsMade >= state.nextSkillWindowMilestone) {
    grantSkillXp(1, "production milestone");
    state.nextSkillWindowMilestone += 4000;
  }

  const cashGain = made * cashPerWindow();
  state.resources.cash += cashGain;
  state.totalEarned += cashGain;

  if (Math.random() < (0.03 + state.modifiers.partsChance) * dt) {
    state.resources.parts += 1;
    if (Math.random() < 0.12) toast("Industrial part recovered.");
  }

  state.resources.reputation += made * 0.0009 * (1 + state.modifiers.reputationGain);

  tickContract(dt, made);
  tickModifier(now);

  if (now > state.rush.activeUntil && now < state.rush.cooldownUntil) {
    const rem = Math.ceil((state.rush.cooldownUntil - now) / 1000);
    el.rushBtn.disabled = true;
    el.rushBtn.classList.remove("ready");
    el.rushBtn.textContent = `Recharging (${rem}s)`;
    el.rushStatus.textContent = `Rush cooldown: ${rem}s`;
  } else if (now <= state.rush.activeUntil) {
    const rem = Math.ceil((state.rush.activeUntil - now) / 1000);
    el.rushBtn.disabled = true;
    el.rushBtn.classList.remove("ready");
    el.rushBtn.textContent = `Boosting (${rem}s)`;
    el.rushStatus.textContent = `Rush active (${rem}s).`;
  } else {
    el.rushBtn.disabled = false;
    el.rushBtn.classList.add("ready");
    el.rushBtn.textContent = "Boost Production";
    el.rushStatus.textContent = "Tap to overclock lines and push your next upgrade.";
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
    if (el.incomeTicker) el.incomeTicker.textContent = `+$${fmt(cashGain / dt)}/s`;
    if (cashGain > 0.01) spawnMoneyPop(cashGain / dt, now <= state.rush.activeUntil);
    tickerFrame = 0;
  }

  maybeSpawnModifier(now);
  renderHUD();
  refreshDynamicViews(dt);
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

function calcWindowsPerSec() {
  let wps = 0;
  lineDefs.forEach((line) => {
    const lv = state.lines[line.id].level;
    if (lv > 0) {
      const localBoost = 1 + Math.sqrt(lv) * 0.03;
      wps += line.baseRate * lv * localBoost;
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
  return wps * divBoost * skillBoost * tokenBoost * rushBoost * modifierMul * startupBoost * calibrationBoost * activePenalty;
}

function cashPerWindow() {
  let v = 2.7 * (1 + state.modifiers.cashBonus);
  if (state.flags.ventureCapital && state.resources.cash < 1200) v *= 1.08;
  if (state.flags.priorityPipeline) v *= 0.94;
  if (state.activeModifier && state.activeModifier.cashMul) v *= state.activeModifier.cashMul;
  return v;
}

function lineUpgradeCost(line) {
  const lv = state.lines[line.id].level;
  let discount = 1 - Math.min(0.18, state.modifiers.costDiscount);
  discount *= 1 - Math.min(0.2, state.metaUpgrades.costEngineering * 0.01);
  if (state.flags.unionMomentum) discount *= 1.04;
  return Math.ceil(line.baseCost * Math.pow(1.47, lv) * discount);
}

function isLineUnlocked(line) {
  if (!line.unlockReq) return true;
  return state.lines[line.unlockReq.line].level >= line.unlockReq.level;
}

function secondsToAfford(cost) {
  if (state.resources.cash >= cost) return 0;
  const rps = calcWindowsPerSec() * cashPerWindow();
  if (rps <= 0.01) return Infinity;
  return Math.ceil((cost - state.resources.cash) / rps);
}

function timeToAffordLabel(seconds) {
  if (seconds === 0) return "Affordable now";
  if (seconds === Infinity) return "Build income first";
  if (seconds < 60) return `~${seconds}s to afford`;
  if (seconds < 3600) return `~${Math.ceil(seconds / 60)}m to afford`;
  return "~1h+ to afford";
}

function buyLine(lineId) {
  const def = lineDefs.find((x) => x.id === lineId);
  if (!def) return;
  if (!isLineUnlocked(def)) return;
  const cost = lineUpgradeCost(def);
  if (state.resources.cash < cost) return;
  state.resources.cash -= cost;
  state.lines[lineId].level += 1;
  flashMachine(lineId);
  toast(`${def.name} upgraded to Lv ${state.lines[lineId].level}`);
  renderAll();
}

function unlockDivision(id) {
  const div = divisionDefs.find((d) => d.id === id);
  if (!div) return;
  if (state.divisions[id] || state.resources.cash < div.reqCash) return;
  state.resources.cash -= div.reqCash;
  state.divisions[id] = true;
  toast(`${div.name} division online.`);
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

function startContract(id) {
  if (state.contract) return;
  const c = contracts.find((x) => x.id === id);
  if (!c) return;
  if (state.resources.reputation < c.minRep) return;
  const tierBoost = Math.floor(state.completedContracts / 3);
  const scaledWindows = Math.ceil(c.windows * (1 + tierBoost * 0.26));
  const scaledRewards = {
    cash: Math.ceil(c.rewards.cash * (1 + tierBoost * 0.06)),
    rep: c.rewards.rep || 0,
    research: c.rewards.research || 0,
    parts: c.rewards.parts || 0
  };
  state.contract = {
    ...c,
    targetWindows: scaledWindows,
    rewardPack: scaledRewards,
    fragmentReward: c.fragments || 0,
    remaining: Math.ceil(c.duration * state.modifiers.contractDurationMul),
    progress: 0,
    status: "active",
    rewardGranted: false
  };
  state.contractContext.rushUsed = false;
  toast(`Contract started: ${c.name}`);
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
  if (state.flags.continuousCasting) mult *= 0.9;
  if (state.flags.priorityPipeline) mult *= 1.06;
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
  if (Math.random() < state.metaUpgrades.rareContractSignal * 0.012 + state.modifiers.rareFragmentChance) fragGain += 1;
  state.blueprintFragments += fragGain;
  unlockBlueprintsFromFragments();
  grantSkillXp(1 + (c.type === "Premium" ? 1 : 0), "contract completion");

  state.completedContracts += 1;
  showRewardPopup(`Claimed +$${fmt((c.rewardPack.cash || 0) * mult)}`);
  toast(`Reward claimed: ${c.name}${fragGain ? ` (+${fragGain} fragments)` : ""}`);
  state.contract = null;
  state.contractContext.rushUsed = false;
  renderAll();
}

function applyContractSpecial(contract, mult) {
  if (!contract?.special) return;
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

function unlockBlueprintsFromFragments() {
  let unlocked = 0;
  const locked = blueprintDefs.filter((bp) => !state.blueprints.includes(bp.id));
  for (const bp of locked) {
    if (state.blueprintFragments < bp.fragmentCost) break;
    state.blueprintFragments -= bp.fragmentCost;
    state.blueprints.push(bp.id);
    unlocked += 1;
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
    { key: "startCash", category: "Early Game Boost", uiCategory: "Economy", icon: "💰", name: "Kickstart Treasury", desc: "+$55 starting cash per level", baseCost: 1, costMul: 1.45, max: 15, effect: (lv) => `$${fmt(lv * 55)}` },
    { key: "startupMomentum", category: "Early Game Boost", uiCategory: "Production", icon: "⚡", name: "Startup Momentum", desc: "+1.8% early-run production per level", baseCost: 1, costMul: 1.6, max: 12, effect: (lv) => `+${(lv * 1.8).toFixed(1)}% early boost` },
    { key: "lineCalibration", category: "Production Efficiency", uiCategory: "Production", icon: "🏭", name: "Line Calibration", desc: "+1.5% production speed per level", baseCost: 2, costMul: 1.58, max: 20, effect: (lv) => `+${(lv * 1.5).toFixed(1)}% speed` },
    { key: "costEngineering", category: "Production Efficiency", uiCategory: "Economy", icon: "🧮", name: "Cost Engineering", desc: "-1% line upgrade cost per level", baseCost: 2, costMul: 1.65, max: 20, effect: (lv) => `-${Math.min(20, lv)}% line cost` },
    { key: "contractNegotiation", category: "Contracts", uiCategory: "Contracts", icon: "📜", name: "Negotiation Office", desc: "+3% contract reward multiplier per level", baseCost: 2, costMul: 1.62, max: 15, effect: (lv) => `+${(lv * 3).toFixed(0)}% rewards` },
    { key: "rareContractSignal", category: "Contracts", uiCategory: "Contracts", icon: "🎯", name: "Rare Contract Signal", desc: "Small chance for +1 extra fragment on claims", baseCost: 3, costMul: 1.7, max: 12, effect: (lv) => `+${(lv * 1.2).toFixed(1)}% bonus frag chance` },
    { key: "fragmentMagnet", category: "Blueprint System", uiCategory: "Blueprints", icon: "🧩", name: "Fragment Magnet", desc: "+5% fragment gains per level", baseCost: 2, costMul: 1.63, max: 18, effect: (lv) => `+${(lv * 5).toFixed(0)}% fragments` },
    { key: "fragmentRefining", category: "Blueprint System", uiCategory: "Blueprints", icon: "🔬", name: "Fragment Refinery", desc: "+3% fragment gains per level", baseCost: 3, costMul: 1.72, max: 15, effect: (lv) => `+${(lv * 3).toFixed(0)}% fragments` },
    { key: "offlineLogistics", category: "Offline Progress", uiCategory: "Offline", icon: "🌙", name: "Offline Logistics", desc: "+10% offline earnings per level", baseCost: 2, costMul: 1.58, max: 15, effect: (lv) => `+${(lv * 10).toFixed(0)}% offline` },
    { key: "offlineCap", category: "Offline Progress", uiCategory: "Offline", icon: "⏱️", name: "Offline Capacity", desc: "+5 min offline cap per level", baseCost: 1, costMul: 1.52, max: 18, effect: (lv) => `+${lv * 5} min cap` },
    { key: "autoClaim", category: "Quality of Life", uiCategory: "Contracts", icon: "🤖", name: "Auto Claim Contracts", desc: "Automatically claims completed contracts", baseCost: 8, costMul: 2.2, max: 1, effect: (lv) => (lv > 0 ? "Enabled" : "Disabled") }
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
        <div class="mod-card-head"><span class="mod-icon">${u.icon || "⚙️"}</span><div><strong>${u.name}</strong><small>${u.category}</small></div><span>Lv ${lvl}/${u.max}</span></div>
        <p>${u.desc}</p>
        <div class="row-meta"><span>Current: ${currentEffect}</span><span>${maxed ? "MAXED" : `Next: ${nextEffect}`}</span></div>
        <div class="mod-progress"><span style="width:${progressPct}%"></span></div>
        <div class="row-meta"><span>${maxed ? "No further cost" : `Cost ${cost} 🏅`}</span><span>${maxed ? "Completed" : (affordable ? "Affordable now" : `Need ${missing} more`)}</span></div>
        ${maxed ? "" : `<button class="action-btn" data-meta="${u.key}" ${disabled}>Invest</button>`}
      </div>`;
    }).join("");
    return `<div class="mod-group"><h4>${category}</h4><div class="list">${rows}</div></div>`;
  }).join("");

  const efficiencyLabel = analysis.shortPenalty < 0.95 ? "Too Early" : (analysis.reward >= 4 ? "Efficient" : "Building");
  const nextHint = analysis.extraRevenue == null ? "Long push needed for next token." : `Need about +$${fmt(analysis.extraRevenue)} more revenue for ${analysis.nextTarget} tokens.`;
  const investedTotal = defs.reduce((sum, u) => sum + (state.metaUpgrades[u.key] || 0), 0);

  openModal(`
    <div class="modernization-shell">
    <div class="modernization-header">
      <h3>Factory Modernization</h3>
      <p>Permanent upgrades that shape every future run.</p>
      <div class="modernization-stats"><span>🏅 Tokens <strong id="modTokens">${fmt(state.resources.tokens)}</strong></span><span>Invested <strong>${investedTotal}</strong></span><span>Tier 2 ATP <strong>${fmt(state.advancedTech.points)}</strong></span></div>
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
}

function renderHUD() {
  const labels = {
    cash: "💵 Cash",
    research: "🧪 Research",
    reputation: "⭐ Reputation",
    parts: "⚙️ Parts",
    tokens: "🏅 Tokens"
  };
  const resourceMarkup = RESOURCES.map((k) => `<div class="res-pill"><div class="k">${labels[k]}</div><div class="v">${k === "cash" ? "$" : ""}${fmt(state.resources[k] || 0)}</div></div>`).join("");
  if (resourceMarkup !== hudCache.resources && el.resourceStrip) {
    el.resourceStrip.innerHTML = resourceMarkup;
    hudCache.resources = resourceMarkup;
  }

  const currentRps = `$${fmt(calcWindowsPerSec() * cashPerWindow())}`;
  const currentWps = fmt(calcWindowsPerSec());
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

  updateMachineActivity();
}

function getMilestoneGoal() {
  if (state.windowsMade < 1000) return "Mid: 1K windows";
  if (state.completedContracts < 10) return `Mid: ${10 - state.completedContracts} contracts to milestone`;
  if (state.modernizationCount < 3) return `Long: ${3 - state.modernizationCount} modernizations`;
  return "Long: collect all blueprints";
}

function renderFactory() {
  el.lineList.innerHTML = lineDefs.map((line) => {
    const lv = state.lines[line.id].level;
    const cost = lineUpgradeCost(line);
    const active = lv > 0;
    const unlocked = isLineUnlocked(line);
    const eta = secondsToAfford(cost);
    const affordText = state.resources.cash >= cost ? "Ready" : timeToAffordLabel(eta).replace(" to afford", "");
    const reqText = unlocked || !line.unlockReq ? "" : `Needs ${lineDefs.find((x) => x.id === line.unlockReq.line).name} Lv ${line.unlockReq.level}`;
    const affordable = unlocked && state.resources.cash >= cost;
    return `<div class="row ${affordable ? "affordable" : ""}"><div class="row-head"><strong>${line.icon} ${line.name}</strong><span>Lv ${lv}</span></div><div class="row-meta"><span>${active ? `${fmt(line.baseRate * lv * (1 + Math.sqrt(lv) * 0.03))} w/s raw` : "Locked"}</span><span>Cost $${fmt(cost)}</span></div><div class="row-meta"><span>${reqText || "Unlocked"}</span><span>${affordText}</span></div><button class="action-btn" data-line="${line.id}" ${(!unlocked || !affordable) ? "disabled" : ""}>${active ? "Upgrade" : "Activate"}</button></div>`;
  }).join("");

  el.lineList.querySelectorAll("button[data-line]").forEach((btn) => btn.addEventListener("click", () => buyLine(btn.dataset.line)));
}

function renderDivisions() {
  el.divisionList.innerHTML = divisionDefs.map((d) => {
    const own = state.divisions[d.id];
    return `<div class="row"><div class="row-head"><strong>${d.name}</strong><span>${own ? "Online" : "Offline"}</span></div><div class="row-meta"><span>Global +${Math.round(d.bonus * 100)}% windows</span><span>Unlock $${fmt(d.reqCash)}</span></div>${own ? "" : `<button class="action-btn" data-div="${d.id}">Unlock Division</button>`}</div>`;
  }).join("");

  el.divisionList.querySelectorAll("button[data-div]").forEach((btn) => btn.addEventListener("click", () => unlockDivision(btn.dataset.div)));
}

function renderContracts() {
  if (state.contract) {
    const c = state.contract;
    const pct = Math.min(100, (c.progress / c.targetWindows) * 100);
    const statusLabel = c.status === "completed" ? "Completed" : "Active";
    const timerLabel = c.status === "completed" ? "Timer stopped" : `${Math.ceil(c.remaining)}s`;
    el.activeContract.innerHTML = `
      <div class="row contract-card state-${c.status}">
        <div class="row-head"><strong>${c.name}</strong><span>${statusLabel}</span></div>
        <div class="row-meta"><span>Progress ${fmt(c.progress)} / ${c.targetWindows} windows</span><span>${pct.toFixed(0)}%</span></div>
        <div class="row-meta"><span>${timerLabel}</span><span>Fragments +${c.fragmentReward || 0}</span></div>
        ${c.status === "completed" ? `<button class="action-btn claim-btn" data-claim-contract="active">Claim Reward</button>` : ""}
      </div>`;
  } else {
    el.activeContract.innerHTML = `<div class="row"><div class="row-head"><strong>No active contract</strong><span>Idle</span></div><div class="row-meta"><span>Select one below.</span><span></span></div></div>`;
  }

  const tierBoost = Math.floor(state.completedContracts / 3);
  el.contractList.innerHTML = contracts.map((c) => {
    const lock = state.resources.reputation < c.minRep;
    const need = Math.ceil(c.windows * (1 + tierBoost * 0.26));
    const rewardCash = Math.ceil(c.rewards.cash * (1 + tierBoost * 0.06));
    const special = c.special ? `Special: ${c.special.replaceAll("_", " ")}` : "Special: none";
    return `<div class="row contract-card state-available"><div class="row-head"><strong>${c.name}</strong><span>${c.type}</span></div><div class="row-meta"><span>Need ${need} windows in ${c.duration}s</span><span>Rep ${c.minRep.toFixed(0)}</span></div><div class="row-meta"><span>Reward: $${fmt(rewardCash)} + extras</span><span>Fragments +${c.fragments || 0}</span></div><div class="row-meta"><span>${special}</span><span>${lock ? "Locked" : "Ready"} • Fail -${c.failRep || 2} rep</span></div>${!lock && !state.contract ? `<button class="action-btn" data-contract="${c.id}">Start</button>` : ""}</div>`;
  }).join("");

  el.contractList.querySelectorAll("button[data-contract]").forEach((btn) => btn.addEventListener("click", () => startContract(btn.dataset.contract)));
  el.activeContract.querySelector("[data-claim-contract]")?.addEventListener("click", claimContractReward);
}

function renderSkills() {
  const grouped = [...new Set(skillDefs.map((s) => s.branch))];
  const xpNeed = skillXpToNext(state.skillLevel);
  const header = `<div class="row"><div class="row-head"><strong>Skill Points</strong><span>${state.skillPoints}</span></div><div class="row-meta"><span>Level ${state.skillLevel}</span><span>${fmt(state.skillXp)} / ${xpNeed} XP</span></div><button class="action-btn" id="respecSkillsBtn">Respec Tree (2🏅 + 1% run cash)</button></div>`;
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

function renderBlueprints() {
  const fragmentHeader = `<div class="row"><div class="row-head"><strong>Blueprint Fragments</strong><span>${fmt(state.blueprintFragments)}</span></div><div class="row-meta"><span>Earned mainly from contracts. Unlocks trigger automatically.</span><span>${state.blueprints.length}/${blueprintDefs.length} unlocked</span></div></div>`;
  const cards = blueprintDefs.map((bp) => {
    const unlocked = state.blueprints.includes(bp.id);
    const remain = Math.max(0, bp.fragmentCost - state.blueprintFragments);
    return `<div class="row blueprint-card ${unlocked ? "unlocked" : "locked"}"><div class="row-head"><strong>${bp.name}</strong><span>${bp.rarity}</span></div><div class="row-meta"><span>${bp.desc}</span><span>${unlocked ? "Unlocked" : `${remain} fragments needed`}</span></div><div class="row-meta"><span>Cost ${bp.fragmentCost} fragments</span><span>${unlocked ? "Applied" : "Locked"}</span></div></div>`;
  }).join("");
  el.blueprintList.innerHTML = `${fragmentHeader}${cards}`;
}

function bootstrapFactoryVisual() {
  const machinePos = {
    cutter: { x: 12, y: 138, stage: "Frame Cut" },
    furnace: { x: 100, y: 64, stage: "Glass Forge" },
    assembler: { x: 186, y: 138, stage: "Panel Fit" },
    qc: { x: 278, y: 64, stage: "QC Scan" },
    pack: { x: 360, y: 138, stage: "Pack Out" }
  };

  const lanes = [
    { y: 86, text: "Glass line" },
    { y: 160, text: "Frame line" }
  ];

  const belts = [
    { x: 74, y: 160, w: 30 },
    { x: 162, y: 86, w: 30 },
    { x: 248, y: 160, w: 30 },
    { x: 340, y: 86, w: 30 }
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
    m.innerHTML = `<span class="lamp"></span><span class="stamp"></span><span class="stage">${p.stage}</span>`;
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
    if (state.lines[line.id].level > 0) {
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
  el.modalLayer.innerHTML = `<div class="modal">${html}</div>`;
  el.modalLayer.classList.remove("hidden");
}

function closeModal() {
  activeModal = "";
  el.modalLayer.classList.add("hidden");
  el.modalLayer.innerHTML = "";
}

function autoSave() {
  state.savedAt = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
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
    return defaultState();
  }
}

function normalizeState(incoming) {
  const next = incoming;
  if (next.metaUpgrades?.kickstart) next.metaUpgrades.startCash += next.metaUpgrades.kickstart;
  if (next.metaUpgrades?.contractMastery) next.metaUpgrades.contractNegotiation += next.metaUpgrades.contractMastery;
  if (next.metaUpgrades?.offlineLab) next.metaUpgrades.offlineLogistics += next.metaUpgrades.offlineLab;
  if (next.metaUpgrades?.blueprintIntel) next.metaUpgrades.fragmentMagnet += next.metaUpgrades.blueprintIntel;
  next.blueprints = (next.blueprints || []).filter((id) => blueprintDefs.some((bp) => bp.id === id));
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
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(n < 10 ? 2 : 1);
}
