import { GitBranch } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default function PipelinePage() {
  return (
    <div>
      <PageHeader
        title="Pipeline"
        description="A simplified sales pipeline from new opportunity to close."
      />
      <EmptyState
        icon={GitBranch}
        title="The Kanban pipeline board is on its way"
        description="Drag opportunities across New, Qualified, Proposal Sent, Negotiation, Won and Lost — with value, probability and expected close date at a glance."
      />
    </div>
  );
}
