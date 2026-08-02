import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Simple executive reporting across revenue, pipeline, assets and more."
      />
      <EmptyState
        icon={BarChart3}
        title="Executive reports are on their way"
        description="Monthly summaries across revenue, expenses, cash position, invoices, leads, pipeline, assets, budget and IT — exportable to PDF and Excel."
      />
    </div>
  );
}
