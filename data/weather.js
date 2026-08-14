const REFERENCE_WEATHER_DATA = {
  "Kochi, Kerala": {
    temperature: 28,
    humidity: 78,
    rainfall: 1200,
    weatherCondition: "Humid & Tropical",
    season: "Kharif",
    forecast: "Favorable seasonal monsoon rainfall expected",
    extremeWeatherWarnings: [],
    isReferenceData: true,
    sourceType: "reference"
  },
  "Ludhiana, Punjab": {
    temperature: 18,
    humidity: 62,
    rainfall: 650,
    weatherCondition: "Cool & Clear",
    season: "Rabi",
    forecast: "Normal winter dew and mild temperatures",
    extremeWeatherWarnings: [],
    isReferenceData: true,
    sourceType: "reference"
  },
  "Default": {
    temperature: 25,
    humidity: 65,
    rainfall: 800,
    weatherCondition: "Moderate Warm",
    season: "Kharif",
    forecast: "Stable agricultural weather conditions",
    extremeWeatherWarnings: [],
    isReferenceData: true,
    sourceType: "reference"
  }
};

module.exports = { REFERENCE_WEATHER_DATA };
