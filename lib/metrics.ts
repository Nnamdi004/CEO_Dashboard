import type { Budget } from "@/types/domain";
import type { WorkspaceDataset } from "@/lib/mock-data/seed";
import {
  getMonthlyTrends,
  OPENING_CASH_BALANCE,
  type MonthlyTrendPoint,
} from "@/lib/mock-data/monthly-trends";
import { TODAY } from "@/lib/mock-data/dates";
import { clamp, daysBetween } from "@/lib/utils";

export interface DashboardMetrics {
  revenueThisMonth: number;
  revenueGrowthPercent: number;
  incomeReceivedThisMonth: number;
  totalExpensesThisMonth: number;
  monthlyProfit: number;
  netCashPosition: number;
  outstandingInvoicesValue: number;
  outstandingInvoicesCount: number;
  overdueInvoicesValue: number;
  overdueInvoicesCount: number;
  collectionRatePercent: number;
  activeLeadsCount: number;
  pipelineValue: number;
  averageDealSize: number;
  openITTicketsCount: number;
  staleITTicketsCount: number;
  totalAssetsCount: number;
  totalAssetsValue: number;
  unassignedAssetsCount: number;
  warrantyExpiringSoonCount: number;
  annualBudget: { allocated: number; spent: number; utilizationPercent: number } | null;
  mostUtilizedDepartmentBudget: (Budget & { utilizationPercent: number }) | null;
  leadConversionRatePercent: number;
  winLossRatioPercent: number;
  dormantClientsCount: number;
  activeClientsCount: number;
  trend: MonthlyTrendPoint[];
}

const OPEN_LEAD_STATUSES = ["new", "contacted", "qualified"] as const;
const OPEN_TICKET_STATUSES = ["open", "in_progress"] as const;
const OPEN_PIPELINE_STAGES = [
  "new",
  "qualified",
  "proposal_sent",
  "negotiation",
] as const;

