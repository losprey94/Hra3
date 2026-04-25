const SAVE_KEY = "window_factory_tycoon_v1";
const SAVE_VERSION = 2;

const RESOURCES = ["cash", "research", "reputation", "parts", "tokens"];

const lineDefs = [
  { id: "cutter", name: "Frame Cutter", baseCost: 45, baseRate: 0.2, icon: "▦", unlockReq: null },
  { id: "furnace", name: "Glass Furnace", baseCost: 240, baseRate: 0.29, icon: "◍", unlockReq: { line: "cutter", level: 7 } },
  { id: "assembler", name: "Assembly Robot", baseCost: 1020, baseRate: 0.39, icon: "◈", unlockReq: { line: "furnace", level: 8 } },
  { id: "qc", name: "Quality Scanner", baseCost: 5100, baseRate: 0.52, icon: "◎", unlockReq: { line: "assembler", level: 7 } },
  { id: "pack", name: "Packaging Bay", baseCost: 26000, baseRate: 0.68, icon: "⬣", unlockReq: { line: "qc", level: 6 } }
];

const lineMilestones = [5, 10, 25, 50];

const chainSequences = [
  { id: "school", steps: ["School Renovation I", "School Renovation II", "School Final Delivery"] },
  { id: "villa", steps: ["Luxury Villa Order I", "Luxury Villa Order II", "Luxury Premium Finish"] },
  { id: "export", steps: ["Export Batch I", "Customs Rush", "Regional Deal"] },
  { id: "hospital", steps: ["Hospital Wing Glazing", "Sterile Seal Refit", "Emergency Block Handover"] },
  { id: "metro", steps: ["Metro Station Retrofit", "Platform Safety Glass", "Interchange Grand Opening"] },
  { id: "resort", steps: ["Coastal Resort Atrium", "Saltproof Seal Pass", "Panorama Suite Completion"] }
];

const runFocusOptions = [
  { id: "prod", label: "Production Focus", desc: "+10% production this run" },
  { id: "contract", label: "Contract Focus", desc: "+10% contract rewards this run" },
  { id: "blueprint", label: "Blueprint Focus", desc: "+10% fragment chance this run" },
  { id: "offline", label: "Offline Focus", desc: "+15% offline earnings this run" }
];

const runGoalOptions = [
  { id: "contract", label: "Contract Run", desc: "Complete 6 contracts", target: 6 },
  { id: "production", label: "Production Run", desc: "Reach 40 w/s", target: 40 },
  { id: "blueprint", label: "Blueprint Run", desc: "Earn 18 fragments", target: 18 },
  { id: "speed", label: "Speed Run", desc: "Reach modernization reward 4", target: 4 },
  { id: "chain", label: "Chain Run", desc: "Finish 3 chain contracts", target: 3 },
  { id: "quality", label: "Quality Run", desc: "Reach 55 reputation", target: 55 },
  { id: "parts", label: "Logistics Run", desc: "Collect 120 parts", target: 120 }
];

const softEventPool = [
  { id: "glass_surge", text: "Glass Demand Surge", duration: 600, contractRewardMul: 1.2 },
  { id: "supplier_discount", text: "Supplier Discount", duration: 300, costMul: 0.9 },
  { id: "power_surge", text: "Power Surge", duration: 120, prodMul: 1.15 },
  { id: "export_rush", text: "Export Rush", duration: 300, contractSpeedMul: 1.1 },
  { id: "qc_award", text: "Quality Certification Week", duration: 360, contractRewardMul: 1.1 },
  { id: "dock_priority", text: "Dock Priority Window", duration: 240, contractSpeedMul: 1.08 },
  { id: "recycle_credit", text: "Recycling Credit Program", duration: 300, costMul: 0.93 }
];

const machineSpecDefs = {
  cutter: {
    t10: [{ id: "fast_frames", label: "Faster Frames", desc: "+6% cutter output" }, { id: "cheap_frames", label: "Cheaper Frames", desc: "-6% cutter upgrade cost" }, { id: "premium_frames", label: "Premium Frames", desc: "+4% contract rewards" }],
    t25: [{ id: "precision_feed", label: "Precision Feed", desc: "+5% furnace output" }, { id: "throughput_feed", label: "Throughput Feed", desc: "+4% global production" }, { id: "stable_frames", label: "Stable Frames", desc: "+6% reputation gain" }]
  },
  furnace: {
    t10: [{ id: "more_glass", label: "More Glass", desc: "+7% furnace output" }, { id: "quality_glass", label: "Quality Glass", desc: "+5% contract rewards" }, { id: "fragment_fumes", label: "Fragment Fumes", desc: "+4% fragment chance" }],
    t25: [{ id: "thermal_sync", label: "Thermal Sync", desc: "+5% assembler output" }, { id: "energy_saver", label: "Energy Saver", desc: "-4% all line costs" }, { id: "premium_burn", label: "Premium Burn", desc: "+6% premium contract rewards" }]
  },
  assembler: {
    t10: [{ id: "fast_assembly", label: "Faster Assembly", desc: "+7% assembler output" }, { id: "offline_assembly", label: "Offline Assembly", desc: "+8% offline earnings" }, { id: "contract_eff", label: "Contract Efficiency", desc: "-5% contract duration" }],
    t25: [{ id: "smart_routing", label: "Smart Routing", desc: "+6% qc output" }, { id: "rush_link", label: "Rush Link", desc: "+8% rush power" }, { id: "quality_fit", label: "Quality Fit", desc: "+5% rep gain" }]
  },
  qc: {
    t10: [{ id: "fast_qc", label: "Fast QC", desc: "+6% qc output" }, { id: "client_trust", label: "Client Trust", desc: "+6% contract rewards" }, { id: "fail_guard", label: "Fail Guard", desc: "-8% fail penalties" }],
    t25: [{ id: "package_sync", label: "Package Sync", desc: "+6% pack output" }, { id: "reputation_boost", label: "Reputation Boost", desc: "+8% reputation gain" }, { id: "reward_scan", label: "Reward Scan", desc: "+5% fragment gain" }]
  },
  pack: {
    t10: [{ id: "fast_pack", label: "Fast Pack", desc: "+6% pack output" }, { id: "vip_pack", label: "VIP Pack", desc: "+6% VIP rewards" }, { id: "safe_pack", label: "Safe Pack", desc: "-4% contract failure loss" }],
    t25: [{ id: "export_pack", label: "Export Pack", desc: "+6% contract cash" }, { id: "parts_recovery", label: "Parts Recovery", desc: "+6% parts chance" }, { id: "frag_seal", label: "Fragment Seal", desc: "+4% fragment gain" }]
  }
};

const divisionDefs = [
  { id: "residential", name: "Residential Unit", reqCash: 900, bonus: 0.06 },
  { id: "commercial", name: "Commercial Unit", reqCash: 8200, bonus: 0.09 },
  { id: "smartglass", name: "SmartGlass Unit", reqCash: 44000, bonus: 0.13 },
  { id: "aeroshield", name: "AeroShield Lab", reqCash: 220000, bonus: 0.18 }
];

const contractTemplates = [
  { id: "starter", name: "Neighborhood Retrofit", baseDuration: 150, baseWindows: 95, minRep: 0, failRep: 2, rewards: { cash: 150, rep: 2, parts: 2 }, fragments: 2 },
  { id: "green", name: "Eco Tower Fitout", baseDuration: 320, baseWindows: 270, minRep: 8, failRep: 3, rewards: { cash: 500, rep: 4, research: 5 }, fragments: 2, special: "research_bonus" },
  { id: "airport", name: "Airport Terminal Rush", baseDuration: 560, baseWindows: 680, minRep: 24, failRep: 4, rewards: { cash: 1250, rep: 7, parts: 9 }, fragments: 3, special: "rush_bonus" },
  { id: "fragile", name: "Fragile Glass Emergency", baseDuration: 430, baseWindows: 540, minRep: 28, failRep: 8, rewards: { cash: 1850, rep: 5, parts: 6 }, fragments: 4, special: "risky_parts" },
  { id: "lux", name: "Luxury Skyline Contract", baseDuration: 980, baseWindows: 1680, minRep: 42, failRep: 6, rewards: { cash: 3850, rep: 11, research: 15, parts: 16 }, fragments: 7, special: "blueprint_fragments_bonus" },
  { id: "rail_hub", name: "Rail Hub Platform Shielding", baseDuration: 520, baseWindows: 620, minRep: 20, failRep: 4, rewards: { cash: 1180, rep: 6, parts: 8 }, fragments: 3 },
  { id: "clinic", name: "Clinic Sterile Window Upgrade", baseDuration: 390, baseWindows: 440, minRep: 16, failRep: 3, rewards: { cash: 820, rep: 5, research: 6 }, fragments: 3, special: "research_bonus" },
  { id: "storm", name: "Stormproof District Rebuild", baseDuration: 740, baseWindows: 980, minRep: 34, failRep: 7, rewards: { cash: 2240, rep: 8, parts: 12 }, fragments: 5, special: "risky_parts" },
  { id: "datacenter", name: "Data Center Thermal Refit", baseDuration: 860, baseWindows: 1280, minRep: 38, failRep: 5, rewards: { cash: 3020, rep: 9, research: 11, parts: 10 }, fragments: 6, special: "rush_bonus" },
  { id: "atrium", name: "Grand Atrium Panorama Install", baseDuration: 1040, baseWindows: 1760, minRep: 46, failRep: 6, rewards: { cash: 4100, rep: 12, research: 14, parts: 18 }, fragments: 8, special: "blueprint_fragments_bonus" }
];

const contractTypes = {
  Standard: { durationMul: 1, rewardMul: 1, windowsMul: 1, repBonus: 0, fragmentMul: 1, riskPenaltyChance: 0, reqRepMul: 1 },
  Rush: { durationMul: 0.68, rewardMul: 1.22, windowsMul: 1.1, repBonus: 1, fragmentMul: 0.85, riskPenaltyChance: 0, reqRepMul: 1.2 },
  Premium: { durationMul: 1.35, rewardMul: 1.42, windowsMul: 1.25, repBonus: 2, fragmentMul: 1.65, riskPenaltyChance: 0, reqRepMul: 1.25 },
  Bulk: { durationMul: 1.22, rewardMul: 1.22, windowsMul: 1.45, repBonus: 1, fragmentMul: 0.88, riskPenaltyChance: 0, reqRepMul: 1.18 },
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
  { id: "m_short_3", tier: "Short", label: "Reach 12 w/s production", progress: () => calcWindowsPerSec() / 12, reward: { cash: 500, parts: 6 } },
  { id: "m_mid_1", tier: "Mid", label: "Unlock 2 blueprints", progress: () => state.blueprints.length / 2, reward: { chest: "rare", fragments: 4 } },
  { id: "m_mid_2", tier: "Mid", label: "Earn $50K total", progress: () => state.totalEarned / 50000, reward: { tokens: 1, chest: "epic" } },
  { id: "m_mid_3", tier: "Mid", label: "Finish 4 chain contracts", progress: () => state.contractChainDepth / 4, reward: { fragments: 6, research: 12 } },
  { id: "m_long_1", tier: "Long", label: "Complete 20 contracts", progress: () => state.completedContracts / 20, reward: { tokens: 2, chest: "legendary" } },
  { id: "m_long_2", tier: "Long", label: "Reach contract tier 8", progress: () => state.contractTier / 8, reward: { tokens: 2, chest: "epic", fragments: 8 } },
  { id: "m_long_3", tier: "Long", label: "Produce 35,000 windows", progress: () => state.windowsMade / 35000, reward: { tokens: 1, chest: "legendary", parts: 30 } }
];

