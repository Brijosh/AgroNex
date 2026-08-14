"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, TrendingUp, ShieldCheck, ArrowUpRight, Sparkles, Droplets, MapPin, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PREVIEW_CANDIDATES = [
  { name: "Tomato", score: 87, profit: "₹83,000", soil: "Loamy (94%)", water: "Drip (Optimal)", match: "Optimal Match" },
  { name: "Chilli", score: 81, profit: "₹72,500", soil: "Loamy (88%)", water: "Drip (Good)", match: "Strong Contender" },
  { name: "Maize", score: 76, profit: "₹54,000", soil: "Loamy (90%)", water: "Drip (Moderate)", match: "Viable Alternative" },
];

export function InteractiveHeroPreview() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % PREVIEW_CANDIDATES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = PREVIEW_CANDIDATES[activeIdx];

  return (
    <div className="w-full max-w-lg mx-auto lg:mx-0 p-1.5 rounded-3xl bg-zinc-950/[0.04] border border-zinc-200/90 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)]">
      <div className="bg-white rounded-[1.35rem] p-6 space-y-5">
        {/* Header with live pulse */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">Live Agronomic Engine</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
            <MapPin className="w-3 h-3 text-zinc-400" />
            <span>Kochi, 2 Acres</span>
          </div>
        </div>

        {/* Dynamic crop card with smooth spring fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-crop-900 text-white flex items-center justify-center shadow-sm">
                  <Sprout className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-zinc-950">{current.name}</h3>
                    <Badge variant="success" className="text-[10px]">
                      {current.match}
                    </Badge>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-500 mt-0.5">Kharif Season • High Yield Variety</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Score</div>
                <div className="text-2xl font-black text-crop-900">{current.score}<span className="text-xs text-zinc-400 font-semibold">/100</span></div>
              </div>
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-left">
                <div className="text-[10px] font-mono uppercase text-zinc-400">Est. Profit</div>
                <div className="text-sm font-extrabold text-zinc-900 mt-0.5">{current.profit}</div>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-left">
                <div className="text-[10px] font-mono uppercase text-zinc-400">Soil Match</div>
                <div className="text-sm font-bold text-zinc-900 mt-0.5">{current.soil}</div>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-left">
                <div className="text-[10px] font-mono uppercase text-zinc-400">Water Index</div>
                <div className="text-sm font-bold text-zinc-900 mt-0.5">{current.water}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Multi-candidate Switcher Pills */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
          <div className="text-[11px] font-mono text-zinc-400">Simulating rankings:</div>
          <div className="flex gap-1.5">
            {PREVIEW_CANDIDATES.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                  activeIdx === i
                    ? "bg-zinc-900 text-white font-bold"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
