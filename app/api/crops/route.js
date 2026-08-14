import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { REFERENCE_CROPS } from "@/data/crops";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbCrops = await prisma.crop.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Case-insensitive Map deduplication
    const map = new Map();
    dbCrops.forEach((c) => {
      if (c && c.name) map.set(c.name.trim().toLowerCase(), c);
    });
    REFERENCE_CROPS.forEach((c) => {
      if (c && c.name) {
        const key = c.name.trim().toLowerCase();
        if (!map.has(key)) map.set(key, c);
      }
    });

    const allCrops = Array.from(map.values());

    return NextResponse.json({ success: true, data: allCrops });
  } catch (error) {
    console.error("Error fetching crops:", error);
    return NextResponse.json({ success: true, data: REFERENCE_CROPS });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: "Crop name is required." }, { status: 400 });
    }

    const name = body.name.trim();

    // Check if custom crop already exists in DB (case-insensitive search)
    const existing = await prisma.crop.findFirst({
      where: { name: { equals: name } },
    });

    if (existing) {
      return NextResponse.json({ success: true, data: existing });
    }

    const newCrop = await prisma.crop.create({
      data: {
        name,
        scientificName: body.scientificName || `${name} sp.`,
        season: body.season || "Kharif",
        suitableSoils: JSON.stringify(body.suitableSoils || ["Loamy", "Sandy", "Clay"]),
        waterRequirement: body.waterRequirement || "Moderate",
        irrigationSuitability: body.irrigationSuitability || "Drip",
        minTemperature: parseFloat(body.minTemperature) || 15,
        maxTemperature: parseFloat(body.maxTemperature) || 35,
        idealTemperatureMin: parseFloat(body.idealTemperatureMin) || 20,
        idealTemperatureMax: parseFloat(body.idealTemperatureMax) || 30,
        rainfallMin: parseFloat(body.rainfallMin) || 500,
        rainfallMax: parseFloat(body.rainfallMax) || 1200,
        averageYieldPerHectare: parseFloat(body.averageYieldPerHectare) || 3500,
        cultivationCostPerHectare: parseFloat(body.cultivationCostPerHectare) || 45000,
        referenceMarketPrice: parseFloat(body.referenceMarketPrice) || 25,
        durationDays: parseInt(body.durationDays, 10) || 100,
        baseRisk: parseFloat(body.baseRisk) || 25,
        marketVolatility: parseFloat(body.marketVolatility) || 30,
        diseaseRisk: parseFloat(body.diseaseRisk) || 30,
        waterSensitivity: parseFloat(body.waterSensitivity) || 35,
        weatherSensitivity: parseFloat(body.weatherSensitivity) || 35,
        isReferenceData: false,
      },
    });

    return NextResponse.json({ success: true, data: newCrop });
  } catch (error) {
    console.error("Error creating custom crop:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
