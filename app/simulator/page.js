"use client";

import React, { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sliders, ArrowLeft, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Sparkles, RefreshCw, Sprout, ShieldAlert, Check, Search, Filter, Plus, MapPin, CloudSun, Compass, RotateCcw 
} from "lucide-react";
import { ScenarioControls } from "@/components/simulator/ScenarioControls";
import { CustomCropModal } from "@/components/farm/CustomCropModal";
import { ProfitChart } from "@/components/charts/ProfitChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { runScenarioSimulation } from "@/lib/engine/simulation-engine";
import { evaluateCropIntelligence } from "@/lib/engine/crop-engine";
import { searchLocation, reverseGeocode } from "@/lib/services/location-service";
import { REFERENCE_CROPS } from "@/data/crops";
import { REFERENCE_MARKET_PRICES } from "@/data/market-prices";
import { formatCurrency } from "@/lib/utils/utils";

function SimulatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Farm Profile State (Editable directly inside Simulator)
  const [farmData, setFarmData] = useState({
    locationName: searchParams.get("location") || "Kochi, Kerala",
    latitude: parseFloat(searchParams.get("lat")) || 9.9312,
    longitude: parseFloat(searchParams.get("lon")) || 76.2673,
    area: parseFloat(searchParams.get("area")) || 2,
    areaUnit: searchParams.get("areaUnit") || "acres",
    soilType: searchParams.get("soil") || "Loamy",
    waterAvailability: searchParams.get("water") || "Moderate",
    irrigationType: searchParams.get("irrigation") || "Drip",
    season: searchParams.get("season") || "Kharif",
  });

  // Location search states
  const [locationSearchInput, setLocationSearchInput] = useState(farmData.locationName);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [liveWeather, setLiveWeather] = useState({ temperature: 28, rainfall: 800, isLive: false });

  // Scenario slider state
  const [scenarioParams, setScenarioParams] = useState({
    priceShiftPct: 0,
    rainfallShiftPct: 0,
    tempShiftOffset: 0,
    costShiftPct: 0,
  });

  // Crop selection states
  const [allCrops, setAllCrops] = useState(REFERENCE_CROPS);
  const [selectedCropNames, setSelectedCropNames] = useState([
    "Tomato", "Rice", "Maize", "Chilli", "Dragonfruit", "Mango", "Watermelon"
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const [baselineAnalysis, setBaselineAnalysis] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load available crops dynamically from API
  useEffect(() => {
    fetch("/api/crops")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const map = new Map();
          [...REFERENCE_CROPS, ...json.data].forEach((c) => {
            if (c && c.name) map.set(c.name.trim().toLowerCase(), c);
          });
          setAllCrops(Array.from(map.values()));
        }
      })
      .catch((err) => console.warn("Failed to load simulator crops:", err));
  }, []);

  // Fetch live weather when location coordinates change
  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(`/api/weather?lat=${farmData.latitude}&lon=${farmData.longitude}`);
        const json = await res.json();
        if (json.success && json.data) {
          setLiveWeather({
            temperature: json.data.temperature || 28,
            rainfall: json.data.rainfall || 800,
            weatherCondition: json.data.weatherCondition || "Favorable",
            isLive: json.data.isLive || false,
          });
        }
      } catch (e) {
        console.warn("Simulator weather fetch failed:", e);
      }
    }

    fetchWeather();
  }, [farmData.latitude, farmData.longitude]);

  // Handle location text search autocompletion
  useEffect(() => {
    if (!locationSearchInput.trim() || locationSearchInput.length < 2) {
      setLocationSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const results = await searchLocation(locationSearchInput);
        setLocationSuggestions(results || []);
      } catch (err) {
        console.warn("Location search error:", err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [locationSearchInput]);

  const selectLocationSuggestion = (loc) => {
    setFarmData((prev) => ({
      ...prev,
      locationName: loc.locationName,
      latitude: loc.latitude,
      longitude: loc.longitude,
    }));
    setLocationSearchInput(loc.locationName);
    setLocationSuggestions([]);
  };

  const handleDetectGPSLocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      setIsSearchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const loc = await reverseGeocode(lat, lon);
          setFarmData((prev) => ({
            ...prev,
            locationName: loc.locationName,
            latitude: lat,
            longitude: lon,
          }));
          setLocationSearchInput(loc.locationName);
          setIsSearchingLocation(false);
        },
        (error) => {
          console.warn("GPS error:", error);
          setIsSearchingLocation(false);
        }
      );
    }
  };

  const handleCustomCropCreated = (newCrop) => {
    if (newCrop && newCrop.name) {
      setAllCrops((prev) => {
        const map = new Map();
        [...prev, newCrop].forEach((c) => {
          if (c && c.name) map.set(c.name.trim().toLowerCase(), c);
        });
        return Array.from(map.values());
      });
      if (!selectedCropNames.includes(newCrop.name)) {
        setSelectedCropNames((prev) => [...prev, newCrop.name]);
      }
    }
  };

  // Filter crops based on user selected names
  const activeCropsList = useMemo(() => {
    return allCrops.filter((c) =>
      selectedCropNames.some((name) => name.toLowerCase() === c.name.toLowerCase())
    );
  }, [allCrops, selectedCropNames]);

  const filteredAvailableCrops = useMemo(() => {
    if (!searchQuery.trim()) return allCrops;
    const q = searchQuery.toLowerCase().trim();
    return allCrops.filter((c) => c.name.toLowerCase().includes(q));
  }, [allCrops, searchQuery]);

  const toggleCropSelection = (name) => {
    if (selectedCropNames.includes(name)) {
      if (selectedCropNames.length > 2) {
        setSelectedCropNames(selectedCropNames.filter((n) => n !== name));
      }
    } else {
      setSelectedCropNames([...selectedCropNames, name]);
    }
  };

  const handleSelectPreset = (presetNames) => {
    const valid = presetNames.filter((name) =>
      allCrops.some((c) => c.name.toLowerCase() === name.toLowerCase())
    );
    if (valid.length >= 2) {
      setSelectedCropNames(valid);
    }
  };

  const handleSelectAllCrops = () => {
    setSelectedCropNames(allCrops.map((c) => c.name));
  };

  const handleDeselectAllCrops = () => {
    // Keep top 2 crops so evaluation matrix remains valid
    setSelectedCropNames([allCrops[0]?.name || "Tomato", allCrops[1]?.name || "Rice"]);
  };

  // Re-calculate baseline analysis when farmData or activeCropsList changes
  useEffect(() => {
    if (activeCropsList.length === 0) return;
    try {
      const base = evaluateCropIntelligence(farmData, activeCropsList, liveWeather, REFERENCE_MARKET_PRICES);
      setBaselineAnalysis(base);
      const sim = runScenarioSimulation(base, scenarioParams);
      setSimulationResult(sim);
    } catch (err) {
      console.warn("Simulator baseline calculation error:", err);
    } finally {
      setLoading(false);
    }
  }, [farmData, activeCropsList, liveWeather]);

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
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold text-[#1D1D1F]">Evaluating What-If Sensitivity Engine...</p>
      </div>
    );
  }

  const rec = simulationResult.recommendedCrop;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#F5F5F7] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Interactive Location & Sensitivity Simulator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            What-If Scenario Simulator
          </h1>
          <p className="text-xs text-[#86868B] mt-0.5 font-medium">
            Edit location, soil profile, and farm size to simulate market price swings and climate impacts in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            onClick={() => setIsCustomModalOpen(true)}
            size="sm"
            className="rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-apple-sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Custom Crop
          </Button>

          <Link href="/analysis">
            <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold border-black/[0.1]">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Report
            </Button>
          </Link>
        </div>
      </div>

      {/* 📍 Editable Location & Farm Parameters Card */}
      <Card className="border border-black/[0.06] shadow-apple-sm p-6 space-y-4 bg-white rounded-3xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#1D1D1F] block">
                Target Location & Farm Parameters
              </span>
              <p className="text-[11px] text-[#86868B] font-medium">Change farm parameters below to recalculate crop recommendations.</p>
            </div>
          </div>

          {liveWeather.isLive && (
            <Badge variant="success" className="rounded-full text-[10px] py-1 px-3 flex items-center gap-1">
              <CloudSun className="w-3.5 h-3.5" /> Live Open-Meteo ({liveWeather.temperature}°C)
            </Badge>
          )}
        </div>

        {/* Location Search Bar & Parameters Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Location Autocomplete */}
          <div className="md:col-span-2 relative">
            <label className="block text-[11px] font-bold text-[#1D1D1F] uppercase mb-1">
              Search Location (OpenStreetMap Nominatim API)
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-[#86868B] absolute left-3" />
              <input
                type="text"
                placeholder="Type village, district, or city (e.g. Kochi, Shimla, Nashik, Ludhiana)..."
                value={locationSearchInput}
                onChange={(e) => setLocationSearchInput(e.target.value)}
                className="w-full pl-9 pr-24 py-2.5 rounded-2xl border border-black/[0.08] text-xs font-semibold focus:ring-2 focus:ring-emerald-600 bg-[#F5F5F7]/50"
              />
              <button
                type="button"
                onClick={handleDetectGPSLocation}
                className="absolute right-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors"
              >
                <Compass className="w-3 h-3" /> GPS
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {locationSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border border-black/[0.08] shadow-apple-md z-30 overflow-hidden max-h-48 overflow-y-auto">
                {locationSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectLocationSuggestion(item)}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 border-b border-black/[0.04] last:border-0 font-medium text-[#1D1D1F] flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{item.locationName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Farm Size & Unit */}
          <div>
            <label className="block text-[11px] font-bold text-[#1D1D1F] uppercase mb-1">
              Farm Area & Size
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.5"
                value={farmData.area}
                onChange={(e) => setFarmData({ ...farmData, area: parseFloat(e.target.value) || 1 })}
                className="w-full px-3 py-2 rounded-2xl border border-black/[0.08] text-xs font-semibold bg-[#F5F5F7]/50 text-[#1D1D1F]"
              />
              <select
                value={farmData.areaUnit}
                onChange={(e) => setFarmData({ ...farmData, areaUnit: e.target.value })}
                className="px-3 py-2 rounded-2xl border border-black/[0.08] text-xs font-semibold bg-white text-[#1D1D1F]"
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
              </select>
            </div>
          </div>
        </div>

        {/* Soil, Water, Irrigation, and Season Selectors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-black/[0.05]">
          <div>
            <label className="block text-[10px] font-bold text-[#86868B] uppercase mb-1">Soil Type</label>
            <select
              value={farmData.soilType}
              onChange={(e) => setFarmData({ ...farmData, soilType: e.target.value })}
              className="w-full px-3 py-2 rounded-2xl border border-black/[0.08] text-xs font-semibold bg-white text-[#1D1D1F]"
            >
              <option value="Loamy">Loamy Soil</option>
              <option value="Sandy">Sandy Soil</option>
              <option value="Clay">Clay Soil</option>
              <option value="Silty">Silty Soil</option>
              <option value="Black">Black Soil</option>
              <option value="Red">Red Soil</option>
              <option value="Laterite">Laterite Soil</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#86868B] uppercase mb-1">Water Supply</label>
            <select
              value={farmData.waterAvailability}
              onChange={(e) => setFarmData({ ...farmData, waterAvailability: e.target.value })}
              className="w-full px-3 py-2 rounded-2xl border border-black/[0.08] text-xs font-semibold bg-white text-[#1D1D1F]"
            >
              <option value="Low">Low Water</option>
              <option value="Moderate">Moderate Water</option>
              <option value="High">High Water</option>
              <option value="Very High">Very High Water</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#86868B] uppercase mb-1">Irrigation Method</label>
            <select
              value={farmData.irrigationType}
              onChange={(e) => setFarmData({ ...farmData, irrigationType: e.target.value })}
              className="w-full px-3 py-2 rounded-2xl border border-black/[0.08] text-xs font-semibold bg-white text-[#1D1D1F]"
            >
              <option value="Drip">Drip Systems</option>
              <option value="Sprinkler">Sprinkler</option>
              <option value="Flood">Flood / Canal</option>
              <option value="Rainfed">Rainfed Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#86868B] uppercase mb-1">Season</label>
            <select
              value={farmData.season}
              onChange={(e) => setFarmData({ ...farmData, season: e.target.value })}
              className="w-full px-3 py-2 rounded-2xl border border-black/[0.08] text-xs font-semibold bg-white text-[#1D1D1F]"
            >
              <option value="Kharif">Kharif (Monsoon)</option>
              <option value="Rabi">Rabi (Winter)</option>
              <option value="Summer">Summer (Zaid)</option>
              <option value="Year-round">Year-round</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Interactive Crop Selection Panel */}
      <Card className="border border-black/[0.06] shadow-apple-sm p-6 space-y-4 bg-white rounded-3xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#1D1D1F] block">
              Select Crops & Fruits to Simulate ({selectedCropNames.length} Selected):
            </span>
            <p className="text-[11px] text-[#86868B] font-medium">Click any pill to select or unselect candidate crops.</p>
          </div>

          {/* Quick Presets & Select All / Deselect All Controls */}
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

            <span className="w-px h-4 bg-black/[0.1] mx-0.5" />

            <button
              type="button"
              onClick={handleSelectAllCrops}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1D1D1F] text-white hover:bg-black transition-colors"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleDeselectAllCrops}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60 hover:bg-rose-100 transition-colors"
            >
              Deselect All
            </button>
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> New Crop
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search crops or fruits to simulate (e.g. Dragonfruit, Mango, Tomato)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-black/[0.08] text-xs font-semibold focus:ring-2 focus:ring-emerald-600 bg-[#F5F5F7]/50"
          />
        </div>

        {/* Crop Pills Multi-select Grid */}
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
          {filteredAvailableCrops.map((c) => {
            const isSelected = selectedCropNames.some((n) => n.toLowerCase() === c.name.toLowerCase());
            return (
              <button
                key={c.id || c.name}
                type="button"
                onClick={() => toggleCropSelection(c.name)}
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
          <Card className="border border-black/[0.06] bg-white rounded-3xl shadow-apple-sm">
            <CardHeader className="border-b border-black/[0.05] pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-extrabold flex items-center gap-2 text-[#1D1D1F]">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Simulated Financial Returns for {farmData.locationName}</span>
              </CardTitle>
              <Badge variant="success" className="text-[10px] rounded-full">Real-Time Updated</Badge>
            </CardHeader>
            <CardContent className="p-4">
              <ProfitChart evaluations={simulationResult.allEvaluations} />
            </CardContent>
          </Card>

          {/* Top Recommendation Banner under Simulated Conditions */}
          {rec && (
            <Card className="bg-[#1D1D1F] text-white p-6 rounded-3xl shadow-apple-md">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> Top Choice for {farmData.locationName} ({farmData.area} {farmData.areaUnit})
                  </div>
                  <h2 className="text-2xl font-black mt-1 text-white">{rec.crop.name}</h2>
                  <p className="text-xs text-[#86868B] mt-1 font-medium">
                    Composite Score: <strong className="text-white">{rec.finalScore}/100</strong> • Net Return: <strong className="text-emerald-400">{formatCurrency(rec.financials.profit)}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {rec.rankShift !== 0 && (
                    <Badge variant={rec.rankShift > 0 ? "success" : "warning"} className="text-xs py-1 px-3 rounded-full">
                      {rec.rankShift > 0 ? `▲ Moved up +${rec.rankShift} places` : `▼ Dropped ${rec.rankShift} places`}
                    </Badge>
                  )}
                  {rec.profitDelta !== 0 && (
                    <Badge variant={rec.profitDelta > 0 ? "success" : "danger"} className="text-xs py-1 px-3 rounded-full">
                      {rec.profitDelta > 0 ? `+${formatCurrency(rec.profitDelta)}` : formatCurrency(rec.profitDelta)}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Simulated Rankings List */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-[#1D1D1F] uppercase tracking-wider">Simulated Candidate Crop Rankings ({simulationResult.allEvaluations.length} Evaluated)</h3>
            <div className="space-y-2">
              {simulationResult.allEvaluations.map((item, idx) => {
                const rank = idx + 1;
                return (
                  <Card key={item.crop.id || item.crop.name} className="p-4 flex items-center justify-between border border-black/[0.06] bg-white rounded-2xl hover:border-emerald-500/50 transition-colors shadow-apple-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs ${
                        rank === 1 ? "bg-emerald-600 text-white" : "bg-[#F5F5F7] text-[#1D1D1F]"
                      }`}>
                        #{rank}
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-[#1D1D1F] flex items-center gap-2">
                          {item.crop.name}
                          {rank === 1 && <Badge variant="success" className="text-[9px] py-0 px-2 rounded-full">#1 Choice</Badge>}
                        </div>
                        <div className="text-xs text-[#86868B] font-medium">Duration: {item.crop.durationDays} Days • {item.crop.season}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-[#1D1D1F]">
                      <div className="text-right">
                        <span className="text-[#86868B] block text-[10px] uppercase font-bold">Net Profit</span>
                        <span className="font-extrabold text-emerald-700">{formatCurrency(item.financials.profit)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#86868B] block text-[10px] uppercase font-bold">Score</span>
                        <span className="font-extrabold text-[#1D1D1F]">{item.finalScore}/100</span>
                      </div>
                      {item.profitDelta !== 0 && (
                        <div className={`font-extrabold flex items-center text-[11px] ${item.profitDelta > 0 ? "text-emerald-600" : "text-rose-600"}`}>
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

      {/* Custom Crop Creation Modal */}
      <CustomCropModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onCropCreated={handleCustomCropCreated}
      />
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <div className="bg-[#F5F5F7] min-h-screen">
      <Suspense fallback={<div className="text-center py-20 text-xs font-semibold text-[#86868B]">Loading AgroNex Simulator...</div>}>
        <SimulatorContent />
      </Suspense>
    </div>
  );
}