const skillDefs = [
  { id: "prod_1", name: "Line Tuning", branch: "Production", tier: 1, cost: 1, type: "small", desc: "+4% production speed", effect: () => state.modifiers.prod += 0.04 },
  { id: "prod_2", name: "Cut Precision", branch: "Production", tier: 2, cost: 2, type: "small", prereq: "prod_1", desc: "+4% production speed", effect: () => state.modifiers.prod += 0.04 },
  { id: "prod_3", name: "Furnace Pressure", branch: "Production", tier: 3, cost: 3, type: "medium", prereq: "prod_2", desc: "+10% production speed", effect: () => state.modifiers.prod += 0.1 },
  { id: "prod_4", name: "Output Mix", branch: "Production", tier: 4, cost: 4, type: "notable", prereq: "prod_2", desc: "+10% cash/window", effect: () => state.modifiers.cashBonus += 0.1 },
  { id: "prod_5", name: "Keystone: Furnace Symphony Protocol", branch: "Production", tier: 5, cost: 6, type: "keystone", prereq: "prod_3", desc: "▲ +42% production and stronger line cadence ▼ -22% contract rewards", effect: () => { state.modifiers.prod += 0.42; state.modifiers.lineMilestonePower += 0.16; state.modifiers.contractReward -= 0.22; } },

  { id: "auto_1", name: "Autoload Arms", branch: "Automation", tier: 1, cost: 1, type: "small", desc: "+5% offline efficiency", effect: () => state.modifiers.offlineEfficiency += 0.05 },
  { id: "auto_2", name: "Sensor Mesh", branch: "Automation", tier: 2, cost: 2, type: "small", prereq: "auto_1", desc: "+4% part recovery chance", effect: () => state.modifiers.partsChance += 0.04 },
  { id: "auto_3", name: "Queued Dispatch", branch: "Automation", tier: 3, cost: 3, type: "medium", prereq: "auto_2", desc: "+12% offline efficiency", effect: () => state.modifiers.offlineEfficiency += 0.12 },
  { id: "auto_4", name: "Maintenance AI", branch: "Automation", tier: 4, cost: 4, type: "notable", prereq: "auto_2", desc: "-10% line costs", effect: () => state.modifiers.costDiscount += 0.1 },
  { id: "auto_5", name: "Keystone: Night Shift Conveyor Grid", branch: "Automation", tier: 5, cost: 6, type: "keystone", prereq: "auto_3", desc: "▲ +70% offline earnings ▼ -15% boost power", effect: () => { state.modifiers.offlineEfficiency += 0.7; state.modifiers.activeProductionPenalty += 0.05; state.modifiers.rushPower -= 0.15; } },

  { id: "con_1", name: "Client Briefing", branch: "Contracts", tier: 1, cost: 1, type: "small", desc: "+5% contract rewards", effect: () => state.modifiers.contractReward += 0.05 },
  { id: "con_2", name: "Sales Cadence", branch: "Contracts", tier: 2, cost: 2, type: "small", prereq: "con_1", desc: "+5% contract rewards", effect: () => state.modifiers.contractReward += 0.05 },
  { id: "con_3", name: "Premium Clauses", branch: "Contracts", tier: 3, cost: 3, type: "medium", prereq: "con_2", desc: "+12% premium and +8% VIP contract rewards", effect: () => { state.modifiers.premiumContractReward += 0.12; state.modifiers.vipContractReward += 0.08; } },
  { id: "con_4", name: "Rapid Negotiation", branch: "Contracts", tier: 4, cost: 4, type: "notable", prereq: "con_2", desc: "-10% contract duration", effect: () => state.modifiers.contractDurationMul -= 0.1 },
  { id: "con_5", name: "Keystone: All-In Brokerage Charter", branch: "Contracts", tier: 5, cost: 6, type: "keystone", prereq: "con_3", desc: "▲ +45% contract rewards and chain mastery ▼ +20% contract duration", effect: () => { state.modifiers.contractReward += 0.45; state.modifiers.contractDurationMul += 0.2; state.flags.chainMastery = true; } },

  { id: "eco_1", name: "Tax Timing", branch: "Economy", tier: 1, cost: 1, type: "small", desc: "+4% cash/window", effect: () => state.modifiers.cashBonus += 0.04 },
  { id: "eco_2", name: "Bulk Negotiation", branch: "Economy", tier: 2, cost: 2, type: "small", prereq: "eco_1", desc: "-4% line costs", effect: () => state.modifiers.costDiscount += 0.04 },
  { id: "eco_3", name: "Capital Rotation", branch: "Economy", tier: 3, cost: 3, type: "medium", prereq: "eco_2", desc: "+10% cash/window", effect: () => state.modifiers.cashBonus += 0.1 },
  { id: "eco_4", name: "Margin Controls", branch: "Economy", tier: 4, cost: 4, type: "notable", prereq: "eco_2", desc: "-10% line costs", effect: () => state.modifiers.costDiscount += 0.1 },
  { id: "eco_5", name: "Keystone: Margin-First Profit Doctrine", branch: "Economy", tier: 5, cost: 6, type: "keystone", prereq: "eco_3", desc: "▲ -15% costs and +18% cash ▼ -18% fragment gains", effect: () => { state.modifiers.cashBonus += 0.18; state.modifiers.costDiscount += 0.15; state.modifiers.economicPressureResist += 0.12; state.modifiers.fragmentGain -= 0.18; } },

  { id: "qual_1", name: "Optic Calibration", branch: "Quality", tier: 1, cost: 1, type: "small", desc: "+5% reputation gain", effect: () => state.modifiers.reputationGain += 0.05 },
  { id: "qual_2", name: "Defect Catchers", branch: "Quality", tier: 2, cost: 2, type: "small", prereq: "qual_1", desc: "+4% part recovery chance", effect: () => state.modifiers.partsChance += 0.04 },
  { id: "qual_3", name: "Seal Inspection", branch: "Quality", tier: 3, cost: 3, type: "medium", prereq: "qual_2", desc: "-12% contract fail reputation loss", effect: () => state.modifiers.contractFailurePenaltyMul -= 0.12 },
  { id: "qual_4", name: "Premium Standard", branch: "Quality", tier: 4, cost: 4, type: "notable", prereq: "qual_2", desc: "+10% contract rewards", effect: () => state.modifiers.contractReward += 0.1 },
  { id: "qual_5", name: "Keystone: Zero Defect Certification", branch: "Quality", tier: 5, cost: 6, type: "keystone", prereq: "qual_3", desc: "▲ +40% premium rewards and +14% reputation ▼ -12% bulk output", effect: () => { state.modifiers.premiumContractReward += 0.4; state.modifiers.reputationGain += 0.14; state.modifiers.prod -= 0.06; state.flags.bossBreaker = true; } },

  { id: "work_1", name: "Shift Meals", branch: "Workforce", tier: 1, cost: 1, type: "small", desc: "+4% rush power", effect: () => state.modifiers.rushPower += 0.04 },
  { id: "work_2", name: "Safety Program", branch: "Workforce", tier: 2, cost: 2, type: "small", prereq: "work_1", desc: "-5% fail reputation loss", effect: () => state.modifiers.contractFailurePenaltyMul -= 0.05 },
  { id: "work_3", name: "Crew Rhythm", branch: "Workforce", tier: 3, cost: 3, type: "medium", prereq: "work_2", desc: "+10% production speed", effect: () => state.modifiers.prod += 0.1 },
  { id: "work_4", name: "Union Coordination", branch: "Workforce", tier: 4, cost: 4, type: "notable", prereq: "work_2", desc: "+12% rush duration", effect: () => state.modifiers.rushDuration += 1.2 },
  { id: "work_5", name: "Keystone: Human Priority Labor Accord", branch: "Workforce", tier: 5, cost: 6, type: "keystone", prereq: "work_3", desc: "▲ -38% fail loss, +16% rush power, adaptive blueprints ▼ -14% offline gains", effect: () => { state.modifiers.contractFailurePenaltyMul -= 0.38; state.modifiers.rushPower += 0.16; state.modifiers.offlineEfficiency -= 0.14; state.flags.adaptiveBlueprints = true; } }
];

const blueprintDefs = [
  { id: "bp_frame", name: "Reinforced Frame Blueprint", desc: "Common: +4% production and +2% line synergy scaling", rarity: "Common", fragmentCost: 20, effect: () => { state.modifiers.prod += 0.04; state.modifiers.lineSynergy += 0.02; } },
  { id: "bp_glass", name: "Precision Glass Cut Blueprint", desc: "Rare: +4% contract payouts, +8% VIP payouts, small double-reward chance", rarity: "Rare", fragmentCost: 45, effect: () => { state.modifiers.contractReward += 0.04; state.modifiers.vipContractReward += 0.08; state.flags.bpDoubleContractRewardChance = true; } },
  { id: "bp_thermal", name: "Thermal Seal Blueprint", desc: "Rare: +5% offline efficiency, reduced economic pressure, first contract bonus fragments", rarity: "Rare", fragmentCost: 80, effect: () => { state.modifiers.offlineEfficiency += 0.05; state.modifiers.economicPressureResist += 0.06; state.flags.bpFirstContractFragBonus = true; } },
  { id: "bp_assembly", name: "Smart Assembly Blueprint", desc: "Epic: +2% parts/+2% rep and boosts milestone power after tier 3 contracts", rarity: "Epic", fragmentCost: 130, effect: () => { state.modifiers.partsChance += 0.02; state.modifiers.reputationGain += 0.02; if (state.contractTier >= 3) state.modifiers.lineMilestonePower += 0.16; } },
  { id: "bp_finish", name: "Premium Finish Blueprint", desc: "Legendary: adaptive economy boost, first upgrade discount, rush cycle bonus", rarity: "Legendary", fragmentCost: 190, effect: () => { const dynamicCash = Math.min(0.12, state.completedContracts * 0.003); state.modifiers.cashBonus += 0.03 + dynamicCash; state.modifiers.premiumContractReward += 0.03; state.flags.bpFirstUpgradeDiscount = true; state.flags.bpRushPartsBonus = true; } },
  { id: "bp_tempered", name: "Tempered Lattice Blueprint", desc: "Rare: +3% production, +4% reputation gains for safety-focused lines", rarity: "Rare", fragmentCost: 105, effect: () => { state.modifiers.prod += 0.03; state.modifiers.reputationGain += 0.04; } },
  { id: "bp_logistics", name: "Dockflow Logistics Blueprint", desc: "Epic: -4% contract duration, +4% parts recovery, smoother rush windows", rarity: "Epic", fragmentCost: 150, effect: () => { state.modifiers.contractDurationMul -= 0.04; state.modifiers.partsChance += 0.04; state.modifiers.rushDuration += 0.45; } },
  { id: "bp_pvc", name: "PVC Fusion Extrusion Blueprint", desc: "Legendary: +6% cash, +5% fragment gains, small line synergy increase", rarity: "Legendary", fragmentCost: 230, effect: () => { state.modifiers.cashBonus += 0.06; state.modifiers.fragmentGain += 0.05; state.modifiers.lineSynergy += 0.03; } }
];

