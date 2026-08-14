const { PrismaClient } = require("@prisma/client");
const { REFERENCE_CROPS } = require("../data/crops");
const { REFERENCE_MARKET_PRICES } = require("../data/market-prices");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CropWise SQLite database with reference datasets...");

  // Seed Crops
  for (const crop of REFERENCE_CROPS) {
    const suitableSoils = JSON.stringify(crop.suitableSoils);
    const advantages = JSON.stringify(crop.advantages);
    const limitations = JSON.stringify(crop.limitations);

    const createdCrop = await prisma.crop.upsert({
      where: { name: crop.name },
      update: {
        scientificName: crop.scientificName,
        season: crop.season,
        suitableSoils: suitableSoils,
        waterRequirement: crop.waterRequirement,
        irrigationSuitability: crop.irrigationSuitability,
        minTemperature: crop.minTemperature,
        maxTemperature: crop.maxTemperature,
        idealTemperatureMin: crop.idealTemperatureMin,
        idealTemperatureMax: crop.idealTemperatureMax,
        rainfallMin: crop.rainfallMin,
        rainfallMax: crop.rainfallMax,
        averageYieldPerHectare: crop.averageYieldPerHectare,
        yieldUnit: crop.yieldUnit,
        cultivationCostPerHectare: crop.cultivationCostPerHectare,
        referenceMarketPrice: crop.referenceMarketPrice,
        marketUnit: crop.marketUnit,
        durationDays: crop.durationDays,
        baseRisk: crop.baseRisk,
        marketVolatility: crop.marketVolatility,
        diseaseRisk: crop.diseaseRisk,
        waterSensitivity: crop.waterSensitivity,
        weatherSensitivity: crop.weatherSensitivity,
        description: crop.description,
        advantages: advantages,
        limitations: limitations,
        isReferenceData: true,
      },
      create: {
        id: crop.id,
        name: crop.name,
        scientificName: crop.scientificName,
        season: crop.season,
        suitableSoils: suitableSoils,
        waterRequirement: crop.waterRequirement,
        irrigationSuitability: crop.irrigationSuitability,
        minTemperature: crop.minTemperature,
        maxTemperature: crop.maxTemperature,
        idealTemperatureMin: crop.idealTemperatureMin,
        idealTemperatureMax: crop.idealTemperatureMax,
        rainfallMin: crop.rainfallMin,
        rainfallMax: crop.rainfallMax,
        averageYieldPerHectare: crop.averageYieldPerHectare,
        yieldUnit: crop.yieldUnit,
        cultivationCostPerHectare: crop.cultivationCostPerHectare,
        referenceMarketPrice: crop.referenceMarketPrice,
        marketUnit: crop.marketUnit,
        durationDays: crop.durationDays,
        baseRisk: crop.baseRisk,
        marketVolatility: crop.marketVolatility,
        diseaseRisk: crop.diseaseRisk,
        waterSensitivity: crop.waterSensitivity,
        weatherSensitivity: crop.weatherSensitivity,
        description: crop.description,
        advantages: advantages,
        limitations: limitations,
        isReferenceData: true,
      },
    });

    // Seed Market Price record
    const marketRef = REFERENCE_MARKET_PRICES.find((m) => m.cropName === crop.name);
    if (marketRef) {
      await prisma.marketPrice.create({
        data: {
          cropId: createdCrop.id,
          location: marketRef.location,
          price: marketRef.price,
          unit: marketRef.unit,
          currency: marketRef.currency,
          source: marketRef.sourceType,
          sourceType: "reference",
          isReferenceData: true,
        },
      });
    }
  }

  console.log("✅ Seeding completed successfully. 12 crops populated.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
