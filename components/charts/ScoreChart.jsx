"use client";

import React, { useState } from "react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip 
} from "recharts";
import { Maximize2, Minimize2, ChevronUp, ChevronDown } from "lucide-react";

export function ScoreChart({ componentScores, cropName = "Recommended Crop", initialCompact = false }) {
  const [viewMode, setViewMode] = useState(initialCompact ? "compact" : "full");

  if (!componentScores) return null;

  const data = [
    { subject: "Profitability", A: Math.round(componentScores.profitabilityScore || 50), fullMark: 100 },
    { subject: "Soil Match", A: Math.round(componentScores.soilScore || 50), fullMark: 100 },
    { subject: "Weather Fit", A: Math.round(componentScores.weatherScore || 50), fullMark: 100 },
    { subject: "Water Fit", A: Math.round(componentScores.waterScore || 50), fullMark: 100 },
    { subject: "Market Stability", A: Math.round(componentScores.marketScore || 50), fullMark: 100 },
    { subject: "Risk Resilience", A: Math.max(0, 100 - Math.round(componentScores.riskScore || 30)), fullMark: 100 },
  ];

  const chartHeightClass = viewMode === "compact" ? "h-48" : "h-72";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end gap-1 text-[11px] font-semibold text-[#86868B]">
        <button
          type="button"
          onClick={() => setViewMode(viewMode === "compact" ? "full" : "compact")}
          className={`px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
            viewMode === "compact"
              ? "bg-[#1D1D1F] text-white border-black"
              : "bg-[#F5F5F7] text-[#1D1D1F] border-black/[0.06] hover:bg-slate-200"
          }`}
        >
          {viewMode === "compact" ? (
            <>
              <Maximize2 className="w-3 h-3 text-emerald-400" />
              <span>Expand Diagram</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3 h-3 text-emerald-600" />
              <span>Compact Diagram</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setViewMode(viewMode === "collapsed" ? "full" : "collapsed")}
          className="p-1 rounded-full hover:bg-black/[0.05] text-[#86868B] transition-colors"
          title={viewMode === "collapsed" ? "Show Diagram" : "Hide Diagram"}
        >
          {viewMode === "collapsed" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {viewMode !== "collapsed" && (
        <div className={`w-full ${chartHeightClass} transition-all duration-300`}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius={viewMode === "compact" ? "65%" : "75%"} data={data}>
              <PolarGrid stroke="rgba(0,0,0,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#1D1D1F", fontSize: 9, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: "#86868B" }} />
              <Radar name={cropName} dataKey="A" stroke="#047857" fill="#10B981" fillOpacity={0.35} />
              <Tooltip 
                formatter={(value) => [`${value} / 100`, "Score"]}
                contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.08)", fontSize: "11px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
