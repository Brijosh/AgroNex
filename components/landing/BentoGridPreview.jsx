"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Layers, CloudSun, TrendingUp, Sliders, ShieldAlert, 
  MapPin, Check, Sparkles, Sprout, ArrowRight, Search, Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BentoGridPreview() {
  const [tickerIndex, setTickerIndex] = useState(0);
  const promptExamples = [
    "5 acres red soil Ludhiana Rabi season...",
    "2 acres loamy Kochi drip irrigation...",
    "10 hectares black soil Nagpur summer...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % promptExamples.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Open-Meteo Weather Tile */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] space-y-4">
        <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
          <CloudSun className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-extrabold text-zinc-950">Live Weather Forecasting</h4>
            <Badge variant="info" className="text-[10px]">Open-Meteo</Badge>
          </div>
          <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
            Pulls hourly temperature, rainfall deficits, and humidity indices based on GPS coordinates.
          </p>
        </div>
        <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 font-mono text-xs text-zinc-700 flex items-center justify-between">
          <span>Regional Temp: <strong>28.4°C</strong></span>
          <span className="text-emerald-700 font-bold">Optimal Bounds</span>
        </div>
      </div>

      {/* 2. ISRIC SoilGrids Physical Matrix */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] space-y-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-100">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-extrabold text-zinc-950">Soil Physical Classification</h4>
            <Badge variant="warning" className="text-[10px]">SoilGrids 250m</Badge>
          </div>
          <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
            Sand, silt, and clay particle fractions classified into USDA soil texture bounds.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-center">
          <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100">
            <div className="text-zinc-400 text-[10px]">Sand</div>
            <div className="font-bold text-zinc-900">42%</div>
          </div>
          <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100">
            <div className="text-zinc-400 text-[10px]">Silt</div>
            <div className="font-bold text-zinc-900">38%</div>
          </div>
          <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100">
            <div className="text-zinc-400 text-[10px]">Clay</div>
            <div className="font-bold text-zinc-900">20%</div>
          </div>
        </div>
      </div>

      {/* 3. Real-Time What-If Simulation */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] space-y-4">
        <div className="w-10 h-10 rounded-2xl bg-crop-50 text-crop-800 flex items-center justify-center border border-crop-100">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-extrabold text-zinc-950">Interactive What-If Simulation</h4>
            <Badge variant="forest" className="text-[10px]">Dynamic</Badge>
          </div>
          <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
            Adjust water table stress, acreage expansions, and irrigation to observe instant score shifts.
          </p>
        </div>
        <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500">Acreage Delta:</span>
          <span className="text-crop-900 font-bold">+15.4% Est Return</span>
        </div>
      </div>
    </div>
  );
}
