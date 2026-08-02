"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./chart-tooltip";

const STAGE_COLORS: Record<string, string> = {
  New: "var(--viz-seq-250)",
  Contacted: "var(--viz-seq-350)",
  Qualified: "var(--viz-seq-450)",
  Converted: "var(--viz-seq-550)",
};

export function LeadConversionChart({
  data,
}: {
  data: { stage: string; count: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 12, right: 16, top: 4 }}>
        <CartesianGrid horizontal={false} stroke="var(--viz-grid)" />
        <XAxis
          type="number"
          allowDecimals={false}
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
          width={80}
        />
        <Tooltip
          cursor={{ fill: "var(--viz-ink-muted)", opacity: 0.06 }}
          content={<ChartTooltip formatter={(v) => `${v} lead${v === 1 ? "" : "s"}`} />}
        />
        <Bar dataKey="count" name="Leads" radius={[0, 4, 4, 0]} maxBarSize={22}>
          {data.map((entry) => (
            <Cell key={entry.stage} fill={STAGE_COLORS[entry.stage] ?? "var(--viz-cat-1)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
