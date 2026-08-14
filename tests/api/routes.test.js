const test = require("node:test");
const assert = require("node:assert/strict");

const { evaluateCropIntelligence } = require("../../lib/engine/crop-engine");
const { REFERENCE_CROPS } = require("../../data/crops");
const { REFERENCE_MARKET_PRICES } = require("../../data/market-prices");
const { REFERENCE_WEATHER_DATA } = require("../../data/weather");

test("API Routes Integration: verifies /api/crops data payload structure", () => {
  assert.ok(Array.isArray(REFERENCE_CROPS), "Reference crops must be an array");
  assert.ok(REFERENCE_CROPS.length >= 12, "Must contain at least 12 core reference crops");

  const crop = REFERENCE_CROPS[0];
  assert.ok(crop.name, "Crop must have a name");
  assert.ok(crop.averageYieldPerHectare, "Crop must have average yield");
  assert.ok(crop.cultivationCostPerHectare, "Crop must have cultivation cost");
});

test("API Routes Integration: verifies /api/market reference price payload structure", () => {
  assert.ok(Array.isArray(REFERENCE_MARKET_PRICES), "Reference market prices must be an array");
  assert.ok(REFERENCE_MARKET_PRICES.length >= 12, "Must contain market prices for reference crops");
});

test("API Routes Integration: verifies /api/weather fallback dataset", () => {
  assert.ok(REFERENCE_WEATHER_DATA["Default"], "Default weather profile must exist");
  assert.ok(REFERENCE_WEATHER_DATA["Default"].temperature, "Default weather must have temperature");
});

test("API Routes Integration: verifies end-to-end /api/analyze execution", () => {
  const farmData = {
    locationName: "Kochi, Kerala",
    area: 2,
    areaUnit: "acres",
    soilType: "Loamy",
    waterAvailability: "Moderate",
    irrigationType: "Drip",
    season: "Year-round",
  };

  const weather = REFERENCE_WEATHER_DATA["Kochi, Kerala"] || REFERENCE_WEATHER_DATA["Default"];
  const result = evaluateCropIntelligence(farmData, REFERENCE_CROPS, weather, REFERENCE_MARKET_PRICES);

  assert.ok(result.recommendedCrop, "Analysis must yield recommended crop");
  assert.ok(result.confidenceScore >= 50, "Confidence score must be populated");
  assert.equal(result.allEvaluations.length, REFERENCE_CROPS.length, "Must evaluate all reference crops when season is Year-round");
});

test("User Crop Filtering: strictly limits engine evaluation to selected crops", () => {
  const farmData = {
    locationName: "Kochi, Kerala",
    area: 2,
    areaUnit: "acres",
    soilType: "Loamy",
    waterAvailability: "Moderate",
    irrigationType: "Drip",
    season: "Kharif",
  };

  const userCrops = ["Tomato", "Chilli"];
  const selectedCrops = REFERENCE_CROPS.filter((c) => userCrops.includes(c.name));
  const weather = REFERENCE_WEATHER_DATA["Default"];

  const result = evaluateCropIntelligence(farmData, selectedCrops, weather, REFERENCE_MARKET_PRICES);

  assert.ok(["Tomato", "Chilli"].includes(result.recommendedCrop.crop.name), "Recommended crop MUST be within selected crops");
  assert.equal(result.allEvaluations.length, 2, "Only selected crops must be evaluated");
  assert.ok(!result.allEvaluations.some((e) => e.crop.name === "Banana"), "Banana MUST NOT be included when not selected");
});
