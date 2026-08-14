/**
 * AI Explanation Service
 * Uses Google Gemini API (if AI_API_KEY present) to generate simple farmer summaries,
 * backed by a transparent rule-based explanation engine fallback.
 */

const { generateRuleBasedExplanation } = require("../engine/explanation-engine");

/**
 * Generates natural language summary for a crop recommendation analysis.
 * @param {Object} analysisResult - Calculated analysis payload
 * @returns {Promise<Object>} { summary, reasons, warnings, sourceType }
 */
async function generateAIExplanation(analysisResult) {
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const fallback = generateRuleBasedExplanation(analysisResult);
    return {
      ...fallback,
      isLiveAI: false,
      sourceType: "rule-based-engine",
    };
  }

  try {
    const rec = analysisResult?.recommendedCrop;
    const farm = analysisResult?.farmSummary || {};
    const weather = analysisResult?.weatherSummary || {};

    const promptText = `
You are CropWise, a friendly agricultural advisory agent helping local farmers.
Explain why ${rec.crop.name} was recommended for this farm in clear, empathetic, non-technical language.

Farm Details:
- Location: ${farm.locationName}
- Area: ${farm.area} ${farm.areaUnit}
- Soil: ${farm.soilType}
- Water: ${farm.waterAvailability} (${farm.irrigationType})
- Temperature: ${weather.temperature}°C, Rainfall: ~${weather.rainfall}mm

Calculated Crop Results (Do NOT change these numbers):
- Recommended Crop: ${rec.crop.name}
- Composite Recommendation Score: ${rec.finalScore} / 100
- Estimated Net Profit: ₹${rec.financials.profit.toLocaleString('en-IN')}
- Soil Match Rating: ${rec.soilScore} / 100
- Weather Fit Rating: ${rec.weatherScore} / 100
- Overall Risk Severity: ${rec.riskAssessment?.overallSeverity || "Low"}

Instructions:
Provide a concise response in JSON format with keys:
"summary": 2-3 sentences explaining why ${rec.crop.name} is the best choice.
"reasons": array of 3 key benefit bullet points for the farmer.
"warnings": array of 1-2 practical risk management tips.
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });

    if (!response.ok) throw new Error(`Gemini API HTTP status: ${response.status}`);

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawText);

    return {
      summary: parsed.summary || `${rec.crop.name} is highly recommended for your farm.`,
      reasons: parsed.reasons || [],
      warnings: parsed.warnings || [],
      isLiveAI: true,
      sourceType: "gemini-llm",
    };
  } catch (error) {
    console.warn("AI Explanation call failed, falling back to rule-based engine:", error.message);
    const fallback = generateRuleBasedExplanation(analysisResult);
    return {
      ...fallback,
      isLiveAI: false,
      sourceType: "rule-based-engine",
    };
  }
}

module.exports = { generateAIExplanation };
