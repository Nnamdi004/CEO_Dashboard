"use client";

import { formatCurrency } from "@/lib/utils";
import type { Currency } from "@/types/domain";

const STATUS_COLOR: Record<string, string> = {
  Paid: "var(--viz-good)",
  Outstanding: "var(--viz-warning)",
  Overdue: "var(--viz-critical)",
  Draft: "var(--viz-ink-muted)",
};

export function InvoiceCollectionChart({
  data,
  currency,
}: {
  data: { status: string; value: number; count: number }[];
  currency: Currency;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-4 w-full gap-0.5 overflow-hidden rounded-full bg-muted">
        {data
          .filter((d) => d.value > 0)
          .map((d) => (
            <div
              key={d.status}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${(d.value / total) * 100}%`,
                backgroundColor: STATUS_COLOR[d.status],
              }}
              title={`${d.status}: ${formatCurrency(d.value, currency)}`}
            />
          ))}
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        {data.map((d) => (
          <div key={d.status} className="flex flex-col gap-1">
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: STATUS_COLOR[d.status] }}
              />
              {d.status}
              <span className="text-muted-foreground/60">({d.count})</span>
            </dt>
            <dd className="text-sm font-semibold tabular-nums">
              {formatCurrency(d.value, currency, { compact: true })}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
