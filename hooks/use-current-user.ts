"use client";

import { useWorkspaceStore } from "@/lib/store/use-workspace-store";
import { USERS, getUsersForWorkspace } from "@/lib/mock-data/users";

export function useCurrentUser() {
  const currentUserId = useWorkspaceStore((s) => s.currentUserId);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const hasHydrated = useWorkspaceStore((s) => s.hasHydrated);
  const switchUser = useWorkspaceStore((s) => s.switchUser);
  const login = useWorkspaceStore((s) => s.login);
  const logout = useWorkspaceStore((s) => s.logout);

  const user = USERS.find((u) => u.id === currentUserId) ?? USERS[0];
  const workspaceUsers = getUsersForWorkspace(activeWorkspaceId);

  return {
    user,
    isAuthenticated,
    hasHydrated,
    workspaceUsers,
    switchUser,
    login,
    logout,
  };
}
