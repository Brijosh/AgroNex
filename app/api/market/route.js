import { NextResponse } from "next/server";
import { getMarketPrice } from "@/lib/services/market-service";
import { REFERENCE_MARKET_PRICES } from "@/data/market-prices";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cropName = searchParams.get("crop");
  const location = searchParams.get("location") || "Kochi, Kerala";

  try {
    if (cropName) {
      const item = await getMarketPrice(cropName, location);
      return NextResponse.json({ success: true, data: item });
    }

    const allLive = await Promise.all(
      REFERENCE_MARKET_PRICES.map((m) => getMarketPrice(m.cropName, location))
    );

    return NextResponse.json({
      success: true,
      data: allLive,
    });
  } catch (error) {
    console.error("Market API error:", error);
    return NextResponse.json({ success: true, data: REFERENCE_MARKET_PRICES });
  }
}