const modifierPool = [
  { id: "shortage", text: "Glass Shortage: -18% production for 3 minutes", duration: 180, prodMul: 0.82 },
  { id: "energy", text: "Energy Crisis: Rush cooldown +10s for 3 minutes", duration: 180, rushCdAdd: 10 },
  { id: "boom", text: "Construction Boom: +12% cash for 3 minutes", duration: 180, cashMul: 1.12 },
  { id: "inspection", text: "Audit Week: +10% contract rewards for 3 minutes", duration: 180, contractRewardMul: 1.1 },
  { id: "belt_jam", text: "Conveyor Jam: -10% production for 2 minutes", duration: 120, prodMul: 0.9 },
  { id: "dock_window", text: "Freight Slot Opened: +8% contract speed for 3 minutes", duration: 180, contractSpeedMul: 1.08 }
];

const defaultState = () => ({
  saveVersion: SAVE_VERSION,
  resources: { cash: 75, research: 0, reputation: 0, parts: 0, tokens: 0 },
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
  contractStreak: 0,
  bestContractStreak: 0,
  completedContracts: 0,
  premiumContractsCompleted: 0,
  activeChain: null,
  chests: { common: 0, rare: 0, epic: 0, legendary: 0 },
  claimedMilestones: [],
  pendingClaims: [],
  activeBoosts: [],
  activeRunEvent: null,
  runEventNextAt: 0,
  runFocus: null,
  runGoal: null,
  offlineReport: null,
  productionStrategy: "balanced",
  machineSpecs: Object.fromEntries(lineDefs.map((l) => [l.id, { t10: null, t25: null }])),
  activeChallenge: null,
  challengeHistory: { completed: 0 },
  overdrive: { charge: 0, streak: 0 },
  milestoneStreak: 0,
  riskEventNextAt: 0,
  skills: [],
  skillPoints: 1,
  skillXp: 0,
  skillLevel: 1,
  nextSkillWindowMilestone: 1800,
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
    firstContractSpeedPending: true,
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
let overdriveReadyNotified = false;
let lastMoneyPopAt = 0;
let lastRewardPopupAt = 0;
const repairWarningState = { lastAt: 0, count: 0 };
let startupRepairNotice = "";
let activeRepairCollector = null;

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
  bottleneckChip: document.getElementById("bottleneckChip"),
  rpsLabel: document.getElementById("rpsLabel"),
  wpsLabel: document.getElementById("wpsLabel"),
  cashFocus: document.getElementById("cashFocus"),
  goalLabel: document.getElementById("goalLabel"),
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
if (startupRepairNotice) toast(startupRepairNotice);
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
  if (activeRepairCollector) {
    activeRepairCollector.count += 1;
    if (activeRepairCollector.issues.length < 8) activeRepairCollector.issues.push(issue);
  }
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
  const report = { repaired: false, count: 0, issues: [] };
  activeRepairCollector = report;
  const defaults = defaultState();
  if (!state || typeof state !== "object") {
    warnRepair(`State object missing (${reason}), restoring defaults.`);
    state = defaults;
    report.repaired = true;
    activeRepairCollector = null;
    return report;
  }

  state.saveVersion = SAVE_VERSION;
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
  state.runState.firstContractSpeedPending = !!state.runState.firstContractSpeedPending;
  state.runState.firstUpgradeDiscountPending = !!state.runState.firstUpgradeDiscountPending;
  state.runState.rushOrdersUsed = Math.floor(clampNonNegative(state.runState.rushOrdersUsed, 0, "runState.rushOrdersUsed"));

  state.contractTier = Math.max(1, Math.floor(clampNonNegative(state.contractTier, 1, "contractTier")));
  state.contractXp = clampNonNegative(state.contractXp, 0, "contractXp");
  state.completedContracts = Math.floor(clampNonNegative(state.completedContracts, 0, "completedContracts"));
  state.contractChainDepth = Math.floor(clampNonNegative(state.contractChainDepth, 0, "contractChainDepth"));
  state.contractBossWins = Math.floor(clampNonNegative(state.contractBossWins, 0, "contractBossWins"));
  state.contractStreak = Math.floor(clampNonNegative(state.contractStreak, 0, "contractStreak"));
  state.bestContractStreak = Math.floor(clampNonNegative(state.bestContractStreak, 0, "bestContractStreak"));
  state.premiumContractsCompleted = Math.floor(clampNonNegative(state.premiumContractsCompleted, 0, "premiumContractsCompleted"));
  if (!state.activeChain || typeof state.activeChain !== "object") state.activeChain = null;
  if (!state.activeRunEvent || typeof state.activeRunEvent !== "object") state.activeRunEvent = null;
  if (state.activeRunEvent && !Number.isFinite(Number(state.activeRunEvent.until))) state.activeRunEvent = null;
  state.runEventNextAt = clampNonNegative(state.runEventNextAt, 0, "runEventNextAt");
  if (!runFocusOptions.some((f) => f.id === state.runFocus)) state.runFocus = null;
  if (!["mass", "balanced", "quality", "lean"].includes(state.productionStrategy)) state.productionStrategy = "balanced";
  if (!state.runGoal || typeof state.runGoal !== "object") state.runGoal = null;
  if (!state.machineSpecs || typeof state.machineSpecs !== "object") {
    state.machineSpecs = Object.fromEntries(lineDefs.map((l) => [l.id, { t10: null, t25: null }]));
  }
  lineDefs.forEach((l) => {
    if (!state.machineSpecs[l.id]) state.machineSpecs[l.id] = { t10: null, t25: null };
    state.machineSpecs[l.id].t10 = typeof state.machineSpecs[l.id].t10 === "string" ? state.machineSpecs[l.id].t10 : null;
    state.machineSpecs[l.id].t25 = typeof state.machineSpecs[l.id].t25 === "string" ? state.machineSpecs[l.id].t25 : null;
  });

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
  state.overdrive = { ...defaults.overdrive, ...(state.overdrive || {}) };
  state.overdrive.charge = Math.max(0, Math.min(100, finiteOrDefault(state.overdrive.charge, defaults.overdrive.charge, "overdrive.charge")));
  state.overdrive.streak = Math.floor(clampNonNegative(state.overdrive.streak, defaults.overdrive.streak, "overdrive.streak"));
  state.milestoneStreak = Math.floor(clampNonNegative(state.milestoneStreak, defaults.milestoneStreak, "milestoneStreak"));
  state.riskEventNextAt = clampNonNegative(state.riskEventNextAt, defaults.riskEventNextAt, "riskEventNextAt");
  state.advancedTech = { ...defaults.advancedTech, ...(state.advancedTech || {}) };
  state.advancedTech.points = Math.floor(clampNonNegative(state.advancedTech.points, defaults.advancedTech.points, "advancedTech.points"));
  state.advancedTech.unlocked = !!state.advancedTech.unlocked;
  state.challengeHistory = { ...defaults.challengeHistory, ...(state.challengeHistory || {}) };
  state.challengeHistory.completed = Math.floor(clampNonNegative(state.challengeHistory.completed, defaults.challengeHistory.completed, "challengeHistory.completed"));
  state.activeChallenge = typeof state.activeChallenge === "string" ? state.activeChallenge : null;
  state.savedAt = clampNonNegative(state.savedAt, Date.now(), "savedAt");
  state.lastTick = clampNonNegative(state.lastTick, Date.now(), "lastTick");
  state.settings = { ...defaults.settings, ...(state.settings || {}) };
  state.settings.showFloatingNumbers = !!state.settings.showFloatingNumbers;
  state.settings.autoBoost = !!state.settings.autoBoost;
  state.settings.compactUi = !!state.settings.compactUi;
  state.settings.animations = !!state.settings.animations;
  state.settings.reducedMotion = !!state.settings.reducedMotion;
  state.settings.soundEnabled = !!state.settings.soundEnabled;
  state.settings.lowPerf = !!state.settings.lowPerf;
  state.settings.fpsFriendly = !!state.settings.fpsFriendly;
  state.settings.confirmMajorActions = !!state.settings.confirmMajorActions;
  state.settings.haptics = !!state.settings.haptics;
  state.settings.soundVolume = Math.round(Math.max(0, Math.min(100, finiteOrDefault(state.settings.soundVolume, defaults.settings.soundVolume, "settings.soundVolume"))));
  if (!["low", "medium", "high"].includes(state.settings.glowIntensity)) state.settings.glowIntensity = defaults.settings.glowIntensity;
  if (!["short", "detailed"].includes(state.settings.numberFormat)) state.settings.numberFormat = defaults.settings.numberFormat;
  if (!state.offlineReport || typeof state.offlineReport !== "object") {
    state.offlineReport = null;
  } else {
    state.offlineReport.awaySec = clampNonNegative(state.offlineReport.awaySec, 0, "offlineReport.awaySec");
    state.offlineReport.cappedSec = clampNonNegative(state.offlineReport.cappedSec, 0, "offlineReport.cappedSec");
    state.offlineReport.cash = clampNonNegative(state.offlineReport.cash, 0, "offlineReport.cash");
    state.offlineReport.rep = clampNonNegative(state.offlineReport.rep, 0, "offlineReport.rep");
    state.offlineReport.parts = Math.floor(clampNonNegative(state.offlineReport.parts, 0, "offlineReport.parts"));
    state.offlineReport.research = Math.floor(clampNonNegative(state.offlineReport.research, 0, "offlineReport.research"));
    state.offlineReport.boost = Math.max(0, finiteOrDefault(state.offlineReport.boost, 1, "offlineReport.boost"));
  }
  report.repaired = report.count > 0;
  activeRepairCollector = null;
  return report;
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
  document.querySelectorAll("[data-bulk]").forEach((btn) => {
    btn.addEventListener("click", () => {
      lineBuyMode = btn.dataset.bulk;
      document.querySelectorAll("[data-bulk]").forEach((b) => b.classList.toggle("active", b === btn));
      renderFactory();
    });
  });
  document.querySelectorAll("[data-strategy]").forEach((btn) => {
    btn.addEventListener("click", () => setProductionStrategy(btn.dataset.strategy));
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

function setProductionStrategy(mode) {
  if (!["mass", "balanced", "quality", "lean"].includes(mode)) return;
  if (!isStrategyUnlocked()) {
    toast("Production modes unlock after your first completed contract.");
    return;
  }
  if (state.productionStrategy === mode) return;
  state.productionStrategy = mode;
  document.querySelectorAll("[data-strategy]").forEach((btn) => btn.classList.toggle("active", btn.dataset.strategy === mode));
  recalculateProgressionEffects();
  const label = mode === "mass" ? "Mass Production" : mode === "quality" ? "Premium Quality" : mode === "lean" ? "Lean Efficiency" : "Balanced";
  toast(`Strategy set: ${label}`);
  renderAll();
}

function isStrategyUnlocked() {
  return state.completedContracts >= 1;
}

function strategyMultipliers() {
  if (state.productionStrategy === "mass") return { prod: 1.08, rep: 0.9, contract: 0.96, frag: 0.94, costMul: 1, partsMul: 1, overdriveCharge: 1.08, rushPowerMul: 1, bottleneckTolerance: 1 };
  if (state.productionStrategy === "quality") return { prod: 0.94, rep: 1.12, contract: 1.06, frag: 1.08, costMul: 1, partsMul: 1, overdriveCharge: 0.96, rushPowerMul: 1, bottleneckTolerance: 0.9 };
  if (state.productionStrategy === "lean") return { prod: 0.97, rep: 1, contract: 0.97, frag: 1, costMul: 0.94, partsMul: 1.1, overdriveCharge: 0.88, rushPowerMul: 0.9, bottleneckTolerance: 1.04 };
  return { prod: 1, rep: 1, contract: 1, frag: 1, costMul: 1, partsMul: 1, overdriveCharge: 1, rushPowerMul: 1, bottleneckTolerance: 1 };
}

function bottleneckAnalysis() {
  const chain = ["cutter", "furnace", "assembler", "qc", "pack"];
  const outputs = chain.map((id) => {
    const line = lineDefs.find((l) => l.id === id);
    const lv = state.lines[id].level;
    const val = lv > 0 ? line.baseRate * lv * (1 + Math.sqrt(lv) * 0.03) : 0;
    return { id, name: line.name, val };
  });
  const active = outputs.filter((o) => o.val > 0);
  if (!active.length) return { text: "Bottleneck: establish first line", severity: 0 };
  const max = Math.max(...active.map((o) => o.val));
  const min = active.sort((a, b) => a.val - b.val)[0];
  const pct = max <= 0 ? 0 : Math.round((1 - min.val / max) * 100);
  return { text: `Bottleneck: ${min.name} limiting output by ${pct}%`, severity: pct, lineId: min.id };
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
      state.nextSkillWindowMilestone += 2200 + state.skillLevel * 280;
    }

    const cashPerW = Math.max(0, safeNumber(cashPerWindow(), "gameTick:cashPerWindow"));
    const cashGain = Math.max(0, safeNumber(made * cashPerW, "gameTick:cashGain", { made, cashPerW }));
    state.resources.cash = Math.max(0, safeNumber(state.resources.cash + cashGain, "gameTick:cashTotal"));
    state.totalEarned = Math.max(0, safeNumber(state.totalEarned + cashGain, "gameTick:totalEarned"));

    if (Math.random() < (0.03 + safeNumber(state.modifiers.partsChance, "gameTick:partsChance")) * strategyMultipliers().partsMul * dt) {
      state.resources.parts = Math.max(0, safeNumber(state.resources.parts + 1, "gameTick:parts"));
      if (Math.random() < 0.12) toast("Industrial part recovered.");
    }

    const qualityBpRep = state.productionStrategy === "quality" && state.blueprints.includes("bp_glass") ? 1.06 : 1;
    state.resources.reputation = Math.max(0, safeNumber(state.resources.reputation + made * 0.0009 * (1 + safeNumber(state.modifiers.reputationGain, "gameTick:repGain")) * strategyMultipliers().rep * qualityBpRep, "gameTick:reputation"));

    tickContract(dt, made);
    tickModifier(now);
    tickRunEvent(now);
    tickRiskEvent(now);
    tickRunGoal();
    const earlyChargeBoost = state.totalEarned < 5000 ? 1.45 : 1;
    state.overdrive.charge = Math.min(100, state.overdrive.charge + made * 0.012 * strategyMultipliers().overdriveCharge * earlyChargeBoost);
    if (state.overdrive.charge >= 100 && !overdriveReadyNotified) {
      toast("Overdrive ready.");
      overdriveReadyNotified = true;
    }
    if (state.overdrive.charge < 100) overdriveReadyNotified = false;

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
      if (state.blueprints.includes("bp_assembly") && Math.random() < 0.08 * dt) state.resources.parts += 1;
    } else {
      el.rushBtn.disabled = false;
      el.rushBtn.classList.add("ready");
      el.rushBtn.classList.add("ready-pulse");
      el.rushBtn.textContent = `Boost Production (${Math.floor(state.overdrive.charge)}%)`;
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
  const refreshInterval = state.settings.lowPerf ? 0.65 : (state.settings.reducedMotion ? 0.5 : 0.4);
  if (uiRefreshTimer < refreshInterval) return;
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
      let localBoost = 1 + Math.sqrt(lv) * 0.03;
      if (line.id === "furnace" && state.lines.cutter.level >= 10) localBoost *= 1.05;
      if (line.id === "assembler" && state.lines.furnace.level >= 25) localBoost *= 1.06;
      if (line.id === "qc" && state.lines.assembler.level >= 25) localBoost *= 1.08;
      if (line.id === "pack" && state.lines.qc.level >= 10) localBoost *= 1.05;
      const spec = state.machineSpecs?.[line.id] || {};
      if ((line.id === "cutter" && spec.t10 === "fast_frames") || (line.id === "furnace" && spec.t10 === "more_glass")
        || (line.id === "assembler" && spec.t10 === "fast_assembly") || (line.id === "qc" && spec.t10 === "fast_qc")
        || (line.id === "pack" && spec.t10 === "fast_pack")) localBoost *= 1.06;
      if ((line.id === "furnace" && state.machineSpecs?.cutter?.t25 === "precision_feed")
        || (line.id === "assembler" && state.machineSpecs?.furnace?.t25 === "thermal_sync")
        || (line.id === "qc" && state.machineSpecs?.assembler?.t25 === "smart_routing")
        || (line.id === "pack" && state.machineSpecs?.qc?.t25 === "package_sync")) localBoost *= 1.05;
      const milestoneMul = getLineMilestoneMultiplier(lv);
      wps += safeNumber(line.baseRate * lv * localBoost * milestoneMul, `calcWindowsPerSec:${line.id}`);
    }
  });

  const divBoost = 1 + divisionDefs.filter((d) => state.divisions[d.id]).reduce((a, d) => a + d.bonus, 0);
  const skillBoost = 1 + state.modifiers.prod;
  const tokenBoost = 1 + state.resources.tokens * 0.018;
  const rushBoost = Date.now() < state.rush.activeUntil ? 1.55 + state.modifiers.rushPower * strategyMultipliers().rushPowerMul : 1;
  const startupBoost = 1 + state.metaUpgrades.startupMomentum * (state.totalEarned < 20000 ? 0.018 : 0.01);
  const calibrationBoost = 1 + state.metaUpgrades.lineCalibration * 0.015;
  const activePenalty = 1 - Math.min(0.4, state.modifiers.activeProductionPenalty);

  let modifierMul = 1;
  if (state.activeModifier && state.activeModifier.prodMul) modifierMul *= state.activeModifier.prodMul;
  if (state.activeRunEvent?.prodMul) modifierMul *= state.activeRunEvent.prodMul;

  if (state.flags.continuousCasting) wps *= 1.12;
  if (state.flags.zeroDefect) wps *= 0.95;
  const synergyBoost = 1 + calcLineSynergyBonus();
  const specialization = getMetaSpecialization();
  const specializationBoost = specialization === "Production" ? 1.09 : 1;
  const tempProdBoost = 1 + getActiveBoostValue("prod");
  const total = wps * divBoost * skillBoost * tokenBoost * rushBoost * modifierMul * startupBoost * calibrationBoost * activePenalty * synergyBoost * specializationBoost * tempProdBoost * strategyMultipliers().prod;
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
  discount *= strategyMultipliers().costMul;
  if (state.activeRunEvent?.costMul) discount *= state.activeRunEvent.costMul;
  discount *= 1 - Math.min(0.2, state.metaUpgrades.costEngineering * 0.01);
  if (state.flags.bpFirstUpgradeDiscount && state.runState.firstUpgradeDiscountPending) discount *= 0.82;
  if (state.flags.unionMomentum) discount *= 1.04;
  return Math.ceil(line.baseCost * Math.pow(1.47, lv) * discount);
}

