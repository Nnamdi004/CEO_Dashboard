"use client";

import type { HealthScoreBreakdown } from "@/lib/metrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SUB_SCORES: { key: keyof Omit<HealthScoreBreakdown, "overall">; label: string }[] = [
  { key: "revenueTrend", label: "Revenue trend" },
  { key: "cashFlow", label: "Cash flow" },
  { key: "pipelineHealth", label: "Pipeline health" },
  { key: "budgetAdherence", label: "Budget adherence" },
  { key: "collections", label: "Collections" },
  { key: "itWorkload", label: "IT workload" },
];

function scoreColor(score: number) {
  if (score >= 75) return "var(--viz-good)";
  if (score >= 50) return "var(--viz-warning)";
  return "var(--viz-critical)";
}

function scoreLabel(score: number) {
  if (score >= 75) return "Healthy";
  if (score >= 50) return "Needs attention";
  return "At risk";
}

export function BusinessHealthScore({ score }: { score: HealthScoreBreakdown }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score.overall / 100);
  const color = scoreColor(score.overall);

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Business Health Score</CardTitle>
        <CardDescription>
          A single 0–100 pulse on revenue, cash, pipeline, budget, collections and IT.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative flex size-32 shrink-0 items-center justify-center">
          <svg viewBox="0 0 100 100" className="size-32 -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="var(--viz-grid)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-semibold tabular-nums">{score.overall}</span>
            <span className="text-[11px] font-medium" style={{ color }}>
              {scoreLabel(score.overall)}
            </span>
          </div>
        </div>

        <div className="grid w-full flex-1 grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {SUB_SCORES.map(({ key, label }) => {
            const value = score[key];
            return (
              <div key={key}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium tabular-nums">{value}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full")}
                    style={{ width: `${value}%`, backgroundColor: scoreColor(value) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
