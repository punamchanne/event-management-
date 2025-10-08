import { SideNavItem } from "@/Types";
import {
  IconLayoutDashboard,
  IconBuildingCommunity,
  IconCalendarEvent,
  IconTrophy,
  IconCoinRupee,
  IconUsers,
  IconSettings,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <IconLayoutDashboard width="22" height="22" />,
  },
  {
    title: "Manage Colleges",
    path: "/admin/manage-colleges",
    icon: <IconBuildingCommunity width="22" height="22" />,
  },
  {
    title: "Manage Events",
    path: "/admin/manage-events",
    icon: <IconCalendarEvent width="22" height="22" />,
  },
  {
    title: "Manage Programs",
    path: "/admin/manage-programs",
    icon: <IconTrophy width="22" height="22" />,
  },
  {
    title: "User Management",
    path: "/admin/users",
    icon: <IconUsers width="22" height="22" />,
  },
  {
    title: "Revenue & Analytics",
    path: "/admin/revenue-analytics",
    icon: <IconCoinRupee width="22" height="22" />,
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: <IconSettings width="22" height="22" />,
  },
];
