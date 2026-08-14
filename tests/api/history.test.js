const test = require("node:test");
const assert = require("node:assert/strict");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

test("Database Persistence Integration: saves farm plot profile and retrieves saved list", async () => {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({ data: { name: "Test Farmer", email: `test-${Date.now()}@cropwise.local` } });
  }

  const farm = await prisma.farm.create({
    data: {
      user: { connect: { id: user.id } },
      locationName: "Kochi, Kerala",
      latitude: 9.9312,
      longitude: 76.2673,
      area: 2.5,
      areaUnit: "acres",
      soilType: "Loamy",
      waterAvailability: "Moderate",
      irrigationType: "Drip",
      season: "Kharif",
    },
  });

  assert.ok(farm.id, "Saved farm plot must have an ID");
  assert.equal(farm.locationName, "Kochi, Kerala");

  const farmsList = await prisma.farm.findMany({ where: { id: farm.id } });
  assert.equal(farmsList.length, 1);
});

test("Database Persistence Integration: stores analysis evaluation run into SQLite Analysis model", async () => {
  const farm = await prisma.farm.findFirst();
  assert.ok(farm, "Farm plot must exist for analysis relationship");

  const analysisRecord = await prisma.analysis.create({
    data: {
      farm: { connect: { id: farm.id } },
      recommendedCropName: "Tomato",
      finalScore: 92,
      confidenceScore: 88,
      estimatedRevenue: 260000,
      estimatedCost: 80000,
      estimatedProfit: 180000,
      scoringBreakdown: JSON.stringify({ soil: 95, profit: 90 }),
      explanation: "Top candidate choice",
    },
  });

  assert.ok(analysisRecord.id, "Analysis record must contain database ID");
  assert.equal(analysisRecord.recommendedCropName, "Tomato");
  assert.equal(analysisRecord.finalScore, 92);
});
