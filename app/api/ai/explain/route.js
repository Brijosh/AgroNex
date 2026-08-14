import { NextResponse } from "next/server";
import { generateAIExplanation } from "@/lib/services/ai-service";

export async function POST(request) {
  try {
    const body = await request.json();
    const { analysisResult } = body;

    if (!analysisResult) {
      return NextResponse.json({ success: false, error: "Analysis result is required" }, { status: 400 });
    }

    const explanation = await generateAIExplanation(analysisResult);

    return NextResponse.json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    console.error("Error in /api/ai/explain:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
