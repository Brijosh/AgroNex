const test = require("node:test");
const assert = require("node:assert/strict");

const { generateAIExplanation } = require("../../lib/services/ai-service");
const { generateRuleBasedExplanation } = require("../../lib/engine/explanation-engine");

test("AI Explanation Service: executes transparent rule-based fallback when AI_API_KEY is absent", async () => {
  delete process.env.AI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  const mockAnalysis = {
    recommendedCrop: {
      crop: { name: "Tomato", waterRequirement: "High" },
      finalScore: 88,
      soilScore: 95,
      weatherScore: 85,
      waterScore: 80,
      financials: { profit: 180000, revenue: 260000, cost: 80000 },
      riskAssessment: { overallSeverity: "Low" },
    },
    farmSummary: { soilType: "Loamy", area: 2, areaUnit: "acres" },
    weatherSummary: { temperature: 26, rainfall: 900 },
  };

  const result = await generateAIExplanation(mockAnalysis);

  assert.equal(result.isLiveAI, false, "Should return false for live AI when API key is missing");
  assert.equal(result.sourceType, "rule-based-engine", "Source type must be rule-based-engine");
  assert.ok(result.summary, "Summary text must be present");
  assert.ok(result.reasons.length > 0, "Reasons array must contain explanations");
});

test("Rule-Based Explanation Engine: formats deterministic bullet points accurately", () => {
  const mockAnalysis = {
    recommendedCrop: {
      crop: { name: "Rice", waterRequirement: "High" },
      finalScore: 92,
      soilScore: 90,
      weatherScore: 90,
      waterScore: 85,
      financials: { profit: 140000 },
      riskAssessment: { marketRisk: { severity: "Moderate" }, weatherRisk: { severity: "Low" } },
    },
    farmSummary: { soilType: "Clay" },
  };

  const explanation = generateRuleBasedExplanation(mockAnalysis);

  assert.ok(explanation.summary.includes("Rice"), "Summary should include crop name");
  assert.ok(explanation.reasons.length > 0, "Reasons should be populated");
  assert.ok(explanation.disclaimer, "Disclaimer must be included");
});
