"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MonthlyTrendPoint } from "@/lib/mock-data/monthly-trends";
import { ChartTooltip } from "./chart-tooltip";
import { formatCurrency } from "@/lib/utils";
import type { Currency } from "@/types/domain";

export function RevenueVsExpensesChart({
  data,
  currency,
}: {
  data: MonthlyTrendPoint[];
  currency: Currency;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barGap={4} margin={{ left: -12, right: 8, top: 4 }}>
        <CartesianGrid vertical={false} stroke="var(--viz-grid)" />
        <XAxis
          dataKey="month"
          tickFormatter={(m: string) => m.split(" ")[0]}
          tick={{ fill: "var(--viz-ink-muted)", fontSize: 12 }}
          axisLine={{ stroke: "var(--viz-baseline)" }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v: number) => formatCurrency(v, currency, { compact: true })}
          tick={{ fill: "var(--viz-ink-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip
          cursor={{ fill: "var(--viz-ink-muted)", opacity: 0.06 }}
          content={<ChartTooltip formatter={(v) => formatCurrency(v, currency)} />}
        />
        <Bar dataKey="revenue" name="Revenue" fill="var(--viz-cat-1)" radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Bar dataKey="expenses" name="Expenses" fill="var(--viz-cat-2)" radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
