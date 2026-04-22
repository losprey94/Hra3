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
  { id: "starter", name: "Neighborhood Retrofit", type: "Standard", duration: 160, windows: 95, minRep: 0, rewards: { cash: 110, rep: 2, parts: 2 } },
  { id: "green", name: "Eco Tower Fitout", type: "Efficiency", duration: 360, windows: 320, minRep: 10, rewards: { cash: 480, rep: 4, research: 5 } },
  { id: "airport", name: "Airport Terminal Rush", type: "Rush", duration: 560, windows: 700, minRep: 24, rewards: { cash: 1300, rep: 7, parts: 9 } },
  { id: "lux", name: "Luxury Skyline Contract", type: "Premium", duration: 1020, windows: 1760, minRep: 42, rewards: { cash: 3900, rep: 11, research: 15, parts: 16 } }
];

const skillDefs = [
  [
    { id: "prod1", name: "Line Tuning", branch: "Production", cost: 6, effect: () => state.modifiers.prod += 0.04 },
    { id: "prod2", name: "Crossfeed Pipes", branch: "Production", cost: 10, effect: () => state.modifiers.prod += 0.05 },
    { id: "prodK", name: "Keystone: Continuous Casting", branch: "Production", keystone: true, cost: 18, effect: () => state.flags.continuousCasting = true }
  ],
  [
    { id: "auto1", name: "Auto Loader", branch: "Automation", cost: 7, effect: () => state.modifiers.rushDuration += 1.2 },
    { id: "auto2", name: "Sensor Net", branch: "Automation", cost: 10, effect: () => state.modifiers.partsChance += 0.012 },
    { id: "autoK", name: "Keystone: Dark Shift", branch: "Automation", keystone: true, cost: 19, effect: () => state.flags.darkShift = true }
  ],
  [
    { id: "work1", name: "Shift Meals", branch: "Workforce", cost: 6, effect: () => state.modifiers.rushPower += 0.08 },
    { id: "work2", name: "Safety Program", branch: "Workforce", cost: 10, effect: () => state.modifiers.quality += 0.03 },
    { id: "workK", name: "Keystone: Union Momentum", branch: "Workforce", keystone: true, cost: 18, effect: () => state.flags.unionMomentum = true }
  ],
  [
    { id: "qual1", name: "Optic Calibration", branch: "Quality", cost: 7, effect: () => state.modifiers.reputationGain += 0.05 },
    { id: "qual2", name: "Defect Catchers", branch: "Quality", cost: 11, effect: () => state.modifiers.quality += 0.04 },
    { id: "qualK", name: "Keystone: Zero-Defect Week", branch: "Quality", keystone: true, cost: 20, effect: () => state.flags.zeroDefect = true }
  ],
  [
    { id: "con1", name: "Client Liaison", branch: "Contracts", cost: 7, effect: () => state.modifiers.contractReward += 0.05 },
    { id: "con2", name: "Negotiation Desk", branch: "Contracts", cost: 12, effect: () => state.modifiers.contractReward += 0.07 },
    { id: "conK", name: "Keystone: Priority Pipeline", branch: "Contracts", keystone: true, cost: 22, effect: () => state.flags.priorityPipeline = true }
  ],
  [
    { id: "eco1", name: "Bulk Purchasing", branch: "Economy", cost: 7, effect: () => state.modifiers.costDiscount += 0.025 },
    { id: "eco2", name: "Tax Optimizer", branch: "Economy", cost: 11, effect: () => state.modifiers.cashBonus += 0.05 },
    { id: "ecoK", name: "Keystone: Venture Capital", branch: "Economy", keystone: true, cost: 23, effect: () => state.flags.ventureCapital = true }
  ]
].flat();

