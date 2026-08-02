"use client";

import { clamp, formatCurrency } from "@/lib/utils";
import type { Currency } from "@/types/domain";

function statusColor(utilization: number) {
  if (utilization >= 100) return "var(--viz-critical)";
  if (utilization >= 80) return "var(--viz-warning)";
  return "var(--viz-good)";
}

export function BudgetVsActualChart({
  data,
  currency,
}: {
  data: { name: string; allocated: number; spent: number }[];
  currency: Currency;
}) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((d) => {
        const utilization = (d.spent / d.allocated) * 100;
        return (
          <div key={d.name}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium">{d.name}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatCurrency(d.spent, currency, { compact: true })} of{" "}
                {formatCurrency(d.allocated, currency, { compact: true })} ({utilization.toFixed(0)}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-[width]"
                style={{
                  width: `${clamp(utilization, 0, 100)}%`,
                  backgroundColor: statusColor(utilization),
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
