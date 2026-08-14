const test = require("node:test");
const assert = require("node:assert/strict");

const { REFERENCE_CROPS } = require("../../data/crops");
const { REFERENCE_MARKET_PRICES } = require("../../data/market-prices");
const { searchLocation } = require("../../lib/services/location-service");
const { getLiveWeather } = require("../../lib/services/weather-service");
const { detectSoilProperties } = require("../../lib/services/soil-service");
const { calculateProfitability } = require("../../lib/engine/profit-engine");

test("Data Accuracy Audit [1/4]: Crop Agronomic Benchmarks", () => {
  for (const crop of REFERENCE_CROPS) {
    assert.ok(crop.averageYieldPerHectare > 0, `${crop.name}: Yield must be positive`);
    assert.ok(crop.cultivationCostPerHectare > 0, `${crop.name}: Cultivation cost must be positive`);
    assert.ok(crop.referenceMarketPrice > 0, `${crop.name}: Market price must be positive`);
    assert.ok(crop.minTemperature < crop.maxTemperature, `${crop.name}: minTemp must be < maxTemp`);
    assert.ok(crop.rainfallMin < crop.rainfallMax, `${crop.name}: rainfallMin must be < rainfallMax`);
    assert.ok(crop.durationDays > 30, `${crop.name}: Growth duration must be realistic (>30 days)`);
  }
});

test("Data Accuracy Audit [2/4]: Open-Source API Live Data Verification", async () => {
  // Geocoding Accuracy
  const locs = await searchLocation("Kochi");
  assert.ok(locs[0].latitude >= 9.8 && locs[0].latitude <= 10.1, "Latitude must match Kochi region (9.9°N)");

  // Weather Accuracy
  const weather = await getLiveWeather(locs[0].latitude, locs[0].longitude, locs[0].locationName);
  assert.ok(weather.temperature >= 15 && weather.temperature <= 45, "Temperature must be within realistic ambient bounds");
  assert.ok(weather.humidity >= 20 && weather.humidity <= 100, "Humidity must be 20-100%");

  // Soil Accuracy
  const soil = await detectSoilProperties(locs[0].latitude, locs[0].longitude);
  assert.ok(soil.sandPercentage + soil.clayPercentage + soil.siltPercentage > 0, "Soil particle distribution must be non-zero");
});

test("Data Accuracy Audit [3/4]: Financial Profit Precision", () => {
  const crop = REFERENCE_CROPS.find((c) => c.name === "Tomato");
  const farmData = { area: 2, areaUnit: "acres" };
  const market = { price: 30 };

  const result = calculateProfitability(farmData, crop, market);

  assert.ok(result.revenue > 0, "Revenue must be positive");
  assert.ok(result.cost > 0, "Cost must be positive");
  assert.equal(result.profit, result.revenue - result.cost, "Net profit must equal Revenue - Cost");
});

test("Data Accuracy Audit [4/4]: Market Price Consistency", () => {
  for (const priceObj of REFERENCE_MARKET_PRICES) {
    assert.ok(priceObj.cropName, "Market price entry must have cropName");
    assert.ok(priceObj.price > 0, "Market price must be positive");
    assert.equal(priceObj.unit, "kg", "Market price unit must be standard kg");
  }
});
