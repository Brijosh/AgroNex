/**
 * Real-Time Simulation Engine Module
 * Recalculates crop economics, weather fit, and rankings under custom scenario sliders.
 */

const { calculateProfitability } = require("./profit-engine");
const { calculateSoilSuitability } = require("./soil-engine");
const { calculateWaterSuitability } = require("./water-engine");
const { calculateWeatherSuitability } = require("./weather-engine");
const { calculateMarketScore } = require("./market-engine");
const { calculateRisk } = require("./risk-engine");
const { normalizeProfitabilityScore, calculateFinalScore } = require("./scoring-engine");

/**
 * Runs a What-If sensitivity scenario simulation.
 * @param {Object} baselineAnalysis - Standard analysis payload
 * @param {Object} scenarioParams - { priceShiftPct, rainfallShiftPct, tempShiftOffset, costShiftPct }
 * @returns {Object} Simulated analysis payload with delta metrics
 */
function runScenarioSimulation(baselineAnalysis, scenarioParams = {}) {
  if (!baselineAnalysis || !baselineAnalysis.allEvaluations) {
    throw new Error("Invalid baseline analysis provided for simulation.");
  }

  const priceShift = parseFloat(scenarioParams.priceShiftPct || 0) / 100;
  const rainShift = parseFloat(scenarioParams.rainfallShiftPct || 0) / 100;
  const tempOffset = parseFloat(scenarioParams.tempShiftOffset || 0);
  const costShift = parseFloat(scenarioParams.costShiftPct || 0) / 100;

  const farmData = baselineAnalysis.farmSummary || {};
  const baseWeather = baselineAnalysis.weatherSummary || { temperature: 28, rainfall: 800 };

  const modifiedWeather = {
    ...baseWeather,
    temperature: baseWeather.temperature + tempOffset,
    rainfall: Math.max(100, Math.round(baseWeather.rainfall * (1 + rainShift))),
  };

  // Step 1: Re-evaluate each candidate crop under scenario parameters
  const simulatedRaw = baselineAnalysis.allEvaluations.map((item, index) => {
    const crop = item.crop;
    const basePrice = crop.referenceMarketPrice;
    const adjustedPrice = Math.max(1, basePrice * (1 + priceShift));
    const adjustedCostPerHa = crop.cultivationCostPerHectare * (1 + costShift);

    const modifiedCrop = {
      ...crop,
      cultivationCostPerHectare: adjustedCostPerHa,
    };

    const profitCalc = calculateProfitability(farmData, modifiedCrop, { price: adjustedPrice });
    const soilScore = calculateSoilSuitability(farmData.soilType, modifiedCrop);
    const waterScore = calculateWaterSuitability(farmData.waterAvailability, farmData.irrigationType, modifiedCrop);
    const weatherScore = calculateWeatherSuitability(modifiedCrop, modifiedWeather);
    const marketScore = calculateMarketScore(modifiedCrop, { price: adjustedPrice });
    const riskAssessment = calculateRisk(farmData, modifiedCrop, modifiedWeather, { price: adjustedPrice });

    return {
      baselineRank: index + 1,
      baselineProfit: item.financials.profit,
      baselineScore: item.finalScore,
      crop,
      financials: profitCalc,
      soilScore,
      waterScore,
      weatherScore,
      marketScore,
      riskAssessment,
    };
  });

  // Step 2: Normalize relative profitability
  const allProfits = simulatedRaw.map((e) => e.financials.profit);

  // Step 3: Compute final scores
  const simulatedScored = simulatedRaw.map((item) => {
    const profitabilityScore = normalizeProfitabilityScore(item.financials.profit, allProfits);
    const componentScores = {
      profitabilityScore,
      soilScore: item.soilScore,
      weatherScore: item.weatherScore,
      waterScore: item.waterScore,
      marketScore: item.marketScore,
      riskScore: item.riskAssessment.overallRiskScore,
    };

    const finalScore = calculateFinalScore(
      componentScores,
      farmData.preferences || {},
      item.crop.durationDays
    );

    return {
      ...item,
      profitabilityScore,
      componentScores,
      finalScore,
    };
  });

  // Step 4: Sort scenario evaluations by finalScore descending
  simulatedScored.sort((a, b) => b.finalScore - a.finalScore);

  // Step 5: Compute rank shifts & profit deltas
  const finalSimulatedEvaluations = simulatedScored.map((item, newIndex) => {
    const scenarioRank = newIndex + 1;
    const rankShift = item.baselineRank - scenarioRank; // positive = jumped up
    const profitDelta = item.financials.profit - item.baselineProfit;

    return {
      ...item,
      scenarioRank,
      rankShift,
      profitDelta,
    };
  });

  return {
    scenarioParams,
    recommendedCrop: finalSimulatedEvaluations[0],
    alternatives: finalSimulatedEvaluations.slice(1, 5),
    allEvaluations: finalSimulatedEvaluations,
    weatherSummary: modifiedWeather,
    simulatedAt: new Date().toISOString(),
  };
}

module.exports = { runScenarioSimulation };
