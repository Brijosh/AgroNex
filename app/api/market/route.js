import { NextResponse } from "next/server";
import { REFERENCE_MARKET_PRICES } from "@/data/market-prices";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cropName = searchParams.get("crop");

  if (cropName) {
    const item = REFERENCE_MARKET_PRICES.find(
      (m) => m.cropName.toLowerCase() === cropName.toLowerCase()
    );
    return NextResponse.json({ success: true, data: item || null });
  }

  return NextResponse.json({
    success: true,
    data: REFERENCE_MARKET_PRICES,
  });
}
