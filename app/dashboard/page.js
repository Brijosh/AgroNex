"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sprout, Plus, BarChart2, Sliders, History, MapPin, 
  Layers, Droplet, ArrowRight, TrendingUp, ShieldCheck 
} from "lucide-react";
import { HistoryViewer } from "@/components/dashboard/HistoryViewer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    async function loadFarms() {
      let serverFarms = [];
      try {
        const res = await fetch("/api/farms");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          serverFarms = json.data;
        }
      } catch (err) {
        console.warn("Failed to load server farms:", err);
      }

      let localFarms = [];
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          localFarms = JSON.parse(localStorage.getItem("agronex_farms") || "[]");
        }
      } catch (e) {
        console.warn("LocalStorage farms read error:", e);
      }

      // Merge and deduplicate by locationName & area
      const map = new Map();
      [...serverFarms, ...localFarms].forEach((f) => {
        if (f && f.locationName) {
          const key = `${f.locationName.toLowerCase()}-${f.area}-${f.soilType}`;
          if (!map.has(key)) {
            map.set(key, {
              ...f,
              name: f.name || `${f.locationName} Plot (${f.area} ${f.areaUnit})`,
            });
          }
        }
      });

      setFarms(Array.from(map.values()));
    }

    loadFarms();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#F5F5F7] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <Sprout className="w-4 h-4" />
            <span>Farmer Operations Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            My Farm Management
          </h1>
          <p className="text-xs text-[#86868B] mt-0.5 font-medium">Manage farm plots, view past crop intelligence evaluations, and launch What-If scenarios.</p>
        </div>

        <Link href="/onboarding">
          <Button size="sm" className="flex items-center gap-1.5 bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs rounded-full px-5 py-2.5 shadow-apple-sm transition-all hover:scale-[1.02]">
            <Plus className="w-4 h-4 text-emerald-400" /> Analyze New Farm Plot
          </Button>
        </Link>
      </div>

      {/* Main Grid: Saved Farm Plots & Analysis History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Saved Farm Plots */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-black/[0.06] bg-white rounded-3xl shadow-apple-sm">
            <CardHeader className="border-b border-black/[0.05] pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-extrabold flex items-center gap-2 text-[#1D1D1F]">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Saved Farm Plots</span>
              </CardTitle>
              <Badge variant="secondary" className="rounded-full text-[10px] font-semibold">{farms.length} Registered</Badge>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {farms.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#86868B] space-y-3 font-medium">
                  <p>No saved farm plots found. Start your first analysis to save a plot.</p>
                  <Link href="/onboarding">
                    <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold border-black/[0.1]">Create Farm Plot</Button>
                  </Link>
                </div>
              ) : (
                farms.map((farm) => (
                  <div key={farm.id} className="p-4 rounded-2xl border border-black/[0.06] bg-[#FAF9F6]/80 hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-extrabold text-[#1D1D1F] text-base flex items-center gap-2">
                        {farm.name}
                        <Badge variant="success" className="rounded-full text-[10px]">{farm.soilType} Soil</Badge>
                      </h3>
                      <div className="text-xs text-[#86868B] mt-1 flex flex-wrap items-center gap-3 font-medium">
                        <span>Location: {farm.locationName}</span>
                        <span>•</span>
                        <span>Area: {farm.area} {farm.areaUnit}</span>
                        <span>•</span>
                        <span>Water: {farm.waterAvailability} ({farm.irrigationType})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/analysis?location=${encodeURIComponent(farm.locationName)}&area=${farm.area}&areaUnit=${farm.areaUnit}&soil=${farm.soilType}&water=${farm.waterAvailability}&irrigation=${farm.irrigationType}&season=${farm.season}`}>
                        <Button size="sm" className="text-xs bg-[#1D1D1F] text-white hover:bg-black font-semibold rounded-full px-4">
                          Run Analysis <ArrowRight className="w-3.5 h-3.5 ml-1 text-emerald-400" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: History Viewer */}
        <div>
          <HistoryViewer />
        </div>
      </div>
    </div>
  );
}
