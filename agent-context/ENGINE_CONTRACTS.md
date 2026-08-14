# Crop Intelligence Engine Contracts

All engine functions must be pure, deterministic, and testable.

### 1. `calculateProfitability(farmData, cropData, marketPrice)`
- Input: `farmData` (area, unit), `cropData` (yield, cost), `marketPrice` (price/unit)
- Output: `{ revenue, cost, profit, profitPerHectare, currency, profitabilityScore }`

### 2. `calculateSoilSuitability(soilType, cropData)`
- Input: `soilType` (String), `cropData` (suitableSoils Array)
- Output: `score` (0–100)

### 3. `calculateWaterSuitability(waterAvailability, irrigationType, cropData)`
- Input: `waterAvailability`, `irrigationType`, `cropData`
- Output: `score` (0–100)

### 4. `calculateWeatherSuitability(weatherData, cropData)`
- Input: `weatherData` (temp, rainfall), `cropData` (temp range, rainfall range)
- Output: `score` (0–100)

### 5. `calculateMarketScore(cropData, marketData)`
- Input: `cropData`, `marketData` (volatility, historical range)
- Output: `score` (0–100)

### 6. `calculateRisk(farmData, cropData, weatherData, marketData)`
- Input: domain entities
- Output: `{ overallRiskScore, weatherRisk, marketRisk, cultivationRisk, riskSeverity }`

### 7. `calculateFinalScore(scores, weights)`
- Input: scores object + weights config
- Output: `finalScore` (0–100)

### 8. `evaluateCrop(farmData, cropData, weatherData, marketData, preferences)`
- Pipeline executing all sub-engines returning full crop evaluation result.
