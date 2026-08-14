/**
 * Confidence Engine Module
 * Evaluates reliability and data completeness of analysis factors (reflects data availability, NOT outcome guarantee).
 */

function calculateConfidence(farmData, weatherData, marketData) {
  let confidence = 85;

  if (!farmData.soilType || farmData.soilType === "Unknown") {
    confidence -= 15;
  }

  if (!farmData.locationName) {
    confidence -= 10;
  }

  if (weatherData?.isReferenceData) {
    confidence -= 5;
  }

  if (marketData?.isReferenceData) {
    confidence -= 5;
  }

  return Math.max(40, Math.min(100, confidence));
}

module.exports = { calculateConfidence };
