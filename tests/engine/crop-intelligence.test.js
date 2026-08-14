const test = require("node:test");
const assert = require("node:assert/strict");

const { calculateProfitability } = require("../../lib/engine/profit-engine");
const { calculateSoilSuitability } = require("../../lib/engine/soil-engine");
const { calculateWaterSuitability } = require("../../lib/engine/water-engine");
const { calculateWeatherSuitability } = require("../../lib/engine/weather-engine");
const { calculateMarketScore } = require("../../lib/engine/market-engine");
const { calculateRisk } = require("../../lib/engine/risk-engine");
const { calculateFinalScore, normalizeProfitabilityScore } = require("../../lib/engine/scoring-engine");
const { evaluateCropIntelligence } = require("../../lib/engine/crop-engine");
const { REFERENCE_CROPS } = require("../../data/crops");
const { REFERENCE_MARKET_PRICES } = require("../../data/market-prices");

test("Profit Engine: verifies revenue, cost, and net return per hectare", () => {
  const farmData = { area: 2, areaUnit: "hectares" };
  const crop = {
    averageYieldPerHectare: 4000,
    cultivationCostPerHectare: 40000,
    referenceMarketPrice: 25,
    yieldUnit: "kg",
  };
  const marketPrice = { price: 25 };

  const result = calculateProfitability(farmData, crop, marketPrice);

  assert.equal(result.revenue, 200000);
  assert.equal(result.cost, 80000);
  assert.equal(result.profit, 120000);
  assert.equal(result.profitPerHectare, 60000);
});

test("Soil Engine: cross-references soil compatibility matrix", () => {
  const crop = { suitableSoils: ["Loamy", "Clay"] };

  assert.equal(calculateSoilSuitability("Loamy", crop), 95, "Direct match should score 95");
  assert.equal(calculateSoilSuitability("Silty", crop), 90, "Silty to Clay match should score 90");
  assert.equal(calculateSoilSuitability("Unknown", crop), 65, "Unknown soil should score baseline 65");
});

test("Water Engine: awards drip irrigation bonus", () => {
  const crop = { waterRequirement: "High" };

  const rainfedScore = calculateWaterSuitability("Moderate", "Rainfed", crop);
  const dripScore = calculateWaterSuitability("Moderate", "Drip", crop);

  assert.ok(dripScore > rainfedScore, "Drip irrigation should yield higher score than Rainfed under water deficit");
});

test("Weather Engine: penalizes extreme temperature and rainfall deficits", () => {
  const crop = {
    minTemperature: 15,
    maxTemperature: 35,
    idealTemperatureMin: 20,
    idealTemperatureMax: 30,
    rainfallMin: 500,
    rainfallMax: 1000,
  };

  const ideal = calculateWeatherSuitability(crop, { temperature: 25, rainfall: 750 });
  const extremeCold = calculateWeatherSuitability(crop, { temperature: 5, rainfall: 750 });

  assert.equal(ideal, 100);
  assert.ok(extremeCold < 60, "Outside min temperature bound should be heavily penalized");
});

test("Risk Engine: computes weather, market, and cultivation risk severities", () => {
  const crop = {
    marketVolatility: 75,
    weatherSensitivity: 60,
    diseaseRisk: 50,
    waterSensitivity: 40,
    baseRisk: 30,
  };

  const risk = calculateRisk({}, crop, {}, {});

  assert.equal(risk.marketRisk.severity, "High");
  assert.ok(risk.overallRiskScore > 40);
});

test("Scoring Engine: adjusts weights dynamically for farmer preferences", () => {
  const componentScores = {
    profitabilityScore: 90,
    soilScore: 80,
    weatherScore: 70,
    waterScore: 60,
    marketScore: 50,
    riskScore: 40,
  };

  const defaultScore = calculateFinalScore(componentScores, {});
  const highProfitScore = calculateFinalScore(componentScores, { highProfit: true });

  assert.ok(highProfitScore > defaultScore, "High profit preference should boost final score when profitability is high");
});

test("Crop Engine Pipeline: evaluates full reference crop list and produces ranked list", () => {
  const farmData = {
    locationName: "Kochi, Kerala",
    area: 2,
    areaUnit: "acres",
    soilType: "Loamy",
    waterAvailability: "Moderate",
    irrigationType: "Drip",
    season: "Kharif",
  };
  const weather = { temperature: 28, rainfall: 1200 };

  const analysis = evaluateCropIntelligence(farmData, REFERENCE_CROPS, weather, REFERENCE_MARKET_PRICES);

  assert.ok(analysis.recommendedCrop, "Must produce top recommendation");
  assert.ok(analysis.alternatives.length >= 3, "Must produce alternatives");
  assert.ok(analysis.confidenceScore > 50, "Confidence score should be populated");

  // Verify descending finalScore sort order
  const scores = analysis.allEvaluations.map((e) => e.finalScore);
  for (let i = 0; i < scores.length - 1; i++) {
    assert.ok(scores[i] >= scores[i + 1], "Evaluations must be sorted in descending finalScore order");
  }
});
