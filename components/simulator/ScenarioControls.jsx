"use client";

import React from "react";
import { Sliders, RefreshCw, TrendingUp, CloudRain, Thermometer, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ScenarioControls({ scenarioParams, onChange, onReset }) {
  const { priceShiftPct = 0, rainfallShiftPct = 0, tempShiftOffset = 0, costShiftPct = 0 } = scenarioParams;

  return (
    <Card className="border-slate-200 shadow-card">
      <CardHeader className="bg-slate-50/60 border-b border-slate-100 py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
          <Sliders className="w-4 h-4 text-crop-600" />
          <span>Interactive Sensitivity Controls</span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onReset} className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 h-8 px-2">
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </Button>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Slider 1: Market Price Shift */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Market Price Variation</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${priceShiftPct > 0 ? "bg-emerald-100 text-emerald-800" : priceShiftPct < 0 ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-700"}`}>
              {priceShiftPct > 0 ? `+${priceShiftPct}%` : `${priceShiftPct}%`}
            </span>
          </div>
          <input
            type="range"
            min="-30"
            max="30"
            step="5"
            value={priceShiftPct}
            onChange={(e) => onChange({ ...scenarioParams, priceShiftPct: parseInt(e.target.value, 10) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-crop-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>-30% Drop</span>
            <span>Baseline</span>
            <span>+30% Surge</span>
          </div>
        </div>

        {/* Slider 2: Rainfall Variation */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5"><CloudRain className="w-3.5 h-3.5 text-sky-600" /> Rainfall Anomaly</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${rainfallShiftPct > 0 ? "bg-sky-100 text-sky-800" : rainfallShiftPct < 0 ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}>
              {rainfallShiftPct > 0 ? `+${rainfallShiftPct}%` : `${rainfallShiftPct}%`}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="10"
            value={rainfallShiftPct}
            onChange={(e) => onChange({ ...scenarioParams, rainfallShiftPct: parseInt(e.target.value, 10) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>-50% Drought</span>
            <span>Normal</span>
            <span>+50% Heavy Rain</span>
          </div>
        </div>

        {/* Slider 3: Temperature Offset */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-rose-500" /> Temperature Shift (°C)</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${tempShiftOffset > 0 ? "bg-rose-100 text-rose-800" : tempShiftOffset < 0 ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-700"}`}>
              {tempShiftOffset > 0 ? `+${tempShiftOffset}°C` : `${tempShiftOffset}°C`}
            </span>
          </div>
          <input
            type="range"
            min="-5"
            max="5"
            step="1"
            value={tempShiftOffset}
            onChange={(e) => onChange({ ...scenarioParams, tempShiftOffset: parseInt(e.target.value, 10) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>-5°C Cooler</span>
            <span>Current</span>
            <span>+5°C Warmer</span>
          </div>
        </div>

        {/* Slider 4: Cultivation Cost Shift */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-amber-600" /> Input Cost Variation</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${costShiftPct > 0 ? "bg-amber-100 text-amber-800" : costShiftPct < 0 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>
              {costShiftPct > 0 ? `+${costShiftPct}%` : `${costShiftPct}%`}
            </span>
          </div>
          <input
            type="range"
            min="-20"
            max="20"
            step="5"
            value={costShiftPct}
            onChange={(e) => onChange({ ...scenarioParams, costShiftPct: parseInt(e.target.value, 10) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>-20% Subsidized</span>
            <span>Standard</span>
            <span>+20% Expensive</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
