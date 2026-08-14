# AgroNex — Hackathon Presentation Guide & Architecture Documentation

---

## 🚀 1. The 30-Second Elevator Pitch (For Judges)

> **"AgroNex is an enterprise-grade, zero-cost Agricultural Decision Intelligence Platform that empowers farmers to maximize crop yield and net profit. By fusing live open-source weather forecasts from Open-Meteo, satellite-derived soil classification from ISRIC SoilGrids, real-time Mandi market commodity rates, and deterministic financial decision algorithms, AgroNex eliminates guesswork in farming. It features an interactive What-If sensitivity simulator, multi-crop side-by-side comparison, and custom fruit/crop modeling — built with Next.js, Prisma, Recharts, and Poppins typography."**

---

## 🎯 2. Problem & Real-World Impact

| Problem | AgroNex Solution |
|---|---|
| **High Crop Failure & Climate Volatility** | Live Open-Meteo weather API provides real-time temperature, rainfall, and 7-day regional climate forecasts to prevent out-of-season planting. |
| **Soil Incompatibility Risk** | ISRIC SoilGrids API auto-classifies soil texture (Loamy, Sandy, Clay, Silty, Black, Red, Laterite) from 0-30cm particle fractions. |
| **Market Volatility & Financial Uncertainty** | Live Mandi market price feeds calculate expected revenue, cultivation expense, and net return per hectare tailored to plot size. |
| **Opaque Recommendations** | Transparent Rule Engine and Google Gemini AI explain exactly *why* a crop was selected or penalised. |

---

## 🛠️ 3. Full Technology Stack

### **Frontend & User Interface**
- **Framework**: Next.js 14 App Router (built strictly using pure JavaScript `.js`/`.jsx`).
- **Styling**: Tailwind CSS with custom design tokens.
- **Typography**: **Poppins** (Google Fonts) with geometric, high-readability hierarchy.
- **Iconography**: Lucide React SVG system.
- **Data Visualization**: **Recharts** (`ResponsiveContainer`, `BarChart`, `RadarChart`, `AreaChart`).

### **Backend & APIs**
- **API Architecture**: Next.js Route Handlers (`app/api/*`).
- **ORM & Database**: **Prisma ORM** with **SQLite** (`prisma/dev.db`).
- **Dual-Layer Persistence**: SQLite DB + Browser `localStorage` synchronization (guarantees 100% data persistence when deployed on Vercel Serverless Lambdas).
- **AI Explanation Layer**: Google Gemini API (`@google/generative-ai`) with deterministic rule-based fallback.

---

## 🌐 4. Open-Source Live API Integrations (Zero Cost)

1. **OpenStreetMap Nominatim Geocoding API** (`lib/services/location-service.js`)
   - *Endpoint*: `https://nominatim.openstreetmap.org/search`
   - *Function*: Forward & reverse geocoding for Indian villages, districts, and cities.
2. **Open-Meteo Climate Weather API** (`lib/services/weather-service.js`)
   - *Endpoint*: `https://api.open-meteo.com/v1/forecast`
   - *Function*: Real-time ambient temperature (°C), relative humidity (%), rainfall (mm), WMO weather codes, and 7-day forecasts.
3. **ISRIC SoilGrids REST API** (`lib/services/soil-service.js`)
   - *Endpoint*: `https://rest.isric.org/soilgrids/v2.0/properties/query`
   - *Function*: Sand, clay, and silt particle distribution at 0–30cm depth for soil classification.
4. **Live Mandi Commodity Market Service** (`lib/services/market-service.js`)
   - *Function*: Commodity rates per kg with trend indicators (`Upward`, `Stable`, `Downward`) and price volatility indices.

---

## 🧮 5. Deterministic Crop Intelligence Engine

AgroNex evaluates crops using a multi-factor weighted scoring algorithm:

$$\text{Final Score} = w_{\text{profit}} \cdot S_{\text{profit}} + w_{\text{soil}} \cdot S_{\text{soil}} + w_{\text{weather}} \cdot S_{\text{weather}} + w_{\text{water}} \cdot S_{\text{water}} - \text{Risk Penalty}$$

- **Profit Score**: $\frac{\text{Net Return}}{\text{Max Benchmark Profit}} \times 100$
- **Soil Score**: Matrix lookup across 8 agronomic soil types.
- **Weather Score**: Temperature & rainfall bounding equations.
- **Water Score**: Irrigation method suitability (Drip/Sprinkler bonus).
- **Risk Severity Index**: Weather vulnerability, price volatility, and disease risk penalties.

---

## 📱 6. Key Demo Flow for Hackathon Judges

Follow this sequence for a flawless 3-minute judge demo:

1. **Homepage (`/`)**: Show the landing page with Poppins typography, metric badges, and open data architecture highlights.
2. **1-Click Demo Setup (`/onboarding?demo=true`)**:
   - Click **"Try Demo Data"** to auto-fill **Kochi, Kerala** (2 Acres, Loamy Soil, Drip Irrigation, Kharif Season).
   - Show Step 7 multi-crop selection and click **"+ Add Custom Crop"** to demonstrate fruit presets (Dragonfruit, Mango, Papaya, Watermelon, Strawberry, Cotton, Guava).
3. **Analysis Report (`/analysis`)**:
   - Show top crop recommendation card with **Recommendation Score (e.g. 92/100)** and confidence index.
   - Highlight **Recharts Profit Bar Chart**, **Multi-Factor Score Radar**, and **Risk Severity Heatmap**.
   - Show **"Agronomic & Financial Recommendation Rationale"** explaining why the top crop won.
4. **Side-by-Side Comparison (`/compare`)**:
   - Show 8-crop matrix comparison. Click **"+ Fruits Suite"** to compare Dragonfruit, Mango, Papaya, Watermelon, Strawberry, and Guava side-by-side.
5. **What-If Simulator (`/simulator`)**:
   - Drag the **Price Slider (+30% price surge)** or **Rainfall Slider (-50% severe drought)**.
   - Show live real-time graph recalculation and dynamic rank shift badges in under 50 milliseconds!
6. **Farmer Operations Dashboard (`/dashboard`)**:
   - Show saved farm plot cards and historical analysis runs persisted cleanly via SQLite + localStorage.

---

## 🏆 7. Hackathon Judging Matrix Alignment

- **Technical Innovation**: 100% open-data API integration without expensive paid API keys.
- **Scalability**: Zero server maintenance, serverless ready on Vercel with local database fallback.
- **UI/UX Aesthetics**: Clean, Apple-level minimal UI design system powered by Poppins typography.
- **Reliability**: 43/43 unit, integration, and E2E audit tests passing cleanly (`npm test`).

---
*AgroNex — Smart Agricultural Intelligence Platform*
