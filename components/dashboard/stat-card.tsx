import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaLabel,
  invertDeltaColor = false,
  hint,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: number;
  deltaLabel?: string;
  invertDeltaColor?: boolean;
  hint?: string;
}) {
  const isPositive = (delta ?? 0) >= 0;
  const isGood = invertDeltaColor ? !isPositive : isPositive;

  return (
    <Card className="gap-2 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-3.5" />
        </div>
      </div>
      <div className="text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">{value}</div>
      {(delta !== undefined || hint) && (
        <div className="flex items-center gap-1 text-xs">
          {delta !== undefined && (
            <span
              className={cn(
                "flex items-center gap-0.5 font-medium",
                isGood ? "text-[var(--viz-good)]" : "text-destructive"
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              {Math.abs(delta).toFixed(0)}%
            </span>
          )}
          <span className="text-muted-foreground">{deltaLabel ?? hint}</span>
        </div>
      )}
    </Card>
  );
}
