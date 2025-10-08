import { SideNavItem } from "@/Types";
import {
  IconLayoutDashboard,
  IconUsers,
  IconClipboardList,
  IconTrophy,
  IconChartBar,
  IconSettings,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/program-manager/dashboard",
    icon: <IconLayoutDashboard width="22" height="22" />,
  },
  {
    title: "Participants",
    path: "/program-manager/participants",
    icon: <IconUsers width="22" height="22" />,
  },
  {
    title: "Submissions",
    path: "/program-manager/submissions",
    icon: <IconClipboardList width="22" height="22" />,
  },
  {
    title: "Results & Scores",
    path: "/program-manager/results",
    icon: <IconTrophy width="22" height="22" />,
  },
  {
    title: "Analytics",
    path: "/program-manager/analytics",
    icon: <IconChartBar width="22" height="22" />,
  },
  {
    title: "Settings",
    path: "/program-manager/settings",
    icon: <IconSettings width="22" height="22" />,
  },
];
