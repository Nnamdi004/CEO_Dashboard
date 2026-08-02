import { FileText, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function InvoicesPage() {
  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Issue, track and collect on every client invoice."
        actions={
          <Button disabled className="gap-1.5">
            <Plus className="size-4" />
            Create Invoice
          </Button>
        }
      />
      <EmptyState
        icon={FileText}
        title="The full invoice register is on its way"
        description="Create, view and download invoices as PDF, mark as paid, and send reminders on overdue balances."
      />
    </div>
  );
}
