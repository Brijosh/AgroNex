const test = require("node:test");
const assert = require("node:assert/strict");

const { evaluateCropIntelligence } = require("../../lib/engine/crop-engine");
const { runScenarioSimulation } = require("../../lib/engine/simulation-engine");
const { calculateProfitability } = require("../../lib/engine/profit-engine");
const { calculateSoilSuitability } = require("../../lib/engine/soil-engine");
const { calculateWaterSuitability } = require("../../lib/engine/water-engine");
const { calculateWeatherSuitability } = require("../../lib/engine/weather-engine");
const { calculateMarketScore } = require("../../lib/engine/market-engine");
const { calculateRisk } = require("../../lib/engine/risk-engine");
const { searchLocation, reverseGeocode } = require("../../lib/services/location-service");
const { getWeather, getLiveWeather } = require("../../lib/services/weather-service");
const { detectSoilProperties, classifySoilTexture } = require("../../lib/services/soil-service");
const { generateAIExplanation } = require("../../lib/services/ai-service");
const { REFERENCE_CROPS } = require("../../data/crops");
const { REFERENCE_MARKET_PRICES } = require("../../data/market-prices");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

test("E2E Audit [1/10]: Reference Data Integrity", () => {
  assert.ok(Array.isArray(REFERENCE_CROPS), "REFERENCE_CROPS must be an array");
  assert.ok(REFERENCE_CROPS.length >= 12, "Must contain at least 12 seeded reference crops");
  assert.ok(Array.isArray(REFERENCE_MARKET_PRICES), "REFERENCE_MARKET_PRICES must be an array");
  assert.ok(REFERENCE_MARKET_PRICES.length >= 12, "Must contain at least 12 market prices");
});

test("E2E Audit [2/10]: OpenStreetMap Nominatim Geocoding API", async () => {
  const result = await searchLocation("Kochi");
  assert.ok(result.length > 0, "Location search must return suggestions");
  assert.ok(result[0].latitude, "Result must contain valid latitude");
  assert.ok(result[0].longitude, "Result must contain valid longitude");

  const reverse = await reverseGeocode(9.9312, 76.2673);
  assert.ok(reverse.locationName, "Reverse geocoding must return location name");
});

test("E2E Audit [3/10]: Open-Meteo Live Weather API Service", async () => {
  const weather = await getWeather({ latitude: 9.9312, longitude: 76.2673, locationName: "Kochi, Kerala" });
  assert.ok(weather.temperature, "Weather must contain temperature");
  assert.ok(weather.rainfall > 0, "Weather must contain rainfall estimate");
  assert.ok(weather.weatherCondition, "Weather must contain weather condition string");
});

test("E2E Audit [4/10]: ISRIC SoilGrids Soil Classification Service", async () => {
  const soil = await detectSoilProperties(9.9312, 76.2673);
  assert.ok(soil.soilType, "Soil service must return classified soil type");
  assert.ok(["Loamy", "Sandy", "Clay", "Silty", "Black soil", "Red soil"].includes(soil.soilType));
});

test("E2E Audit [5/10]: Deterministic Crop Intelligence Engine Sub-Modules", () => {
  const crop = REFERENCE_CROPS[0];
  const farmData = { area: 2, areaUnit: "acres", soilType: "Loamy", waterAvailability: "Moderate", irrigationType: "Drip" };
  const weather = { temperature: 28, rainfall: 850 };
  const market = { price: crop.referenceMarketPrice };

  const profit = calculateProfitability(farmData, crop, market);
  assert.ok(profit.revenue > 0, "Profit engine must calculate revenue");

  const soilScore = calculateSoilSuitability(farmData.soilType, crop);
  assert.ok(soilScore >= 50 && soilScore <= 100, "Soil score must be bounded 50-100");

  const waterScore = calculateWaterSuitability(farmData.waterAvailability, farmData.irrigationType, crop);
  assert.ok(waterScore >= 20 && waterScore <= 100, "Water score must be bounded 20-100");

  const weatherScore = calculateWeatherSuitability(crop, weather);
  assert.ok(weatherScore >= 20 && weatherScore <= 100, "Weather score must be bounded 20-100");

  const marketScore = calculateMarketScore(crop, market);
  assert.ok(marketScore >= 10 && marketScore <= 100, "Market score must be bounded 10-100");

  const risk = calculateRisk(farmData, crop, weather, market);
  assert.ok(risk.overallSeverity, "Risk engine must return severity badge");
});

