"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MapPin, Maximize2, Layers, Droplet, Sun, SlidersHorizontal, 
  ArrowRight, ArrowLeft, CheckCircle2, Navigation, Search, Check, Sprout, Plus 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomCropModal } from "./CustomCropModal";

const DEFAULT_CROPS_LIST = [
  "Rice", "Wheat", "Maize", "Tomato", "Chilli", "Banana", 
  "Cucumber", "Onion", "Potato", "Groundnut", "Millet", "Okra"
];

export function FarmWizard({ initialDemo = false }) {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [availableCrops, setAvailableCrops] = useState(DEFAULT_CROPS_LIST);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    locationName: initialDemo ? "Kochi, Kerala" : "",
    latitude: initialDemo ? 9.9312 : null,
    longitude: initialDemo ? 76.2673 : null,
    area: initialDemo ? "2" : "",
    areaUnit: "acres",
    soilType: initialDemo ? "Loamy" : "Loamy",
    waterAvailability: initialDemo ? "Moderate" : "Moderate",
    irrigationType: initialDemo ? "Drip" : "Rainfed",
    season: initialDemo ? "Kharif" : "Kharif",
    userCrops: initialDemo ? ["Tomato", "Rice", "Maize", "Chilli"] : ["Tomato", "Chilli", "Rice"],
    preferences: {
      lowRisk: false,
      highProfit: true,
      lowWater: false,
      shortDuration: false,
    },
  });

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [detectedSoil, setDetectedSoil] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch all crops (reference + custom) with strict case-insensitive Map deduplication
  useEffect(() => {
    fetch("/api/crops")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          const map = new Map();
          [...DEFAULT_CROPS_LIST, ...json.data.map((c) => c.name)].forEach((name) => {
            if (name && typeof name === "string") {
              const trimmed = name.trim();
              const key = trimmed.toLowerCase();
              if (!map.has(key)) map.set(key, trimmed);
            }
          });
          setAvailableCrops(Array.from(map.values()));
        }
      })
      .catch((e) => console.warn("Failed to fetch crops list:", e));
  }, []);

  // Debounced search for location auto-complete
  useEffect(() => {
    if (!formData.locationName || formData.locationName.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const res = await fetch(`/api/location?q=${encodeURIComponent(formData.locationName)}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setLocationSuggestions(json.data);
        }
      } catch (err) {
        console.warn("Failed to fetch location suggestions:", err);
      } font-medium;
      setIsSearchingLocation(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.locationName]);

  // Auto-detect soil properties when coordinates change
  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      fetch(`/api/soil?lat=${formData.latitude}&lon=${formData.longitude}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data?.soilType) {
            setDetectedSoil(json.data.soilType);
            setFormData((prev) => ({ ...prev, soilType: json.data.soilType }));
          }
        })
        .catch((err) => console.warn("SoilGrids fetch error:", err));
    }
  }, [formData.latitude, formData.longitude]);

  const handleSelectLocation = (item) => {
    setFormData({
      ...formData,
      locationName: item.locationName,
      latitude: item.latitude,
      longitude: item.longitude,
    });
    setLocationSuggestions([]);
  };

  const handleDetectBrowserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const res = await fetch(`/api/location?lat=${lat}&lon=${lon}`);
          const json = await res.json();
          if (json.success && json.data) {
            setFormData({
              ...formData,
              locationName: json.data.locationName,
              latitude: lat,
              longitude: lon,
            });
          }
        } catch (e) {
          console.warn("Reverse geocoding error:", e);
        } finally {
          setIsGeolocating(false);
        }
      },
      (err) => {
        setIsGeolocating(false);
        setFormData({
          ...formData,
          locationName: "Kochi, Kerala",
          latitude: 9.9312,
          longitude: 76.2673,
        });
      }
    );
  };

  const toggleUserCrop = (cropName) => {
    const current = formData.userCrops || [];
    const lower = cropName.toLowerCase();
    if (current.some((c) => c.toLowerCase() === lower)) {
      setFormData({ ...formData, userCrops: current.filter((c) => c.toLowerCase() !== lower) });
    } else {
      setFormData({ ...formData, userCrops: [...current, cropName] });
    }
  };

  const handleSelectAllCrops = () => {
    setFormData({ ...formData, userCrops: [...availableCrops] });
  };

  const handleClearCrops = () => {
    setFormData({ ...formData, userCrops: [] });
  };

  const handleCustomCropCreated = (newCrop) => {
    const name = newCrop.name.trim();
    const map = new Map();
    [...availableCrops, name].forEach((n) => map.set(n.toLowerCase(), n));
    const dedupedList = Array.from(map.values());

    setAvailableCrops(dedupedList);
    setFormData((prev) => ({
      ...prev,
      userCrops: Array.from(new Set([...(prev.userCrops || []), name])),
    }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.locationName.trim()) {
      setErrors({ locationName: "Please enter or select a location." });
      return;
    }
    if (step === 2 && (!formData.area || parseFloat(formData.area) <= 0)) {
      setErrors({ area: "Please enter a valid positive land area." });
      return;
    }
    if (step === 7 && (!formData.userCrops || formData.userCrops.length === 0)) {
      setErrors({ userCrops: "Please select at least one crop to evaluate." });
      return;
    }

    setErrors({});
    if (step < 8) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleTryDemo = () => {
    setFormData({
      locationName: "Kochi, Kerala",
      latitude: 9.9312,
      longitude: 76.2673,
      area: "2",
      areaUnit: "acres",
      soilType: "Loamy",
      waterAvailability: "Moderate",
      irrigationType: "Drip",
      season: "Kharif",
      userCrops: ["Tomato", "Chilli", "Rice", "Maize"],
      preferences: {
        lowRisk: false,
        highProfit: true,
        lowWater: false,
        shortDuration: false,
      },
    });
    setErrors({});
  };

  const handleSubmit = () => {
    const query = new URLSearchParams({
      location: formData.locationName,
      lat: formData.latitude || 9.9312,
      lon: formData.longitude || 76.2673,
      area: formData.area,
      areaUnit: formData.areaUnit,
      soil: formData.soilType,
      water: formData.waterAvailability,
      irrigation: formData.irrigationType,
      season: formData.season,
      crops: (formData.userCrops || []).join(","),
    }).toString();

    router.push(`/analysis?${query}`);
  };

  const soilOptions = ["Sandy", "Loamy", "Clay", "Silty", "Black soil", "Red soil", "Laterite", "Unknown"];
  const waterOptions = ["Very Low", "Low", "Moderate", "High", "Very High"];
  const irrigationOptions = ["Rainfed", "Drip", "Sprinkler", "Flood", "Other"];
  const seasonOptions = ["Kharif", "Rabi", "Summer", "Year-round"];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Top Demo Quickfill Banner */}
      <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sprout className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs text-slate-700">
            <strong>Auto-Fetch Open Data Demo:</strong>
            <p className="text-slate-500">Auto-fill Kochi (OpenStreetMap Geocoded, Open-Meteo Weather, SoilGrids API).</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleTryDemo} className="shrink-0 bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold">
          Try Demo Data
        </Button>
      </div>

      <Card className="border-slate-200/90 shadow-card">
        {/* Wizard Header & Progress Bar */}
        <CardHeader className="bg-slate-50/60 pb-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span>Step {step} of 8</span>
            <span>{Math.round((step / 8) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-crop-600 transition-all duration-300" style={{ width: `${(step / 8) * 100}%` }}></div>
          </div>
          <CardTitle className="text-xl mt-4">
            {step === 1 && "Step 1: Search Your Location (OpenStreetMap)"}
            {step === 2 && "Step 2: Land Area Size"}
            {step === 3 && "Step 3: Soil Type (Auto-Detected or Manual)"}
            {step === 4 && "Step 4: Water Availability"}
            {step === 5 && "Step 5: Irrigation System"}
            {step === 6 && "Step 6: Cultivation Season"}
            {step === 7 && "Step 7: Select Your Crops or Add Custom Crop"}
            {step === 8 && "Step 8: Optional Farming Priorities"}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 min-h-[280px] flex flex-col justify-center">
          {/* STEP 1: Live Geocoded Location */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Search Village / District / City</label>
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Type city or village (e.g. Kochi, Ludhiana, Pune)..."
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crop-500 text-slate-900 text-sm font-medium"
                />
              </div>

              {/* Suggestions Dropdown */}
              {locationSuggestions.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-lg shadow-elevated overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto">
                  {locationSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectLocation(item)}
                      className="w-full text-left p-2.5 text-xs text-slate-700 hover:bg-crop-50 hover:text-crop-900 transition-colors flex items-center gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5 text-crop-600 shrink-0" />
                      <span className="truncate">{item.locationName}</span>
                    </button>
                  ))}
                </div>
              )}

              {errors.locationName && <p className="text-xs text-rose-600">{errors.locationName}</p>}

              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDetectBrowserLocation}
                  disabled={isGeolocating}
                  className="text-xs flex items-center gap-2 font-semibold"
                >
                  <Navigation className="w-3.5 h-3.5 text-crop-600" />
                  {isGeolocating ? "Detecting GPS location..." : "Use Browser Geolocation"}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Land Area */}
          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Land Area Size</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="e.g. 2.5"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crop-500 text-slate-900 text-sm font-semibold"
                />
                <select
                  value={formData.areaUnit}
                  onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                  className="w-32 px-3 py-2.5 rounded-lg border border-slate-300 bg-white font-medium text-sm text-slate-700"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                </select>
              </div>
              {errors.area && <p className="text-xs text-rose-600">{errors.area}</p>}
            </div>
          )}

          {/* STEP 3: Soil Type */}
          {step === 3 && (
            <div className="space-y-3">
              {detectedSoil && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span><strong>Auto-Detected via ISRIC SoilGrids API:</strong> {detectedSoil} Soil</span>
                  </div>
                  <Badge variant="success">Open Data</Badge>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {soilOptions.map((soil) => (
                  <button
                    key={soil}
                    type="button"
                    onClick={() => setFormData({ ...formData, soilType: soil })}
                    className={`p-3.5 rounded-xl border text-left text-sm font-bold transition-all ${
                      formData.soilType === soil
                        ? "border-crop-600 bg-crop-50 text-crop-900 shadow-sm ring-2 ring-crop-600"
                        : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                    }`}
                  >
                    {soil}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Water Availability */}
          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {waterOptions.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, waterAvailability: level })}
                  className={`p-3 rounded-xl border text-center text-sm font-bold transition-all ${
                    formData.waterAvailability === level
                      ? "border-crop-600 bg-crop-50 text-crop-900 shadow-sm ring-2 ring-crop-600"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          )}

          {/* STEP 5: Irrigation */}
          {step === 5 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {irrigationOptions.map((irr) => (
                <button
                  key={irr}
                  type="button"
                  onClick={() => setFormData({ ...formData, irrigationType: irr })}
                  className={`p-3.5 rounded-xl border text-left text-sm font-bold transition-all ${
                    formData.irrigationType === irr
                      ? "border-crop-600 bg-crop-50 text-crop-900 shadow-sm ring-2 ring-crop-600"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                  }`}
                >
                  {irr}
                </button>
              ))}
            </div>
          )}

          {/* STEP 6: Season */}
          {step === 6 && (
            <div className="grid grid-cols-2 gap-3">
              {seasonOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, season: s })}
                  className={`p-4 rounded-xl border text-left text-sm font-bold transition-all ${
                    formData.season === s
                      ? "border-crop-600 bg-crop-50 text-crop-900 shadow-sm ring-2 ring-crop-600"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* STEP 7: User Crop Inventory & Custom Crop Modal Launcher */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs text-slate-600 font-medium">Select ONLY the crops you want evaluated for your farm:</p>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={handleSelectAllCrops} className="text-[11px] font-bold text-crop-700 hover:underline">Select All</button>
                  <span className="text-slate-300">•</span>
                  <button type="button" onClick={handleClearCrops} className="text-[11px] font-bold text-slate-500 hover:underline">Clear All</button>
                  <span className="text-slate-300">•</span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsCustomModalOpen(true)}
                    className="text-xs flex items-center gap-1.5 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5 text-crop-600" /> + Add Custom Crop
                  </Button>
                </div>
              </div>

              {errors.userCrops && <p className="text-xs text-rose-600 font-semibold">{errors.userCrops}</p>}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1">
                {availableCrops.map((cropName) => {
                  const isChecked = (formData.userCrops || []).some((c) => c.toLowerCase() === cropName.toLowerCase());
                  return (
                    <button
                      key={cropName}
                      type="button"
                      onClick={() => toggleUserCrop(cropName)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                        isChecked
                          ? "border-crop-600 bg-crop-700 text-white shadow-sm"
                          : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <Sprout className="w-3.5 h-3.5 shrink-0" />
                        {cropName}
                      </span>
                      {isChecked && <Check className="w-4 h-4 text-emerald-300 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 8: Preferences */}
          {step === 8 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2 font-medium">Optional priorities to tailor the weighted scoring algorithm:</p>
              {[
                { key: "highProfit", label: "Maximize Potential Revenue & Net Return" },
                { key: "lowRisk", label: "Prioritize Low Volatility & Minimal Crop Risk" },
                { key: "lowWater", label: "Conserve Water Resources (Low Water Need)" },
                { key: "shortDuration", label: "Prefer Short Growth Duration (Fast Harvest)" },
              ].map((pref) => (
                <label key={pref.key} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={!!formData.preferences[pref.key]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, [pref.key]: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-crop-600 rounded focus:ring-crop-500 border-slate-300"
                  />
                  <span className="text-sm font-semibold text-slate-800">{pref.label}</span>
                </label>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-1.5 font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <Button type="button" variant="primary" onClick={handleNext} className="flex items-center gap-1.5 px-6 font-bold">
            <span>{step === 8 ? "Analyze My Farm" : "Continue"}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>

      {/* Custom Crop Creation Modal */}
      <CustomCropModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onCropCreated={handleCustomCropCreated}
      />
    </div>
  );
}
