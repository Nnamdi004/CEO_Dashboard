import { Boxes, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function AssetsPage() {
  return (
    <div>
      <PageHeader
        title="Assets"
        description="Track company assets, their condition and assignment."
        actions={
          <Button disabled className="gap-1.5">
            <Plus className="size-4" />
            Register Asset
          </Button>
        }
      />
      <EmptyState
        icon={Boxes}
        title="The full asset register is on its way"
        description="Serial numbers, assignment, condition, location and warranty tracking with expiry alerts."
      />
    </div>
  );
}
