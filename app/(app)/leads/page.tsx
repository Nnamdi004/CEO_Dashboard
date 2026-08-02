import { Target } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function LeadsPage() {
  return (
    <div>
      <PageHeader
        title="Leads"
        description="Track every new business opportunity from first contact to conversion."
        actions={
          <Button disabled className="gap-1.5">
            <Plus className="size-4" />
            Add Lead
          </Button>
        }
      />
      <EmptyState
        icon={Target}
        title="The full leads register is on its way"
        description="Company, contact, source, expected value, status and follow-ups — filterable, sortable, and exportable. Use Quick Actions on the Dashboard to add a lead in the meantime."
      />
    </div>
  );
}
