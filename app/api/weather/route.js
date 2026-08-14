import { NextResponse } from "next/server";
import { getWeather } from "@/lib/services/weather-service";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location") || "Kochi, Kerala";
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  try {
    const input = lat && lon ? { latitude: parseFloat(lat), longitude: parseFloat(lon), locationName: location } : location;
    const weather = await getWeather(input);

    return NextResponse.json({
      success: true,
      data: weather,
    });
  } catch (error) {
    console.error("Error in /api/weather:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