test("E2E Audit [6/10]: Crop Orchestration Engine Pipeline", () => {
  const farmData = {
    locationName: "Kochi, Kerala",
    area: 2,
    areaUnit: "acres",
    soilType: "Loamy",
    waterAvailability: "Moderate",
    irrigationType: "Drip",
    season: "Kharif",
  };
  const weather = { temperature: 28, rainfall: 850 };

  const analysis = evaluateCropIntelligence(farmData, REFERENCE_CROPS, weather, REFERENCE_MARKET_PRICES);
  assert.ok(analysis.recommendedCrop, "Pipeline must yield recommended crop");
  assert.ok(analysis.alternatives.length >= 3, "Pipeline must produce ranked alternatives");
  assert.ok(analysis.confidenceScore >= 50, "Confidence score must be populated");
});

test("E2E Audit [7/10]: What-If Simulator Real-Time Engine", () => {
  const farmData = { locationName: "Kochi, Kerala", area: 2, areaUnit: "acres", season: "Kharif" };
  const baseline = evaluateCropIntelligence(farmData, REFERENCE_CROPS, { temperature: 28, rainfall: 800 }, REFERENCE_MARKET_PRICES);

  const scenario = runScenarioSimulation(baseline, { priceShiftPct: 20, rainfallShiftPct: -30 });
  assert.ok(scenario.recommendedCrop, "Simulator must yield recommended crop");
  assert.ok(scenario.recommendedCrop.financials.profit > 0, "Simulator must compute profit under scenario");
});

test("E2E Audit [8/10]: AI Explanation Layer Service", async () => {
  const mockAnalysis = {
    recommendedCrop: { crop: { name: "Tomato" }, finalScore: 90, financials: { profit: 180000 } },
    farmSummary: { soilType: "Loamy" },
  };

  const aiResult = await generateAIExplanation(mockAnalysis);
  assert.ok(aiResult.summary, "AI explanation must return summary text");
  assert.ok(aiResult.reasons.length > 0, "AI explanation must return reasons array");
});

test("E2E Audit [9/10]: Prisma SQLite Database Persistence", async () => {
  let user = await prisma.user.findFirst();
  if (!user) user = await prisma.user.create({ data: { name: "Audit User", email: `audit-${Date.now()}@cropwise.local` } });

  const farm = await prisma.farm.create({
    data: {
      user: { connect: { id: user.id } },
      locationName: "Audit Farm Kochi",
      area: 3,
      areaUnit: "hectares",
      soilType: "Loamy",
      waterAvailability: "High",
      irrigationType: "Sprinkler",
      season: "Kharif",
    },
  });
  assert.ok(farm.id, "Saved farm must contain database ID");

  const analysis = await prisma.analysis.create({
    data: {
      farm: { connect: { id: farm.id } },
      recommendedCropName: "Chilli",
      finalScore: 94,
      confidenceScore: 90,
      estimatedRevenue: 300000,
      estimatedCost: 90000,
      estimatedProfit: 210000,
    },
  });
  assert.ok(analysis.id, "Saved analysis must contain database ID");
});

test("E2E Audit [10/10]: Navigation Query String Parameter Verification", () => {
  const params = new URLSearchParams({
    location: "Kochi, Kerala",
    lat: "9.9312",
    lon: "76.2673",
    area: "2.5",
    areaUnit: "acres",
    soil: "Loamy",
    water: "Moderate",
    irrigation: "Drip",
    season: "Kharif",
    crops: "Tomato,Rice,Maize",
  }).toString();

  assert.ok(params.includes("location=Kochi"));
  assert.ok(params.includes("crops=Tomato%2CRice%2CMaize"));
});
