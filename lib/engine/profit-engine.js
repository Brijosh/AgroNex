/**
 * Profit Engine Module
 * Source of truth for crop revenue, cultivation cost, and net return calculations.
 */

const { convertAcresToHectares } = require("../utils/utils");

/**
 * Calculates financial metrics for a candidate crop.
 * @param {Object} farmData - Farm attributes { area, areaUnit }
 * @param {Object} crop - Crop database record
 * @param {Object} [marketPrice] - Market price object or reference price
 * @returns {Object} { revenue, cost, profit, profitPerHectare, totalYield, yieldUnit, priceUsed, currency }
 */
function calculateProfitability(farmData, crop, marketPrice) {
  const rawArea = parseFloat(farmData?.area) || 1;
  const areaUnit = farmData?.areaUnit === "hectares" ? "hectares" : "acres";
  const areaInHectares = areaUnit === "hectares" ? rawArea : convertAcresToHectares(rawArea);
  const effectiveArea = Math.max(0.01, areaInHectares);

  const price = parseFloat(marketPrice?.price) || parseFloat(crop?.referenceMarketPrice) || 25;
  const yieldPerHectare = parseFloat(crop?.averageYieldPerHectare) || 3000;
  const costPerHectare = parseFloat(crop?.cultivationCostPerHectare) || 40000;

  const totalYield = yieldPerHectare * effectiveArea;
  const revenue = totalYield * price;
  const cost = costPerHectare * effectiveArea;
  const profit = revenue - cost;
  const profitPerHectare = profit / effectiveArea;

  return {
    revenue: Math.round(revenue),
    cost: Math.round(cost),
    profit: Math.round(profit),
    profitPerHectare: Math.round(profitPerHectare),
    totalYield: Math.round(totalYield),
    yieldUnit: crop?.yieldUnit || "kg",
    priceUsed: price,
    currency: "INR",
    areaEvaluatedHectares: parseFloat(effectiveArea.toFixed(3)),
  };
}

module.exports = { calculateProfitability };
