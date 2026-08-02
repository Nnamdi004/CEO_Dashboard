import type {
  Asset,
  Budget,
  Client,
  Expense,
  IncomeRecord,
  Invoice,
  ITTicket,
  Lead,
  Opportunity,
} from "@/types/domain";
import { WORKSPACES } from "./workspaces";
import { getLeadsForWorkspace } from "./leads";
import { getClientsForWorkspace } from "./clients";
import { getOpportunitiesForWorkspace } from "./pipeline";
import { getInvoicesForWorkspace } from "./invoices";
import { getIncomeForWorkspace } from "./income";
import { getExpensesForWorkspace } from "./expenses";
import { getBudgetsForWorkspace } from "./budget";
import { getAssetsForWorkspace } from "./assets";
import { getITTicketsForWorkspace } from "./it-tickets";

export interface WorkspaceDataset {
  leads: Lead[];
  clients: Client[];
  opportunities: Opportunity[];
  invoices: Invoice[];
  incomeRecords: IncomeRecord[];
  expenses: Expense[];
  budgets: Budget[];
  assets: Asset[];
  itTickets: ITTicket[];
}

function buildDataset(workspaceId: string): WorkspaceDataset {
  return {
    leads: getLeadsForWorkspace(workspaceId),
    clients: getClientsForWorkspace(workspaceId),
    opportunities: getOpportunitiesForWorkspace(workspaceId),
    invoices: getInvoicesForWorkspace(workspaceId),
    incomeRecords: getIncomeForWorkspace(workspaceId),
    expenses: getExpensesForWorkspace(workspaceId),
    budgets: getBudgetsForWorkspace(workspaceId),
    assets: getAssetsForWorkspace(workspaceId),
    itTickets: getITTicketsForWorkspace(workspaceId),
  };
}

export const INITIAL_DATASETS: Record<string, WorkspaceDataset> =
  Object.fromEntries(WORKSPACES.map((w) => [w.id, buildDataset(w.id)]));
