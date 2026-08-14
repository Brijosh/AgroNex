import React from "react";
import Link from "next/link";
import { 
  Sprout, ArrowRight, ShieldCheck, TrendingUp, CloudSun, Layers, 
  BarChart2, Sliders, CheckCircle2, MapPin, Database, Award 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="space-y-16 pb-16 bg-surface-canvas">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-crop-950 via-crop-900 to-slate-950 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8 border-b border-crop-800/40">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crop-800/60 border border-crop-700/60 text-emerald-300 text-xs font-semibold">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>AgroNex Crop Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none">
            Precision Agricultural Intelligence <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-300 via-crop-300 to-teal-200 bg-clip-text text-transparent">
              for Maximum Crop Yield & Profit
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            AgroNex evaluates soil compatibility, live weather data, and commodity market prices to deliver 100% transparent crop recommendations for your farm.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/onboarding">
              <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold flex items-center gap-2">
                <span>Start Free Farm Setup</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/onboarding?demo=true">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-slate-700 hover:bg-slate-800">
                View Kochi Sample Demo
              </Button>
            </Link>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto border-t border-slate-800/80">
            <div className="p-3 text-center">
              <div className="text-2xl font-black text-emerald-400">100% Free</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Open Source Data</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-black text-emerald-400">8 Soils</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Agronomic Matrix</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-black text-emerald-400">Live Weather</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Open-Meteo Feed</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-black text-emerald-400">Real-Time</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Market Volatility Index</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How AgroNex Intelligence Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Engineered around zero-cost open data and multi-factor decision math.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200 shadow-subtle hover:shadow-card transition-shadow">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-crop-50 text-crop-700 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Open Data Integration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connects to OpenStreetMap Nominatim for free geocoding, Open-Meteo for live weather forecasts, and ISRIC SoilGrids for soil classification.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-subtle hover:shadow-card transition-shadow">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-crop-50 text-crop-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Financial Profit Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates expected revenue, cultivation expense, and net profit per hectare tailored to your exact plot size.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-subtle hover:shadow-card transition-shadow">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-crop-50 text-crop-700 flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">What-If Scenario Simulator</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simulate price drops, droughts, or cost shifts in real time and view live dynamic rank shifts on interactive Recharts graphics.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-crop-900 to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-elevated flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black">Ready to Evaluate Your Farm?</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Get immediate crop recommendations, risk assessments, and financial forecasts.
            </p>
          </div>
          <Link href="/onboarding">
            <Button variant="primary" size="lg" className="font-bold shrink-0">
              Setup My Farm Plot
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
