"use client";

import { useMemo } from "react";
import { Bell, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { useWorkspace } from "@/hooks/use-workspace";
import { buildNotifications } from "@/lib/metrics";
import { formatCurrency, relativeTime, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SEVERITY_ICON = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertCircle,
} as const;

const SEVERITY_COLOR = {
  info: "text-chart-2",
  warning: "text-chart-4",
  critical: "text-destructive",
} as const;

export function Notifications() {
  const { workspace, dataset } = useWorkspace();

  const notifications = useMemo(
    () => buildNotifications(dataset, (amount) => formatCurrency(amount, workspace.currency)),
    [dataset, workspace.currency]
  );

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="ghost" size="icon" className="relative rounded-full" />}>
        <Bell className="size-[18px]" />
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 flex size-2 rounded-full bg-destructive" />
        )}
        <span className="sr-only">Notifications</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <p className="text-xs text-muted-foreground">
            {notifications.length} item{notifications.length === 1 ? "" : "s"} need your attention
          </p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              You&apos;re all caught up.
            </p>
          )}
          {notifications.map((n) => {
            const Icon = SEVERITY_ICON[n.severity];
            return (
              <div key={n.id} className="flex gap-2.5 border-b px-4 py-3 last:border-b-0">
                <Icon className={cn("mt-0.5 size-4 shrink-0", SEVERITY_COLOR[n.severity])} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">{n.message}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{relativeTime(n.date)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
