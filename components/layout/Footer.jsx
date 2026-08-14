import React from "react";
import Link from "next/link";
import { Sprout, ShieldAlert, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 mt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-zinc-900">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-crop-800 text-emerald-300 flex items-center justify-center shadow-inner">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">CropWise</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Transparent, deterministic agricultural decision intelligence. Evaluating crop suitability, soil compatibility, expected returns, and risk for informed farm decisions.
            </p>
            <div className="inline-flex items-center gap-2 text-[11px] text-zinc-400 bg-zinc-900/80 border border-zinc-800/80 px-3 py-1.5 rounded-full max-w-md">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Decision-support estimate based on research benchmarks.</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-200 font-mono">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-white transition-colors">Farm Onboarding</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">Farmer Dashboard</Link>
              </li>
              <li>
                <Link href="/analysis" className="hover:text-white transition-colors">Crop Intelligence Report</Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">Side-by-Side Comparison</Link>
              </li>
              <li>
                <Link href="/simulator" className="hover:text-white transition-colors">What-If Simulator</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Engine Architecture */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-200 font-mono">Deterministic Engine</h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-crop-500"></span>
                <span>Multi-factor agronomic suitability scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-crop-500"></span>
                <span>Regional soil compatibility matrix</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-crop-500"></span>
                <span>Economic net return estimation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-crop-500"></span>
                <span>Weather sensitivity & price volatility risk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} CropWise Agricultural Intelligence. All rights reserved.</p>
          <p className="text-[11px] text-zinc-600 font-mono">v1.2 • Deterministic Evaluation Framework</p>
        </div>
      </div>
    </footer>
  );
}

