"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Sliders, ArrowLeft, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Sparkles, RefreshCw, Sprout, ShieldAlert, Check 
} from "lucide-react";
import { ScenarioControls } from "@/components/simulator/ScenarioControls";
import { ProfitChart } from "@/components/charts/ProfitChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { runScenarioSimulation } from "@/lib/engine/simulation-engine";
import { evaluateCropIntelligence } from "@/lib/engine/crop-engine";
import { REFERENCE_CROPS } from "@/data/crops";
import { REFERENCE_MARKET_PRICES } from "@/data/market-prices";
import { formatCurrency } from "@/lib/utils/utils";

function SimulatorContent() {
  const searchParams = useSearchParams();

  const farmData = {
    locationName: searchParams.get("location") || "Kochi, Kerala",
    latitude: parseFloat(searchParams.get("lat")) || 9.9312,
    longitude: parseFloat(searchParams.get("lon")) || 76.2673,
    area: parseFloat(searchParams.get("area")) || 2,
    areaUnit: searchParams.get("areaUnit") || "acres",
    soilType: searchParams.get("soil") || "Loamy",
    waterAvailability: searchParams.get("water") || "Moderate",
    irrigationType: searchParams.get("irrigation") || "Drip",
    season: searchParams.get("season") || "Kharif",
  };

  const [scenarioParams, setScenarioParams] = useState({
    priceShiftPct: 0,
    rainfallShiftPct: 0,
    tempShiftOffset: 0,
    costShiftPct: 0,
  });

  const [baselineAnalysis, setBaselineAnalysis] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Compute baseline analysis on load
  useEffect(() => {
    async function loadBaseline() {
      try {
        const weatherData = { temperature: 28, rainfall: 800 };
        const base = evaluateCropIntelligence(farmData, REFERENCE_CROPS, weatherData, REFERENCE_MARKET_PRICES);
        setBaselineAnalysis(base);
        const sim = runScenarioSimulation(base, scenarioParams);
        setSimulationResult(sim);
      } catch (err) {
        console.warn("Simulator baseline error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBaseline();
  }, [searchParams]);

  // Recalculate simulation whenever sliders change
  useEffect(() => {
    if (baselineAnalysis) {
      const sim = runScenarioSimulation(baselineAnalysis, scenarioParams);
      setSimulationResult(sim);
    }
  }, [scenarioParams, baselineAnalysis]);

  const handleReset = () => {
    setScenarioParams({
      priceShiftPct: 0,
      rainfallShiftPct: 0,
      tempShiftOffset: 0,
      costShiftPct: 0,
    });
  };

  if (loading || !simulationResult) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-crop-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-slate-700">Loading What-If Scenario Lab...</p>
      </div>
    );
  }

  const rec = simulationResult.recommendedCrop;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-crop-700 uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Sensitivity & Scenario Lab</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            What-If Scenario Simulator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Test how market price swings, droughts, and cost increases affect your crop profits and rankings.
          </p>
        </div>

        <Link href="/analysis">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Analysis
          </Button>
        </Link>
      </div>

      {/* Main Grid: Controls vs Chart & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Sliders */}
        <div>
          <ScenarioControls
            scenarioParams={scenarioParams}
            onChange={setScenarioParams}
            onReset={handleReset}
          />
        </div>

        {/* Right 2 Cols: Real-Time Recharts & Simulated Ranking Cards */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Simulated Financial Returns (Recharts)</span>
              </CardTitle>
              <Badge variant="success" className="text-[10px]">Real-Time Updated</Badge>
            </CardHeader>
            <CardContent className="p-4">
              <ProfitChart evaluations={simulationResult.allEvaluations} />
            </CardContent>
          </Card>

          {/* Top Recommendation Banner under Simulated Conditions */}
          <Card className="bg-gradient-to-r from-crop-900 via-crop-800 to-crop-900 text-white p-6 rounded-2xl shadow-elevated">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Top Choice Under Simulated Conditions
                </div>
                <h2 className="text-2xl font-black mt-1 text-white">{rec.crop.name}</h2>
                <p className="text-xs text-slate-200 mt-1">
                  Composite Score: <strong>{rec.finalScore}/100</strong> • Net Return: <strong>{formatCurrency(rec.financials.profit)}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {rec.rankShift !== 0 && (
                  <Badge variant={rec.rankShift > 0 ? "success" : "warning"} className="text-xs py-1 px-3">
                    {rec.rankShift > 0 ? `▲ Moved up +${rec.rankShift} places` : `▼ Dropped ${rec.rankShift} places`}
                  </Badge>
                )}
                {rec.profitDelta !== 0 && (
                  <Badge variant={rec.profitDelta > 0 ? "success" : "danger"} className="text-xs py-1 px-3">
                    {rec.profitDelta > 0 ? `+${formatCurrency(rec.profitDelta)}` : formatCurrency(rec.profitDelta)}
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          {/* Simulated Rankings List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Simulated Candidate Crop Rankings</h3>
            <div className="space-y-2">
              {simulationResult.allEvaluations.slice(0, 5).map((item, idx) => {
                const rank = idx + 1;
                return (
                  <Card key={item.crop.id} className="p-4 flex items-center justify-between hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                        rank === 1 ? "bg-crop-700 text-white" : "bg-slate-100 text-slate-700"
                      }`}>
                        #{rank}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{item.crop.name}</div>
                        <div className="text-xs text-slate-500">Duration: {item.crop.durationDays} Days • {item.crop.season}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Net Profit</span>
                        <span className="font-bold text-slate-900">{formatCurrency(item.financials.profit)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Score</span>
                        <span className="font-bold text-crop-800">{item.finalScore}/100</span>
                      </div>
                      {item.profitDelta !== 0 && (
                        <div className={`font-bold flex items-center text-[11px] ${item.profitDelta > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {item.profitDelta > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          {formatCurrency(Math.abs(item.profitDelta))}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <div className="bg-surface-light min-h-screen">
      <Suspense fallback={<div className="text-center py-20 text-sm text-slate-500">Loading Simulator...</div>}>
        <SimulatorContent />
      </Suspense>
    </div>
  );
}
