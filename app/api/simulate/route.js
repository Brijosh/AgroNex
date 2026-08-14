import { NextResponse } from "next/server";
import { runScenarioSimulation } from "@/lib/engine/simulation-engine";
import { evaluateCropIntelligence } from "@/lib/engine/crop-engine";
import { getWeather } from "@/lib/services/weather-service";
import { REFERENCE_CROPS } from "@/data/crops";
import { REFERENCE_MARKET_PRICES } from "@/data/market-prices";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { farmData, scenarioParams } = body;

    const farmSummary = farmData || {
      locationName: "Kochi, Kerala",
      latitude: 9.9312,
      longitude: 76.2673,
      area: 2,
      areaUnit: "acres",
      soilType: "Loamy",
      waterAvailability: "Moderate",
      irrigationType: "Drip",
      season: "Kharif",
    };

    const weatherData = await getWeather({
      latitude: farmSummary.latitude,
      longitude: farmSummary.longitude,
      locationName: farmSummary.locationName,
    });

    const baselineAnalysis = evaluateCropIntelligence(
      farmSummary,
      REFERENCE_CROPS,
      weatherData,
      REFERENCE_MARKET_PRICES
    );

    const simulationResult = runScenarioSimulation(baselineAnalysis, scenarioParams || {});

    return NextResponse.json({
      success: true,
      data: simulationResult,
    });
  } catch (error) {
    console.error("Error in /api/simulate:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to execute simulation" },
      { status: 500 }
    );
  }
}