export function computeDashboardMetrics(
  dataset: WorkspaceDataset,
  workspaceId: string
): DashboardMetrics {
  const trend = getMonthlyTrends(workspaceId);
  const current = trend[trend.length - 1];
  const previous = trend[trend.length - 2];

  const revenueThisMonth = current?.revenue ?? 0;
  const revenueGrowthPercent = previous?.revenue
    ? ((current.revenue - previous.revenue) / previous.revenue) * 100
    : 0;
  const incomeReceivedThisMonth = current?.income ?? 0;
  const totalExpensesThisMonth = current?.expenses ?? 0;
  const monthlyProfit = revenueThisMonth - totalExpensesThisMonth;

  const lifetimeIncome = trend.reduce((sum, t) => sum + t.income, 0);
  const lifetimeExpenses = trend.reduce((sum, t) => sum + t.expenses, 0);
  const netCashPosition =
    (OPENING_CASH_BALANCE[workspaceId] ?? 0) + lifetimeIncome - lifetimeExpenses;

  const outstandingInvoices = dataset.invoices.filter((i) => i.status === "outstanding");
  const overdueInvoices = dataset.invoices.filter((i) => i.status === "overdue");
  const paidInvoices = dataset.invoices.filter((i) => i.status === "paid");
  const outstandingInvoicesValue = sumBy(outstandingInvoices, (i) => i.amount);
  const overdueInvoicesValue = sumBy(overdueInvoices, (i) => i.amount);
  const collectibleValue =
    sumBy(paidInvoices, (i) => i.amount) + outstandingInvoicesValue + overdueInvoicesValue;
  const collectionRatePercent = collectibleValue
    ? (sumBy(paidInvoices, (i) => i.amount) / collectibleValue) * 100
    : 100;

  const activeLeads = dataset.leads.filter((l) =>
    (OPEN_LEAD_STATUSES as readonly string[]).includes(l.status)
  );
  const openOpportunities = dataset.opportunities.filter((o) =>
    (OPEN_PIPELINE_STAGES as readonly string[]).includes(o.stage)
  );
  const pipelineValue = sumBy(openOpportunities, (o) => o.estimatedValue);
  const averageDealSize = openOpportunities.length
    ? pipelineValue / openOpportunities.length
    : 0;

  const wonOpportunities = dataset.opportunities.filter((o) => o.stage === "won");
  const lostOpportunities = dataset.opportunities.filter((o) => o.stage === "lost");
  const closedCount = wonOpportunities.length + lostOpportunities.length;
  const winLossRatioPercent = closedCount
    ? (wonOpportunities.length / closedCount) * 100
    : 50;

  const convertedLeads = dataset.leads.filter((l) => l.status === "converted");
  const leadConversionRatePercent = dataset.leads.length
    ? (convertedLeads.length / dataset.leads.length) * 100
    : 0;

  const openTickets = dataset.itTickets.filter((t) =>
    (OPEN_TICKET_STATUSES as readonly string[]).includes(t.status)
  );
  const staleITTicketsCount = openTickets.filter(
    (t) => daysBetween(t.createdDate, TODAY) > 5
  ).length;

  const unassignedAssets = dataset.assets.filter((a) => !a.assignedTo);
  const warrantyExpiringSoonCount = dataset.assets.filter(
    (a) => a.warrantyExpiry && daysBetween(TODAY, a.warrantyExpiry) <= 14 && daysBetween(TODAY, a.warrantyExpiry) >= 0
  ).length;
  const totalAssetsValue = sumBy(dataset.assets, (a) => a.currentValue);

  const annualBudgetRecord = dataset.budgets.find((b) => b.period === "annual");
  const annualBudget = annualBudgetRecord
    ? {
        allocated: annualBudgetRecord.allocated,
        spent: annualBudgetRecord.spent,
        utilizationPercent: (annualBudgetRecord.spent / annualBudgetRecord.allocated) * 100,
      }
    : null;

  const departmentBudgets = dataset.budgets.filter((b) => b.period !== "annual");
  const mostUtilizedDepartmentBudget = departmentBudgets
    .map((b) => ({ ...b, utilizationPercent: (b.spent / b.allocated) * 100 }))
    .sort((a, b) => b.utilizationPercent - a.utilizationPercent)[0] ?? null;

  const dormantClientsCount = dataset.clients.filter((c) => c.status === "dormant").length;
  const activeClientsCount = dataset.clients.filter((c) => c.status === "active").length;

  return {
    revenueThisMonth,
    revenueGrowthPercent,
    incomeReceivedThisMonth,
    totalExpensesThisMonth,
    monthlyProfit,
    netCashPosition,
    outstandingInvoicesValue,
    outstandingInvoicesCount: outstandingInvoices.length,
    overdueInvoicesValue,
    overdueInvoicesCount: overdueInvoices.length,
    collectionRatePercent,
    activeLeadsCount: activeLeads.length,
    pipelineValue,
    averageDealSize,
    openITTicketsCount: openTickets.length,
    staleITTicketsCount,
    totalAssetsCount: dataset.assets.length,
    totalAssetsValue,
    unassignedAssetsCount: unassignedAssets.length,
    warrantyExpiringSoonCount,
    annualBudget,
    mostUtilizedDepartmentBudget,
    leadConversionRatePercent,
    winLossRatioPercent,
    dormantClientsCount,
    activeClientsCount,
    trend,
  };
}

export interface HealthScoreBreakdown {
  overall: number;
  revenueTrend: number;
  cashFlow: number;
  pipelineHealth: number;
  budgetAdherence: number;
  collections: number;
  itWorkload: number;
}

export function computeBusinessHealthScore(
  metrics: DashboardMetrics
): HealthScoreBreakdown {
  const revenueTrend = clamp(50 + metrics.revenueGrowthPercent * 2, 0, 100);

  const avgMonthlyExpenses =
    metrics.trend.reduce((sum, t) => sum + t.expenses, 0) / (metrics.trend.length || 1);
  const runwayMonths = avgMonthlyExpenses ? metrics.netCashPosition / avgMonthlyExpenses : 0;
  const cashFlow = clamp((runwayMonths / 6) * 100, 0, 100);

  const pipelineHealth = clamp(metrics.winLossRatioPercent, 0, 100);

  const elapsedYearFraction = (TODAY.getUTCMonth() + 1) / 12;
  const budgetAdherence = metrics.annualBudget
    ? clamp(
        100 -
          (metrics.annualBudget.utilizationPercent / 100 - elapsedYearFraction) * 200,
        0,
        100
      )
    : 100;

  const collections = clamp(metrics.collectionRatePercent, 0, 100);

  const itWorkload = clamp(
    100 - metrics.openITTicketsCount * 8 - metrics.staleITTicketsCount * 10,
    0,
    100
  );

  const overall = Math.round(
    (revenueTrend + cashFlow + pipelineHealth + budgetAdherence + collections + itWorkload) / 6
  );

  return {
    overall,
    revenueTrend: Math.round(revenueTrend),
    cashFlow: Math.round(cashFlow),
    pipelineHealth: Math.round(pipelineHealth),
    budgetAdherence: Math.round(budgetAdherence),
    collections: Math.round(collections),
    itWorkload: Math.round(itWorkload),
  };
}

