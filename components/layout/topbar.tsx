"use client";

import { MobileSidebar } from "./mobile-sidebar";
import { GlobalSearch } from "./global-search";
import { Notifications } from "./notifications";
import { UserMenu } from "./user-menu";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <MobileSidebar />
      <GlobalSearch />
      <div className="ml-auto flex items-center gap-1.5">
        <Notifications />
        <UserMenu />
      </div>
    </header>
  );
}
