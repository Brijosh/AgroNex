"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Sprout, RefreshCw, BarChart2, Sliders, ShieldAlert, CheckCircle2, 
  HelpCircle, ChevronDown, ChevronUp, MapPin, Layers, Droplet, CloudSun, TrendingUp 
} from "lucide-react";
import { RecommendationCard } from "@/components/analysis/RecommendationCard";
import { ScoreBreakdown } from "@/components/analysis/ScoreBreakdown";
import { RiskPanel } from "@/components/analysis/RiskPanel";
import { Alternatives } from "@/components/analysis/Alternatives";
import { ProfitChart } from "@/components/charts/ProfitChart";
import { ScoreChart } from "@/components/charts/ScoreChart";
import { RiskChart } from "@/components/charts/RiskChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function AnalysisContent() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [showAssumptions, setShowAssumptions] = useState(false);

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
    userCrops: searchParams.get("crops") ? searchParams.get("crops").split(",") : [],
  };

  useEffect(() => {
    async function runAnalysis() {
      setLoading(true);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(farmData),
        });

        const json = await res.json();
        if (json.success && json.data) {
          setAnalysis(json.data);

          // 1. Dual-Layer Storage: Persist to Browser localStorage for Vercel Serverless Reliability
          try {
            if (typeof window !== "undefined" && window.localStorage) {
              // Store Farm Plot in LocalStorage
              const existingFarms = JSON.parse(localStorage.getItem("agronex_farms") || "[]");
              const newFarm = {
                id: `farm-${Date.now()}`,
                name: `${farmData.locationName} Plot (${farmData.area} ${farmData.areaUnit})`,
                ...farmData,
                createdAt: new Date().toISOString(),
              };
              const updatedFarms = [newFarm, ...existingFarms.filter((f) => f.locationName !== farmData.locationName)];
              localStorage.setItem("agronex_farms", JSON.stringify(updatedFarms));

              // Store History Run in LocalStorage
              if (json.data.recommendedCrop) {
                const rec = json.data.recommendedCrop;
                const existingHistory = JSON.parse(localStorage.getItem("agronex_history") || "[]");
                const newHistory = {
                  id: `run-${Date.now()}`,
                  farmId: newFarm.id,
                  recommendedCropName: rec.crop.name,
                  finalScore: rec.finalScore,
                  confidenceScore: json.data.confidenceScore || 85,
                  estimatedRevenue: rec.financials.revenue,
                  estimatedCost: rec.financials.cost,
                  estimatedProfit: rec.financials.profit,
                  createdAt: new Date().toISOString(),
                  farm: newFarm,
                };
                const updatedHistory = [newHistory, ...existingHistory];
                localStorage.setItem("agronex_history", JSON.stringify(updatedHistory));
              }
            }
          } catch (lsErr) {
            console.warn("LocalStorage save warning:", lsErr);
          }

          // 2. Persist to Prisma SQLite Backend API
          try {
            const farmRes = await fetch("/api/farms", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(farmData),
            });
            const farmJson = await farmRes.json();
            const farmId = farmJson.data?.id;

            if (json.data.recommendedCrop) {
              const rec = json.data.recommendedCrop;
              await fetch("/api/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  farmId: farmId || null,
                  recommendedCropName: rec.crop.name,
                  finalScore: rec.finalScore,
                  confidenceScore: json.data.confidenceScore || 85,
                  estimatedRevenue: rec.financials.revenue,
                  estimatedCost: rec.financials.cost,
                  estimatedProfit: rec.financials.profit,
                }),
              });
            }
          } catch (persistErr) {
            console.warn("SQLite API save warning:", persistErr);
          }
        }
      } catch (err) {
        console.warn("Analysis API fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    runAnalysis();
  }, [searchParams.toString()]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold text-[#1D1D1F]">Evaluating AgroNex Crop Intelligence Engine...</p>
        <p className="text-xs text-[#86868B]">Fetching Open-Meteo live weather, soil compatibility, and market profitability</p>
      </div>
    );
  }

  if (!analysis || !analysis.recommendedCrop) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-rose-600 font-bold text-lg">No Analysis Available</div>
        <p className="text-xs text-[#86868B]">We couldn&apos;t evaluate crops for the given parameters. Please try again.</p>
        <Link href="/onboarding"><Button variant="primary">Back to Farm Setup</Button></Link>
      </div>
    );
  }

  const rec = analysis.recommendedCrop;
  const weather = analysis.weatherSummary || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Live Data Badge Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <Sprout className="w-4 h-4" />
            <span>AgroNex Farm Intelligence Report</span>
            {weather.isLive && (
              <Badge variant="success" className="text-[10px] py-0 px-2 flex items-center gap-1 rounded-full">
                <CloudSun className="w-3 h-3" /> Live Open-Meteo Weather
              </Badge>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            Crop Recommendation & Analysis
          </h1>
          <p className="text-xs text-[#86868B] mt-0.5 flex items-center gap-2 flex-wrap font-medium">
            <span>Farm: {farmData.locationName}</span>
            <span>•</span>
            <span>{farmData.area} {farmData.areaUnit}</span>
            <span>•</span>
            <span>{farmData.soilType} Soil</span>
            <span>•</span>
            <span>{weather.temperature}°C ({weather.weatherCondition})</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/onboarding">
            <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold border-black/[0.1]">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Analyze Again
            </Button>
          </Link>
          <Link href={`/compare?crops=${rec.crop.name},Rice,Maize,Tomato`}>
            <Button variant="secondary" size="sm" className="rounded-full text-xs font-semibold bg-white border border-black/[0.08]">
              <BarChart2 className="w-3.5 h-3.5 mr-1" /> Compare Crops
            </Button>
          </Link>
          <Link href={`/simulator?area=${farmData.area}&water=${farmData.waterAvailability}&soil=${farmData.soilType}`}>
            <Button size="sm" className="rounded-full text-xs font-semibold bg-[#1D1D1F] text-white">
              <Sliders className="w-3.5 h-3.5 mr-1 text-emerald-400" /> What-If Simulator
            </Button>
          </Link>
        </div>
      </div>

      <RecommendationCard recommendation={rec} confidenceScore={analysis.confidenceScore} />

      {/* Main Financial & Score Graphics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Financial Comparison Chart & Reasons */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-black/[0.06] bg-white rounded-3xl shadow-apple-sm">
            <CardHeader className="border-b border-black/[0.05] pb-3">
              <CardTitle className="text-base font-extrabold flex items-center gap-2 text-[#1D1D1F]">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Financial Returns Comparison (Recharts)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ProfitChart evaluations={analysis.allEvaluations} />
            </CardContent>
          </Card>

          <Card className="border border-black/[0.06] bg-white rounded-3xl shadow-apple-sm">
            <CardHeader className="border-b border-black/[0.05] pb-3">
              <CardTitle className="text-base font-extrabold flex items-center gap-2 text-[#1D1D1F]">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Why Was {rec.crop.name} Recommended?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <p className="text-xs text-[#1D1D1F] leading-relaxed font-semibold">
                {rec.crop.name} achieved the top composite recommendation score of <strong>{rec.finalScore}/100</strong> across evaluated criteria.
              </p>

              <div className="space-y-2">
                {[
                  `High Soil Compatibility: ${rec.crop.name} matches your ${farmData.soilType} soil with a ${rec.soilScore}/100 suitability rating.`,
                  `Strong Net Profitability: Estimated net return of ₹${rec.financials.profit.toLocaleString('en-IN')} for your ${farmData.area} ${farmData.areaUnit} farm.`,
                  `Favorable Live Weather Profile: Live Open-Meteo temperature (${weather.temperature}°C) and seasonal rainfall (~${weather.rainfall}mm) fall within optimal growth range.`,
                  `Water Requirement Alignment: ${rec.crop.waterRequirement} water requirement fits your ${farmData.waterAvailability} water availability with ${farmData.irrigationType} irrigation.`,
                ].map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#1D1D1F] bg-[#F5F5F7] p-3.5 rounded-2xl border border-black/[0.04] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              {weather.forecast && (
                <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 text-xs text-sky-950 space-y-1 font-medium">
                  <strong>7-Day Live Forecast (Open-Meteo API):</strong>
                  <p>{weather.forecast}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Alternatives alternatives={analysis.alternatives} recommendedCropName={rec.crop.name} />
        </div>

        {/* Right Col: Score Radar Chart & Progress Bars */}
        <div className="space-y-6">
          <Card className="border border-black/[0.06] bg-white rounded-3xl shadow-apple-sm">
            <CardHeader className="border-b border-black/[0.05] pb-3">
              <CardTitle className="text-base font-extrabold flex items-center gap-2 text-[#1D1D1F]">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>Multi-Factor Radar Diagram</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScoreChart componentScores={rec.componentScores} cropName={rec.crop.name} />
            </CardContent>
          </Card>

          <ScoreBreakdown componentScores={rec.componentScores} />
        </div>
      </div>

      {/* Risk Panel & Risk Graphic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RiskPanel riskAssessment={rec.riskAssessment} />
        </div>
        <div>
          <Card className="border border-black/[0.06] bg-white rounded-3xl shadow-apple-sm">
            <CardHeader className="border-b border-black/[0.05] pb-3">
              <CardTitle className="text-base font-extrabold flex items-center gap-2 text-[#1D1D1F]">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>Risk Severity Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <RiskChart riskAssessment={rec.riskAssessment} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data & Assumptions Accordion */}
      <Card className="border border-black/[0.06] bg-white rounded-3xl shadow-apple-sm">
        <CardHeader 
          className="cursor-pointer hover:bg-slate-50 transition-colors flex flex-row items-center justify-between p-5"
          onClick={() => setShowAssumptions(!showAssumptions)}
        >
          <CardTitle className="text-xs font-bold flex items-center gap-2 text-[#1D1D1F]">
            <HelpCircle className="w-4 h-4 text-[#86868B]" />
            <span>Open-Source Data Sources & Calculation Assumptions</span>
          </CardTitle>
          {showAssumptions ? <ChevronUp className="w-4 h-4 text-[#86868B]" /> : <ChevronDown className="w-4 h-4 text-[#86868B]" />}
        </CardHeader>
        {showAssumptions && (
          <CardContent className="text-xs text-[#86868B] space-y-3 pt-3 border-t border-black/[0.05] p-5 font-normal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Location Geocoding:</strong> OpenStreetMap Nominatim API (Open Source).
              </div>
              <div>
                <strong>Weather Data Source:</strong> Open-Meteo API (`{weather.sourceType}`).
              </div>
              <div>
                <strong>Soil Classification:</strong> ISRIC SoilGrids REST API / particle fraction model.
              </div>
              <div>
                <strong>Calculation Date:</strong> {new Date(analysis.evaluatedAt).toLocaleDateString()}
              </div>
            </div>
            <p className="text-[11px] text-[#86868B] italic pt-2">
              Note: Confidence score ({analysis.confidenceScore}%) reflects data completeness, not a guarantee of crop yield outcome.
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <div className="bg-[#F5F5F7] min-h-screen">
      <Suspense fallback={<div className="text-center py-20 text-xs font-semibold text-[#86868B]">Loading AgroNex Analysis...</div>}>
        <AnalysisContent />
      </Suspense>
    </div>
  );
}
