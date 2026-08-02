import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      <Badge variant="outline" className="mt-4 text-[10px]">
        Coming in a future update
      </Badge>
      {action}
    </div>
  );
}
