"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { BarChart2, ArrowLeft, Check, Sprout, Search, Plus, Sparkles, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { REFERENCE_CROPS } from "@/data/crops";
import { formatCurrency, formatNumber } from "@/lib/utils/utils";

export default function ComparePage() {
  const [allCrops, setAllCrops] = useState(REFERENCE_CROPS);
  const [selectedCrops, setSelectedCrops] = useState(["Tomato", "Rice", "Maize", "Chilli", "Banana", "Dragonfruit"]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load all available crops dynamically from API
  useEffect(() => {
    fetch("/api/crops")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          // Merge with reference crops
          const map = new Map();
          [...REFERENCE_CROPS, ...json.data].forEach((c) => {
            if (c && c.name) map.set(c.name.trim().toLowerCase(), c);
          });
          setAllCrops(Array.from(map.values()));
        }
      })
      .catch((err) => console.warn("Failed to load crops for comparison:", err));
  }, []);

  const filteredAvailableCrops = useMemo(() => {
    if (!searchQuery.trim()) return allCrops;
    const q = searchQuery.toLowerCase().trim();
    return allCrops.filter((c) => c.name.toLowerCase().includes(q));
  }, [allCrops, searchQuery]);

  const toggleCrop = (name) => {
    if (selectedCrops.includes(name)) {
      if (selectedCrops.length > 2) {
        setSelectedCrops(selectedCrops.filter((c) => c !== name));
      }
    } else {
      if (selectedCrops.length < 8) {
        setSelectedCrops([...selectedCrops, name]);
      }
    }
  };

  const handleSelectPreset = (presetNames) => {
    const validNames = presetNames.filter((name) =>
      allCrops.some((c) => c.name.toLowerCase() === name.toLowerCase())
    );
    if (validNames.length >= 2) {
      setSelectedCrops(validNames.slice(0, 8));
    }
  };

  const comparedData = useMemo(() => {
    return selectedCrops.map((name) => {
      const found = allCrops.find((c) => c.name.toLowerCase() === name.toLowerCase());
      if (found) return found;
      return {
        id: name,
        name: name,
        season: "Kharif",
        referenceMarketPrice: 30,
        averageYieldPerHectare: 4000,
        cultivationCostPerHectare: 40000,
        waterRequirement: "Moderate",
        durationDays: 110,
        marketVolatility: 30,
      };
    });
  }, [selectedCrops, allCrops]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#F5F5F7] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Multi-Crop Agronomic Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight mt-2">
            Side-by-Side Crop & Fruit Comparison
          </h1>
          <p className="text-xs text-[#86868B] mt-1 font-medium">Compare economics, yield benchmarks, water requirements, and risk indices for up to 8 crops.</p>
        </div>

        <Link href="/analysis">
          <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold border-black/[0.1]">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Report
          </Button>
        </Link>
      </div>

      {/* Selector Card & Quick Search */}
      <Card className="border border-black/[0.06] shadow-apple-sm p-6 space-y-4 bg-white rounded-3xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#1D1D1F] block">
              Select Candidate Crops to Compare ({selectedCrops.length} / 8 Selected):
            </span>
            <p className="text-[11px] text-[#86868B] font-medium">Click any crop pill to add or remove from comparison matrix.</p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleSelectPreset(["Dragonfruit", "Mango", "Papaya", "Watermelon", "Strawberry", "Guava"])}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/60 hover:bg-emerald-100 transition-colors"
            >
              + Fruits Suite
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset(["Rice", "Wheat", "Maize", "Groundnut", "Millet", "Potato"])}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-[#1D1D1F] hover:bg-slate-200 transition-colors"
            >
              + Grains Suite
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset(["Tomato", "Chilli", "Okra", "Cucumber", "Onion", "Potato"])}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-[#1D1D1F] hover:bg-slate-200 transition-colors"
            >
              + Veggies Suite
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search crops or fruits (e.g. Dragonfruit, Mango, Rice)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-black/[0.08] text-xs font-semibold focus:ring-2 focus:ring-emerald-600 bg-[#F5F5F7]/50"
          />
        </div>

        {/* Crop Pills Grid */}
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
          {filteredAvailableCrops.map((c) => {
            const isSelected = selectedCrops.some((name) => name.toLowerCase() === c.name.toLowerCase());
            return (
              <button
                key={c.id || c.name}
                type="button"
                onClick={() => toggleCrop(c.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-[0.98] ${
                  isSelected
                    ? "bg-[#1D1D1F] text-white shadow-apple-sm"
                    : "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-slate-200/80 border border-black/[0.04]"
                }`}
              >
                <Sprout className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-400" : "text-[#86868B]"}`} />
                <span>{c.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Side-by-Side Desktop Comparison Table */}
      <div className="hidden md:block overflow-x-auto rounded-3xl border border-black/[0.06] shadow-apple-md bg-white">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#FAF9F6] border-b border-black/[0.05]">
              <th className="p-4 font-extrabold uppercase text-[#86868B] text-[11px] w-52 tracking-wider">Metrics / Criteria</th>
              {comparedData.map((crop) => (
                <th key={crop.id || crop.name} className="p-4 font-extrabold text-[#1D1D1F] text-sm">
                  <div className="flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{crop.name}</span>
                  </div>
                  <div className="text-[10px] font-normal text-[#86868B] mt-0.5">{crop.season} Season</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04]">
            <tr>
              <td className="p-4 font-bold text-[#86868B] bg-[#FAF9F6]/50">Market Price (₹/kg)</td>
              {comparedData.map((c) => (
                <td key={c.id || c.name} className="p-4 font-extrabold text-[#1D1D1F]">₹{c.referenceMarketPrice} / kg</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-[#86868B] bg-[#FAF9F6]/50">Avg Yield / Hectare</td>
              {comparedData.map((c) => (
                <td key={c.id || c.name} className="p-4 text-[#1D1D1F] font-semibold">{formatNumber(c.averageYieldPerHectare)} kg</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-[#86868B] bg-[#FAF9F6]/50">Cultivation Cost / Ha</td>
              {comparedData.map((c) => (
                <td key={c.id || c.name} className="p-4 text-[#1D1D1F] font-semibold">{formatCurrency(c.cultivationCostPerHectare)}</td>
              ))}
            </tr>
            <tr className="bg-emerald-50/40">
              <td className="p-4 font-extrabold text-emerald-900">Est. Gross Revenue / Ha</td>
              {comparedData.map((c) => (
                <td key={c.id || c.name} className="p-4 font-bold text-[#1D1D1F]">{formatCurrency(c.averageYieldPerHectare * c.referenceMarketPrice)}</td>
              ))}
            </tr>
            <tr className="bg-emerald-100/60 font-black">
              <td className="p-4 font-extrabold text-emerald-950">Est. Net Profit / Ha</td>
              {comparedData.map((c) => {
                const profit = c.averageYieldPerHectare * c.referenceMarketPrice - c.cultivationCostPerHectare;
                return (
                  <td key={c.id || c.name} className="p-4 text-emerald-950 font-extrabold text-sm">{formatCurrency(profit)}</td>
                );
              })}
            </tr>
            <tr>
              <td className="p-4 font-bold text-[#86868B] bg-[#FAF9F6]/50">Water Need</td>
              {comparedData.map((c) => (
                <td key={c.id || c.name} className="p-4">
                  <Badge variant={c.waterRequirement === "Very High" ? "danger" : c.waterRequirement === "High" ? "warning" : "success"} className="rounded-full text-[10px]">
                    {c.waterRequirement}
                  </Badge>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-[#86868B] bg-[#FAF9F6]/50">Duration (Days)</td>
              {comparedData.map((c) => (
                <td key={c.id || c.name} className="p-4 text-[#1D1D1F] font-semibold">{c.durationDays} Days</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-[#86868B] bg-[#FAF9F6]/50">Market Volatility</td>
              {comparedData.map((c) => (
                <td key={c.id || c.name} className="p-4 text-[#1D1D1F] font-semibold">{c.marketVolatility}% Index</td>
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
            <Card key={c.id || c.name} className="p-5 space-y-3 border border-black/[0.06] shadow-apple-sm rounded-3xl bg-white">
              <div className="flex items-center justify-between border-b border-black/[0.05] pb-2">
                <h3 className="font-extrabold text-base text-[#1D1D1F] flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  {c.name}
                </h3>
                <Badge variant="success" className="rounded-full text-[10px]">{c.waterRequirement} Water</Badge>
              </div>
              <div className="text-xs space-y-1.5 text-[#86868B] pt-1 font-medium">
                <div className="flex justify-between"><span>Price:</span> <strong className="text-[#1D1D1F]">₹{c.referenceMarketPrice}/kg</strong></div>
                <div className="flex justify-between"><span>Yield:</span> <strong className="text-[#1D1D1F]">{formatNumber(c.averageYieldPerHectare)} kg/ha</strong></div>
                <div className="flex justify-between"><span>Cost:</span> <strong className="text-[#1D1D1F]">{formatCurrency(c.cultivationCostPerHectare)}</strong></div>
                <div className="flex justify-between text-emerald-950 font-bold pt-2 border-t border-black/[0.05]">
                  <span>Net Profit:</span> <strong className="text-sm text-emerald-700">{formatCurrency(profit)}</strong>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
