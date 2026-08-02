"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarNav } from "./sidebar-nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex"
    >
      <div className={cn("flex h-16 items-center border-b border-sidebar-border px-2", collapsed && "justify-center px-0")}>
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto py-4">
        <SidebarNav collapsed={collapsed} />
      </div>

      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? <PanelLeftOpen className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
