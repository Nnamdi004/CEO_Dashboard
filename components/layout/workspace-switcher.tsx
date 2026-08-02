"use client";

import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import { useWorkspace } from "@/hooks/use-workspace";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WorkspaceSwitcher({ collapsed = false }: { collapsed?: boolean }) {
  const { workspace, workspaces, switchWorkspace } = useWorkspace();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-sidebar-accent",
              collapsed && "justify-center px-0"
            )}
          />
        }
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
          {workspace.logoInitials}
        </div>
        {!collapsed && (
          <>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold text-sidebar-foreground">
                {workspace.name}
              </span>
              <span className="truncate text-xs text-sidebar-foreground/50">
                {workspace.industry}
              </span>
            </div>
            <ChevronsUpDown className="size-4 shrink-0 text-sidebar-foreground/40" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Your workspaces
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => switchWorkspace(ws.id)}
            className="gap-2"
          >
            <div className="flex size-6 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-semibold">
              {ws.logoInitials}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm">{ws.name}</span>
              <span className="truncate text-xs text-muted-foreground capitalize">
                {ws.plan} plan
              </span>
            </div>
            {ws.id === workspace.id && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="gap-2 text-muted-foreground">
          <Building2 className="size-4" />
          Add a workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
