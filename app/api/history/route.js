import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const history = await prisma.analysis.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { farm: true },
    });
    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching analysis history:", error);
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const analysis = await prisma.analysis.create({
      data: {
        farmId: body.farmId || null,
        recommendedCropName: body.recommendedCropName || "Tomato",
        finalScore: parseFloat(body.finalScore) || 85,
        confidenceScore: parseFloat(body.confidenceScore) || 85,
        estimatedRevenue: parseFloat(body.estimatedRevenue) || 0,
        estimatedCost: parseFloat(body.estimatedCost) || 0,
        estimatedProfit: parseFloat(body.estimatedProfit) || 0,
      },
    });

    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    console.error("Error saving analysis run:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
