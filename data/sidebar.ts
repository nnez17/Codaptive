import { Home, User, BookOpen, Settings, type LucideIcon } from "lucide-react";

export interface NavItem {
  name: string;
  icon: LucideIcon | null;
  href: string;
}

export const loggedOutNavItems: NavItem[] = [
  { name: "Path", icon: null, href: "/#path" },
  { name: "Community", icon: null, href: "/#community" },
];

export const loggedInNavItems: NavItem[] = [
  { name: "Path", icon: null, href: "/#path" },
  { name: "Community", icon: null, href: "/#community" },
  { name: "Dashboard", icon: null, href: "/profile" },
];

export const profileNavItems: NavItem[] = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Learn", icon: BookOpen, href: "/learn" },
  { name: "Dashboard", icon: User, href: "/profile" },
  { name: "Settings", icon: Settings, href: "/settings" },
];