const blueprintDefs = [
  { id: "bp_laminate", name: "Laminated Glass Protocol", desc: "+8% contract cash", rarity: "Rare", effect: () => state.modifiers.contractReward += 0.08 },
  { id: "bp_hydro", name: "Hydraulic Rail Conversion", desc: "+6% global production", rarity: "Epic", effect: () => state.modifiers.prod += 0.06 },
  { id: "bp_selfclean", name: "Self-Clean Coating", desc: "+4% reputation gain", rarity: "Rare", effect: () => state.modifiers.reputationGain += 0.04 },
  { id: "bp_smart", name: "Smart Tint Driver", desc: "Rush also grants Research ticks", rarity: "Legendary", effect: () => state.flags.smartTint = true }
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
  completedContracts: 0,
  skills: [],
  blueprints: [],
  modifiers: {
    prod: 0,
    rushPower: 0.28,
    rushDuration: 0,
    partsChance: 0,
    quality: 0,
    reputationGain: 0,
    contractReward: 0,
    costDiscount: 0,
    cashBonus: 0
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
  modernizationCount: 0
});

let state = loadState();
let tickerFrame = 0;
let goalReadyLastTick = false;
let hudCache = { resources: "", rps: "", wps: "", goal: "", cash: "" };

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
  modalLayer: document.getElementById("modalLayer"),
  modifierBanner: document.getElementById("modifierBanner")
};

validateConfig();
bootstrapFactoryVisual();
bindEvents();
applyOfflineEarnings();
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
  document.getElementById("menuButton")?.addEventListener("click", () => el.sideMenu?.classList.toggle("open"));

  document.getElementById("researchBtn")?.addEventListener("click", convertResearch);
  document.getElementById("prestigeBtn")?.addEventListener("click", tryModernize);
  document.getElementById("statsBtn")?.addEventListener("click", showStats);
  document.getElementById("saveBtn")?.addEventListener("click", () => {
    autoSave();
    toast("Game saved.");
  });
  document.getElementById("resetBtn")?.addEventListener("click", hardReset);
}

function gameTick() {
  const now = Date.now();
  const dt = Math.min((now - state.lastTick) / 1000, 2.5);
  state.lastTick = now;
  state.playtime += dt;

  const windowsPerSec = calcWindowsPerSec();
  const made = windowsPerSec * dt;
  state.windowsMade += made;

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

  el.factoryView?.classList.toggle("boosted", now <= state.rush.activeUntil);

  tickerFrame += dt;
  const flowInterval = now <= state.rush.activeUntil ? 0.55 : 1;
  if (tickerFrame > flowInterval) {
    animateFlow();
    if (el.incomeTicker) el.incomeTicker.textContent = `+$${fmt(cashGain / dt)}/s`;
    if (cashGain > 0.01) spawnMoneyPop(cashGain / dt, now <= state.rush.activeUntil);
    tickerFrame = 0;
  }

  maybeSpawnModifier(now);
  renderHUD();
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

  let modifierMul = 1;
  if (state.activeModifier && state.activeModifier.prodMul) modifierMul *= state.activeModifier.prodMul;

  if (state.flags.continuousCasting) wps *= 1.04;
  return wps * divBoost * skillBoost * tokenBoost * rushBoost * modifierMul;
}

function cashPerWindow() {
  let v = 2.7 * (1 + state.modifiers.cashBonus);
  if (state.flags.ventureCapital && state.resources.cash < 1200) v *= 1.08;
  if (state.activeModifier && state.activeModifier.cashMul) v *= state.activeModifier.cashMul;
  return v;
}

function lineUpgradeCost(line) {
  const lv = state.lines[line.id].level;
  const discount = 1 - Math.min(0.18, state.modifiers.costDiscount);
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
  state.rush.cooldownUntil = now + 32000 + cdPenalty;
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
  state.contract = { ...c, remaining: c.duration, progress: 0 };
  toast(`Contract started: ${c.name}`);
  renderAll();
}

function tickContract(dt, windowsMade) {
  if (!state.contract) return;
  state.contract.remaining -= dt;
  state.contract.progress += windowsMade;

  if (state.contract.remaining <= 0) {
    if (state.contract.progress >= state.contract.windows) {
      completeContract();
    } else {
      toast("Contract failed. Client unhappy.");
      state.resources.reputation = Math.max(0, state.resources.reputation - 2.5);
      state.contract = null;
    }
    renderAll();
  }
}

