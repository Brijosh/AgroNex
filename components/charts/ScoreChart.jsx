"use client";

import React from "react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip 
} from "recharts";

export function ScoreChart({ componentScores, cropName = "Recommended Crop" }) {
  if (!componentScores) return null;

  const data = [
    { subject: "Profitability", A: Math.round(componentScores.profitabilityScore || 50), fullMark: 100 },
    { subject: "Soil Match", A: Math.round(componentScores.soilScore || 50), fullMark: 100 },
    { subject: "Weather Fit", A: Math.round(componentScores.weatherScore || 50), fullMark: 100 },
    { subject: "Water Fit", A: Math.round(componentScores.waterScore || 50), fullMark: 100 },
    { subject: "Market Stability", A: Math.round(componentScores.marketScore || 50), fullMark: 100 },
    { subject: "Risk Resilience", A: Math.max(0, 100 - Math.round(componentScores.riskScore || 30)), fullMark: 100 },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#F1F5F9" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 10, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#94A3B8" }} />
          <Radar name={cropName} dataKey="A" stroke="#0F3C28" fill="#10B981" fillOpacity={0.35} />
          <Tooltip 
            formatter={(value) => [`${value} / 100`, "Score"]}
            contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "11px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
