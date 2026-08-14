"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BarChart2, ArrowLeft, Check, Sprout } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { REFERENCE_CROPS } from "@/data/crops";
import { formatCurrency, formatNumber } from "@/lib/utils/utils";

export default function ComparePage() {
  const [selectedCrops, setSelectedCrops] = useState(["Tomato", "Rice", "Maize", "Chilli"]);

  const availableCrops = REFERENCE_CROPS.map((c) => c.name);

  const toggleCrop = (name) => {
    if (selectedCrops.includes(name)) {
      if (selectedCrops.length > 2) {
        setSelectedCrops(selectedCrops.filter((c) => c !== name));
      }
    } else {
      if (selectedCrops.length < 5) {
        setSelectedCrops([...selectedCrops, name]);
      }
    }
  };

  const comparedData = selectedCrops.map((name) => {
    return REFERENCE_CROPS.find((c) => c.name === name) || REFERENCE_CROPS[0];
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-crop-800 bg-crop-50 px-2.5 py-0.5 rounded-md">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Multi-Crop Agronomic Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight mt-2">
            Side-by-Side Crop Comparison
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Compare key economics, water requirements, and risk factors across 2 to 5 crop varieties.</p>
        </div>

        <Link href="/analysis">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Analysis
          </Button>
        </Link>
      </div>

      {/* Selector Pills */}
      <Card className="border-zinc-200/90 shadow-ambient p-5 space-y-3">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
          Select Candidate Crops to Compare (2 to 5):
        </div>
        <div className="flex flex-wrap gap-2">
          {availableCrops.map((name) => {
            const isSelected = selectedCrops.includes(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => toggleCrop(name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-[0.98] ${
                  isSelected
                    ? "bg-crop-900 text-white shadow-sm ring-1 ring-crop-900"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-emerald-300" />}
                <span>{name}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Desktop Comparison Table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-200/90 shadow-ambient bg-white">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-zinc-50/70 border-b border-zinc-200/70">
              <th className="p-4 text-xs font-mono font-bold uppercase text-zinc-400 w-52">Metric / Crop</th>
              {comparedData.map((crop) => (
                <th key={crop.id} className="p-4 font-extrabold text-zinc-950 text-base">
                  <div>{crop.name}</div>
                  <div className="text-[11px] font-mono font-normal text-zinc-400">{crop.season} Season</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-xs">
            <tr>
              <td className="p-4 font-mono font-semibold text-zinc-500 bg-zinc-50/40">Market Reference Price</td>
              {comparedData.map((c) => (
                <td key={c.id} className="p-4 font-bold text-zinc-900 font-mono">₹{c.referenceMarketPrice} / kg</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-mono font-semibold text-zinc-500 bg-zinc-50/40">Avg Yield / Hectare</td>
              {comparedData.map((c) => (
                <td key={c.id} className="p-4 text-zinc-700 font-mono">{formatNumber(c.averageYieldPerHectare)} kg</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-mono font-semibold text-zinc-500 bg-zinc-50/40">Cultivation Cost / Ha</td>
              {comparedData.map((c) => (
                <td key={c.id} className="p-4 text-zinc-700 font-mono">{formatCurrency(c.cultivationCostPerHectare)}</td>
              ))}
            </tr>
            <tr className="bg-crop-50/40">
              <td className="p-4 font-mono font-bold text-crop-800">Est. Gross Revenue / Ha</td>
              {comparedData.map((c) => (
                <td key={c.id} className="p-4 font-bold text-zinc-900 font-mono">{formatCurrency(c.averageYieldPerHectare * c.referenceMarketPrice)}</td>
              ))}
            </tr>
            <tr className="bg-crop-100/60 font-black">
              <td className="p-4 font-mono font-bold text-crop-950">Est. Net Profit / Ha</td>
              {comparedData.map((c) => {
                const profit = c.averageYieldPerHectare * c.referenceMarketPrice - c.cultivationCostPerHectare;
                return (
                  <td key={c.id} className="p-4 text-crop-950 text-sm font-mono font-bold">{formatCurrency(profit)}</td>
                );
              })}
            </tr>
            <tr>
              <td className="p-4 font-mono font-semibold text-zinc-500 bg-zinc-50/40">Water Requirement</td>
              {comparedData.map((c) => (
                <td key={c.id} className="p-4">
                  <Badge variant={c.waterRequirement === "Very High" ? "danger" : c.waterRequirement === "High" ? "warning" : "success"}>
                    {c.waterRequirement}
                  </Badge>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-mono font-semibold text-zinc-500 bg-zinc-50/40">Duration</td>
              {comparedData.map((c) => (
                <td key={c.id} className="p-4 text-zinc-700 font-mono">{c.durationDays} Days</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-mono font-semibold text-zinc-500 bg-zinc-50/40">Market Volatility</td>
              {comparedData.map((c) => (
                <td key={c.id} className="p-4 text-zinc-700 font-mono">{c.marketVolatility}% Index</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Comparison Cards */}
      <div className="md:hidden space-y-4">
        {comparedData.map((c) => {
          const profit = c.averageYieldPerHectare * c.referenceMarketPrice - c.cultivationCostPerHectare;
          return (
            <Card key={c.id} className="p-4 space-y-2 border-zinc-200 shadow-ambient">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <h3 className="font-extrabold text-base text-zinc-950">{c.name}</h3>
                <Badge variant="success">{c.waterRequirement} Water</Badge>
              </div>
              <div className="text-xs space-y-1 text-zinc-600 pt-1 font-mono">
                <div className="flex justify-between"><span>Price:</span> <strong className="text-zinc-900">₹{c.referenceMarketPrice}/kg</strong></div>
                <div className="flex justify-between"><span>Yield:</span> <strong className="text-zinc-900">{formatNumber(c.averageYieldPerHectare)} kg/ha</strong></div>
                <div className="flex justify-between"><span>Cost:</span> <strong className="text-zinc-900">{formatCurrency(c.cultivationCostPerHectare)}</strong></div>
                <div className="flex justify-between text-crop-950 font-bold pt-1 border-t border-zinc-100">
                  <span>Net Profit:</span> <strong className="text-sm font-sans">{formatCurrency(profit)}</strong>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
