"use client";

import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Maximize2, Minimize2, ChevronUp, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils/utils";

export function ProfitChart({ evaluations = [], initialCompact = false }) {
  const [viewMode, setViewMode] = useState(initialCompact ? "compact" : "full"); // "compact" | "full" | "collapsed"

  if (!evaluations || evaluations.length === 0) return null;

  const data = evaluations.slice(0, 6).map((item) => ({
    name: item.crop?.name || "Crop",
    Revenue: item.financials?.revenue || 0,
    Cost: item.financials?.cost || 0,
    NetProfit: item.financials?.profit || 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-black/[0.08] rounded-2xl shadow-apple-md text-xs space-y-1 min-w-[170px]">
          <p className="font-extrabold text-[#1D1D1F] border-b border-black/[0.05] pb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between items-center gap-3 text-[#86868B] font-medium text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-extrabold text-[#1D1D1F]">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartHeightClass = viewMode === "compact" ? "h-44" : "h-72";

  return (
    <div className="space-y-2">
      {/* Compact / Expand View Controls */}
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
              <span>Expand Chart</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3 h-3 text-emerald-600" />
              <span>Compact Chart</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setViewMode(viewMode === "collapsed" ? "full" : "collapsed")}
          className="p-1 rounded-full hover:bg-black/[0.05] text-[#86868B] transition-colors"
          title={viewMode === "collapsed" ? "Show Chart" : "Hide Chart"}
        >
          {viewMode === "collapsed" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {viewMode !== "collapsed" && (
        <div className={`w-full ${chartHeightClass} transition-all duration-300 pt-1`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 10, left: 10, bottom: viewMode === "compact" ? 5 : 18 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#1D1D1F", fontWeight: 600 }} axisLine={{ stroke: "rgba(0,0,0,0.08)" }} tickLine={false} />
              <YAxis 
                tick={{ fontSize: 9, fill: "#86868B" }} 
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} 
                axisLine={{ stroke: "rgba(0,0,0,0.08)" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
              {viewMode === "full" && <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10, fontWeight: 600 }} />}
              <Bar dataKey="Revenue" fill="#10B981" name="Gross Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Cost" fill="#F59E0B" name="Cultivation Cost" radius={[4, 4, 0, 0]} />
              <Bar dataKey="NetProfit" fill="#047857" name="Net Return" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
