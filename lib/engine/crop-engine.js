/**
 * Crop Engine Core Orchestrator
 * Evaluates candidate crops against farm conditions, weather, and market reference data.
 */

const { calculateProfitability } = require("./profit-engine");
const { calculateSoilSuitability } = require("./soil-engine");
const { calculateWaterSuitability } = require("./water-engine");
const { calculateWeatherSuitability } = require("./weather-engine");
const { calculateMarketScore } = require("./market-engine");
const { calculateRisk } = require("./risk-engine");
const { normalizeProfitabilityScore, calculateFinalScore } = require("./scoring-engine");
const { calculateConfidence } = require("./confidence-engine");

/**
 * Main evaluation pipeline for farm analysis.
 * @param {Object} farmData - Farm attributes from wizard form
 * @param {Array<Object>} cropsList - Candidate crop entities
 * @param {Object} weatherData - Weather dataset for location
 * @param {Array<Object>} marketPrices - Reference market price records
 * @returns {Object} Complete evaluation analysis payload
 */
function evaluateCropIntelligence(farmData, cropsList, weatherData, marketPrices = []) {
  if (!cropsList || cropsList.length === 0) {
    throw new Error("No candidate crops provided for evaluation.");
  }

  // Evaluate all provided crops (preserving user crop selection)
  const eligibleCrops = cropsList;

  // Step 1: Raw calculations for each candidate
  const rawEvaluations = eligibleCrops.map((crop) => {
    const marketRef = marketPrices.find(
      (m) => m.cropName?.toLowerCase() === crop.name?.toLowerCase() || m.cropId === crop.id
    );
    const profitCalc = calculateProfitability(farmData, crop, marketRef);
    const soilScore = calculateSoilSuitability(farmData?.soilType, crop);
    const waterScore = calculateWaterSuitability(farmData?.waterAvailability, farmData?.irrigationType, crop);
    const weatherScore = calculateWeatherSuitability(crop, weatherData);
    const marketScore = calculateMarketScore(crop, marketRef);
    const riskAssessment = calculateRisk(farmData, crop, weatherData, marketRef);

    return {
      crop,
      financials: profitCalc,
      soilScore,
      waterScore,
      weatherScore,
      marketScore,
      riskAssessment,
    };
  });

  // Step 2: Relative profitability normalization
  const allProfits = rawEvaluations.map((e) => e.financials.profit);

  // Step 3: Composite final scoring with farmer preferences
  const scoredEvaluations = rawEvaluations.map((item) => {
    const profitabilityScore = normalizeProfitabilityScore(item.financials.profit, allProfits);
    const riskScore = item.riskAssessment.overallRiskScore;

    const componentScores = {
      profitabilityScore,
      soilScore: item.soilScore,
      weatherScore: item.weatherScore,
      waterScore: item.waterScore,
      marketScore: item.marketScore,
      riskScore,
    };

    const finalScore = calculateFinalScore(
      componentScores,
      farmData?.preferences || {},
      item.crop.durationDays
    );

    return {
      ...item,
      profitabilityScore,
      componentScores,
      finalScore,
    };
  });

  // Step 4: Sort ranked crop recommendations by finalScore descending
  scoredEvaluations.sort((a, b) => b.finalScore - a.finalScore);

  const recommended = scoredEvaluations[0];
  const alternatives = scoredEvaluations.slice(1, 5);
  const confidenceScore = calculateConfidence(farmData, weatherData);

  return {
    recommendedCrop: recommended,
    alternatives,
    allEvaluations: scoredEvaluations,
    confidenceScore,
    farmSummary: farmData,
    weatherSummary: weatherData,
    evaluatedAt: new Date().toISOString(),
  };
}

module.exports = { evaluateCropIntelligence };
