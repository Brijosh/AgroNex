"use client";

import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { formatCurrency } from "@/lib/utils/utils";

export function ProfitChart({ evaluations = [] }) {
  if (!evaluations || evaluations.length === 0) return null;

  const data = evaluations.slice(0, 5).map((item) => ({
    name: item.crop?.name || "Crop",
    Revenue: item.financials?.revenue || 0,
    Cost: item.financials?.cost || 0,
    NetProfit: item.financials?.profit || 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3.5 border border-zinc-200/90 rounded-xl shadow-lg text-xs space-y-1.5 min-w-[180px]">
          <p className="font-extrabold text-zinc-950 border-b border-zinc-100 pb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between items-center gap-4 text-zinc-600 font-mono text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-zinc-900">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
          <YAxis 
            tick={{ fontSize: 10, fill: "#64748B", fontFamily: "monospace" }} 
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} 
            axisLine={{ stroke: "#E2E8F0" }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12, fontWeight: 500 }} />
          <Bar dataKey="Revenue" fill="#10B981" name="Gross Revenue" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Cost" fill="#F59E0B" name="Cultivation Cost" radius={[4, 4, 0, 0]} />
          <Bar dataKey="NetProfit" fill="#0F3C28" name="Net Return" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
