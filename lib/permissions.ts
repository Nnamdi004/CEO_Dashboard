import type { Role } from "@/types/domain";

export type Capability =
  | "manageRegisters" // create/edit leads, clients, pipeline, invoices, income, expenses, assets, tickets
  | "manageBudget"
  | "approveExpenses"
  | "viewReports"
  | "manageSettings"
  | "inviteUsers";

const ROLE_CAPABILITIES: Record<Role, Capability[]> = {
  ceo: [
    "manageRegisters",
    "manageBudget",
    "approveExpenses",
    "viewReports",
    "manageSettings",
    "inviteUsers",
  ],
  executive: ["manageRegisters", "manageBudget", "approveExpenses", "viewReports"],
  // Staff can update records they own; register mutation is allowed here, scoped
  // ownership enforcement is a Phase 2 concern once registers exist.
  staff: ["manageRegisters"],
  admin: ["viewReports", "manageSettings", "inviteUsers"],
};

export function can(role: Role, capability: Capability): boolean {
  return ROLE_CAPABILITIES[role].includes(capability);
}

export const ROLE_LABELS: Record<Role, string> = {
  ceo: "CEO",
  executive: "Executive",
  staff: "Staff",
  admin: "Admin",
};
