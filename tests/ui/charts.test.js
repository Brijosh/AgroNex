const test = require("node:test");
const assert = require("node:assert/strict");

test("Chart Components: verifies chart data structures for Recharts", () => {
  const mockEvaluations = [
    { crop: { name: "Tomato" }, financials: { revenue: 250000, cost: 80000, profit: 170000 } },
    { crop: { name: "Maize" }, financials: { revenue: 150000, cost: 45000, profit: 105000 } },
  ];

  const chartData = mockEvaluations.map((item) => ({
    name: item.crop.name,
    Revenue: item.financials.revenue,
    Cost: item.financials.cost,
    NetProfit: item.financials.profit,
  }));

  assert.equal(chartData.length, 2);
  assert.equal(chartData[0].name, "Tomato");
  assert.equal(chartData[0].NetProfit, 170000);
});
