"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, ArrowRight } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { WORKSPACES } from "@/lib/mock-data/workspaces";
import { getUsersForWorkspace } from "@/lib/mock-data/users";
import { ROLE_LABELS } from "@/lib/permissions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useCurrentUser();

  function handleSelect(userId: string) {
    login(userId);
    router.push("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_60%)]"
      />

      <div className="w-full max-w-3xl">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <LayoutDashboard className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            CEO Executive Dashboard
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            The CEO&apos;s single source of truth. Pick a demo workspace and role to
            explore.
          </p>
        </div>

        <div className="space-y-8">
          {WORKSPACES.map((workspace, wi) => (
            <div key={workspace.id}>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-muted text-[11px] font-semibold">
                  {workspace.logoInitials}
                </div>
                <p className="text-sm font-medium">{workspace.name}</p>
                <Badge variant="outline" className="text-[10px] capitalize">
                  {workspace.plan}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {getUsersForWorkspace(workspace.id).map((user, ui) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (wi * 4 + ui) * 0.03, duration: 0.25 }}
                  >
                    <Card
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelect(user.id)}
                      onKeyDown={(e) => e.key === "Enter" && handleSelect(user.id)}
                      className="group cursor-pointer flex-row items-center gap-3 border-border/60 p-3.5 shadow-none transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {initialsOf(user.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.title}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        {ROLE_LABELS[user.role]}
                      </Badge>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground/0 transition-all group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Demo environment — no password required. All data shown is fictional.
        </p>
      </div>
    </div>
  );
}