function completeContract() {
  const c = state.contract;
  const mult = 1 + Math.min(0.32, state.modifiers.contractReward);
  state.resources.cash += (c.rewards.cash || 0) * mult;
  state.resources.parts += Math.round((c.rewards.parts || 0) * mult);
  state.resources.research += Math.round((c.rewards.research || 0) * mult);
  state.resources.reputation += (c.rewards.rep || 0) * (1 + state.modifiers.reputationGain);

  if (state.flags.priorityPipeline && Math.random() < 0.1) state.resources.parts += 2;

  if (Math.random() < Math.min(0.17, 0.05 + state.completedContracts * 0.0015)) {
    awardBlueprint();
  }

  state.completedContracts += 1;
  showRewardPopup(`Contract Complete +$${fmt((c.rewards.cash || 0) * mult)}`);
  toast(`Contract complete: ${c.name}`);
  state.contract = null;
}

function awardBlueprint() {
  const available = blueprintDefs.filter((b) => !state.blueprints.includes(b.id));
  if (!available.length) return;
  const pick = available[Math.floor(Math.random() * available.length)];
  state.blueprints.push(pick.id);
  pick.effect();
  toast(`Blueprint found: ${pick.name}`);
}

function buySkill(skillId) {
  if (state.skills.includes(skillId)) return;
  const skill = skillDefs.find((x) => x.id === skillId);
  if (!skill) return;
  if (state.resources.research < skill.cost) return;
  state.resources.research -= skill.cost;
  state.skills.push(skillId);
  skill.effect();
  if (skill.keystone) toast(`Keystone unlocked: ${skill.name}`);
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
  return 130000 * Math.pow(1.85, state.modernizationCount);
}

function calcModernizationReward() {
  const score = state.totalEarned / 220000 + state.completedContracts * 0.14 + state.resources.reputation * 0.035;
  return Math.max(0, Math.floor(Math.pow(score, 0.68)));
}

function tryModernize() {
  const cost = modernizationCost();
  const reward = calcModernizationReward();
  if (state.resources.cash < cost || reward < 1) {
    toast("Modernization not ready yet.");
    return;
  }
  openModal(`
    <h3>Factory Modernization</h3>
    <p>Reset lines, divisions, skills and contracts to gain <strong>${reward} Modernization Tokens</strong>.</p>
    <button class="action-btn" id="confirmModernize">Proceed</button>
  `);
  document.getElementById("confirmModernize").addEventListener("click", () => {
    state.resources.tokens += reward;
    state.modernizationCount += 1;
    const preservedTokens = state.resources.tokens;
    state = defaultState();
    state.resources.tokens = preservedTokens;
    toast(`Modernized! +${reward} tokens.`);
    closeModal();
    renderAll();
  });
}

function hardReset() {
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
  const goalText = `Goal: ${goalTarget.line.name} $${fmt(goalTarget.cost)} (${etaLabel})`;
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
    const pct = Math.min(100, (c.progress / c.windows) * 100);
    el.activeContract.innerHTML = `<div class="row"><div class="row-head"><strong>${c.name}</strong><span>${Math.ceil(c.remaining)}s</span></div><div class="row-meta"><span>${fmt(c.progress)} / ${c.windows} windows</span><span>${pct.toFixed(0)}%</span></div></div>`;
  } else {
    el.activeContract.innerHTML = `<div class="row"><div class="row-head"><strong>No active contract</strong><span>Idle</span></div><div class="row-meta"><span>Select one below.</span><span></span></div></div>`;
  }

  const tierBoost = Math.floor(state.completedContracts / 3);
  el.contractList.innerHTML = contracts.map((c) => {
    const lock = state.resources.reputation < c.minRep;
    const need = Math.ceil(c.windows * (1 + tierBoost * 0.26));
    const rewardCash = Math.ceil(c.rewards.cash * (1 + tierBoost * 0.06));
    return `<div class="row"><div class="row-head"><strong>${c.name}</strong><span>${c.type}</span></div><div class="row-meta"><span>Need ${need} windows in ${c.duration}s</span><span>Rep ${c.minRep.toFixed(0)}</span></div><div class="row-meta"><span>Reward: $${fmt(rewardCash)} + extras</span><span>${lock ? "Locked" : "Ready"}</span></div>${!lock && !state.contract ? `<button class="action-btn" data-contract="${c.id}">Start</button>` : ""}</div>`;
  }).join("");

  el.contractList.querySelectorAll("button[data-contract]").forEach((btn) => btn.addEventListener("click", () => startContract(btn.dataset.contract)));
}

