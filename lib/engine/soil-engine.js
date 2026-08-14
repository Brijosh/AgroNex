/**
 * Soil Suitability Engine
 * Cross-references farmer's soil type against crop soil compatibility rules.
 */

const SOIL_COMPATIBILITY_MATRIX = {
  "Loamy": { "Loamy": 100, "Sandy": 85, "Clay": 80, "Silty": 90, "Black soil": 90, "Red soil": 85, "Laterite": 75 },
  "Sandy": { "Sandy": 100, "Loamy": 85, "Silty": 70, "Clay": 50, "Red soil": 80, "Laterite": 75 },
  "Clay": { "Clay": 100, "Loamy": 85, "Silty": 90, "Black soil": 95, "Sandy": 50 },
  "Silty": { "Silty": 100, "Loamy": 90, "Clay": 85, "Black soil": 85, "Sandy": 70 },
  "Black soil": { "Black soil": 100, "Clay": 95, "Loamy": 85, "Silty": 85 },
  "Red soil": { "Red soil": 100, "Loamy": 85, "Sandy": 80, "Laterite": 75 },
  "Laterite": { "Laterite": 100, "Red soil": 80, "Loamy": 70, "Sandy": 70 }
};

/**
 * Evaluates soil match score (0–100).
 * @param {string} soilType - Farmer's soil type
 * @param {Object} crop - Crop database entity
 * @returns {number} score 0–100
 */
function calculateSoilSuitability(soilType, crop) {
  if (!soilType || soilType === "Unknown") {
    return 65; // Baseline neutral score for unverified soil
  }

  let suitableSoils = [];
  try {
    suitableSoils = typeof crop.suitableSoils === "string" ? JSON.parse(crop.suitableSoils) : crop.suitableSoils;
  } catch (e) {
    suitableSoils = [crop.suitableSoils];
  }

  if (!Array.isArray(suitableSoils) || suitableSoils.length === 0) return 70;

  // Direct match check
  const normalizedFarmerSoil = soilType.trim();
  if (suitableSoils.some((s) => s.toLowerCase() === normalizedFarmerSoil.toLowerCase())) {
    return 95;
  }

  // Cross-reference matrix match
  let maxMatch = 50;
  for (const cropSoil of suitableSoils) {
    const match = SOIL_COMPATIBILITY_MATRIX[normalizedFarmerSoil]?.[cropSoil] || 50;
    if (match > maxMatch) maxMatch = match;
  }

  return maxMatch;
}

module.exports = { calculateSoilSuitability, SOIL_COMPATIBILITY_MATRIX };