export interface DailyBrief {
  greeting: string;
  lines: string[];
}

export function buildDailyBrief(
  dataset: WorkspaceDataset,
  metrics: DashboardMetrics,
  firstName: string,
  currencyFormatter: (amount: number) => string
): DailyBrief {
  const lines: string[] = [];

  const direction = metrics.revenueGrowthPercent >= 0 ? "up" : "down";
  lines.push(
    `Revenue is ${direction} ${Math.abs(metrics.revenueGrowthPercent).toFixed(0)}% compared to last month.`
  );

  const openInvoiceCount = metrics.outstandingInvoicesCount + metrics.overdueInvoicesCount;
  if (openInvoiceCount > 0) {
    lines.push(
      `${currencyFormatter(
        metrics.outstandingInvoicesValue + metrics.overdueInvoicesValue
      )} is awaiting payment across ${openInvoiceCount} invoice${openInvoiceCount === 1 ? "" : "s"}.`
    );
  }

  const highValueLeads = dataset.leads.filter(
    (l) =>
      (OPEN_LEAD_STATUSES as readonly string[]).includes(l.status) &&
      l.expectedValue >= 3000000 &&
      l.nextFollowUp &&
      daysBetween(TODAY, l.nextFollowUp) <= 7
  );
  if (highValueLeads.length > 0) {
    lines.push(
      `${highValueLeads.length} high-value lead${highValueLeads.length === 1 ? "" : "s"} require follow-up this week.`
    );
  }

  if (metrics.mostUtilizedDepartmentBudget) {
    lines.push(
      `The ${metrics.mostUtilizedDepartmentBudget.department ?? metrics.mostUtilizedDepartmentBudget.name} budget is ${metrics.mostUtilizedDepartmentBudget.utilizationPercent.toFixed(0)}% utilized.`
    );
  }

  if (metrics.staleITTicketsCount > 0) {
    lines.push(
      `${metrics.staleITTicketsCount} IT ticket${metrics.staleITTicketsCount === 1 ? " has" : "s have"} been unresolved for more than 5 days.`
    );
  }

  if (metrics.warrantyExpiringSoonCount > 0) {
    lines.push(
      `${metrics.warrantyExpiringSoonCount} company asset warrant${metrics.warrantyExpiringSoonCount === 1 ? "y expires" : "ies expire"} within 14 days.`
    );
  }

  return {
    greeting: `Good morning, ${firstName}.`,
    lines,
  };
}

// ---------- Chart data builders ----------

export function buildSalesPipelineChartData(dataset: WorkspaceDataset) {
  const stages = ["new", "qualified", "proposal_sent", "negotiation", "won", "lost"] as const;
  const labels: Record<(typeof stages)[number], string> = {
    new: "New",
    qualified: "Qualified",
    proposal_sent: "Proposal Sent",
    negotiation: "Negotiation",
    won: "Won",
    lost: "Lost",
  };
  return stages.map((stage) => {
    const opportunities = dataset.opportunities.filter((o) => o.stage === stage);
    return {
      stage: labels[stage],
      count: opportunities.length,
      value: sumBy(opportunities, (o) => o.estimatedValue),
    };
  });
}

export function buildInvoiceCollectionChartData(dataset: WorkspaceDataset) {
  const statuses = ["paid", "outstanding", "overdue", "draft"] as const;
  const labels: Record<(typeof statuses)[number], string> = {
    paid: "Paid",
    outstanding: "Outstanding",
    overdue: "Overdue",
    draft: "Draft",
  };
  return statuses.map((status) => {
    const invoices = dataset.invoices.filter((i) => i.status === status);
    return {
      status: labels[status],
      value: sumBy(invoices, (i) => i.amount),
      count: invoices.length,
    };
  });
}

