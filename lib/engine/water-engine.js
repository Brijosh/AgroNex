/**
 * Water Suitability Engine
 * Evaluates water availability and micro-irrigation efficiency against crop requirements.
 */

const WATER_LEVELS = {
  "Very Low": 1,
  "Low": 2,
  "Moderate": 3,
  "High": 4,
  "Very High": 5,
};

/**
 * Calculates water suitability score (0–100).
 * @param {string} waterAvailability - Very Low, Low, Moderate, High, Very High
 * @param {string} irrigationType - Rainfed, Drip, Sprinkler, Flood, Other
 * @param {Object} crop - Crop database entity
 * @returns {number} score 0–100
 */
function calculateWaterSuitability(waterAvailability, irrigationType, crop) {
  const farmLevel = WATER_LEVELS[waterAvailability] || 3;
  const cropLevel = WATER_LEVELS[crop?.waterRequirement] || 3;

  if (farmLevel >= cropLevel) {
    return 95; // Fully adequate water availability
  }

  const deficit = cropLevel - farmLevel;
  let score = 95 - deficit * 24;

  // Efficiency bonuses for modern micro-irrigation
  if (irrigationType === "Drip") {
    score += 15;
  } else if (irrigationType === "Sprinkler") {
    score += 10;
  }

  return Math.max(20, Math.min(100, Math.round(score)));
}

module.exports = { calculateWaterSuitability, WATER_LEVELS };
