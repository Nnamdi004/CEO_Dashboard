"use client";

import { Building2, Users, Network, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/hooks/use-workspace";
import { useRoleGate } from "@/hooks/use-role-gate";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";
import { getUsersForWorkspace } from "@/lib/mock-data/users";

export default function SettingsPage() {
  const { workspace } = useWorkspace();
  const { can } = useRoleGate();

  if (!can("manageSettings")) {
    return (
      <div>
        <PageHeader title="Settings" description="Company administration." />
        <EmptyState
          icon={Building2}
          title="You don't have access to Settings"
          description="Only Admins and the CEO can manage company profile, users and billing. Ask an admin on your team for access."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Settings" description="Company profile, users, departments and billing." />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-1.5">
            <Building2 className="size-3.5" />
            Company Profile
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5">
            <Users className="size-3.5" />
            Users
          </TabsTrigger>
          <TabsTrigger value="departments" className="gap-1.5">
            <Network className="size-3.5" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-1.5">
            <CreditCard className="size-3.5" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="max-w-xl">
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Company name" value={workspace.name} />
              <Field label="Industry" value={workspace.industry} />
              <Field label="Currency" value={workspace.currency} />
              <Field label="Plan" value={workspace.plan} className="capitalize" />
              <Field label="Workspace since" value={formatDate(workspace.createdAt, "long")} />
              <Field label="Workspace ID" value={workspace.slug} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <UsersList workspaceId={workspace.id} />
          </div>
        </TabsContent>

        <TabsContent value="departments" className="mt-6">
          <EmptyState
            icon={Network}
            title="Department management is on its way"
            description="Create departments, assign budgets and route registers to the right team."
          />
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <EmptyState
            icon={CreditCard}
            title="Billing management is on its way"
            description="Manage your subscription plan, payment method and invoices for the CEO Dashboard platform itself."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-0.5 font-medium ${className ?? ""}`}>{value}</p>
    </div>
  );
}

function UsersList({ workspaceId }: { workspaceId: string }) {
  const users = getUsersForWorkspace(workspaceId);

  return (
    <>
      {users.map((u) => (
        <Card key={u.id} className="flex-row items-center gap-3 p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {u.name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{u.name}</p>
            <p className="truncate text-xs text-muted-foreground">{u.email}</p>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            {ROLE_LABELS[u.role]}
          </Badge>
        </Card>
      ))}
    </>
  );
}