export function buildBudgetVsActualChartData(dataset: WorkspaceDataset) {
  return dataset.budgets
    .filter((b) => b.period !== "annual")
    .map((b) => ({
      name: b.department ?? b.name,
      allocated: b.allocated,
      spent: b.spent,
    }));
}

export function buildLeadConversionChartData(dataset: WorkspaceDataset) {
  const stages = ["new", "contacted", "qualified", "converted"] as const;
  const labels: Record<(typeof stages)[number], string> = {
    new: "New",
    contacted: "Contacted",
    qualified: "Qualified",
    converted: "Converted",
  };
  return stages.map((stage) => ({
    stage: labels[stage],
    count: dataset.leads.filter((l) => l.status === stage).length,
  }));
}

export function buildExpenseBreakdownChartData(dataset: WorkspaceDataset) {
  const byCategory = new Map<string, number>();
  for (const expense of dataset.expenses) {
    if (expense.status === "rejected") continue;
    byCategory.set(expense.category, (byCategory.get(expense.category) ?? 0) + expense.amount);
  }
  return Array.from(byCategory.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function buildMonthlyGrowthChartData(workspaceId: string) {
  const trend = getMonthlyTrends(workspaceId);
  return trend.map((point, index) => {
    const previous = trend[index - 1];
    const growthPercent = previous?.revenue
      ? ((point.revenue - previous.revenue) / previous.revenue) * 100
      : 0;
    return { month: point.month, growthPercent };
  });
}

function sumBy<T>(items: T[], fn: (item: T) => number): number {
  return items.reduce((sum, item) => sum + fn(item), 0);
}

// ---------- Notifications ----------

export interface Notification {
  id: string;
  severity: "info" | "warning" | "critical";
  message: string;
  date: string;
}

export function buildNotifications(
  dataset: WorkspaceDataset,
  currencyFormatter: (amount: number) => string
): Notification[] {
  const notifications: Notification[] = [];

  for (const invoice of dataset.invoices.filter((i) => i.status === "overdue")) {
    notifications.push({
      id: `notif-inv-${invoice.id}`,
      severity: "critical",
      message: `Invoice ${invoice.invoiceNumber} for ${invoice.clientName} is overdue (${currencyFormatter(invoice.amount)}).`,
      date: invoice.dueDate,
    });
  }

  for (const budget of dataset.budgets) {
    const utilization = (budget.spent / budget.allocated) * 100;
    if (utilization >= 90) {
      notifications.push({
        id: `notif-bud-${budget.id}`,
        severity: "warning",
        message: `${budget.name} budget is ${utilization.toFixed(0)}% utilized.`,
        date: TODAY.toISOString().slice(0, 10),
      });
    }
  }

  for (const lead of dataset.leads.filter((l) => l.status === "new")) {
    notifications.push({
      id: `notif-lead-${lead.id}`,
      severity: "info",
      message: `New lead: ${lead.company} (${currencyFormatter(lead.expectedValue)} expected).`,
      date: lead.createdDate,
    });
  }

  for (const income of dataset.incomeRecords.slice(0, 3)) {
    notifications.push({
      id: `notif-inc-${income.id}`,
      severity: "info",
      message: `Payment received from ${income.clientName} (${currencyFormatter(income.amount)}).`,
      date: income.date,
    });
  }

  for (const ticket of dataset.itTickets.filter(
    (t) => (t.status === "open" || t.status === "in_progress") && daysBetween(t.createdDate, TODAY) > 5
  )) {
    notifications.push({
      id: `notif-tkt-${ticket.id}`,
      severity: "warning",
      message: `IT ticket ${ticket.ticketNumber} has been open for ${daysBetween(ticket.createdDate, TODAY)} days.`,
      date: ticket.createdDate,
    });
  }

  for (const asset of dataset.assets.filter(
    (a) => a.warrantyExpiry && daysBetween(TODAY, a.warrantyExpiry) <= 14 && daysBetween(TODAY, a.warrantyExpiry) >= 0
  )) {
    notifications.push({
      id: `notif-ast-${asset.id}`,
      severity: "warning",
      message: `Warranty for ${asset.name} expires in ${daysBetween(TODAY, asset.warrantyExpiry!)} days.`,
      date: asset.warrantyExpiry!,
    });
  }

  return notifications.sort((a, b) => (a.date < b.date ? 1 : -1));
}
