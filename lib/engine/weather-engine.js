/**
 * Weather Suitability Engine
 * Evaluates thermal and precipitation match against crop tolerance thresholds.
 */

/**
 * Calculates weather suitability score (0–100).
 * @param {Object} crop - Crop record
 * @param {Object} weather - Weather metrics { temperature, rainfall }
 * @returns {number} score 0–100
 */
function calculateWeatherSuitability(crop, weather) {
  if (!weather) return 75;

  const temp = parseFloat(weather.temperature) || 25;
  const rain = parseFloat(weather.rainfall) || 700;

  // Temperature evaluation
  let tempScore = 75;
  if (temp >= crop.idealTemperatureMin && temp <= crop.idealTemperatureMax) {
    tempScore = 100;
  } else if (temp >= crop.minTemperature && temp <= crop.maxTemperature) {
    const minDev = Math.abs(temp - crop.idealTemperatureMin);
    const maxDev = Math.abs(temp - crop.idealTemperatureMax);
    const dev = Math.min(minDev, maxDev);
    tempScore = Math.max(50, 95 - dev * 4);
  } else {
    tempScore = 20; // Severe penalty when temperature falls outside growth bounds
  }

  // Rainfall evaluation
  let rainScore = 80;
  if (rain >= crop.rainfallMin && rain <= crop.rainfallMax) {
    rainScore = 100;
  } else if (rain < crop.rainfallMin) {
    const deficitRatio = (crop.rainfallMin - rain) / crop.rainfallMin;
    rainScore = Math.max(20, 90 - deficitRatio * 70);
  } else if (rain > crop.rainfallMax) {
    const excessRatio = (rain - crop.rainfallMax) / crop.rainfallMax;
    rainScore = Math.max(25, 90 - excessRatio * 50);
  }

  return Math.round(tempScore * 0.55 + rainScore * 0.45);
}

module.exports = { calculateWeatherSuitability };
