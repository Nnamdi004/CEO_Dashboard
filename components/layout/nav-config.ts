import {
  LayoutDashboard,
  Target,
  Users,
  GitBranch,
  FileText,
  TrendingUp,
  Receipt,
  Wallet,
  Boxes,
  Headset,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Executive summary and business health at a glance.",
  },
  {
    label: "Leads",
    href: "/leads",
    icon: Target,
    description: "Track every new business opportunity.",
  },
  {
    label: "Clients",
    href: "/clients",
    icon: Users,
    description: "Maintain a record of all active clients.",
  },
  {
    label: "Pipeline",
    href: "/pipeline",
    icon: GitBranch,
    description: "A simplified sales pipeline from lead to close.",
  },
  {
    label: "Invoices",
    href: "/invoices",
    icon: FileText,
    description: "Issue, track and collect on client invoices.",
  },
  {
    label: "Income",
    href: "/income",
    icon: TrendingUp,
    description: "Track every payment received.",
  },
  {
    label: "Expenses",
    href: "/expenses",
    icon: Receipt,
    description: "Track business expenditure by department.",
  },
  {
    label: "Budget",
    href: "/budget",
    icon: Wallet,
    description: "Annual, monthly and department budgets.",
  },
  {
    label: "Assets",
    href: "/assets",
    icon: Boxes,
    description: "Track company assets and their condition.",
  },
  {
    label: "IT Support",
    href: "/it-support",
    icon: Headset,
    description: "Track internal technical issues.",
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
    description: "Simple executive reporting, exportable to PDF/Excel.",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Company profile, users, departments and billing.",
  },
];
