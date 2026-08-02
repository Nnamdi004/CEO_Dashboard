interface ChartTooltipPayloadEntry {
  dataKey?: string | number;
  name?: string | number;
  color?: string;
  value?: number | string;
}

export function ChartTooltip({
  active,
  label,
  payload,
  formatter,
}: {
  active?: boolean;
  label?: string | number;
  payload?: ChartTooltipPayloadEntry[];
  formatter?: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md ring-1 ring-foreground/10">
      {label !== undefined && (
        <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((entry, i) => (
          <div key={`${entry.dataKey ?? i}`} className="flex items-center gap-2 text-xs">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium">
              {formatter && typeof entry.value === "number"
                ? formatter(entry.value)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
