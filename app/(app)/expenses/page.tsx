import { Receipt, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function ExpensesPage() {
  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Track business expenditure by category and department."
        actions={
          <Button disabled className="gap-1.5">
            <Plus className="size-4" />
            Record Expense
          </Button>
        }
      />
      <EmptyState
        icon={Receipt}
        title="The full expense register is on its way"
        description="Category, vendor and department breakdowns with receipt tracking and an approval workflow."
      />
    </div>
  );
}
