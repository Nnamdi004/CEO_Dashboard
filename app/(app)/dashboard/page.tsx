"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  FileWarning,
  TrendingUp,
  Receipt,
  Landmark,
  Target,
  GitBranch,
  Headset,
  Boxes,
  PiggyBank,
  BadgeCheck,
  LineChart,
} from "lucide-react";
import { useWorkspace } from "@/hooks/use-workspace";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  computeDashboardMetrics,
  computeBusinessHealthScore,
  buildDailyBrief,
  buildSalesPipelineChartData,
  buildInvoiceCollectionChartData,
  buildBudgetVsActualChartData,
  buildLeadConversionChartData,
  buildExpenseBreakdownChartData,
  buildMonthlyGrowthChartData,
} from "@/lib/metrics";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { CeoDailyBrief } from "@/components/dashboard/ceo-daily-brief";
import { BusinessHealthScore } from "@/components/dashboard/business-health-score";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartLegend } from "@/components/dashboard/chart-legend";
import { RevenueVsExpensesChart } from "@/components/dashboard/charts/revenue-vs-expenses-chart";
import { IncomeTrendChart } from "@/components/dashboard/charts/income-trend-chart";
import { SalesPipelineChart } from "@/components/dashboard/charts/sales-pipeline-chart";
import { InvoiceCollectionChart } from "@/components/dashboard/charts/invoice-collection-chart";
import { BudgetVsActualChart } from "@/components/dashboard/charts/budget-vs-actual-chart";
import { LeadConversionChart } from "@/components/dashboard/charts/lead-conversion-chart";
import { ExpenseBreakdownChart } from "@/components/dashboard/charts/expense-breakdown-chart";
import { MonthlyGrowthChart } from "@/components/dashboard/charts/monthly-growth-chart";

export default function DashboardPage() {
  const { workspace, dataset } = useWorkspace();
  const { user } = useCurrentUser();

  const metrics = computeDashboardMetrics(dataset, workspace.id);
  const healthScore = computeBusinessHealthScore(metrics);
  const brief = buildDailyBrief(dataset, metrics, user.name.split(" ")[0], (amt) =>
    formatCurrency(amt, workspace.currency)
  );

  const currency = workspace.currency;
  const fmt = (amt: number) => formatCurrency(amt, currency, { compact: true });

  const kpis = [
    {
      label: "Revenue this month",
      value: fmt(metrics.revenueThisMonth),
      icon: TrendingUp,
      delta: metrics.revenueGrowthPercent,
    },
    {
      label: "Outstanding invoices",
      value: fmt(metrics.outstandingInvoicesValue + metrics.overdueInvoicesValue),
      icon: FileWarning,
      hint: `${metrics.outstandingInvoicesCount + metrics.overdueInvoicesCount} invoices`,
    },
    {
      label: "Income received",
      value: fmt(metrics.incomeReceivedThisMonth),
      icon: Landmark,
      hint: "This month",
    },
    {
      label: "Total expenses",
      value: fmt(metrics.totalExpensesThisMonth),
      icon: Receipt,
      hint: "This month",
    },
    {
      label: "Net cash position",
      value: fmt(metrics.netCashPosition),
      icon: PiggyBank,
      hint: "Estimated cash on hand",
    },
    {
      label: "Active leads",
      value: formatNumber(metrics.activeLeadsCount),
      icon: Target,
      hint: "New, contacted or qualified",
    },
    {
      label: "Pipeline value",
      value: fmt(metrics.pipelineValue),
      icon: GitBranch,
      hint: "Open opportunities",
    },
    {
      label: "Open IT tickets",
      value: formatNumber(metrics.openITTicketsCount),
      icon: Headset,
      hint: metrics.staleITTicketsCount > 0 ? `${metrics.staleITTicketsCount} overdue` : "All on track",
    },
    {
      label: "Company assets",
      value: formatNumber(metrics.totalAssetsCount),
      icon: Boxes,
      hint: fmt(metrics.totalAssetsValue) + " total value",
    },
    {
      label: "Budget utilization",
      value: metrics.annualBudget ? `${metrics.annualBudget.utilizationPercent.toFixed(0)}%` : "—",
      icon: Wallet,
      hint: "Annual budget",
    },
    {
      label: "Monthly profit",
      value: fmt(metrics.monthlyProfit),
      icon: LineChart,
      hint: "Revenue less expenses",
    },
    {
      label: "Collection rate",
      value: `${metrics.collectionRatePercent.toFixed(0)}%`,
      icon: BadgeCheck,
      hint: "Paid vs. invoiced",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`${workspace.name} — the health of your business in under 30 seconds.`}
      />

      <div className="flex flex-col gap-6">
        <CeoDailyBrief brief={brief} />

        <motion.div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.03 } } }}
        >
          {kpis.map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <StatCard {...kpi} />
            </motion.div>
          ))}
        </motion.div>

        <BusinessHealthScore score={healthScore} />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartCard
            title="Revenue vs Expenses"
            description="Last 6 months"
            legend={
              <ChartLegend
                items={[
                  { label: "Revenue", color: "var(--viz-cat-1)" },
                  { label: "Expenses", color: "var(--viz-cat-2)" },
                ]}
              />
            }
          >
            <RevenueVsExpensesChart data={metrics.trend} currency={currency} />
          </ChartCard>

          <ChartCard title="Income Trend" description="Cash received, last 6 months">
            <IncomeTrendChart data={metrics.trend} currency={currency} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ChartCard title="Sales Pipeline" description="Value by stage">
            <SalesPipelineChart data={buildSalesPipelineChartData(dataset)} currency={currency} />
          </ChartCard>

          <ChartCard title="Invoice Collection" description="Composition of invoiced value">
            <InvoiceCollectionChart data={buildInvoiceCollectionChartData(dataset)} currency={currency} />
          </ChartCard>

          <ChartCard title="Budget vs Actual" description="Department spend this month">
            <BudgetVsActualChart data={buildBudgetVsActualChartData(dataset)} currency={currency} />
          </ChartCard>

          <ChartCard title="Lead Conversion" description="Funnel by stage">
            <LeadConversionChart data={buildLeadConversionChartData(dataset)} />
          </ChartCard>

          <ChartCard title="Expense Breakdown" description="By category">
            <ExpenseBreakdownChart data={buildExpenseBreakdownChartData(dataset)} currency={currency} />
          </ChartCard>

          <ChartCard title="Monthly Growth" description="Revenue growth, month over month">
            <MonthlyGrowthChart data={buildMonthlyGrowthChartData(workspace.id)} />
          </ChartCard>
        </div>

        <QuickActions />
      </div>
    </div>
  );
}
