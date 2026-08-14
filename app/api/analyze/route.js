import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateCropIntelligence } from "@/lib/engine/crop-engine";
import { getWeather } from "@/lib/services/weather-service";
import { REFERENCE_CROPS } from "@/data/crops";
import { REFERENCE_MARKET_PRICES } from "@/data/market-prices";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    
    const farmData = {
      locationName: body.locationName || "Kochi, Kerala",
      latitude: parseFloat(body.latitude) || 9.9312,
      longitude: parseFloat(body.longitude) || 76.2673,
      area: parseFloat(body.area) || 2,
      areaUnit: body.areaUnit || "acres",
      soilType: body.soilType || "Loamy",
      waterAvailability: body.waterAvailability || "Moderate",
      irrigationType: body.irrigationType || "Drip",
      season: body.season || "Kharif",
      preferences: body.preferences || {},
    };

    // Fetch all crops from Prisma database (reference + custom user crops)
    let allAvailableCrops = REFERENCE_CROPS;
    try {
      const dbCrops = await prisma.crop.findMany();
      if (Array.isArray(dbCrops) && dbCrops.length > 0) {
        const dbNames = new Set(dbCrops.map((c) => c.name.toLowerCase()));
        const filteredRef = REFERENCE_CROPS.filter((c) => !dbNames.has(c.name.toLowerCase()));
        allAvailableCrops = [...dbCrops, ...filteredRef];
      }
    } catch (e) {
      console.warn("Database crops query fallback to reference data:", e.message);
    }

    // Strictly filter candidate crops to ONLY the user's selected crops if specified
    let candidateCrops = allAvailableCrops;
    if (Array.isArray(body.userCrops) && body.userCrops.length > 0) {
      const selectedSet = new Set(body.userCrops.map((c) => c.toLowerCase().trim()));
      const filtered = allAvailableCrops.filter((c) => selectedSet.has(c.name.toLowerCase().trim()));
      if (filtered.length > 0) {
        candidateCrops = filtered;
      }
    }

    // Fetch live weather data from Open-Meteo API
    const weatherData = await getWeather({
      latitude: farmData.latitude,
      longitude: farmData.longitude,
      locationName: farmData.locationName,
    });

    const analysis = evaluateCropIntelligence(farmData, candidateCrops, weatherData, REFERENCE_MARKET_PRICES);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to analyze farm data" },
      { status: 500 }
    );
  }
}
