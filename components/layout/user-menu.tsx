"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LogOut, Moon, Sun, UserCog } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ROLE_LABELS } from "@/lib/permissions";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu() {
  const { user, workspaceUsers, switchUser, logout } = useCurrentUser();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
        }
      >
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {initialsOf(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <div className="px-2 pb-1.5">
          <Badge variant="secondary" className="text-[10px]">
            {ROLE_LABELS[user.role]}
          </Badge>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2">
            <UserCog className="size-4" />
            Switch role (demo)
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {workspaceUsers.map((u) => (
              <DropdownMenuItem
                key={u.id}
                onClick={() => switchUser(u.id)}
                className="flex flex-col items-start gap-0"
              >
                <span className="text-sm">{u.name}</span>
                <span className="text-xs text-muted-foreground">
                  {ROLE_LABELS[u.role]} · {u.title}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="gap-2"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
