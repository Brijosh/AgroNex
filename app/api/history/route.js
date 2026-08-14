import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const history = await prisma.analysis.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching analysis history:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { farmData, recommendedCropName, score, netProfit, confidenceScore, fullAnalysis } = body;

    let farm = await prisma.farm.findFirst();
    if (!farm) {
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({ data: { name: "Demo Farmer", email: "farmer@cropwise.local" } });
      }
      farm = await prisma.farm.create({
        data: {
          user: { connect: { id: user.id } },
          locationName: farmData?.locationName || "Kochi, Kerala",
          latitude: parseFloat(farmData?.latitude) || 9.9312,
          longitude: parseFloat(farmData?.longitude) || 76.2673,
          area: parseFloat(farmData?.area) || 2,
          areaUnit: farmData?.areaUnit || "acres",
          soilType: farmData?.soilType || "Loamy",
          waterAvailability: farmData?.waterAvailability || "Moderate",
          irrigationType: farmData?.irrigationType || "Drip",
          season: farmData?.season || "Kharif",
        },
      });
    }

    const record = await prisma.analysis.create({
      data: {
        farm: { connect: { id: farm.id } },
        recommendedCropName: recommendedCropName || "Tomato",
        finalScore: Math.round(score || 85),
        confidenceScore: Math.round(confidenceScore || 85),
        estimatedRevenue: parseFloat(fullAnalysis?.recommendedCrop?.financials?.revenue) || 250000,
        estimatedCost: parseFloat(fullAnalysis?.recommendedCrop?.financials?.cost) || 80000,
        estimatedProfit: parseFloat(netProfit) || 170000,
        scoringBreakdown: JSON.stringify(fullAnalysis?.recommendedCrop?.componentScores || {}),
        reasons: JSON.stringify(fullAnalysis?.recommendedCrop?.reasons || []),
        explanation: fullAnalysis?.explanation || "Top crop recommendation",
      },
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("Error saving analysis history:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
