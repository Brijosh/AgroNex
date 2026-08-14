# Architectural Decision Records (DECISIONS.md)

This document records the foundational architectural decisions made for **CropWise**.

---

### ADR 1: Next.js Route Handlers over Separate Flask Backend
- **Decision**: Implement all backend APIs as Next.js Route Handlers (`app/api/.../route.js`) inside the same project.
- **Rationale**: Keeps deployment unified, reduces system latency, avoids cross-origin CORS overhead, and allows seamless server-side database access via Prisma.

### ADR 2: JavaScript over TypeScript
- **Decision**: Use standard JavaScript (`.js` / `.jsx`) throughout the codebase.
- **Rationale**: Strict project constraint requirement to ensure maximum code compatibility and rapid execution without extra build step transpilation issues.

### ADR 3: SQLite for MVP Database
- **Decision**: Use SQLite with Prisma ORM for initial development and MVP deployment.
- **Rationale**: Zero setup cost, file-based persistence, fast local development, and Prisma allows seamless migration to PostgreSQL for production.

### ADR 4: Deterministic Engine as Source of Truth (AI as Explanation Layer)
- **Decision**: All profitability calculations, suitability scoring, risk assessments, and crop rankings are calculated deterministically in JS engine modules (`lib/engine/*`).
- **Rationale**: Agricultural advice requires mathematical reliability, auditability, and safety. AI LLMs must never invent prices, yields, or suitability scores. AI is strictly confined to natural language explanations.

### ADR 5: Local Reference Datasets for Offline Capability
- **Decision**: Provide local static datasets (`data/crops.js`, `data/market-prices.js`, `data/weather.js`) for 12 reference crops.
- **Rationale**: Ensures the application is 100% functional out-of-the-box without requiring live third-party API keys or internet connection during hackathon evaluation.

### ADR 6: Weighted Multi-Factor Scoring Model
- **Decision**: Crop ranking uses a weighted composite formula: Profitability (25%), Soil Suitability (20%), Weather Suitability (20%), Water Suitability (15%), Market Stability (10%), Risk-adjusted Factor (10%).
- **Rationale**: Balances economic return against physical suitability and risk, preventing dangerous high-risk recommendations.
