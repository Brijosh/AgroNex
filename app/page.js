import React from "react";
import Link from "next/link";
import { 
  Sprout, ArrowRight, ShieldCheck, TrendingUp, CloudSun, Layers, 
  BarChart2, Sliders, CheckCircle2, MapPin, Database, Award 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="space-y-16 pb-24 bg-[#F5F5F7]">
      {/* Apple-style Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold tracking-tight shadow-apple-sm">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>AgroNex Decision Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#1D1D1F] leading-[1.08]">
            Precision Agricultural <br className="hidden sm:inline" />
            <span className="text-emerald-600">
              Intelligence.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#86868B] font-normal leading-relaxed tracking-tight">
            AgroNex evaluates soil compatibility, live Open-Meteo weather data, and commodity market prices to deliver transparent crop recommendations for your farm.
          </p>

          {/* Apple Pill Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link href="/onboarding">
              <Button size="lg" className="w-full sm:w-auto font-semibold flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1D1D1F] hover:bg-black text-white rounded-full shadow-apple-md transition-all hover:scale-[1.02]">
                <span>Start Free Farm Setup</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Button>
            </Link>
            <Link href="/onboarding?demo=true">
              <button
                type="button"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#1D1D1F] font-semibold text-sm border border-black/[0.08] shadow-apple-sm transition-all hover:scale-[1.02]"
              >
                View Kochi Sample Demo
              </button>
            </Link>
          </div>

          {/* Apple Stat Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
            <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border border-black/[0.05] shadow-apple-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F]">100% Free</div>
              <div className="text-[11px] text-[#86868B] font-medium uppercase tracking-wider mt-1">Open Source Data</div>
            </div>
            <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border border-black/[0.05] shadow-apple-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F]">8 Soils</div>
              <div className="text-[11px] text-[#86868B] font-medium uppercase tracking-wider mt-1">Agronomic Matrix</div>
            </div>
            <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border border-black/[0.05] shadow-apple-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">Live Weather</div>
              <div className="text-[11px] text-[#86868B] font-medium uppercase tracking-wider mt-1">Open-Meteo Feed</div>
            </div>
            <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border border-black/[0.05] shadow-apple-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F]">Real-Time</div>
              <div className="text-[11px] text-[#86868B] font-medium uppercase tracking-wider mt-1">Market Volatility Index</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#1D1D1F] tracking-tight">
            How AgroNex Intelligence Works
          </h2>
          <p className="text-sm text-[#86868B] font-medium">
            Engineered around open data APIs and multi-factor decision math.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-black/[0.06] bg-white shadow-apple-sm hover:shadow-apple-md transition-all duration-300 rounded-3xl p-2">
            <CardContent className="p-6 space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-[#1D1D1F]">Open Data Integration</h3>
              <p className="text-xs text-[#86868B] leading-relaxed font-normal">
                Connects to OpenStreetMap Nominatim for free geocoding, Open-Meteo for live weather forecasts, and ISRIC SoilGrids for soil classification.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-black/[0.06] bg-white shadow-apple-sm hover:shadow-apple-md transition-all duration-300 rounded-3xl p-2">
            <CardContent className="p-6 space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-[#1D1D1F]">Financial Profit Engine</h3>
              <p className="text-xs text-[#86868B] leading-relaxed font-normal">
                Calculates expected revenue, cultivation expense, and net profit per hectare tailored to your exact plot size.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-black/[0.06] bg-white shadow-apple-sm hover:shadow-apple-md transition-all duration-300 rounded-3xl p-2">
            <CardContent className="p-6 space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-[#1D1D1F]">What-If Scenario Simulator</h3>
              <p className="text-xs text-[#86868B] leading-relaxed font-normal">
                Simulate price drops, droughts, or cost shifts in real time and view live dynamic rank shifts on interactive Recharts graphics.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Apple Dark Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-[#1D1D1F] text-white rounded-4xl p-8 md:p-12 shadow-apple-lg border border-black/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to Evaluate Your Farm?</h2>
            <p className="text-xs sm:text-sm text-[#86868B] font-normal">
              Get immediate crop recommendations, risk assessments, and financial forecasts.
            </p>
          </div>
          <Link href="/onboarding">
            <Button size="lg" className="font-semibold shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-full shadow-apple-sm transition-all hover:scale-[1.02]">
              Setup My Farm Plot
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
