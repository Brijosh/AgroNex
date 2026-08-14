import { NextResponse } from "next/server";
import { searchLocation, reverseGeocode } from "@/lib/services/location-service";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  try {
    if (lat && lon) {
      const location = await reverseGeocode(parseFloat(lat), parseFloat(lon));
      return NextResponse.json({ success: true, data: location });
    }

    if (query) {
      const results = await searchLocation(query);
      return NextResponse.json({ success: true, data: results });
    }

    const defaultLocs = await searchLocation("Kochi");
    return NextResponse.json({ success: true, data: defaultLocs });
  } catch (error) {
    console.error("Error in /api/location:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to search location" },
      { status: 500 }
    );
  }
}
