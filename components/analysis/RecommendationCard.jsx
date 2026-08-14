"use client";

import React, { useState, useEffect } from "react";
import { 
  Award, TrendingUp, Calendar, Droplet, ShieldCheck, 
  CheckCircle2, ChevronRight, FileText 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils/utils";

export function RecommendationCard({ recommendation, confidenceScore = 85 }) {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!recommendation) return;

    async function fetchExplanation() {
      setLoading(true);
      try {
        const res = await fetch("/api/ai/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysisResult: { recommendedCrop: recommendation } }),
        });
        const json = await res.json();
        if (json.success && json.data) {
          setExplanation(json.data);
        }
      } catch (err) {
        console.warn("Failed to fetch explanation:", err);
      } font-medium;
      setLoading(false);
    }

    fetchExplanation();
  }, [recommendation]);

  if (!recommendation) return null;

  const { crop, financials, finalScore, riskAssessment } = recommendation;

  return (
    <Card className="bg-gradient-to-br from-crop-900 via-crop-800 to-crop-950 text-white rounded-2xl shadow-elevated overflow-hidden border-0">
      <div className="p-6 md:p-8 space-y-6">
        {/* Header Badge & Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-crop-700/50 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-300">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Top Recommended Crop for Your Farm</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">{crop.name}</h2>
            <p className="text-xs text-emerald-100/80">
              Optimal Season: <span className="font-bold text-white">{crop.season}</span> • Growth Duration: <span className="font-bold text-white">{crop.durationDays} Days</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center">
              <div className="text-2xl font-black text-white">{finalScore}<span className="text-sm font-normal text-emerald-200">/100</span></div>
              <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Recommendation Score</div>
            </div>
            <div className="text-[11px] text-emerald-200/90 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Confidence: <strong>{confidenceScore}%</strong>
            </div>
          </div>
        </div>

        {/* Key Economic Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 rounded-xl p-4 border border-white/10 text-xs">
          <div>
            <span className="text-emerald-200/70 block uppercase text-[10px] font-bold">Est. Net Profit</span>
            <span className="text-lg font-black text-emerald-300">{formatCurrency(financials.profit)}</span>
          </div>
          <div>
            <span className="text-emerald-200/70 block uppercase text-[10px] font-bold">Expected Revenue</span>
            <span className="text-base font-bold text-white">{formatCurrency(financials.revenue)}</span>
          </div>
          <div>
            <span className="text-emerald-200/70 block uppercase text-[10px] font-bold">Cultivation Expense</span>
            <span className="text-base font-bold text-slate-300">{formatCurrency(financials.cost)}</span>
          </div>
          <div>
            <span className="text-emerald-200/70 block uppercase text-[10px] font-bold">Risk Rating</span>
            <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-extrabold ${
              riskAssessment?.overallSeverity === "Low" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            }`}>
              {riskAssessment?.overallSeverity || "Low"} Risk
            </span>
          </div>
        </div>

        {/* Agronomic Rationale Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Agronomic & Financial Recommendation Rationale</span>
            </div>
            <Badge variant="secondary" className="text-[10px] py-0.5 px-2 bg-white/10 text-emerald-200">
              Rule Engine Rationale
            </Badge>
          </div>

          {loading ? (
            <div className="text-xs text-slate-300 animate-pulse">Evaluating agronomic profile for your farm...</div>
          ) : (
            <div className="space-y-2 text-xs text-slate-100 leading-relaxed">
              <p className="font-medium text-sm text-white">
                {explanation?.summary || `${crop.name} is the optimal choice for your soil, water availability, and financial goals.`}
              </p>

              {explanation?.reasons && explanation.reasons.length > 0 && (
                <div className="space-y-1 pt-1">
                  {explanation.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-emerald-200/90 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