function lineUpgradeCostAtLevel(line, level) {
  let discount = 1 - Math.min(0.18, state.modifiers.costDiscount);
  discount *= strategyMultipliers().costMul;
  if (state.activeRunEvent?.costMul) discount *= state.activeRunEvent.costMul;
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
      if (step >= 25) state.resources.parts += 2 + lineMilestones.indexOf(step);
    }
  }
  maybeOfferMachineSpecialization(lineId, startLv, state.lines[lineId].level);
  flashMachine(lineId);
  toast(`${def.name} upgraded +${plan.qty} to Lv ${state.lines[lineId].level}`);
  validateGameState("buyLine");
  renderAll();
}

function maybeOfferMachineSpecialization(lineId, fromLv, toLv) {
  if (!state.machineSpecs?.[lineId]) return;
  if (fromLv < 10 && toLv >= 10 && !state.machineSpecs[lineId].t10) {
    openMachineSpecPicker(lineId, "t10");
    return;
  }
  if (fromLv < 25 && toLv >= 25 && !state.machineSpecs[lineId].t25) {
    openMachineSpecPicker(lineId, "t25");
  }
}

function openMachineSpecPicker(lineId, tierKey) {
  const line = lineDefs.find((l) => l.id === lineId);
  const options = machineSpecDefs[lineId]?.[tierKey] || [];
  if (!line || !options.length) return;
  openModal(`
    <h3>${line.name} Specialization</h3>
    <p>Choose one specialization for ${tierKey === "t10" ? "Level 10" : "Level 25"}.</p>
    <div class="list">${options.map((opt) => `<div class="row"><div class="row-head"><strong>${opt.label}</strong><span></span></div><div class="row-meta"><span>${opt.desc}</span><button class="action-btn slim" data-spec-pick="${lineId}|${tierKey}|${opt.id}">Choose</button></div></div>`).join("")}</div>
  `);
  document.querySelectorAll("[data-spec-pick]").forEach((btn) => btn.addEventListener("click", () => {
    const [lineIdPicked, tierPicked, specId] = btn.dataset.specPick.split("|");
    state.machineSpecs[lineIdPicked][tierPicked] = specId;
    recalculateProgressionEffects();
    closeModal();
    toast(`${lineDefs.find((l) => l.id === lineIdPicked)?.name} specialization selected.`);
    renderAll();
  }));
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
  if ((state.overdrive?.charge || 0) < 100) {
    toast("Overdrive not ready yet.");
    return;
  }
  if (now < state.rush.cooldownUntil) return;
  const duration = 5000 + state.modifiers.rushDuration * 1000;
  const cdPenalty = state.activeModifier?.rushCdAdd ? state.activeModifier.rushCdAdd * 1000 : 0;
  state.rush.activeUntil = now + duration;
  const darkShiftPenalty = state.flags.darkShift ? 3000 : 0;
  state.rush.cooldownUntil = now + 32000 + cdPenalty + darkShiftPenalty;
  state.runState.rushOrdersUsed += 1;
  state.overdrive.charge = 0;
  overdriveReadyNotified = false;
  state.overdrive.streak = (state.overdrive.streak || 0) + 1;
  if (state.overdrive.streak % 4 === 0) {
    state.resources.parts += 1;
    toast("Overdrive streak bonus: +1 part.");
  }
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

function getNextChainStepOffer() {
  if (!state.activeChain) return null;
  const seq = chainSequences.find((s) => s.id === state.activeChain.id);
  if (!seq) return null;
  const idx = state.activeChain.step || 0;
  if (idx >= seq.steps.length) return null;
  const base = contractTemplates[Math.min(contractTemplates.length - 1, 1 + idx)];
  const scale = 1 + idx * 0.16;
  return {
    id: `chain_${seq.id}_${idx}_${Date.now()}`,
    templateId: base.id,
    name: seq.steps[idx],
    type: idx === seq.steps.length - 1 ? "Premium" : "Standard",
    duration: Math.ceil(base.baseDuration * (0.9 + idx * 0.1)),
    windows: Math.ceil(base.baseWindows * scale),
    minRep: Math.max(0, Math.ceil(base.minRep * (0.8 + idx * 0.12))),
    failRep: Math.max(1, Math.ceil((base.failRep || 2) * (0.9 + idx * 0.1))),
    rewards: {
      cash: Math.ceil((base.rewards.cash || 0) * (1.1 + idx * 0.16)),
      rep: Math.ceil((base.rewards.rep || 0) + idx),
      research: Math.ceil((base.rewards.research || 0) * (1 + idx * 0.18)),
      parts: Math.ceil((base.rewards.parts || 0) * (1 + idx * 0.16))
    },
    fragmentReward: (base.fragments || 0) + (idx > 0 ? 1 : 0),
    specialType: "Chain",
    tierRequired: Math.max(1, state.contractTier - 1),
    limited: true,
    expiresAt: Date.now() + 55000,
    rarityTier: idx === seq.steps.length - 1 ? "A" : "B",
    special: base.special || null,
    modifiers: [`Chain Step ${idx + 1}/${seq.steps.length}`],
    requiredLine: idx > 1 ? { id: "assembler", level: 10 } : null,
    riskPenaltyChance: 0.08 + idx * 0.05,
    chainMeta: { id: seq.id, step: idx, total: seq.steps.length }
  };
}

function generateContractOffer() {
  const alreadyOfferedChain = state.contractBoard?.some((c) => c.chainMeta && state.activeChain && c.chainMeta.id === state.activeChain.id && c.chainMeta.step === state.activeChain.step);
  const chained = alreadyOfferedChain ? null : getNextChainStepOffer();
  if (chained) return chained;
  const template = contractTemplates[Math.floor(Math.random() * contractTemplates.length)];
  const typeNames = Object.keys(contractTypes);
  let type = typeNames[Math.floor(Math.random() * typeNames.length)];
  if (state.productionStrategy === "mass" && Math.random() < 0.35) type = "Bulk";
  if (state.productionStrategy === "quality" && Math.random() < 0.28) type = "Premium";
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
  const rewardFocusRoll = Math.random();
  let rewardFocus = "Cash";
  if (rewardFocusRoll < 0.2) {
    rewardFocus = "Fragments";
  } else if (rewardFocusRoll < 0.38) {
    rewardFocus = "Research";
  } else if (rewardFocusRoll < 0.52) {
    rewardFocus = "Reputation";
  }
  if (rewardFocus === "Fragments") {
    rewards.cash = Math.ceil(rewards.cash * 0.9);
  } else if (rewardFocus === "Research") {
    rewards.research = Math.max(1, Math.ceil((rewards.research || 0) * 1.35 + 1));
  } else if (rewardFocus === "Reputation") {
    rewards.rep = Math.max(1, Math.ceil((rewards.rep || 0) * 1.45));
    rewards.cash = Math.ceil(rewards.cash * 0.92);
  }
  const fragments = Math.max(0, Math.round((template.fragments || 0) * modPack.fragmentMul) + modPack.flatFragments + (specialCfg?.fragmentBonus || 0));
  const tierRequired = specialType === "Boss" ? Math.max(2, state.contractTier) : Math.max(1, state.contractTier - 1);
  const limited = Math.random() < 0.16 + Math.min(0.12, state.contractTier * 0.015);
  const expiresAt = limited ? Date.now() + (35000 + Math.random() * 35000) : 0;
  const reqWps = state.completedContracts >= 2 && (type === "Bulk" || Math.random() < 0.22) ? Math.max(1, Math.round(calcWindowsPerSec() * (type === "Bulk" ? 1.28 : (1.08 + Math.random() * 0.35)))) : null;
  const reqStrategy = state.completedContracts >= 3 ? (type === "Premium" ? "quality" : type === "Bulk" ? "mass" : (Math.random() < 0.16 ? (Math.random() < 0.5 ? "quality" : "mass") : null)) : null;
  const reqBlueprint = Math.random() < 0.14 && state.contractTier >= 3 && state.completedContracts >= 5
    ? blueprintDefs[Math.floor(Math.random() * blueprintDefs.length)]?.id
    : null;
  const bottleneckReq = state.contractTier >= 2 && state.completedContracts >= 4 && (type === "Premium" || Math.random() < 0.1) ? Math.floor(28 + Math.random() * 18) : null;
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
    modifiers: [`Focus: ${rewardFocus}`, ...mods.map((m) => m.text)],
    requiredLine: modPack.requiredLine,
    requiredWps: reqWps,
    requiredStrategy: reqStrategy,
    requiredBlueprint: reqBlueprint,
    requiredBottleneck: bottleneckReq,
    riskPenaltyChance: typeCfg.riskPenaltyChance + (specialType === "Boss" ? 0.04 : 0),
    chainMeta: null
  };
}

