/**
 * Explanation Engine Module (Deterministic Rule-Based System)
 * Generates transparent natural language explanations for crop recommendations.
 */

function generateRuleBasedExplanation(analysisResult) {
  const rec = analysisResult?.recommendedCrop;
  if (!rec) return { summary: "Analysis complete.", reasons: [], warnings: [] };

  const cropName = rec.crop.name;
  const reasons = [];

  if (rec.soilScore >= 85) {
    reasons.push(`Your ${analysisResult.farmSummary?.soilType || "loamy"} soil type is highly compatible with ${cropName} (${rec.soilScore}/100 match).`);
  }

  if (rec.weatherScore >= 80) {
    reasons.push(`Regional weather patterns and thermal bounds suit ${cropName}'s growth cycle.`);
  }

  if (rec.financials.profit > 0) {
    reasons.push(`Strong estimated net return of ₹${rec.financials.profit.toLocaleString('en-IN')} for your farm area.`);
  }

  if (rec.waterScore >= 80) {
    reasons.push(`Water availability meets ${cropName}'s ${rec.crop.waterRequirement} requirement with minimal stress.`);
  } else {
    reasons.push(`Drip or micro-irrigation is recommended to optimize water delivery for ${cropName}.`);
  }

  const warnings = [];
  if (rec.riskAssessment?.marketRisk?.severity === "High") {
    warnings.push(`Market price volatility is elevated for ${cropName}. Consider forward pricing or contract arrangements.`);
  }

  if (rec.riskAssessment?.weatherRisk?.severity === "High") {
    warnings.push(`Weather sensitivity is high. Monitor regional rainfall forecasts prior to sowing.`);
  }

  return {
    summary: `${cropName} achieved the top composite score of ${rec.finalScore}/100 based on superior soil compatibility, climate fit, and net profit return.`,
    reasons: reasons.length > 0 ? reasons : [`Balanced score of ${rec.finalScore}/100 across soil, weather, and yield criteria.`],
    warnings: warnings.length > 0 ? warnings : ["Market prices are estimates and fluctuate based on seasonal supply."],
    disclaimer: "This calculation is a decision-support estimate based on reference models.",
  };
}

module.exports = { generateRuleBasedExplanation };
