"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoleGate } from "@/hooks/use-role-gate";
import { AddLeadDialog } from "./quick-action-dialogs/add-lead-dialog";
import { CreateInvoiceDialog } from "./quick-action-dialogs/create-invoice-dialog";
import { RecordIncomeDialog } from "./quick-action-dialogs/record-income-dialog";
import { RecordExpenseDialog } from "./quick-action-dialogs/record-expense-dialog";
import { CreateBudgetDialog } from "./quick-action-dialogs/create-budget-dialog";
import { RegisterAssetDialog } from "./quick-action-dialogs/register-asset-dialog";
import { CreateITTicketDialog } from "./quick-action-dialogs/create-it-ticket-dialog";

export function QuickActions() {
  const { can } = useRoleGate();
  const canManageRegisters = can("manageRegisters");
  const canManageBudget = can("manageBudget");

  if (!canManageRegisters && !canManageBudget) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Add a record without leaving the dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {canManageRegisters && (
            <>
              <AddLeadDialog />
              <CreateInvoiceDialog />
              <RecordIncomeDialog />
              <RecordExpenseDialog />
              <RegisterAssetDialog />
              <CreateITTicketDialog />
            </>
          )}
          {canManageBudget && <CreateBudgetDialog />}
        </div>
      </CardContent>
    </Card>
  );
}