function getContractStreakBonus() {
  return Math.min(0.12, state.contractStreak * 0.02);
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
  if (c.requiredWps && calcWindowsPerSec() < c.requiredWps) return;
  if (c.requiredStrategy && state.productionStrategy !== c.requiredStrategy) return;
  if (c.requiredBlueprint && !state.blueprints.includes(c.requiredBlueprint)) return;
  if (c.requiredBottleneck && bottleneckAnalysis().severity > c.requiredBottleneck * strategyMultipliers().bottleneckTolerance) return;
  state.contract = {
    ...c,
    targetWindows: c.windows,
    rewardPack: c.rewards,
    fragmentReward: c.fragmentReward || 0,
    remaining: Math.ceil(c.duration * state.modifiers.contractDurationMul * (state.activeRunEvent?.contractSpeedMul ? (1 / state.activeRunEvent.contractSpeedMul) : 1)),
    progress: 0,
    status: "active",
    rewardGranted: false
  };
  if (state.blueprints.includes("bp_thermal") && state.runState.firstContractSpeedPending) {
    state.contract.remaining = Math.ceil(state.contract.remaining * 0.82);
    state.runState.firstContractSpeedPending = false;
    showRewardPopup("Blueprint: first contract starts 18% faster");
  }
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
  state.contractStreak = 0;
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
  mult *= 1 + getContractStreakBonus();
  mult *= strategyMultipliers().contract;
  if (state.activeRunEvent?.contractRewardMul) mult *= state.activeRunEvent.contractRewardMul;
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
  let fragGain = Math.max(0, Math.round((c.fragmentReward || 0) * (1 + intelligenceBonus + refinementBonus) * fragmentMul * strategyMultipliers().frag));
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
  if (c.type === "Premium") {
    state.premiumContractsCompleted += 1;
    if (state.blueprints.includes("bp_finish") && state.premiumContractsCompleted % 5 === 0) {
      state.blueprintFragments += 2;
      showRewardPopup("Blueprint cycle: +2 fragments (every 5th premium)");
    }
  }
  state.contractStreak += 1;
  state.bestContractStreak = Math.max(state.bestContractStreak, state.contractStreak);
  if (c.specialType === "Chain") {
    const seq = c.chainMeta?.id || state.activeChain?.id || chainSequences[Math.floor(Math.random() * chainSequences.length)].id;
    const nextStep = (c.chainMeta?.step ?? state.activeChain?.step ?? 0) + 1;
    const total = c.chainMeta?.total || 3;
    state.activeChain = nextStep < total ? { id: seq, step: nextStep } : null;
  } else if (!state.activeChain && Math.random() < 0.16 && state.contractTier >= 2) {
    const seq = chainSequences[Math.floor(Math.random() * chainSequences.length)];
    state.activeChain = { id: seq.id, step: 0 };
  }
  gainContractXp(c);
  maybeAwardChest(c);
  showRewardPopup(`Claimed +$${fmt((c.rewardPack.cash || 0) * mult)} • +${fragGain} fragments`);
  const streakTxt = state.contractStreak > 1 ? ` • streak ${state.contractStreak}` : "";
  toast(`Reward claimed: ${c.name}${fragGain ? ` (+${fragGain} fragments)` : ""}${streakTxt}`);
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
  applyMachineSpecializationEffects();
}

function applyLineMilestoneBonuses() {
  const frameLv = state.lines.cutter.level;
  const forgeLv = state.lines.furnace.level;
  const assemblyLv = state.lines.assembler.level;
  const qcLv = state.lines.qc.level;

  if (frameLv >= 10) state.modifiers.lineSynergy += 0.05;
  if (forgeLv >= 25) state.modifiers.rareFragmentChance += 0.03;
  if (assemblyLv >= 25) state.modifiers.contractDurationMul -= 0.06;
  if (qcLv >= 10) state.modifiers.contractReward += 0.05;
  if (qcLv >= 25) state.modifiers.contractFailurePenaltyMul -= 0.08;
  if (frameLv >= 10) state.modifiers.prod += 0.02;
  if (state.lines.pack.level >= 50) state.modifiers.contractReward += 0.05;

  const unlocked = new Set(state.blueprints);
  const setCounts = {
    glass: ["bp_glass", "bp_thermal", "bp_finish"].filter((id) => unlocked.has(id)).length,
    contract: ["bp_glass", "bp_assembly", "bp_finish"].filter((id) => unlocked.has(id)).length,
    automation: ["bp_frame", "bp_thermal", "bp_assembly"].filter((id) => unlocked.has(id)).length
  };
  if (setCounts.glass >= 3) state.modifiers.prod += 0.05;
  if (setCounts.contract >= 3) state.modifiers.contractReward += 0.1;
  if (setCounts.automation >= 3) state.modifiers.offlineEfficiency += 0.1;

  if (state.runFocus === "prod") state.modifiers.prod += 0.1;
  if (state.runFocus === "contract") state.modifiers.contractReward += 0.1;
  if (state.runFocus === "blueprint") state.modifiers.rareFragmentChance += 0.1;
  if (state.runFocus === "offline") state.modifiers.offlineEfficiency += 0.15;
  const spend = {};
  state.skills.forEach((id) => {
    const node = skillDefs.find((s) => s.id === id);
    if (!node) return;
    spend[node.branch] = (spend[node.branch] || 0) + (node.cost || 0);
  });
  const ranking = Object.entries(spend).sort((a, b) => b[1] - a[1]);
  if (ranking.length) {
    const [branch, topPoints] = ranking[0];
    const secondPoints = ranking[1]?.[1] || 0;
    if (topPoints >= 8 && topPoints >= secondPoints * 1.4) {
      if (branch === "Production") state.modifiers.prod += 0.06;
      if (branch === "Contracts") state.modifiers.contractReward += 0.06;
      if (branch === "Automation") state.modifiers.offlineEfficiency += 0.08;
      if (branch === "Economy") state.modifiers.cashBonus += 0.06;
      if (branch === "Quality") {
        state.modifiers.reputationGain += 0.06;
        state.modifiers.contractFailurePenaltyMul -= 0.06;
      }
      if (branch === "Workforce") state.modifiers.rushPower += 0.08;
    }
  }
  if (lineDefs.every((l) => state.lines[l.id].level >= 50)) {
    state.modifiers.prod += 0.15;
    state.modifiers.contractReward += 0.08;
  }
}

