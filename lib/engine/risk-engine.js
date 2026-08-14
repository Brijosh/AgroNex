/**
 * Risk Engine Module
 * Evaluates weather risk, market risk, and cultivation disease hazards.
 */

/**
 * Calculates risk assessments for a crop.
 * @param {Object} farmData - Farm details
 * @param {Object} crop - Crop record
 * @param {Object} weather - Weather details
 * @param {Object} marketData - Market price details
 * @returns {Object} { overallRiskScore, weatherRisk, marketRisk, cultivationRisk, overallSeverity }
 */
function calculateRisk(farmData, crop, weather, marketData) {
  const marketVolatility = parseFloat(crop.marketVolatility) || 30;
  const weatherSensitivity = parseFloat(crop.weatherSensitivity) || 40;
  const diseaseRisk = parseFloat(crop.diseaseRisk) || 30;
  const waterSensitivity = parseFloat(crop.waterSensitivity) || 40;
  const baseRisk = parseFloat(crop.baseRisk) || 25;

  const weatherRiskScore = Math.round(weatherSensitivity * 0.8 + baseRisk * 0.2);
  const marketRiskScore = Math.round(marketVolatility * 0.8 + baseRisk * 0.2);
  const cultivationRiskScore = Math.round(diseaseRisk * 0.5 + waterSensitivity * 0.5);

  const overallRiskScore = Math.round(
    weatherRiskScore * 0.35 + marketRiskScore * 0.35 + cultivationRiskScore * 0.30
  );

  const getSeverity = (score) => {
    if (score <= 30) return "Low";
    if (score <= 60) return "Moderate";
    return "High";
  };

  return {
    overallRiskScore,
    weatherRisk: { score: weatherRiskScore, severity: getSeverity(weatherRiskScore) },
    marketRisk: { score: marketRiskScore, severity: getSeverity(marketRiskScore) },
    cultivationRisk: { score: cultivationRiskScore, severity: getSeverity(cultivationRiskScore) },
    overallSeverity: getSeverity(overallRiskScore),
  };
}

module.exports = { calculateRisk };
