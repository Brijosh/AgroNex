/**
 * Live Open-Source Weather Service
 * Powered by Open-Meteo API (100% free open-source, zero API key required).
 */

const { REFERENCE_WEATHER_DATA } = require("../../data/weather");

// WMO Weather Interpretation Codes
const WMO_WEATHER_CODES = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Foggy",
  51: "Light Drizzle",
  61: "Slight Rain",
  63: "Moderate Rain",
  65: "Heavy Monsoon Rain",
  80: "Slight Rain Showers",
  81: "Moderate Showers",
  95: "Thunderstorm",
};

/**
 * Fetches real-time weather from Open-Meteo API using latitude and longitude coordinates.
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} [locationName]
 * @returns {Promise<Object>} Weather payload
 */
async function getLiveWeather(latitude, longitude, locationName = "Target Location") {
  const lat = parseFloat(latitude) || 9.9312;
  const lon = parseFloat(longitude) || 76.2673;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=7&timezone=auto`;
    
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`Open-Meteo HTTP status: ${res.status}`);

    const data = await res.json();
    const current = data.current || {};
    const daily = data.daily || {};

    const temp = Math.round(current.temperature_2m ?? 28);
    const humidity = Math.round(current.relative_humidity_2m ?? 75);
    const weatherCode = current.weather_code ?? 0;
    const condition = WMO_WEATHER_CODES[weatherCode] || "Moderate Warm";

    const dailyRainSum = Array.isArray(daily.precipitation_sum)
      ? daily.precipitation_sum.reduce((a, b) => a + b, 0)
      : 25;
    
    // Estimate seasonal rainfall from weekly telemetry or baseline
    const estimatedRainfall = Math.round(Math.max(400, dailyRainSum * 35));

    return {
      temperature: temp,
      humidity,
      rainfall: estimatedRainfall,
      weatherCondition: condition,
      season: getSeasonFromMonth(),
      forecast: `Live Open-Meteo: 7-day total rain ~${Math.round(dailyRainSum)}mm. High ${Math.round(daily.temperature_2m_max?.[0] || temp)}°C / Low ${Math.round(daily.temperature_2m_min?.[0] || temp - 5)}°C.`,
      extremeWeatherWarnings: weatherCode >= 95 ? ["Thunderstorm / Heavy Wind Advisory"] : [],
      isLive: true,
      sourceType: "open-meteo-api",
      latitude: lat,
      longitude: lon,
    };
  } catch (error) {
    console.warn("Open-Meteo API call failed, falling back to reference data:", error.message);
    return getWeatherFallback(locationName);
  }
}

/**
 * Standard weather service accessor (supports both text location and lat/lon coordinates).
 * @param {string|Object} locationInput - Location string or { latitude, longitude, locationName }
 * @returns {Promise<Object>} Weather payload
 */
async function getWeather(locationInput) {
  if (typeof locationInput === "object" && locationInput?.latitude && locationInput?.longitude) {
    return getLiveWeather(locationInput.latitude, locationInput.longitude, locationInput.locationName);
  }

  const locStr = typeof locationInput === "string" ? locationInput : "Default";
  return getWeatherFallback(locStr);
}

function getWeatherFallback(locationName) {
  const matchedKey = Object.keys(REFERENCE_WEATHER_DATA).find(
    (key) => key.toLowerCase().includes(locationName.toLowerCase()) || locationName.toLowerCase().includes(key.toLowerCase())
  );

  return {
    ...(REFERENCE_WEATHER_DATA[matchedKey] || REFERENCE_WEATHER_DATA["Default"]),
    isLive: false,
    sourceType: "reference",
  };
}

function getSeasonFromMonth() {
  const month = new Date().getMonth(); // 0 = Jan
  if (month >= 5 && month <= 9) return "Kharif"; // June - Oct
  if (month >= 10 || month <= 2) return "Rabi"; // Nov - March
  return "Summer";
}

module.exports = { getWeather, getLiveWeather, WMO_WEATHER_CODES };
