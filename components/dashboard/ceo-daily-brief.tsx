import { Sparkles } from "lucide-react";
import type { DailyBrief } from "@/lib/metrics";
import { Card, CardContent } from "@/components/ui/card";

export function CeoDailyBrief({ brief }: { brief: DailyBrief }) {
  return (
    <Card className="border-primary/15 bg-gradient-to-br from-primary/5 via-card to-card">
      <CardContent className="flex gap-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold">{brief.greeting}</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {brief.lines.map((line, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary/50" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
