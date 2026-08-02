// Domain types for the CEO Executive Dashboard mock data layer.

export type Role = "ceo" | "executive" | "staff" | "admin";

export type Currency = "NGN" | "USD" | "GBP" | "EUR";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  title?: string;
  workspaceId: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  industry: string;
  logoInitials: string;
  currency: Currency;
  createdAt: string;
  plan: "starter" | "growth" | "enterprise";
}

// ---------- Leads ----------

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "unqualified"
  | "converted";

export interface Lead {
  id: string;
  workspaceId: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  source: string;
  expectedValue: number;
  status: LeadStatus;
  assignedExecutive: string;
  nextFollowUp: string | null;
  createdDate: string;
  notes?: string;
}

// ---------- Clients ----------

export type ClientStatus = "active" | "dormant" | "churned";

export interface Client {
  id: string;
  workspaceId: string;
  name: string;
  industry: string;
  primaryContact: string;
  email: string;
  phone: string;
  status: ClientStatus;
  projectsCount: number;
  invoicesCount: number;
  revenueGenerated: number;
  lastInteraction: string;
  accountOwner: string;
}

// ---------- Pipeline ----------

export type PipelineStage =
  | "new"
  | "qualified"
  | "proposal_sent"
  | "negotiation"
  | "won"
  | "lost";

export interface Opportunity {
  id: string;
  workspaceId: string;
  name: string;
  clientId: string;
  clientName: string;
  estimatedValue: number;
  probability: number;
  expectedCloseDate: string;
  owner: string;
  stage: PipelineStage;
}

// ---------- Invoices ----------

export type InvoiceStatus = "paid" | "outstanding" | "overdue" | "draft";

export interface Invoice {
  id: string;
  workspaceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
}

// ---------- Income ----------

export interface IncomeRecord {
  id: string;
  workspaceId: string;
  date: string;
  clientId: string;
  clientName: string;
  invoiceId?: string;
  amount: number;
  paymentMethod: "bank_transfer" | "card" | "cash" | "cheque" | "other";
  referenceNumber: string;
  receivedBy: string;
  notes?: string;
}

// ---------- Expenses ----------

export type ExpenseStatus = "pending" | "approved" | "rejected";

export interface Expense {
  id: string;
  workspaceId: string;
  category: string;
  department: string;
  vendor: string;
  amount: number;
  date: string;
  status: ExpenseStatus;
  hasReceipt: boolean;
  approvedBy?: string;
  notes?: string;
}

// ---------- Budget ----------

export type BudgetPeriod = "annual" | "monthly" | "department" | "project";

export interface Budget {
  id: string;
  workspaceId: string;
  name: string;
  period: BudgetPeriod;
  department?: string;
  allocated: number;
  spent: number;
  startDate: string;
  endDate: string;
}

// ---------- Assets ----------

export type AssetCondition = "excellent" | "good" | "fair" | "poor";
export type AssetStatus = "in_use" | "in_storage" | "under_repair" | "retired";

export interface Asset {
  id: string;
  workspaceId: string;
  name: string;
  category: string;
  serialNumber: string;
  assignedTo: string | null;
  purchaseDate: string;
  currentValue: number;
  condition: AssetCondition;
  location: string;
  status: AssetStatus;
  warrantyExpiry: string | null;
}

// ---------- IT Support ----------

export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface ITTicket {
  id: string;
  workspaceId: string;
  ticketNumber: string;
  reportedBy: string;
  issue: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string | null;
  createdDate: string;
  resolvedDate: string | null;
}
