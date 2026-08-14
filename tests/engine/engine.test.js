const test = require("node:test");
const assert = require("node:assert/strict");

const { calculateProfitability } = require("../../lib/engine/profit-engine");
const { calculateSoilSuitability } = require("../../lib/engine/soil-engine");
const { calculateWaterSuitability } = require("../../lib/engine/water-engine");
const { calculateWeatherSuitability } = require("../../lib/engine/weather-engine");
const { calculateFinalScore } = require("../../lib/engine/scoring-engine");
const { evaluateCropIntelligence } = require("../../lib/engine/crop-engine");
const { REFERENCE_CROPS } = require("../../data/crops");
const { REFERENCE_MARKET_PRICES } = require("../../data/market-prices");

test("Profit Engine: computes exact revenue, cost, and net profit", () => {
  const farmData = { area: 2, areaUnit: "hectares" };
  const crop = {
    averageYieldPerHectare: 5000,
    cultivationCostPerHectare: 50000,
    referenceMarketPrice: 20,
    yieldUnit: "kg"
  };
  const marketPrice = { price: 20 };

  const result = calculateProfitability(farmData, crop, marketPrice);

  assert.equal(result.revenue, 200000, "Revenue should equal 5000 * 20 * 2 = 200000");
  assert.equal(result.cost, 100000, "Cost should equal 50000 * 2 = 100000");
  assert.equal(result.profit, 100000, "Net profit should equal 200000 - 100000 = 100000");
});

test("Soil Engine: returns high score for matching soil types", () => {
  const crop = { suitableSoils: ["Loamy", "Clay"] };
  const scoreLoamy = calculateSoilSuitability("Loamy", crop);
  assert.equal(scoreLoamy, 95, "Direct soil match should return 95");
});

test("Water Engine: calculates water suitability correctly", () => {
  const crop = { waterRequirement: "Moderate" };
  const score = calculateWaterSuitability("High", "Drip", crop);
  assert.equal(score, 95, "Abundant water should yield top score");
});

test("Weather Engine: evaluates temperature and rainfall bounds", () => {
  const crop = {
    minTemperature: 15,
    maxTemperature: 35,
    idealTemperatureMin: 20,
    idealTemperatureMax: 30,
    rainfallMin: 500,
    rainfallMax: 1000
  };
  const weather = { temperature: 25, rainfall: 750 };
  const score = calculateWeatherSuitability(crop, weather);
  assert.equal(score, 100, "Ideal weather conditions should yield 100 score");
});

test("Crop Engine: ranks crops deterministically", () => {
  const farmData = {
    locationName: "Kochi, Kerala",
    area: 2,
    areaUnit: "acres",
    soilType: "Loamy",
    waterAvailability: "Moderate",
    irrigationType: "Drip",
    season: "Kharif"
  };
  const weather = { temperature: 28, rainfall: 1200 };

  const analysis = evaluateCropIntelligence(farmData, REFERENCE_CROPS, weather, REFERENCE_MARKET_PRICES);

  assert.ok(analysis.recommendedCrop, "Should return a recommended crop");
  assert.ok(analysis.recommendedCrop.finalScore > 0, "Final score should be > 0");
  assert.ok(analysis.alternatives.length > 0, "Should return alternative candidates");
});
