import { Wallet, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function BudgetPage() {
  return (
    <div>
      <PageHeader
        title="Budget"
        description="Annual, monthly and department budgets — allocated vs. spent."
        actions={
          <Button disabled className="gap-1.5">
            <Plus className="size-4" />
            Create Budget
          </Button>
        }
      />
      <EmptyState
        icon={Wallet}
        title="The full budget module is on its way"
        description="Allocated, spent and remaining for every department and project, with alerts when spending crosses your threshold."
      />
    </div>
  );
}
