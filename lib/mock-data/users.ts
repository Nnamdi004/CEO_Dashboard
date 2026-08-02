import type { User } from "@/types/domain";

export const USERS: User[] = [
  // Solaris Retail Group
  {
    id: "u-solaris-ceo",
    name: "Chibueze Okafor",
    email: "chibueze@solarisretail.com",
    role: "ceo",
    title: "Chief Executive Officer",
    workspaceId: "ws-solaris",
  },
  {
    id: "u-solaris-exec",
    name: "Amara Nwosu",
    email: "amara@solarisretail.com",
    role: "executive",
    title: "VP of Sales",
    workspaceId: "ws-solaris",
  },
  {
    id: "u-solaris-admin",
    name: "Tunde Bakare",
    email: "tunde@solarisretail.com",
    role: "admin",
    title: "Operations Administrator",
    workspaceId: "ws-solaris",
  },
  {
    id: "u-solaris-staff",
    name: "Ifeoma Eze",
    email: "ifeoma@solarisretail.com",
    role: "staff",
    title: "Accounts Assistant",
    workspaceId: "ws-solaris",
  },
  // Vertex Logistics Ltd
  {
    id: "u-vertex-ceo",
    name: "Grace Adeyemi",
    email: "grace@vertexlogistics.com",
    role: "ceo",
    title: "Managing Director",
    workspaceId: "ws-vertex",
  },
  {
    id: "u-vertex-exec",
    name: "Emeka Chukwu",
    email: "emeka@vertexlogistics.com",
    role: "executive",
    title: "Head of Business Development",
    workspaceId: "ws-vertex",
  },
  {
    id: "u-vertex-admin",
    name: "Fatima Bello",
    email: "fatima@vertexlogistics.com",
    role: "admin",
    title: "HR & Admin Lead",
    workspaceId: "ws-vertex",
  },
  {
    id: "u-vertex-staff",
    name: "Segun Afolabi",
    email: "segun@vertexlogistics.com",
    role: "staff",
    title: "Fleet Coordinator",
    workspaceId: "ws-vertex",
  },
];

export function getUsersForWorkspace(workspaceId: string) {
  return USERS.filter((u) => u.workspaceId === workspaceId);
}
