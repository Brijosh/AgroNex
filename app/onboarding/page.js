"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FarmWizard } from "@/components/farm/FarmWizard";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";

  return <FarmWizard initialDemo={isDemo} />;
}

export default function OnboardingPage() {
  return (
    <div className="py-8 bg-surface-canvas min-h-[calc(100vh-8rem)]">
      <Suspense fallback={
        <div className="max-w-md mx-auto py-24 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-crop-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Loading Setup Wizard...</p>
        </div>
      }>
        <OnboardingContent />
      </Suspense>
    </div>
  );
}

