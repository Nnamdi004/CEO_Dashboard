import { Users, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function ClientsPage() {
  return (
    <div>
      <PageHeader
        title="Clients"
        description="Maintain a record of every active client relationship."
        actions={
          <Button disabled className="gap-1.5">
            <Plus className="size-4" />
            Add Client
          </Button>
        }
      />
      <EmptyState
        icon={Users}
        title="The full client register is on its way"
        description="Industry, primary contact, project and invoice counts, revenue generated and account ownership — all in one filterable table."
      />
    </div>
  );
}
