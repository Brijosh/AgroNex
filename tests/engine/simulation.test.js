const test = require("node:test");
const assert = require("node:assert/strict");

const { evaluateCropIntelligence } = require("../../lib/engine/crop-engine");
const { runScenarioSimulation } = require("../../lib/engine/simulation-engine");
const { REFERENCE_CROPS } = require("../../data/crops");
const { REFERENCE_MARKET_PRICES } = require("../../data/market-prices");

test("Simulation Engine: recalculates profits and rank positions under price surge scenario", () => {
  const farmData = {
    locationName: "Kochi, Kerala",
    area: 2,
    areaUnit: "acres",
    soilType: "Loamy",
    waterAvailability: "Moderate",
    irrigationType: "Drip",
    season: "Kharif",
  };
  const weather = { temperature: 28, rainfall: 800 };

  const baseline = evaluateCropIntelligence(farmData, REFERENCE_CROPS, weather, REFERENCE_MARKET_PRICES);

  // Run +30% market price surge scenario
  const simulation = runScenarioSimulation(baseline, { priceShiftPct: 30 });

  assert.ok(simulation.recommendedCrop, "Simulation must return top candidate");
  assert.ok(
    simulation.recommendedCrop.financials.profit > baseline.recommendedCrop.financials.profit,
    "Price surge must increase estimated net return"
  );
  assert.ok(simulation.recommendedCrop.profitDelta > 0, "Profit delta must be positive under price surge");
});

test("Simulation Engine: recalculates weather scores and rank shifts under severe drought scenario", () => {
  const farmData = {
    locationName: "Ludhiana, Punjab",
    area: 3,
    areaUnit: "hectares",
    soilType: "Sandy",
    waterAvailability: "Low",
    irrigationType: "Rainfed",
    season: "Kharif",
  };
  const weather = { temperature: 30, rainfall: 600 };

  const baseline = evaluateCropIntelligence(farmData, REFERENCE_CROPS, weather, REFERENCE_MARKET_PRICES);

  // Run -50% drought scenario
  const simulation = runScenarioSimulation(baseline, { rainfallShiftPct: -50 });

  assert.equal(simulation.weatherSummary.rainfall, 300);
  assert.ok(simulation.allEvaluations.length > 0);
});
