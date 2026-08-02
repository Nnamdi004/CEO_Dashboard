// Hand-authored monthly rollups (last 6 months, ending at the TODAY anchor's
// month) for trend charts and the headline "this month" financial KPIs.
// Transactional registers (invoices/income/expenses) only span the last
// ~2-3 months, which is realistic for a snapshot but too thin to bucket into
// a clean 6-month trend — so trends are modeled explicitly instead.

export interface MonthlyTrendPoint {
  month: string; // e.g. "Feb 2026"
  revenue: number; // accrual — invoiced this month
  expenses: number; // incurred this month
  income: number; // cash received this month
}

export const MONTHLY_TRENDS: Record<string, MonthlyTrendPoint[]> = {
  "ws-solaris": [
    { month: "Feb 2026", revenue: 68000000, expenses: 55000000, income: 60000000 },
    { month: "Mar 2026", revenue: 74000000, expenses: 58000000, income: 65000000 },
    { month: "Apr 2026", revenue: 71000000, expenses: 56000000, income: 69000000 },
    { month: "May 2026", revenue: 79000000, expenses: 61000000, income: 72000000 },
    { month: "Jun 2026", revenue: 83000000, expenses: 64000000, income: 76000000 },
    { month: "Jul 2026", revenue: 88000000, expenses: 67000000, income: 81000000 },
  ],
  "ws-vertex": [
    { month: "Feb 2026", revenue: 32000000, expenses: 27000000, income: 29000000 },
    { month: "Mar 2026", revenue: 35000000, expenses: 29000000, income: 31000000 },
    { month: "Apr 2026", revenue: 33000000, expenses: 28000000, income: 30000000 },
    { month: "May 2026", revenue: 38000000, expenses: 31000000, income: 34000000 },
    { month: "Jun 2026", revenue: 41000000, expenses: 33000000, income: 37000000 },
    { month: "Jul 2026", revenue: 44000000, expenses: 35000000, income: 40000000 },
  ],
};

// Opening cash balance before the trend window — combined with cumulative
// (income - expenses) since, this anchors "Net Cash Position" to a realistic
// running total rather than just the current month's flows.
export const OPENING_CASH_BALANCE: Record<string, number> = {
  "ws-solaris": 18000000,
  "ws-vertex": 9500000,
};

export function getMonthlyTrends(workspaceId: string): MonthlyTrendPoint[] {
  return MONTHLY_TRENDS[workspaceId] ?? [];
}
