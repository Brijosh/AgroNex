/**
 * Market Engine Module
 * Evaluates market stability, price volatility index, and demand resilience.
 */

/**
 * Calculates market score (0–100).
 * @param {Object} crop - Crop database entity
 * @param {Object} [marketData] - Market price entity
 * @returns {number} score 0–100
 */
function calculateMarketScore(crop, marketData) {
  const volatility = parseFloat(crop?.marketVolatility) || 30;
  const stabilityScore = Math.max(10, 100 - volatility);

  let priceTrendScore = 75;
  if (marketData && marketData.price > crop.referenceMarketPrice) {
    priceTrendScore = 90;
  } else if (marketData && marketData.price < crop.referenceMarketPrice * 0.8) {
    priceTrendScore = 55;
  }

  return Math.round(stabilityScore * 0.7 + priceTrendScore * 0.3);
}

module.exports = { calculateMarketScore };
