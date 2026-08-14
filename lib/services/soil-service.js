/**
 * Open-Source Soil Classification Service
 * Powered by ISRIC SoilGrids API / open soil particle distribution (100% free open-source).
 */

/**
 * Queries soil properties (sand, clay, silt fractions) for latitude and longitude.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>} Detected soil classification object
 */
async function detectSoilProperties(latitude, longitude) {
  const lat = parseFloat(latitude) || 9.9312;
  const lon = parseFloat(longitude) || 76.2673;

  try {
    const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=clay&property=sand&property=silt&depth=0-5cm&value=mean`;
    
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`SoilGrids HTTP error: ${res.status}`);

    const data = await res.json();
    const properties = data?.properties?.layers || [];

    const clayVal = extractPropertyMean(properties, "clay");
    const sandVal = extractPropertyMean(properties, "sand");
    const siltVal = extractPropertyMean(properties, "silt");

    const soilType = classifySoilTexture(sandVal, clayVal, siltVal);

    return {
      soilType,
      sandPercentage: Math.round(sandVal / 10),
      clayPercentage: Math.round(clayVal / 10),
      siltPercentage: Math.round(siltVal / 10),
      isLive: true,
      sourceType: "isric-soilgrids",
    };
  } catch (error) {
    console.warn("ISRIC SoilGrids call failed, using regional open soil estimate:", error.message);
    return getRegionalSoilEstimate(lat, lon);
  }
}

function extractPropertyMean(layers, propName) {
  const layer = layers.find((l) => l.name === propName);
  if (!layer) return 330;
  const depth = layer.depths?.find((d) => d.label === "0-5cm");
  return depth?.values?.mean ?? 330;
}

/**
 * Classifies USDA soil texture triangle based on sand, clay, silt fractions (per mil / 1000).
 */
function classifySoilTexture(sand, clay, silt) {
  const sandPct = sand / 10;
  const clayPct = clay / 10;
  const siltPct = silt / 10;

  if (clayPct >= 40) return "Clay";
  if (sandPct >= 70) return "Sandy";
  if (siltPct >= 60) return "Silty";
  if (sandPct >= 40 && clayPct < 30) return "Loamy";
  if (clayPct >= 25 && sandPct < 50) return "Black soil";

  return "Loamy"; // Dominant versatile default
}

function getRegionalSoilEstimate(latitude, longitude) {
  // Regional heuristics for fallback
  if (latitude > 25 && longitude > 70 && longitude < 76) return { soilType: "Sandy", isLive: false, sourceType: "reference" }; // Rajasthan
  if (latitude > 18 && latitude < 23 && longitude > 73 && longitude < 79) return { soilType: "Black soil", isLive: false, sourceType: "reference" }; // Deccan/Maharashtra
  if (latitude < 12) return { soilType: "Loamy", isLive: false, sourceType: "reference" }; // Kerala/Coastal

  return { soilType: "Loamy", isLive: false, sourceType: "reference" };
}

module.exports = { detectSoilProperties, classifySoilTexture };
