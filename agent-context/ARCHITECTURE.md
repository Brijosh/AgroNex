# CropWise Architecture Overview

```
User Input (Farm Onboarding / Simulator)
                ↓
    Next.js App Router Page / Client Form
                ↓
    Zod Input Validation (lib/validation/*)
                ↓
    POST /api/analyze Route Handler
                ↓
  ┌───────────────────────────────────────────┐
  │     Crop Intelligence Engine Pipeline      │
  │                                           │
  │  1. Weather & Market Services (Fallback)  │
  │  2. Profit Engine (Revenue, Cost, Net)    │
  │  3. Soil, Water & Weather Suitability     │
  │  4. Market Volatility & Risk Engine       │
  │  5. Weighted Scoring Engine               │
  │  6. Ranking & Alternatives Engine         │
  │  7. Confidence Score Calculator           │
  └───────────────────────────────────────────┘
                ↓
    Rule-Based / AI Explanation Layer (lib/services/ai-service.js)
                ↓
    Structured Analysis JSON Response
                ↓
    React Dashboard & Analysis Components
```
