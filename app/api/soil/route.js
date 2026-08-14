import { NextResponse } from "next/server";
import { detectSoilProperties } from "@/lib/services/soil-service";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat")) || 9.9312;
  const lon = parseFloat(searchParams.get("lon")) || 76.2673;

  try {
    const soilData = await detectSoilProperties(lat, lon);
    return NextResponse.json({
      success: true,
      data: soilData,
    });
  } catch (error) {
    console.error("Error in /api/soil:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
