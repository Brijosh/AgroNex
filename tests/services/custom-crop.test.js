const test = require("node:test");
const assert = require("node:assert/strict");

const { getMarketPrice, getFallbackMarketPrice } = require("../../lib/services/market-service");
const { PrismaClient } = require("@prisma/client");
const { evaluateCropIntelligence } = require("../../lib/engine/crop-engine");

const prisma = new PrismaClient();

test("Live Market Price Service: fetches commodity price payload and provides trend", async () => {
  const market = await getMarketPrice("Tomato", "Kochi Mandi");
  assert.ok(market.price > 0, "Price per kg must be positive");
  assert.equal(market.cropName, "Tomato");
  assert.ok(market.trend, "Trend indicator must be present");
});

test("Custom Crop Creation: persists new custom crop into Prisma SQLite database", async () => {
  const customName = `Dragonfruit_${Date.now()}`;

  const createdCrop = await prisma.crop.create({
    data: {
      name: customName,
      season: "Kharif",
      suitableSoils: JSON.stringify(["Loamy", "Sandy"]),
      waterRequirement: "Low",
      minTemperature: 15,
      maxTemperature: 38,
      idealTemperatureMin: 22,
      idealTemperatureMax: 32,
      rainfallMin: 400,
      rainfallMax: 1000,
      averageYieldPerHectare: 5000,
      cultivationCostPerHectare: 60000,
      referenceMarketPrice: 120,
      durationDays: 120,
      baseRisk: 20,
      marketVolatility: 25,
      diseaseRisk: 20,
      waterSensitivity: 25,
      weatherSensitivity: 25,
      isReferenceData: false,
    },
  });

  assert.ok(createdCrop.id, "Created crop must contain database ID");
  assert.equal(createdCrop.name, customName);
  assert.equal(createdCrop.isReferenceData, false);

  // Evaluate custom crop in Crop Engine
  const farmData = { area: 2, areaUnit: "acres", soilType: "Loamy", season: "Kharif" };
  const weather = { temperature: 28, rainfall: 800 };
  const analysis = evaluateCropIntelligence(farmData, [createdCrop], weather, []);

  assert.ok(analysis.recommendedCrop, "Custom crop must be evaluated cleanly by engine");
  assert.equal(analysis.recommendedCrop.crop.name, customName);
});
