import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CloudRain, TrendingDown, Bug } from "lucide-react";

export function RiskPanel({ riskAssessment }) {
  if (!riskAssessment) return null;

  const getVariant = (severity) => {
    if (severity === "Low") return "success";
    if (severity === "Moderate") return "warning";
    return "danger";
  };

  const risks = [
    {
      title: "Climate & Weather",
      severity: riskAssessment.weatherRisk?.severity || "Moderate",
      score: riskAssessment.weatherRisk?.score || 35,
      icon: CloudRain,
      desc: "Evaluates unseasonal rainfall deficits, humidity, and temperature tolerance extremes.",
    },
    {
      title: "Market Volatility",
      severity: riskAssessment.marketRisk?.severity || "Low",
      score: riskAssessment.marketRisk?.score || 25,
      icon: TrendingDown,
      desc: "Evaluates wholesale price fluctuations, demand stability, and historical price risk.",
    },
    {
      title: "Cultivation & Disease",
      severity: riskAssessment.cultivationRisk?.severity || "Moderate",
      score: riskAssessment.cultivationRisk?.score || 40,
      icon: Bug,
      desc: "Evaluates water sensitivity deficits and common agronomic disease vulnerabilities.",
    },
  ];

  return (
    <Card className="border-zinc-200/90 shadow-ambient">
      <CardHeader className="bg-zinc-50/50 pb-4">
        <CardTitle className="flex items-center justify-between text-sm md:text-base font-extrabold text-zinc-950">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Risk Factor Assessment</span>
          </div>
          <Badge variant={getVariant(riskAssessment.overallSeverity)}>
            {riskAssessment.overallSeverity} Overall Risk
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-5">
        {risks.map((risk, i) => {
          const Icon = risk.icon;
          return (
            <div key={i} className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs text-zinc-900">
                  <Icon className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{risk.title}</span>
                </div>
                <Badge variant={getVariant(risk.severity)} className="text-[10px]">{risk.severity}</Badge>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">{risk.desc}</p>
              <div className="text-[10px] font-mono text-zinc-400 pt-1 border-t border-zinc-200/50">
                Risk Index: <span className="font-bold text-zinc-700">{risk.score}/100</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

