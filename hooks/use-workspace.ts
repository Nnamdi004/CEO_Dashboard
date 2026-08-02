"use client";

import { useWorkspaceStore } from "@/lib/store/use-workspace-store";
import { WORKSPACES, getWorkspace } from "@/lib/mock-data/workspaces";

export function useWorkspace() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const switchWorkspace = useWorkspaceStore((s) => s.switchWorkspace);
  const dataset = useWorkspaceStore((s) => s.datasets[activeWorkspaceId]);

  return {
    workspace: getWorkspace(activeWorkspaceId),
    workspaces: WORKSPACES,
    dataset,
    switchWorkspace,
  };
}
