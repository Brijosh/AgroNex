const test = require("node:test");
const assert = require("node:assert/strict");

const { searchLocation, reverseGeocode, FALLBACK_LOCATIONS } = require("../../lib/services/location-service");
const { getWeather, getLiveWeather } = require("../../lib/services/weather-service");
const { detectSoilProperties, classifySoilTexture } = require("../../lib/services/soil-service");

test("Location Service: returns fallback location objects for text queries", async () => {
  const locations = await searchLocation("Kochi");
  assert.ok(locations.length > 0, "Should return at least one location result");
  assert.ok(locations[0].latitude, "Location must contain latitude");
  assert.ok(locations[0].longitude, "Location must contain longitude");
});

test("Weather Service: fetches weather payload and provides fallback defaults", async () => {
  const weather = await getWeather("Kochi, Kerala");
  assert.ok(weather.temperature > 0, "Temperature should be a valid number");
  assert.ok(weather.rainfall > 0, "Rainfall should be a valid number");
  assert.ok(weather.weatherCondition, "Weather condition text should be present");
});

test("Soil Service: classifies soil texture based on particle fractions", () => {
  assert.equal(classifySoilTexture(200, 500, 300), "Clay", "High clay percentage should classify as Clay");
  assert.equal(classifySoilTexture(800, 100, 100), "Sandy", "High sand percentage should classify as Sandy");
  assert.equal(classifySoilTexture(400, 200, 400), "Loamy", "Balanced particles should classify as Loamy");
});
