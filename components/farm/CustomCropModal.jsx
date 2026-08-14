"use client";

import React, { useState } from "react";
import { Plus, X, Sprout, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const SMART_PRESETS = [
  { name: "Dragonfruit", season: "Year-round", waterRequirement: "Low", averageYieldPerHectare: "8000", cultivationCostPerHectare: "120000", referenceMarketPrice: "150", durationDays: "365" },
  { name: "Mango", season: "Summer", waterRequirement: "Moderate", averageYieldPerHectare: "10000", cultivationCostPerHectare: "80000", referenceMarketPrice: "60", durationDays: "120" },
  { name: "Papaya", season: "Year-round", waterRequirement: "Moderate", averageYieldPerHectare: "45000", cultivationCostPerHectare: "70000", referenceMarketPrice: "25", durationDays: "270" },
  { name: "Watermelon", season: "Summer", waterRequirement: "High", averageYieldPerHectare: "30000", cultivationCostPerHectare: "50000", referenceMarketPrice: "18", durationDays: "90" },
  { name: "Strawberry", season: "Rabi", waterRequirement: "Moderate", averageYieldPerHectare: "15000", cultivationCostPerHectare: "150000", referenceMarketPrice: "200", durationDays: "150" },
  { name: "Cotton", season: "Kharif", waterRequirement: "Moderate", averageYieldPerHectare: "2200", cultivationCostPerHectare: "45000", referenceMarketPrice: "65", durationDays: "160" },
  { name: "Sugarcane", season: "Year-round", waterRequirement: "Very High", averageYieldPerHectare: "80000", cultivationCostPerHectare: "90000", referenceMarketPrice: "3.5", durationDays: "365" },
  { name: "Guava", season: "Year-round", waterRequirement: "Moderate", averageYieldPerHectare: "18000", cultivationCostPerHectare: "60000", referenceMarketPrice: "40", durationDays: "365" },
];

export function CustomCropModal({ isOpen, onClose, onCropCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    season: "Kharif",
    waterRequirement: "Moderate",
    averageYieldPerHectare: "4000",
    cultivationCostPerHectare: "40000",
    referenceMarketPrice: "30",
    durationDays: "110",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleApplyPreset = (preset) => {
    setFormData({
      name: preset.name,
      season: preset.season,
      waterRequirement: preset.waterRequirement,
      averageYieldPerHectare: preset.averageYieldPerHectare,
      cultivationCostPerHectare: preset.cultivationCostPerHectare,
      referenceMarketPrice: preset.referenceMarketPrice,
      durationDays: preset.durationDays,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Crop / Fruit name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success && json.data) {
        onCropCreated(json.data);
        onClose();
        setFormData({
          name: "",
          season: "Kharif",
          waterRequirement: "Moderate",
          averageYieldPerHectare: "4000",
          cultivationCostPerHectare: "40000",
          referenceMarketPrice: "30",
          durationDays: "110",
        });
      } else {
        setError(json.error || "Failed to create crop.");
      }
    } catch (err) {
      setError(err.message || "Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto transition-all">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-apple-lg border border-black/[0.08] space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
          <div className="flex items-center gap-2 font-extrabold text-[#1D1D1F] text-base tracking-tight">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Add Fruit or Crop Entry</span>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.04] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Fruit/Crop Presets */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" /> Quick Presets:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SMART_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  formData.name === preset.name
                    ? "bg-[#1D1D1F] text-white border-black shadow-apple-sm"
                    : "bg-[#F5F5F7] hover:bg-slate-200/70 text-[#1D1D1F] border-black/[0.06]"
                }`}
              >
                + {preset.name}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-2xl">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-[#1D1D1F] mb-1">Crop / Fruit Name</label>
            <input
              type="text"
              placeholder="e.g. Dragonfruit, Mango, Strawberry, Avocado..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.1] text-xs font-semibold focus:ring-2 focus:ring-emerald-600 bg-[#F5F5F7]/40"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Season</label>
              <select
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                className="w-full px-3 py-2 rounded-2xl border border-black/[0.1] bg-white font-medium text-xs text-[#1D1D1F]"
              >
                <option value="Kharif">Kharif</option>
                <option value="Rabi">Rabi</option>
                <option value="Summer">Summer</option>
                <option value="Year-round">Year-round</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Water Need</label>
              <select
                value={formData.waterRequirement}
                onChange={(e) => setFormData({ ...formData, waterRequirement: e.target.value })}
                className="w-full px-3 py-2 rounded-2xl border border-black/[0.1] bg-white font-medium text-xs text-[#1D1D1F]"
              >
                <option value="Very Low">Very Low</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Avg Yield (kg/ha)</label>
              <input
                type="number"
                placeholder="4000"
                value={formData.averageYieldPerHectare}
                onChange={(e) => setFormData({ ...formData, averageYieldPerHectare: e.target.value })}
                className="w-full px-3 py-2 rounded-2xl border border-black/[0.1] font-medium text-xs text-[#1D1D1F] bg-[#F5F5F7]/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Cultivation Cost (₹/ha)</label>
              <input
                type="number"
                placeholder="40000"
                value={formData.cultivationCostPerHectare}
                onChange={(e) => setFormData({ ...formData, cultivationCostPerHectare: e.target.value })}
                className="w-full px-3 py-2 rounded-2xl border border-black/[0.1] font-medium text-xs text-[#1D1D1F] bg-[#F5F5F7]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Market Price (₹/kg)</label>
              <input
                type="number"
                placeholder="30"
                value={formData.referenceMarketPrice}
                onChange={(e) => setFormData({ ...formData, referenceMarketPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-2xl border border-black/[0.1] font-medium text-xs text-[#1D1D1F] bg-[#F5F5F7]/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Duration (Days)</label>
              <input
                type="number"
                placeholder="110"
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                className="w-full px-3 py-2 rounded-2xl border border-black/[0.1] font-medium text-xs text-[#1D1D1F] bg-[#F5F5F7]/40"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-black/[0.05]">
            <Button type="button" variant="outline" onClick={onClose} size="sm" className="font-semibold text-xs rounded-full border border-black/[0.1]">Cancel</Button>
            <Button type="submit" disabled={loading} size="sm" className="font-semibold text-xs bg-[#1D1D1F] hover:bg-black text-white rounded-full px-4">
              {loading ? "Saving..." : "Analyze & Save Crop"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
