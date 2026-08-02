"use client";

import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./chart-tooltip";

export function MonthlyGrowthChart({
  data,
}: {
  data: { month: string; growthPercent: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ left: -12, right: 8, top: 4 }}>
        <CartesianGrid vertical={false} stroke="var(--viz-grid)" />
        <XAxis
          dataKey="month"
          tickFormatter={(m: string) => m.split(" ")[0]}
          tick={{ fill: "var(--viz-ink-muted)", fontSize: 12 }}
          axisLine={{ stroke: "var(--viz-baseline)" }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v: number) => `${v.toFixed(0)}%`}
          tick={{ fill: "var(--viz-ink-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={44}
        />
        <ReferenceLine y={0} stroke="var(--viz-baseline)" />
        <Tooltip
          cursor={{ fill: "var(--viz-ink-muted)", opacity: 0.06 }}
          content={<ChartTooltip formatter={(v) => `${v.toFixed(1)}%`} />}
        />
        <Bar dataKey="growthPercent" name="Growth" radius={[4, 4, 4, 4]} maxBarSize={28}>
          {data.map((entry) => (
            <Cell
              key={entry.month}
              fill={entry.growthPercent >= 0 ? "var(--viz-div-pos)" : "var(--viz-div-neg)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
