import { TrendingUp, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function IncomePage() {
  return (
    <div>
      <PageHeader
        title="Income"
        description="Track every payment received against invoices and clients."
        actions={
          <Button disabled className="gap-1.5">
            <Plus className="size-4" />
            Record Income
          </Button>
        }
      />
      <EmptyState
        icon={TrendingUp}
        title="The full income register is on its way"
        description="Payment method, reference number and received-by tracking for every deposit, reconciled against invoices."
      />
    </div>
  );
}
