import { Headset, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function ITSupportPage() {
  return (
    <div>
      <PageHeader
        title="IT Support"
        description="Track internal technical issues from report to resolution."
        actions={
          <Button disabled className="gap-1.5">
            <Plus className="size-4" />
            Create Ticket
          </Button>
        }
      />
      <EmptyState
        icon={Headset}
        title="The full IT support register is on its way"
        description="Priority, category, assignment and resolution-time tracking for every ticket."
      />
    </div>
  );
}
