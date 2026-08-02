import type { Workspace } from "@/types/domain";

export const WORKSPACES: Workspace[] = [
  {
    id: "ws-solaris",
    name: "Solaris Retail Group",
    slug: "solaris-retail",
    industry: "Retail & FMCG",
    logoInitials: "SR",
    currency: "NGN",
    createdAt: "2023-02-14",
    plan: "growth",
  },
  {
    id: "ws-vertex",
    name: "Vertex Logistics Ltd",
    slug: "vertex-logistics",
    industry: "Logistics & Supply Chain",
    logoInitials: "VL",
    currency: "NGN",
    createdAt: "2024-06-01",
    plan: "starter",
  },
];

export function getWorkspace(id: string): Workspace {
  const ws = WORKSPACES.find((w) => w.id === id);
  if (!ws) throw new Error(`Unknown workspace: ${id}`);
  return ws;
}
