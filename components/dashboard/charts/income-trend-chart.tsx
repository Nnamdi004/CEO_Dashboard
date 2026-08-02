"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MonthlyTrendPoint } from "@/lib/mock-data/monthly-trends";
import { ChartTooltip } from "./chart-tooltip";
import { formatCurrency } from "@/lib/utils";
import type { Currency } from "@/types/domain";

export function IncomeTrendChart({
  data,
  currency,
}: {
  data: MonthlyTrendPoint[];
  currency: Currency;
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ left: -12, right: 8, top: 4 }}>
        <defs>
          <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--viz-cat-1)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--viz-cat-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v, currency)} />} />
        <Area
          type="monotone"
          dataKey="income"
          name="Income"
          stroke="var(--viz-cat-1)"
          strokeWidth={2}
          fill="url(#incomeFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
