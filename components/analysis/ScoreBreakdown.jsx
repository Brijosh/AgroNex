import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Layers, CloudSun, Droplet, TrendingUp, ShieldAlert } from "lucide-react";

export function ScoreBreakdown({ componentScores }) {
  if (!componentScores) return null;

  const items = [
    { label: "Profitability Index", score: componentScores.profitabilityScore, color: "bg-emerald-600" },
    { label: "Soil Suitability", score: componentScores.soilScore, color: "bg-amber-600" },
    { label: "Weather Match", score: componentScores.weatherScore, color: "bg-sky-600" },
    { label: "Water Availability", score: componentScores.waterScore, color: "bg-blue-600" },
    { label: "Market Stability", score: componentScores.marketScore, color: "bg-indigo-600" },
    { label: "Risk-Adjusted Factor", score: Math.max(0, 100 - (componentScores.riskScore || 25)), color: "bg-teal-600" },
  ];

  return (
    <Card className="border-zinc-200/90 shadow-ambient">
      <CardHeader className="bg-zinc-50/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-sm font-extrabold text-zinc-950">
          <Layers className="w-4 h-4 text-crop-800" />
          <span>Score Breakdown</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {items.map((item, index) => {
          const score = Math.round(item.score || 50);

          return (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-700">{item.label}</span>
                <span className="font-mono font-bold text-zinc-900">{score} / 100</span>
              </div>
              {/* Minimal Progress Track */}
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-500 rounded-full`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

