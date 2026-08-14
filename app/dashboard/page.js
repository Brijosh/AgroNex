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
import { formatCurrency } from "@/lib/utils/utils";

export default function DashboardPage() {
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    fetch("/api/farms")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setFarms(json.data);
        }
      })
      .catch((err) => console.warn("Failed to load farms:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-crop-700 uppercase tracking-wider">
            <Sprout className="w-4 h-4" />
            <span>Farmer Operations Dashboard</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            My Farm Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage farm plots, view past crop intelligence evaluations, and launch What-If scenarios.</p>
        </div>

        <Link href="/onboarding">
          <Button variant="primary" size="sm" className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Analyze New Farm Plot
          </Button>
        </Link>
      </div>

      {/* Main Grid: Saved Farm Plots & Analysis History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Saved Farm Plots */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-crop-700" />
                <span>Saved Farm Plots</span>
              </CardTitle>
              <Badge variant="secondary">{farms.length} Plots Registered</Badge>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {farms.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 space-y-3">
                  <p>No saved farm plots found. Start your first analysis to save a plot.</p>
                  <Link href="/onboarding"><Button variant="outline" size="sm">Create Farm Plot</Button></Link>
                </div>
              ) : (
                farms.map((farm) => (
                  <div key={farm.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-crop-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                        {farm.name}
                        <Badge variant="success">{farm.soilType} Soil</Badge>
                      </h3>
                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                        <span>Location: {farm.locationName}</span>
                        <span>•</span>
                        <span>Area: {farm.area} {farm.areaUnit}</span>
                        <span>•</span>
                        <span>Water: {farm.waterAvailability} ({farm.irrigationType})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/analysis?location=${encodeURIComponent(farm.locationName)}&area=${farm.area}&areaUnit=${farm.areaUnit}&soil=${farm.soilType}&water=${farm.waterAvailability}&irrigation=${farm.irrigationType}&season=${farm.season}`}>
                        <Button variant="primary" size="sm" className="text-xs">
                          Run Analysis <ArrowRight className="w-3.5 h-3.5 ml-1" />
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
