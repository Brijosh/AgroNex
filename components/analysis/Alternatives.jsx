import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils/utils";

export function Alternatives({ alternatives = [], recommendedCropName = "Recommended Crop" }) {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <Card className="border-zinc-200/90 shadow-ambient">
      <CardHeader className="bg-zinc-50/50 pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm md:text-base font-extrabold text-zinc-950">
          Ranked Alternative Candidates
        </CardTitle>
        <span className="text-[11px] font-mono text-zinc-400">Top 4 Alternatives</span>
      </CardHeader>
      <CardContent className="space-y-3 pt-5">
        {alternatives.map((item, idx) => {
          const { crop, finalScore, financials, waterScore, soilScore } = item;

          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-zinc-200/80 bg-white hover:border-zinc-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-zinc-400">#{idx + 2}</span>
                  <h4 className="text-sm font-bold text-zinc-950">{crop.name}</h4>
                  <Badge variant="neutral" className="text-[10px]">Score: {finalScore}/100</Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 font-mono">
                  <span>Net Return: <strong className="text-zinc-900 font-sans">{formatCurrency(financials.profit)}</strong></span>
                  <span>Soil: <strong>{soilScore}/100</strong></span>
                  <span>Water: <strong>{waterScore}/100</strong></span>
                </div>
              </div>

              {/* Explainable contrast bullet */}
              <div className="text-xs bg-zinc-50 p-3 rounded-xl border border-zinc-100 max-w-sm w-full md:w-auto">
                <div className="font-semibold text-zinc-800 text-[11px] mb-0.5 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>Why {recommendedCropName} ranked higher:</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  {waterScore < 70
                    ? `Higher water demand than currently available on farm.`
                    : financials.profit < (item.financials.profit || 0)
                    ? `Lower projected net return per acre.`
                    : `Slightly lower composite soil/weather suitability rating.`}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

