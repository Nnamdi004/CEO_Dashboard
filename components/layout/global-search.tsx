"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function GlobalSearch() {
  return (
    <div className="relative hidden w-full max-w-sm sm:block">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search leads, clients, invoices…"
        className="rounded-full bg-muted/60 pl-9 border-transparent focus-visible:bg-background"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
        ⌘K
      </kbd>
    </div>
  );
}