function renderSkills() {
  const grouped = [...new Set(skillDefs.map((s) => s.branch))];
  el.skillBranches.innerHTML = grouped.map((b) => {
    const branchSkills = skillDefs.filter((s) => s.branch === b);
    const owned = branchSkills.filter((s) => state.skills.includes(s.id)).length;
    return `<div class="branch"><div class="row-head"><strong>${b}</strong><span>${owned}/${branchSkills.length}</span></div><div class="nodes">${branchSkills.map((s) => `<button class="node ${s.keystone ? "keystone" : ""} ${state.skills.includes(s.id) ? "owned" : ""}" data-skill="${s.id}">${s.name}<br/>${state.skills.includes(s.id) ? "Owned" : `${s.cost} RP`}</button>`).join("")}</div></div>`;
  }).join("");

  el.skillBranches.querySelectorAll("button[data-skill]").forEach((btn) => btn.addEventListener("click", () => buySkill(btn.dataset.skill)));
}

function renderBlueprints() {
  if (!state.blueprints.length) {
    el.blueprintList.innerHTML = `<div class="row"><div class="row-head"><strong>No blueprints yet</strong><span>Rare Drops</span></div><div class="row-meta"><span>Finish contracts to discover build-defining tech.</span><span></span></div></div>`;
    return;
  }

  el.blueprintList.innerHTML = state.blueprints.map((id) => {
    const b = blueprintDefs.find((x) => x.id === id);
    return `<div class="row"><div class="row-head"><strong>${b.name}</strong><span>${b.rarity}</span></div><div class="row-meta"><span>${b.desc}</span><span>Applied</span></div></div>`;
  }).join("");
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
      { duration: 980, easing: "linear" }
    );
    setTimeout(() => {
      item.remove();
      spawnCompletionBurst(path.to.x, path.to.y);
      spawnTickPop(path.to.x + 8, path.to.y - 6);
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
  const pop = document.createElement("div");
  pop.className = `money-pop ${boosted ? "boost" : ""}`;
  pop.textContent = `+$${fmt(amountPerSec)}/s`;
  el.fxLayer.appendChild(pop);
  setTimeout(() => pop.remove(), 760);
}

function spawnCompletionBurst(x, y) {
  if (!el.fxLayer) return;
  const burst = document.createElement("div");
  burst.className = "completion-burst";
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;
  el.fxLayer.appendChild(burst);
  setTimeout(() => burst.remove(), 460);
}

function spawnTickPop(x, y) {
  if (!el.fxLayer) return;
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

  const cappedSec = Math.min(1200, offlineSec);
  const offlineRate = calcWindowsPerSec() * cashPerWindow();
  const offlineGain = offlineRate * cappedSec * 0.2;
  if (offlineGain > 0) {
    state.resources.cash += offlineGain;
    state.totalEarned += offlineGain;
    toast(`Offline production: +$${fmt(offlineGain)} (${Math.floor(cappedSec / 60)}m capped).`);
  }
  state.savedAt = now;
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
    return {
      ...defaultState(),
      ...parsed,
      lastTick: Date.now()
    };
  } catch {
    return defaultState();
  }
}

function fmt(n) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(n < 10 ? 2 : 1);
}
