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
      try {
        const res = await fetch("/api/history");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setHistory(json.data);
        }
      } catch (err) {
        console.warn("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  if (loading) {
    return <div className="text-xs text-slate-500 py-4 animate-pulse">Loading past analysis history...</div>;
  }

  if (history.length === 0) {
    return (
      <Card className="p-6 text-center text-slate-500 text-xs space-y-2">
        <History className="w-8 h-8 text-slate-300 mx-auto" />
        <p>No past analysis reports saved yet.</p>
        <Link href="/onboarding"><Button variant="outline" size="sm">Run First Analysis</Button></Link>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <History className="w-5 h-5 text-crop-700" />
          <span>Past Analysis Reports</span>
        </CardTitle>
        <Badge variant="secondary">{history.length} Saved Runs</Badge>
      </CardHeader>

      <CardContent className="p-4 divide-y divide-slate-100 space-y-3">
        {history.map((item) => (
          <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-crop-50 border border-crop-200 flex items-center justify-center font-bold text-crop-800">
                <Sprout className="w-4 h-4 text-crop-700" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900">{item.recommendedCropName}</div>
                <div className="text-slate-500 text-[11px] flex items-center gap-2">
                  <span>Score: {item.score}/100</span>
                  <span>•</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Est Return</span>
                <span className="font-extrabold text-crop-900 text-sm">{formatCurrency(item.netProfit)}</span>
              </div>
              <Link href={`/analysis?crops=${item.recommendedCropName}`}>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-crop-700 hover:text-crop-900">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
