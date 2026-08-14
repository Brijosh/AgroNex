import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowUpRight, BarChart2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils/utils";

export function Alternatives({ alternatives = [], recommendedCropName = "Recommended Crop" }) {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <Card className="border border-black/[0.06] bg-white rounded-3xl shadow-apple-sm">
      <CardHeader className="border-b border-black/[0.05] pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-extrabold text-[#1D1D1F]">
          Ranked Alternative Candidates
        </CardTitle>
        <span className="text-[11px] font-semibold text-[#86868B]">Top 4 Alternatives</span>
      </CardHeader>
      <CardContent className="space-y-3 pt-5 p-5">
        {alternatives.map((item, idx) => {
          const { crop, finalScore, financials, waterScore, soilScore } = item;

          return (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-black/[0.06] bg-[#FAF9F6]/60 hover:bg-white hover:shadow-apple-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#86868B]">#{idx + 2}</span>
                  <h4 className="text-sm font-extrabold text-[#1D1D1F]">{crop.name}</h4>
                  <Badge variant="secondary" className="text-[10px] rounded-full font-semibold">Score: {finalScore}/100</Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#86868B] font-medium">
                  <span>Net Return: <strong className="text-emerald-700">{formatCurrency(financials.profit)}</strong></span>
                  <span>Soil: <strong className="text-[#1D1D1F]">{soilScore}/100</strong></span>
                  <span>Water: <strong className="text-[#1D1D1F]">{waterScore}/100</strong></span>
                </div>
              </div>

              {/* Explainable contrast bullet */}
              <div className="text-xs bg-white p-3 rounded-2xl border border-black/[0.06] max-w-xs w-full md:w-auto">
                <div className="font-semibold text-[#1D1D1F] text-[11px] mb-0.5 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-[#86868B] shrink-0" />
                  <span>Why {recommendedCropName} ranked higher:</span>
                </div>
                <p className="text-[11px] text-[#86868B] leading-relaxed">
                  {waterScore < 70
                    ? `Higher water demand than currently available on farm.`
                    : financials.profit < (item.financials.profit || 0)
                    ? `Lower projected net return per acre.`
                    : `Slightly lower composite soil/weather suitability rating.`}
                </p>
              </div>

              <Link href={`/compare?crops=${encodeURIComponent(recommendedCropName)},${encodeURIComponent(crop.name)}`}>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-colors shadow-apple-sm"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Compare</span>
                </button>
              </Link>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
