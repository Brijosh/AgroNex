/**
 * Scoring Engine Module
 * Source of truth for weighted composite scoring & preference adjustments.
 */

const DEFAULT_WEIGHTS = {
  profitability: 0.25,
  soil: 0.20,
  weather: 0.20,
  water: 0.15,
  market: 0.10,
  riskAdjusted: 0.10,
};

/**
 * Normalizes net profit across candidate crops to a 0–100 score.
 * @param {number} profit - Net profit for target crop
 * @param {Array<number>} allProfits - Array of net profits across candidate crops
 * @returns {number} normalized score 0–100
 */
function normalizeProfitabilityScore(profit, allProfits) {
  if (!allProfits || allProfits.length === 0) return 50;

  const validProfits = allProfits.filter((p) => typeof p === "number" && !isNaN(p));
  if (validProfits.length === 0) return 50;

  const maxProfit = Math.max(...validProfits, 1);
  const minProfit = Math.min(...validProfits, 0);

  if (maxProfit === minProfit) return 75;

  if (profit <= 0) {
    const denom = Math.abs(minProfit) || 1;
    return Math.max(0, Math.round(30 + (profit / denom) * 20));
  }

  return Math.round(40 + (profit / maxProfit) * 60);
}

/**
 * Calculates final preference-adjusted composite recommendation score.
 * @param {Object} componentScores - { profitabilityScore, soilScore, weatherScore, waterScore, marketScore, riskScore }
 * @param {Object} [preferences] - Farmer preferences { lowRisk, highProfit, lowWater, shortDuration }
 * @param {number} [durationDays] - Crop growth duration
 * @returns {number} score 0–100
 */
function calculateFinalScore(componentScores, preferences = {}, durationDays = 100) {
  let weights = { ...DEFAULT_WEIGHTS };

  // Adjust weights based on farmer preferences
  if (preferences.highProfit) {
    weights = { ...weights, profitability: 0.35, market: 0.15, soil: 0.15, weather: 0.15 };
  }

  if (preferences.lowRisk) {
    weights = { ...weights, riskAdjusted: 0.25, weather: 0.25, water: 0.20, profitability: 0.15 };
  }

  if (preferences.lowWater) {
    weights = { ...weights, water: 0.30, soil: 0.20, profitability: 0.20 };
  }

  const riskAdjustedScore = Math.max(0, 100 - (componentScores.riskScore || 30));

  let weightedSum =
    (componentScores.profitabilityScore || 50) * weights.profitability +
    (componentScores.soilScore || 50) * weights.soil +
    (componentScores.weatherScore || 50) * weights.weather +
    (componentScores.waterScore || 50) * weights.water +
    (componentScores.marketScore || 50) * weights.market +
    riskAdjustedScore * weights.riskAdjusted;

  // Short duration preference penalty if crop duration > 120 days
  if (preferences.shortDuration && durationDays > 120) {
    weightedSum -= (durationDays - 120) * 0.15;
  }

  return Math.round(Math.min(100, Math.max(0, weightedSum)));
}

module.exports = { normalizeProfitabilityScore, calculateFinalScore, DEFAULT_WEIGHTS };
