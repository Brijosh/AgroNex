import { cn } from "@/lib/utils/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-zinc-200/70", className)}
      {...props}
    />
  );
}

export { Skeleton };
