"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./chart-tooltip";
import { formatCurrency } from "@/lib/utils";
import type { Currency } from "@/types/domain";

const STAGE_COLORS: Record<string, string> = {
  New: "var(--viz-seq-250)",
  Qualified: "var(--viz-seq-350)",
  "Proposal Sent": "var(--viz-seq-450)",
  Negotiation: "var(--viz-seq-550)",
  Won: "var(--viz-good)",
  Lost: "var(--viz-critical)",
};

export function SalesPipelineChart({
  data,
  currency,
}: {
  data: { stage: string; count: number; value: number }[];
  currency: Currency;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 12, right: 16, top: 4 }}>
        <CartesianGrid horizontal={false} stroke="var(--viz-grid)" />
        <XAxis
          type="number"
          tickFormatter={(v: number) => formatCurrency(v, currency, { compact: true })}
          tick={{ fill: "var(--viz-ink-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="stage"
          tick={{ fill: "var(--viz-ink-secondary)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={90}
        />
        <Tooltip
          cursor={{ fill: "var(--viz-ink-muted)", opacity: 0.06 }}
          content={
            <ChartTooltip
              formatter={(v) => formatCurrency(v, currency)}
            />
          }
        />
        <Bar dataKey="value" name="Pipeline value" radius={[0, 4, 4, 0]} maxBarSize={22}>
          {data.map((entry) => (
            <Cell key={entry.stage} fill={STAGE_COLORS[entry.stage] ?? "var(--viz-cat-1)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
