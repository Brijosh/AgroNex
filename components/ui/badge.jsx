import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-zinc-900 text-zinc-50 shadow-sm",
        secondary:
          "border border-transparent bg-zinc-100 text-zinc-900",
        outline:
          "border border-zinc-200 text-zinc-800 bg-white",
        success:
          "border border-emerald-200/80 bg-emerald-50 text-emerald-800",
        warning:
          "border border-amber-200/80 bg-amber-50 text-amber-800",
        danger:
          "border border-rose-200/80 bg-rose-50 text-rose-800",
        info:
          "border border-sky-200/80 bg-sky-50 text-sky-800",
        neutral:
          "border border-zinc-200/80 bg-zinc-50 text-zinc-700",
        forest:
          "border border-crop-200/90 bg-crop-50 text-crop-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
