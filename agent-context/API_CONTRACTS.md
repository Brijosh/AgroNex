# API Route Handler Contracts

### POST `/api/analyze`
- Request Body: Farm attributes (locationName, area, areaUnit, soilType, waterAvailability, irrigationType, season, preferences)
- Response Body: Complete analysis payload including recommended crop, scores, ranked alternatives, risk breakdown, and explanation.

### GET `/api/crops`
- Response Body: List of reference crops.

### GET `/api/weather?location=...`
- Response Body: Normalized weather data (temperature, rainfall, humidity, condition).

### GET `/api/market?cropId=...`
- Response Body: Normalized market prices (price, unit, currency, isReferenceData).

### POST `/api/simulate`
- Request Body: Base farm payload + modified scenario parameters.
- Response Body: Before vs after scenario comparison analysis.

### POST `/api/ai/explain`
- Request Body: Analysis result object.
- Response Body: Natural language explanation string with breakdown bullet points.
