"use client";

import { useCurrentUser } from "./use-current-user";
import { can, type Capability } from "@/lib/permissions";

export function useRoleGate() {
  const { user } = useCurrentUser();
  return {
    role: user.role,
    can: (capability: Capability) => can(user.role, capability),
  };
}