function applyMachineSpecializationEffects() {
  const specs = Object.values(state.machineSpecs || {}).flatMap((x) => [x?.t10, x?.t25]).filter(Boolean);
  specs.forEach((id) => {
    if (id === "premium_frames" || id === "quality_glass" || id === "client_trust") state.modifiers.contractReward += 0.04;
    if (id === "cheap_frames" || id === "energy_saver") state.modifiers.costDiscount += 0.04;
    if (id === "fragment_fumes" || id === "reward_scan" || id === "frag_seal") state.modifiers.rareFragmentChance += 0.04;
    if (id === "offline_assembly") state.modifiers.offlineEfficiency += 0.08;
    if (id === "contract_eff") state.modifiers.contractDurationMul -= 0.05;
    if (id === "rush_link") state.modifiers.rushPower += 0.08;
    if (id === "fail_guard" || id === "safe_pack") state.modifiers.contractFailurePenaltyMul -= 0.08;
    if (id === "reputation_boost" || id === "stable_frames" || id === "quality_fit") state.modifiers.reputationGain += 0.06;
    if (id === "vip_pack" || id === "premium_burn") state.modifiers.vipContractReward += 0.06;
    if (id === "parts_recovery") state.modifiers.partsChance += 0.06;
    if (id === "throughput_feed") state.modifiers.prod += 0.04;
    if (id === "export_pack") state.modifiers.cashBonus += 0.06;
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
  return 100000 * Math.pow(1.72, state.modernizationCount);
}

function calcRunEfficiency(stats = state) {
  const seconds = Math.max(1, stats.playtime);
  const windowsPerSec = stats.windowsMade / seconds;
  return Math.max(0.65, Math.min(1.75, windowsPerSec / 3.4));
}

function calcModernizationReward(stats = state) {
  const revenueFactor = Math.pow(Math.max(0, stats.totalEarned) / 240000, 0.7) * 4.1;
  const contractFactor = Math.pow(Math.max(0, stats.completedContracts), 0.82) * 0.9;
  const blueprintFactor = Math.pow(Math.max(0, stats.blueprints.length), 1.22) * 2.35;
  const efficiencyFactor = Math.max(0, (calcRunEfficiency(stats) - 0.85) * 3.8);
  const rawScore = revenueFactor + contractFactor + blueprintFactor + efficiencyFactor;
  const playMin = Math.max(0, stats.playtime / 60);
  const shortRunPenalty = playMin < 8 ? 0.28 + (playMin / 8) * 0.72 : 1;
  const longevityBonus = 1 + Math.min(0.34, Math.log1p(playMin) / 12);
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
  autoSave();
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
    <button class="action-btn" id="closeModernizeSummary">Choose Run Focus</button>
  `);
  document.getElementById("closeModernizeSummary")?.addEventListener("click", openRunFocusPicker);
}

function openRunFocusPicker() {
  activeModal = "runFocus";
  openModal(`
    <h3>Run Focus</h3>
    <p>Select one temporary focus for this run.</p>
    <div class="list">
      ${runFocusOptions.map((f) => `<div class="row"><div class="row-head"><strong>${f.label}</strong><span>${state.runFocus === f.id ? "Active" : ""}</span></div><div class="row-meta"><span>${f.desc}</span><button class="action-btn slim" data-run-focus="${f.id}">Choose</button></div></div>`).join("")}
    </div>
  `);
  document.querySelectorAll("[data-run-focus]").forEach((btn) => btn.addEventListener("click", () => {
    state.runFocus = btn.dataset.runFocus;
    recalculateProgressionEffects();
    openRunGoalPicker();
  }));
}

function openRunGoalPicker() {
  const goals = [...runGoalOptions].sort(() => Math.random() - 0.5).slice(0, 5);
  openModal(`
    <h3>Run Goal</h3>
    <p>Pick one optional run goal for a bonus chest + tokens.</p>
    <div class="list">${goals.map((g) => `<div class="row"><div class="row-head"><strong>${g.label}</strong><span>${g.desc}</span></div><div class="row-meta"><span></span><button class="action-btn slim" data-run-goal="${g.id}|${g.target}">Select</button></div></div>`).join("")}</div>
  `);
  document.querySelectorAll("[data-run-goal]").forEach((btn) => btn.addEventListener("click", () => {
    const [id, targetStr] = btn.dataset.runGoal.split("|");
    state.runGoal = {
      id,
      target: Number(targetStr),
      startContracts: state.completedContracts,
      startChainDepth: state.contractChainDepth,
      startFragments: state.blueprintFragments,
      completed: false
    };
    closeModal();
    toast(`Run focus set: ${runFocusOptions.find((f) => f.id === state.runFocus)?.label}. Goal selected.`);
    renderAll();
  }));
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
        <div class="row-meta"><span>Current: ${currentEffect}</span><span>${maxed ? "MAXED" : `Next: ${nextEffect}`}</span></div>
        <div class="mod-progress"><span style="width:${progressPct}%"></span></div>
        <div class="row-meta"><span>${maxed ? "No further cost" : `Cost ${cost} TK`}</span><span>${maxed ? "Completed" : (affordable ? "Affordable now" : `Need ${missing} more`)}</span></div>
        <button class="action-btn slim" data-meta-detail="${u.key}">Details</button>
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
  document.querySelectorAll("[data-meta-detail]").forEach((btn) => {
    btn.addEventListener("click", () => openMetaUpgradeDetail(btn.dataset.metaDetail));
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
    validateGameState("hardReset");
    autoSave();
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

function tickRunEvent(now) {
  if (state.activeRunEvent && now >= state.activeRunEvent.until) {
    toast(`${state.activeRunEvent.text} ended.`);
    state.activeRunEvent = null;
  }
  if (state.activeRunEvent) return;
  if (!state.runEventNextAt) state.runEventNextAt = now + 150000;
  if (now < state.runEventNextAt) return;
  if (Math.random() < 0.35) {
    const e = softEventPool[Math.floor(Math.random() * softEventPool.length)];
    state.activeRunEvent = { ...e, until: now + e.duration * 1000 };
    toast(`Run event: ${e.text}`);
  }
  state.runEventNextAt = now + (150000 + Math.random() * 150000);
}

function tickRiskEvent(now) {
  if (!state.riskEventNextAt) state.riskEventNextAt = now + 480000;
  if (activeModal || state.contract || now < state.riskEventNextAt) return;
  if (Math.random() > 0.2) {
    state.riskEventNextAt = now + 360000 + Math.random() * 240000;
    return;
  }
  state.riskEventNextAt = now + 360000 + Math.random() * 240000;
  const event = Math.random() < 0.5
    ? {
      title: "Cheap Supplier",
      text: "Take -12% upgrade costs for 2m, but -8% reputation gain.",
      accept: () => { state.activeRunEvent = { id: "supplier", text: "Cheap Supplier", until: now + 120000, costMul: 0.88 }; state.resources.reputation = Math.max(0, state.resources.reputation - 2); }
    }
    : {
      title: "Energy Surge",
      text: "Take +12% production for 90s, but rush cooldown +8s.",
      accept: () => { state.activeRunEvent = { id: "energy", text: "Energy Surge", until: now + 90000, prodMul: 1.12 }; state.rush.cooldownUntil += 8000; }
    };
  openModal(`
    <h3>${event.title}</h3>
    <p>${event.text}</p>
    <button class="action-btn" id="acceptRiskEvent">Accept</button>
    <button class="action-btn" id="declineRiskEvent">Skip</button>
  `);
  document.getElementById("acceptRiskEvent")?.addEventListener("click", () => {
    event.accept();
    closeModal();
    toast(`${event.title} activated.`);
  });
  document.getElementById("declineRiskEvent")?.addEventListener("click", closeModal);
}

function runGoalProgress(goal) {
  if (!goal || typeof goal !== "object") return 0;
  if (goal.id === "contract") return state.completedContracts - (goal.startContracts || 0);
  if (goal.id === "production") return calcWindowsPerSec();
  if (goal.id === "blueprint") return state.blueprintFragments - (goal.startFragments || 0);
  if (goal.id === "speed") return calcModernizationReward();
  if (goal.id === "chain") return state.contractChainDepth - (goal.startChainDepth || 0);
  if (goal.id === "quality") return state.resources.reputation;
  if (goal.id === "parts") return state.resources.parts;
  return 0;
}

function tickRunGoal() {
  const g = state.runGoal;
  if (!g || g.completed) return;
  const progress = runGoalProgress(g);
  if (progress >= g.target) {
    g.completed = true;
    state.resources.tokens += 1;
    if (Math.random() < 0.5) state.chests.common = (state.chests.common || 0) + 1;
    showRewardPopup("Run goal complete: +1 token");
    toast("Run goal completed.");
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
    let hint = goalReady ? "Goal ready" : (eta < 90 ? "Close to next upgrade" : "Build income");
    if (state.runGoal && !state.runGoal.completed) {
      const g = state.runGoal;
      const progress = runGoalProgress(g);
      hint = `Run goal: ${fmt(Math.max(0, progress))}/${fmt(g.target)}`;
    }
    el.missionHint.textContent = hint;
  }
  const bottleneck = bottleneckAnalysis();
  if (el.bottleneckChip) el.bottleneckChip.textContent = bottleneck.text;
  if (goalReady && !goalReadyLastTick) {
    toast("Goal ready: next upgrade is affordable.");
  }
  goalReadyLastTick = goalReady;

  const bannerBits = [];
  if (state.activeModifier) {
    const sec = Math.max(0, Math.ceil((state.modifierUntil - Date.now()) / 1000));
    bannerBits.push(`${state.activeModifier.text} (${sec}s)`);
  }
  if (state.activeRunEvent?.until) {
    const sec = Math.max(0, Math.ceil((state.activeRunEvent.until - Date.now()) / 1000));
    bannerBits.push(`${state.activeRunEvent.text} (${sec}s)`);
  }
  if (el.modifierBanner) {
    el.modifierBanner.style.display = bannerBits.length ? "block" : "none";
    el.modifierBanner.textContent = bannerBits.join(" • ");
  }

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
  const nextBp = blueprintDefs.find((bp) => !state.blueprints.includes(bp.id));
  const blueprintsReady = nextBp && state.blueprintFragments >= nextBp.fragmentCost ? 1 : 0;
  const map = { home: rewardsReady, skills: skillsReady, blueprints: blueprintsReady, contracts: contractReady };
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

function getMilestoneGoal() {
  if (state.windowsMade < 1000) return "Mid: 1K windows";
  if (state.completedContracts < 10) return `Mid: ${10 - state.completedContracts} contracts to milestone`;
  if (state.contractTier < 3) return `Contracts: reach tier ${3}`;
  if (state.modernizationCount < 3) return `Long: ${3 - state.modernizationCount} modernizations`;
  return `Long: collect all blueprints • ${getMetaSpecialization()} path`;
}

function renderFactory() {
  const strategyUnlocked = isStrategyUnlocked();
  document.querySelectorAll("[data-strategy]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.strategy === state.productionStrategy);
    btn.disabled = !strategyUnlocked && btn.dataset.strategy !== "balanced";
  });
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
    const nextMilestone = lineMilestones.find((m) => m > lv);
    const milestoneLabel = milestoneCount ? `${milestoneCount}/${lineMilestones.length} milestones` : "No milestone";
    const milestoneProgress = nextMilestone ? `Next milestone Lv ${nextMilestone}` : "All milestones reached";
    const modeLabel = lineBuyMode === "max" ? `Buy Max ${bulk.qty > 0 ? `(${bulk.qty})` : ""}` : `Buy x${lineBuyMode}`;
    return `<div class="row ${affordable ? "affordable" : ""} ${!unlocked ? "locked" : ""}"><div class="row-head"><strong>${line.icon} ${line.name}</strong><span>Lv ${lv}</span></div><div class="row-meta"><span>${active ? `${fmt(line.baseRate * lv * (1 + Math.sqrt(lv) * 0.03))} w/s raw` : "Locked"}</span><span>Cost $${fmt(cost)}</span></div><div class="row-meta"><span>${reqText || "Unlocked"}</span><span>${bulk.qty > 0 ? affordText : "Requires more income"}</span></div><div class="row-meta"><span>${milestoneLabel}</span><span>${milestoneProgress}</span></div><div class="row-meta"><span>Plant synergy +${synergyPct}%</span><button class="action-btn slim" data-line-detail="${line.id}">Details</button></div><button class="action-btn" data-line="${line.id}" ${(!unlocked || !affordable) ? "disabled" : ""}>${modeLabel}</button></div>`;
  }).join("");

  el.lineList.querySelectorAll("button[data-line]").forEach((btn) => btn.addEventListener("click", () => buyLine(btn.dataset.line, "mode")));
  el.lineList.querySelectorAll("button[data-line-detail]").forEach((btn) => btn.addEventListener("click", () => openLineDetail(btn.dataset.lineDetail)));
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
    const wpsLock = c.requiredWps && calcWindowsPerSec() < c.requiredWps;
    const strategyLock = c.requiredStrategy && c.requiredStrategy !== state.productionStrategy;
    const blueprintLock = c.requiredBlueprint && !state.blueprints.includes(c.requiredBlueprint);
    const bottleneckLock = c.requiredBottleneck && bottleneckAnalysis().severity > c.requiredBottleneck * strategyMultipliers().bottleneckTolerance;
    const reqItems = [];
    if (c.requiredLine) reqItems.push(`${lineDefs.find((l) => l.id === c.requiredLine.id)?.name || "Line"} Lv ${c.requiredLine.level}`);
    if (c.requiredWps) reqItems.push(`${fmt(c.requiredWps)} w/s`);
    if (c.requiredStrategy) reqItems.push(`${c.requiredStrategy === "quality" ? "Premium Quality" : "Mass Production"} mode`);
    if (c.requiredBlueprint) reqItems.push(`${blueprintDefs.find((bp) => bp.id === c.requiredBlueprint)?.name || c.requiredBlueprint}`);
    if (c.requiredBottleneck) reqItems.push(`Bottleneck < ${c.requiredBottleneck}%`);
    const statusText = tierLock ? `Tier ${c.tierRequired}` : (lock ? "Rep locked" : (lineLock || wpsLock || strategyLock || blueprintLock || bottleneckLock ? "Req locked" : "Ready"));
    const special = c.modifiers?.length ? c.modifiers[0] : "Standard terms";
    const typeClass = `type-${c.type.toLowerCase()}`;
    const specialBadge = c.specialType ? `<span>${c.specialType}</span>` : `<span>${c.type}</span>`;
    const limitedLeft = c.limited ? Math.max(0, Math.ceil((c.expiresAt - Date.now()) / 1000)) : null;
    const nearExpiry = c.limited && limitedLeft <= 15;
    return `<div class="row contract-card state-available ${typeClass} ${best?.id === c.id ? "best-option" : ""}">
      <div class="row-head"><strong>${c.name}</strong>${specialBadge}</div>
      <div class="row-meta"><span>Value Tier ${c.rarityTier || "C"}</span><span>${c.limited ? `<span class="${nearExpiry ? "ready-pulse" : ""}">Limited ${limitedLeft}s</span>` : "Standard window"}</span></div>
      <div class="row-meta"><span>${c.windows} windows • ${c.duration}s</span><span>Rep ${c.minRep.toFixed(0)}</span></div>
      <div class="row-meta"><span>$${fmt(c.rewards.cash)} • +${c.fragmentReward || 0} frags</span><span>${statusText}</span></div>
      <div class="row-meta"><span>${special}</span><span>Fail -${c.failRep} rep</span></div>
      ${reqItems.length ? `<div class="row-meta"><span>Needs: ${reqItems.join(" • ")}</span><span>${lineLock || wpsLock || strategyLock || blueprintLock || bottleneckLock ? "Missing reqs" : "All met"}</span></div>` : ""}
      <div class="row-meta"><span>Tier ${c.tierRequired || 1}</span><button class="action-btn slim" data-contract-detail="${c.id}">Details</button></div>
      ${(!lock && !tierLock && !lineLock && !wpsLock && !strategyLock && !blueprintLock && !bottleneckLock && !state.contract) ? `<button class="action-btn ${nearExpiry ? "ready-pulse" : ""}" data-contract="${c.id}">Start</button>` : ""}
    </div>`;
  }).join("");

  const refreshReady = Date.now() >= state.contractRefreshAt;
  if (el.contractRefreshBtn) el.contractRefreshBtn.disabled = !!state.contract || !refreshReady;
  if (el.contractRefreshStatus) {
    const sec = Math.max(0, Math.ceil((state.contractRefreshAt - Date.now()) / 1000));
    const needed = 5 + state.contractTier * 3;
    const streakBonusPct = Math.round(getContractStreakBonus() * 100);
    el.contractRefreshStatus.textContent = refreshReady
      ? `Tier ${state.contractTier} ready • XP ${state.contractXp}/${needed} • Streak ${state.contractStreak} (+${streakBonusPct}%).`
      : `Tier ${state.contractTier} • new offers in ${sec}s • XP ${state.contractXp}/${needed} • Streak ${state.contractStreak} (+${streakBonusPct}%)`;
  }

  el.contractList.querySelectorAll("button[data-contract]").forEach((btn) => btn.addEventListener("click", () => startContract(btn.dataset.contract)));
  el.contractList.querySelectorAll("button[data-contract-detail]").forEach((btn) => btn.addEventListener("click", () => openContractDetail(btn.dataset.contractDetail)));
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
  const header = `<div class="row"><div class="row-head"><strong>Skill Points</strong><span>${state.skillPoints}</span></div><div class="row-meta"><span>Level ${state.skillLevel}</span><span>${fmt(state.skillXp)} / ${xpNeed} XP</span></div><div class="row-meta"><span>Current Build</span><span>${getBuildIdentity()}</span></div><button class="action-btn" id="respecSkillsBtn">Respec Tree (2 TK + 1% run cash)</button></div>`;
  const body = grouped.map((b) => {
    const branchSkills = skillDefs.filter((s) => s.branch === b);
    const owned = branchSkills.filter((s) => state.skills.includes(s.id)).length;
    return `<div class="branch"><div class="row-head"><strong>${b}</strong><span>${owned}/${branchSkills.length}</span></div><div class="nodes">${branchSkills.map((s) => {
      const ownedNode = state.skills.includes(s.id);
      const canBuy = canUnlockSkill(s);
      const prereqLabel = s.prereq && !ownedNode ? `Req ${skillDefs.find((x) => x.id === s.prereq)?.name || "Node"}` : s.desc;
      return `<div class="node ${s.type || ""} ${ownedNode ? "owned" : ""} ${(!ownedNode && canBuy) ? "affordable" : ""} ${(!ownedNode && !canBuy) ? "locked" : ""}">
        ${s.type === "keystone" ? `<span class="node-tag">Keystone</span>` : ""}
        <span class="node-title">${s.name}</span>
        <span class="node-cost">${ownedNode ? "Selected" : `${s.cost} SP`}</span>
        <span class="node-desc">${prereqLabel}</span>
        <div class="node-actions">
          <button class="action-btn slim" data-skill-detail="${s.id}">Details</button>
          ${ownedNode ? "" : `<button class="action-btn slim" data-skill="${s.id}" ${canBuy ? "" : "disabled"}>Unlock</button>`}
        </div>
      </div>`;
    }).join("")}</div></div>`;
  }).join("");
  el.skillBranches.innerHTML = `${header}${body}`;

  el.skillBranches.querySelectorAll("button[data-skill]").forEach((btn) => btn.addEventListener("click", () => buySkill(btn.dataset.skill)));
  el.skillBranches.querySelectorAll("button[data-skill-detail]").forEach((btn) => btn.addEventListener("click", () => openSkillDetail(btn.dataset.skillDetail)));
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
  const setProgress = [
    { key: "Glass Set", count: ["bp_glass", "bp_thermal", "bp_finish"].filter((id) => state.blueprints.includes(id)).length, bonus: "+5% production" },
    { key: "Contract Set", count: ["bp_glass", "bp_assembly", "bp_finish"].filter((id) => state.blueprints.includes(id)).length, bonus: "+10% contract rewards" },
    { key: "Automation Set", count: ["bp_frame", "bp_thermal", "bp_assembly"].filter((id) => state.blueprints.includes(id)).length, bonus: "+10% offline earnings" }
  ];
  const fragmentHeader = `<div class="row"><div class="row-head"><strong>Blueprint Fragments</strong><span>${fmt(state.blueprintFragments)}</span></div><div class="row-meta"><span>${state.blueprints.length}/${blueprintDefs.length} unlocked</span><span>${nextBp ? `Next: ${nextBp.name}` : "All unlocked"}</span></div><div class="mod-progress"><span style="width:${progressPct}%"></span></div><div class="row-meta"><span>${nextBp ? `${Math.max(0, nextBp.fragmentCost - state.blueprintFragments)} needed` : "Collection complete"}</span><span>${progressPct}%</span></div><div class="row-meta"><span>${setProgress.map((s) => `${s.key} ${s.count}/3`).join(" • ")}</span><span>${setProgress.filter((s) => s.count >= 3).map((s) => s.bonus).join(" • ") || "No set bonuses active"}</span></div></div>`;
  const cards = blueprintDefs.map((bp) => {
    const unlocked = state.blueprints.includes(bp.id);
    const remain = Math.max(0, bp.fragmentCost - state.blueprintFragments);
    return `<div class="row blueprint-card ${unlocked ? "unlocked" : "locked"} rarity-${bp.rarity.toLowerCase()}"><div class="row-head"><strong>${bp.name}</strong><span>${bp.rarity}</span></div><div class="row-meta"><span>${unlocked ? "Applied" : `${remain} fragments needed`}</span><span>Cost ${bp.fragmentCost}</span></div><div class="row-meta"><span>${unlocked ? "Unlocked" : "Locked"}</span><button class="action-btn slim" data-blueprint-detail="${bp.id}">Details</button></div></div>`;
  }).join("");
  el.blueprintList.innerHTML = `${fragmentHeader}${cards}`;
  el.blueprintList.querySelectorAll("[data-blueprint-detail]").forEach((btn) => btn.addEventListener("click", () => openBlueprintDetail(btn.dataset.blueprintDetail)));
}

function openSkillDetail(skillId) {
  const s = skillDefs.find((x) => x.id === skillId);
  if (!s) return;
  const owned = state.skills.includes(s.id);
  const prereqMet = !s.prereq || state.skills.includes(s.prereq);
  openModal(`
    <h3>${s.name}</h3>
    <div class="row"><div class="row-head"><strong>Branch</strong><span>${s.branch}</span></div><div class="row-meta"><span>${s.desc}</span><span>Tier ${s.tier}</span></div><div class="row-meta"><span>Cost ${s.cost} SP</span><span>${owned ? "Selected" : (prereqMet ? "Ready" : "Prerequisite missing")}</span></div></div>
    ${owned ? "" : `<button class="action-btn" id="unlockSkillFromDetail" ${canUnlockSkill(s) ? "" : "disabled"}>Unlock Skill</button>`}
  `);
  document.getElementById("unlockSkillFromDetail")?.addEventListener("click", () => {
    buySkill(skillId);
    closeModal();
  });
}

function openBlueprintDetail(bpId) {
  const bp = blueprintDefs.find((x) => x.id === bpId);
  if (!bp) return;
  const unlocked = state.blueprints.includes(bp.id);
  const remain = Math.max(0, bp.fragmentCost - state.blueprintFragments);
  openModal(`
    <h3>${bp.name}</h3>
    <div class="row"><div class="row-head"><strong>${bp.rarity}</strong><span>${unlocked ? "Unlocked" : "Locked"}</span></div><div class="row-meta"><span>${bp.desc}</span><span>Cost ${bp.fragmentCost} fragments</span></div><div class="row-meta"><span>${unlocked ? "Effect active this run." : `${remain} fragments needed`}</span><span></span></div></div>
  `);
}

function openLineDetail(lineId) {
  const line = lineDefs.find((x) => x.id === lineId);
  if (!line) return;
  const lv = state.lines[line.id].level;
  const milestones = lineMilestones.map((m) => `${m}: ${lv >= m ? "claimed" : `needs Lv ${m}`}`).join(" • ");
  openModal(`
    <h3>${line.icon} ${line.name}</h3>
    <div class="row"><div class="row-head"><strong>Line Status</strong><span>Lv ${lv}</span></div><div class="row-meta"><span>Current output ${fmt(line.baseRate * lv * (1 + Math.sqrt(Math.max(1, lv)) * 0.03))} w/s raw</span><span>Base cost $${fmt(line.baseCost)}</span></div><div class="row-meta"><span>Milestones</span><span>${milestones}</span></div></div>
  `);
}

function openContractDetail(contractId) {
  const c = state.contractBoard.find((x) => x.id === contractId);
  if (!c) return;
  const req = c.requiredLine ? `${lineDefs.find((l) => l.id === c.requiredLine.id)?.name || "Line"} Lv ${c.requiredLine.level}` : "No line requirement";
  openModal(`
    <h3>${c.name}</h3>
    <div class="row"><div class="row-head"><strong>${c.specialType || c.type}</strong><span>Tier ${c.tierRequired || 1}</span></div><div class="row-meta"><span>${c.windows} windows in ${c.duration}s</span><span>Rep ${c.minRep.toFixed(0)}</span></div><div class="row-meta"><span>Rewards: $${fmt(c.rewards.cash)} • +${c.fragmentReward || 0} fragments</span><span>Fail -${c.failRep} rep</span></div><div class="row-meta"><span>Requirements: ${req}</span><span>${(c.modifiers || []).join(" • ") || "Standard terms"}</span></div></div>
  `);
}

function openMetaUpgradeDetail(key) {
  const u = getModernizationUpgradeDefs().find((x) => x.key === key);
  if (!u) return;
  const lv = state.metaUpgrades[key] || 0;
  const cost = modernizationUpgradeCost(u);
  openModal(`
    <h3>${u.name}</h3>
    <div class="row"><div class="row-head"><strong>${u.category}</strong><span>Lv ${lv}/${u.max}</span></div><div class="row-meta"><span>${u.desc}</span><span>Current: ${u.effect(lv)}</span></div><div class="row-meta"><span>Next: ${u.effect(Math.min(u.max, lv + 1))}</span><span>${lv >= u.max ? "MAXED" : `Cost ${cost} TK`}</span></div></div>
    ${lv >= u.max ? "" : `<button class="action-btn" id="buyMetaFromDetail" ${state.resources.tokens >= cost ? "" : "disabled"}>Invest</button>`}
  `);
  document.getElementById("buyMetaFromDetail")?.addEventListener("click", () => {
    buyModernizationUpgrade(key);
    closeModal();
  });
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
  if (state.settings.lowPerf) return;
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
  if (state.settings.lowPerf || state.settings.reducedMotion) return;
  const now = Date.now();
  if (now - lastMoneyPopAt < 550) return;
  if (el.fxLayer.childElementCount > 20) return;
  lastMoneyPopAt = now;
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
  if (state.settings.lowPerf || state.settings.reducedMotion) return;
  const now = Date.now();
  if (now - lastRewardPopupAt < 250) return;
  lastRewardPopupAt = now;
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
  const focusBonus = state.runFocus === "offline" ? 0.15 : 0;
  const setBonus = ["bp_frame", "bp_thermal", "bp_assembly"].filter((id) => state.blueprints.includes(id)).length >= 3 ? 0.1 : 0;
  const offlineBoost = 1 + state.metaUpgrades.offlineLogistics * 0.1 + state.modifiers.offlineEfficiency + (state.flags.darkShift ? 0.2 : 0) + focusBonus + setBonus;
  const offlineGain = offlineRate * cappedSec * 0.2 * offlineBoost;
  if (offlineGain > 0) {
    const repGain = Math.max(0, offlineGain * 0.0005);
    const partsGain = Math.floor((offlineSec / 300) * (0.3 + state.modifiers.partsChance));
    const researchGain = Math.floor((offlineSec / 420) * (0.2 + state.modifiers.researchGain));
    state.offlineReport = {
      awaySec: offlineSec,
      cappedSec,
      cash: offlineGain,
      rep: repGain,
      parts: Math.max(0, partsGain),
      research: Math.max(0, researchGain),
      boost: offlineBoost
    };
    openOfflineSummaryModal();
  }
  state.savedAt = now;
}

function openOfflineSummaryModal() {
  if (!state.offlineReport) return;
  const o = state.offlineReport;
  activeModal = "offlineSummary";
  openModal(`
    <h3>Offline Report</h3>
    <div class="list">
      <div class="row"><div class="row-head"><strong>Time Away</strong><span>${Math.floor(o.awaySec / 60)}m</span></div><div class="row-meta"><span>Capped at ${Math.floor(o.cappedSec / 60)}m</span><span>${o.cappedSec < o.awaySec ? "Cap reached" : "Within cap"}</span></div></div>
      <div class="row"><div class="row-head"><strong>Cash</strong><span>$${fmt(o.cash)}</span></div><div class="row-meta"><span>Offline multiplier x${o.boost.toFixed(2)}</span><span></span></div></div>
      <div class="row"><div class="row-head"><strong>Bonus Gains</strong><span>+${fmt(o.research)} research • +${fmt(o.parts)} parts • +${fmt(o.rep)} rep</span></div></div>
    </div>
    <button class="action-btn claim-btn" id="claimOfflineBtn">Claim Offline Gains</button>
    <button class="action-btn" id="skipOfflineBtn">Skip</button>
  `);
  document.getElementById("claimOfflineBtn")?.addEventListener("click", claimOfflineSummary);
  document.getElementById("skipOfflineBtn")?.addEventListener("click", () => {
    state.offlineReport = null;
    closeModal();
  });
}

function claimOfflineSummary() {
  if (!state.offlineReport) return;
  const o = state.offlineReport;
  state.resources.cash += o.cash;
  state.resources.research += o.research;
  state.resources.parts += o.parts;
  state.resources.reputation += o.rep;
  state.totalEarned += o.cash;
  toast(`Offline gains claimed: +$${fmt(o.cash)}`);
  state.offlineReport = null;
  closeModal();
  renderAll();
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
  document.body.classList.toggle("low-perf", !!state.settings.lowPerf);
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
        const imported = sanitizeLoadedState(parsed, "importSave");
        state = imported.state;
        recalculateProgressionEffects();
        applySettingsToUI();
        autoSave();
        closeModal();
        renderAll();
        if (imported.report.repaired || imported.migrated.migratedAny) {
          toast("Save imported with repairs for compatibility.");
        } else {
          toast("Save imported.");
        }
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
      validateGameState("dataReset");
      autoSave();
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
    if (document.hidden && Date.now() - (state.savedAt || 0) < 30000) return;
    const report = validateGameState("autosave");
    state.saveVersion = SAVE_VERSION;
    state.savedAt = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    if (report.repaired) {
      toast("Save repaired automatically before saving.");
    }
  } catch (error) {
    console.error("[autoSave] Failed to persist state safely.", error);
  }
}

function migrateSaveData(parsed) {
  const incoming = (parsed && typeof parsed === "object") ? { ...parsed } : {};
  const originalVersion = Math.floor(Number(incoming.saveVersion)) || 0;
  const migrated = { ...incoming };
  let migratedAny = false;

  if (originalVersion < 1) {
    migratedAny = true;
    if (migrated.metaUpgrades?.kickstart) migrated.metaUpgrades.startCash = (migrated.metaUpgrades.startCash || 0) + migrated.metaUpgrades.kickstart;
    if (migrated.metaUpgrades?.contractMastery) migrated.metaUpgrades.contractNegotiation = (migrated.metaUpgrades.contractNegotiation || 0) + migrated.metaUpgrades.contractMastery;
    if (migrated.metaUpgrades?.offlineLab) migrated.metaUpgrades.offlineLogistics = (migrated.metaUpgrades.offlineLogistics || 0) + migrated.metaUpgrades.offlineLab;
    if (migrated.metaUpgrades?.blueprintIntel) migrated.metaUpgrades.fragmentMagnet = (migrated.metaUpgrades.fragmentMagnet || 0) + migrated.metaUpgrades.blueprintIntel;
  }
  if (originalVersion < 2) {
    migratedAny = true;
    if (typeof migrated.productionMode === "string" && !migrated.productionStrategy) migrated.productionStrategy = migrated.productionMode;
    if (migrated.lines && typeof migrated.lines === "object") {
      lineDefs.forEach((line) => {
        if (typeof migrated.lines[line.id] === "number") {
          migrated.lines[line.id] = { level: migrated.lines[line.id] };
        }
      });
    }
  }
  migrated.saveVersion = SAVE_VERSION;
  return { state: migrated, originalVersion, migratedAny };
}

function sanitizeLoadedState(rawState, reason = "load") {
  const migrated = migrateSaveData(rawState);
  const merged = normalizeState({
    ...defaultState(),
    ...migrated.state,
    lastTick: Date.now()
  });
  const prev = state;
  state = merged;
  const report = validateGameState(reason);
  const sanitized = state;
  state = prev;
  sanitized.saveVersion = SAVE_VERSION;
  return { state: sanitized, report, migrated };
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const hydrated = sanitizeLoadedState(parsed, "loadState");
    if (hydrated.report.repaired || hydrated.migrated.migratedAny) {
      const message = hydrated.migrated.migratedAny
        ? "Save updated to latest format and repaired."
        : "Save had invalid values and was repaired.";
      startupRepairNotice = message;
      try {
        hydrated.state.savedAt = Date.now();
        localStorage.setItem(SAVE_KEY, JSON.stringify(hydrated.state));
      } catch {
        // ignore storage write failures
      }
    }
    return hydrated.state;
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
  if (typeof next.contractStreak !== "number") next.contractStreak = 0;
  if (typeof next.bestContractStreak !== "number") next.bestContractStreak = 0;
  if (typeof next.premiumContractsCompleted !== "number") next.premiumContractsCompleted = 0;
  if (!next.activeChain || typeof next.activeChain !== "object") next.activeChain = null;
  if (!next.activeRunEvent || typeof next.activeRunEvent !== "object") next.activeRunEvent = null;
  if (next.activeRunEvent && !Number.isFinite(Number(next.activeRunEvent.until))) next.activeRunEvent = null;
  if (typeof next.runEventNextAt !== "number") next.runEventNextAt = 0;
  if (!runFocusOptions.some((f) => f.id === next.runFocus)) next.runFocus = null;
  if (!next.machineSpecs || typeof next.machineSpecs !== "object") next.machineSpecs = Object.fromEntries(lineDefs.map((l) => [l.id, { t10: null, t25: null }]));
  lineDefs.forEach((l) => {
    if (!next.machineSpecs[l.id]) next.machineSpecs[l.id] = { t10: null, t25: null };
  });
  if (!next.overdrive || typeof next.overdrive !== "object") next.overdrive = { charge: 0, streak: 0 };
  if (typeof next.productionStrategy !== "string") next.productionStrategy = "balanced";
  if (!["mass", "balanced", "quality", "lean"].includes(next.productionStrategy)) next.productionStrategy = "balanced";
  if (!next.runGoal || typeof next.runGoal !== "object") next.runGoal = null;
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
