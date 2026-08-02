"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./chart-tooltip";
import { formatCurrency } from "@/lib/utils";
import type { Currency } from "@/types/domain";

const PALETTE = [
  "var(--viz-cat-1)",
  "var(--viz-cat-2)",
  "var(--viz-cat-3)",
  "var(--viz-cat-4)",
  "var(--viz-cat-5)",
  "var(--viz-cat-6)",
  "var(--viz-cat-7)",
];
const OTHER_COLOR = "var(--viz-ink-muted)";
const MAX_SLICES = 7;

export function ExpenseBreakdownChart({
  data,
  currency,
}: {
  data: { category: string; amount: number }[];
  currency: Currency;
}) {
  const top = data.slice(0, MAX_SLICES);
  const rest = data.slice(MAX_SLICES);
  const chartData = rest.length
    ? [...top, { category: "Other", amount: rest.reduce((s, d) => s + d.amount, 0) }]
    : top;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 12, right: 16, top: 4 }}>
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
          dataKey="category"
          tick={{ fill: "var(--viz-ink-secondary)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={116}
        />
        <Tooltip
          cursor={{ fill: "var(--viz-ink-muted)", opacity: 0.06 }}
          content={<ChartTooltip formatter={(v) => formatCurrency(v, currency)} />}
        />
        <Bar dataKey="amount" name="Spend" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {chartData.map((entry, i) => (
            <Cell
              key={entry.category}
              fill={entry.category === "Other" ? OTHER_COLOR : PALETTE[i % PALETTE.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
