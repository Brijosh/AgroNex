"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout, Menu, X, BarChart2, Sliders, LayoutDashboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analysis", label: "Analysis", icon: Sprout },
    { href: "/compare", label: "Compare", icon: BarChart2 },
    { href: "/simulator", label: "Simulator", icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-xl border-b border-black/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Apple-style Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="AgroNex Homepage">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-apple-sm group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-[#1D1D1F] tracking-tight">
              Agro<span className="text-emerald-600">Nex</span>
            </span>
          </Link>

          {/* Apple Segmented Pill Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-black/[0.04] p-1 rounded-full border border-black/[0.04]" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#1D1D1F] shadow-apple-sm"
                      : "text-[#86868B] hover:text-[#1D1D1F]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-600" : "text-[#86868B]"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Primary Pill Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/onboarding">
              <Button size="sm" className="bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs px-4 py-2 rounded-full shadow-apple-sm flex items-center gap-1.5 transition-all hover:scale-[1.02]">
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>New Farm Analysis</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-[#1D1D1F] hover:bg-black/[0.04] focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-black/[0.06] px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold min-h-[44px] ${
                  isActive
                    ? "bg-emerald-50 text-emerald-950 font-bold"
                    : "text-[#1D1D1F] hover:bg-black/[0.03]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-[#86868B]"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center min-h-[44px] bg-[#1D1D1F] text-white font-semibold text-xs rounded-full">
                <Plus className="w-4 h-4 mr-2" /> New Farm Analysis
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
