"use client";

import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";

export function RiskChart({ riskAssessment }) {
  if (!riskAssessment) return null;

  const data = [
    {
      name: "Weather Risk",
      score: riskAssessment.weatherRisk?.score || 35,
      severity: riskAssessment.weatherRisk?.severity || "Moderate",
    },
    {
      name: "Market Volatility",
      score: riskAssessment.marketRisk?.score || 25,
      severity: riskAssessment.marketRisk?.severity || "Low",
    },
    {
      name: "Cultivation Risk",
      score: riskAssessment.cultivationRisk?.score || 40,
      severity: riskAssessment.cultivationRisk?.severity || "Moderate",
    },
  ];

  const getColor = (severity) => {
    if (severity === "Low") return "#10B981"; // Emerald
    if (severity === "Moderate") return "#F59E0B"; // Amber
    return "#EF4444"; // Rose
  };

  return (
    <div className="w-full h-48 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748B", fontFamily: "monospace" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#334155", fontWeight: 600 }} width={110} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
          <Tooltip 
            formatter={(value, name, item) => [`${value} / 100 (${item.payload.severity} Severity)`, "Risk Factor"]}
            contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "11px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          />
          <Bar dataKey="score" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.severity)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
