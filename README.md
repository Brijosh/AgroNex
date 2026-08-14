# CropWise — AI-Assisted Crop Profitability & Risk Platform

CropWise is an agricultural decision-support web application that evaluates crop profitability, soil suitability, water needs, weather conditions, and multidimensional risks to recommend the best planting options for farmers.

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router, JavaScript)
- **Styling**: Tailwind CSS, CSS variables, Lucide React
- **Database**: SQLite with Prisma ORM
- **Validation**: Zod + React Hook Form
- **Data Visualization**: Recharts

---

## Directory Structure

```
├── app/                  # Next.js App Router pages & API route handlers
├── components/           # UI components (layout, farm, analysis, crops, simulator, ui)
├── lib/
│   ├── engine/           # Deterministic Crop Intelligence Engine modules
│   ├── services/         # Weather, Market, and AI service abstractions
│   ├── validation/       # Zod validation schemas
│   └── utils/            # Helper formatting utilities
├── data/                 # Local reference crop, weather, & market datasets
├── prisma/               # Database schema and seed script
├── tests/                # Engine & API unit test suites
└── agent-context/        # Architectural specification contracts & agent rules
```

---

## Setup & Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```

3. **Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Linting & Tests**:
   ```bash
   npm run lint
   npm test
   ```
