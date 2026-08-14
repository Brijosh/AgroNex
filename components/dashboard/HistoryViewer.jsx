"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { History, Sprout, Calendar, TrendingUp, Award, ArrowRight, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/utils";

export function HistoryViewer() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      let serverHistory = [];
      try {
        const res = await fetch("/api/history");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          serverHistory = json.data;
        }
      } catch (err) {
        console.warn("Failed to load server history:", err);
      }

      let localHistory = [];
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          localHistory = JSON.parse(localStorage.getItem("agronex_history") || "[]");
        }
      } catch (e) {
        console.warn("LocalStorage history read error:", e);
      }

      // Merge and deduplicate by ID or timestamp + cropName
      const map = new Map();
      [...serverHistory, ...localHistory].forEach((item) => {
        if (item && item.recommendedCropName) {
          const key = item.id || `${item.recommendedCropName}-${item.createdAt}`;
          if (!map.has(key)) {
            map.set(key, item);
          }
        }
      });

      const mergedList = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setHistory(mergedList);
      setLoading(false);
    }

    loadHistory();
  }, []);

  if (loading) {
    return <div className="text-xs text-[#86868B] py-4 animate-pulse">Loading past analysis history...</div>;
  }

  if (history.length === 0) {
    return (
      <Card className="p-6 text-center text-[#86868B] text-xs space-y-2 border border-black/[0.06] bg-white rounded-3xl shadow-apple-sm">
        <History className="w-8 h-8 text-slate-300 mx-auto" />
        <p>No past analysis reports saved yet.</p>
        <Link href="/onboarding"><Button variant="outline" size="sm" className="rounded-full text-xs font-semibold">Run First Analysis</Button></Link>
      </Card>
    );
  }

  return (
    <Card className="border border-black/[0.06] bg-white rounded-3xl shadow-apple-sm">
      <CardHeader className="border-b border-black/[0.05] pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-extrabold flex items-center gap-2 text-[#1D1D1F]">
          <History className="w-5 h-5 text-emerald-600" />
          <span>Past Analysis Reports</span>
        </CardTitle>
        <Badge variant="secondary" className="rounded-full text-[10px] font-semibold">{history.length} Saved Runs</Badge>
      </CardHeader>

      <CardContent className="p-4 divide-y divide-black/[0.04] space-y-3">
        {history.map((item) => {
          const score = item.finalScore || item.score || 85;
          const profit = item.estimatedProfit || item.netProfit || 0;
          return (
            <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-emerald-800">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1D1D1F]">{item.recommendedCropName}</div>
                  <div className="text-[#86868B] text-[11px] flex items-center gap-2 font-medium">
                    <span>Score: {score}/100</span>
                    <span>•</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-[#86868B] uppercase font-bold block">Est Return</span>
                  <span className="font-extrabold text-emerald-600 text-sm">{formatCurrency(profit)}</span>
                </div>
                <Link href={`/analysis?crops=${item.recommendedCropName}`}>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-[#1D1D1F] hover:text-emerald-600">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
